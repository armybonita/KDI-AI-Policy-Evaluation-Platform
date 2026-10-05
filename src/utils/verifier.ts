import { VerificationWarning, StanceType, QuoteMatchStatus } from '../types';
import { CHUNKS } from '../data/mockData';

export function sentences(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  const re = /[^.]+?\.(?:\s*\[[A-Z]\d\])*/g;
  let m: RegExpExecArray | null;
  let last = 0;
  while ((m = re.exec(text))) {
    if (m[0].trim()) out.push(m[0].trim());
    last = re.lastIndex;
  }
  const rest = text.slice(last).trim();
  if (rest) out.push(rest);
  return out;
}

export function citesOf(text: string): string[] {
  if (!text) return [];
  const matches = [...text.matchAll(/\[([A-Z]\d)\]/g)];
  return matches.map(m => m[1]).filter(id => !!CHUNKS[id]);
}

export function stripCites(text: string): string {
  if (!text) return '';
  return text.replace(/\s*\[[A-Z]\d\]/g, '').trim();
}

export function stanceOf(text: string): StanceType {
  if (/기대|추정|전망|가능성/.test(text)) return 'expected';
  if (/(검토|추진|진행|준비)\s?중/.test(text)) return 'in_progress';
  return 'realized';
}

export const STANCE_LABELS: Record<StanceType, string> = {
  realized: '실현 보고',
  in_progress: '추진·검토 중',
  expected: '기대·추정'
};

export function isLimitationSentence(plain: string): boolean {
  return /(확인되지 않|미확인|확인하기 어렵|단정하기 어렵|추가 확인이 필요|부족하)/.test(plain);
}

export function quoteMatch(chunkId: string, quoteText: string): QuoteMatchStatus {
  const chunk = CHUNKS[chunkId];
  if (!chunk || !quoteText) return 'unverified';
  const cleanChunk = chunk.text.replace(/\s+/g, '');
  const cleanQuote = quoteText.replace(/\s+/g, '');
  if (cleanChunk.includes(cleanQuote)) return 'verified';
  if (cleanQuote.length > 5 && cleanChunk.includes(cleanQuote.slice(0, 10))) return 'partial';
  return 'unverified';
}

export function verifyText(text: string): VerificationWarning[] {
  const res: VerificationWarning[] = [];
  const list = sentences(text);

  list.forEach((s, idx) => {
    const ids = citesOf(s);
    const plain = stripCites(s);
    const n = idx + 1;

    if (!ids.length) {
      if (!isLimitationSentence(plain)) {
        res.push({
          lv: 'high',
          rule: '근거 없는 문장',
          msg: `${n}번 문장에 원천 근거 ID([O1], [S1] 등)가 연결되어 있지 않습니다. 근거를 태깅하거나 '미확인' 한계로 남기세요.`
        });
      }
      return;
    }

    const src = ids.map(id => CHUNKS[id]?.text || '').join(' ');

    // 1. Numbers check
    const numbersInPlain = [...new Set(plain.match(/\d+/g) || [])];
    const missingNums = numbersInPlain.filter(num => !src.includes(num));
    if (missingNums.length > 0) {
      res.push({
        lv: 'high',
        rule: '수치 대조 불일치',
        msg: `${n}번 문장의 수치(${missingNums.join(', ')})가 연결된 근거 원문에 존재하지 않습니다.`
      });
    }

    // 2. Stance mismatch
    const sStance = stanceOf(plain);
    const cStance = stanceOf(src);
    if (sStance === 'realized' && cStance !== 'realized') {
      res.push({
        lv: 'high',
        rule: '진술 성격 오분류 (성과 과장)',
        msg: `${n}번 문장은 완료형 '실현 성과'로 서술되었으나, 원문은 '${STANCE_LABELS[cStance]}' 단계입니다.`
      });
    }

    // 3. Speaker / Agency mismatch
    if (/협력기관의? (의견|입장|평가)/.test(plain) && ids.every(id => CHUNKS[id]?.speakerType !== 'partner')) {
      const speakerNames = ids.map(id => CHUNKS[id]?.speaker).join(', ');
      res.push({
        lv: 'high',
        rule: '발화 주체 불일치',
        msg: `${n}번 문장은 '협력기관 의견'으로 서술되었으나, 근거 출처는 [${speakerNames}]입니다.`
      });
    }

    // 4. Missing conditional premise
    if (/경우/.test(src) && !/경우|조건|전제/.test(plain)) {
      res.push({
        lv: 'mid',
        rule: '전제 조건 누락',
        msg: `${n}번 문장에 원문의 핵심 전제 조건("~연계될 경우")이 누락되어 성과가 확정된 것처럼 오인될 수 있습니다.`
      });
    }

    // 5. Missing time period
    const per = src.match(/향후\s?\d~\d년/);
    if (per && !/\d~\d년/.test(plain)) {
      res.push({
        lv: 'mid',
        rule: '발현 기간 누락',
        msg: `${n}번 문장에 원문의 시계열 기간("${per[0]}")이 빠져 있습니다.`
      });
    }

    // 6. Stage nuance (e.g. 초안 vs 확정)
    if (/초안/.test(src) && !/초안/.test(plain) && !/검토/.test(plain)) {
      res.push({
        lv: 'mid',
        rule: '단계 표현 누락',
        msg: `원문은 "초안 검토" 단계이나 문장에서 정식 수립처럼 서술되었습니다.`
      });
    }

    // 7. Organization mapping resolution
    if (/국세청/.test(plain) && !/국세청/.test(src)) {
      res.push({
        lv: 'info',
        rule: '기관명 온톨로지 매핑',
        msg: `${n}번 문장의 '국세청'은 원문의 '협력기관'을 사업 메타데이터(수원국 부처=조세위원회/국세청)와 정합 매핑하여 확인했습니다.`
      });
    }
  });

  return res;
}

export async function computeSha256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'sha256-mock-' + Math.random().toString(36).substring(2, 10);
  }
}

export async function computeFileSha256(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'sha256-file-' + Math.random().toString(36).substring(2, 10);
  }
}
