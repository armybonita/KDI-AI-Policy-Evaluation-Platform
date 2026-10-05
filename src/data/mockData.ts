import { Chunk, Project, PdmPlan, NodeAiData, LessonItem, PackageCheckItem, DocumentItem, QuadrantType, NodeKey } from '../types';

export const CHUNKS: Record<string, Chunk> = {
  O1: {
    id: 'O1',
    chunk: 'doc01-p14-para2',
    doc: '우즈베키스탄_KSP_최종사업종료보고서_v2.pdf',
    ver: 'v2',
    page: 14,
    kind: 'internal',
    docType: '최종보고서(자문보고서)',
    speaker: '수행기관 (사업종료보고)',
    speakerType: 'implementer',
    text: '정책 제언 보고서(국·영·러 3개 언어 총 380페이지)를 인쇄본 및 전자문서로 2025년 12월 15일 협력기관에 공식 이관 완료하였음.',
    contextBefore: '... 본 과업의 4대 자문 분야에 대한 종합 연구 결과를 통합 편철하여 국문본 150부, 영문본 200부, 러시아어본 200부를 제작하였으며 ...',
    contextAfter: '... 협력기관 조세위원회(State Tax Committee) 대회의실에서 개최된 최종보고회에서 공식 수령증을 교부받아 사업을 종결함.'
  },
  O2: {
    id: 'O2',
    chunk: 'doc02-p52-para1',
    doc: '기술자문_성과증빙_부속서_2025.pdf',
    ver: 'v1',
    page: 52,
    kind: 'internal',
    docType: '성과증빙 부속서',
    speaker: '수행기관 (성과증빙)',
    speakerType: 'implementer',
    text: '빅데이터 기반 12개 세무 리스크 프로파일링 알고리즘 설계도 및 현장 운영 매뉴얼 인도 완료.',
    contextBefore: '... 현지 조세 행정 IT 환경을 고려한 룰 기반 탐지 알고리즘 및 머신러닝 리스크 스코어링 모델 12종의 소스코드를 검수 완료하고 ...',
    contextAfter: '... 세무조사관 현장 활용을 위한 한국어-러시아어 대역 매뉴얼 50부를 전달하여 교육훈련 실습에 활용함.'
  },
  S1: {
    id: 'S1',
    chunk: 'doc03-p8-para4',
    doc: '2026_우즈벡_현지_종료평가_심층인터뷰록.docx',
    ver: 'v1',
    page: 8,
    kind: 'internal',
    docType: '인터뷰·회의록',
    speaker: '협력기관 실무진 (당사자 활용 진술)',
    speakerType: 'partner',
    text: '국세청 실무진 인터뷰: "2026년 차기 세무행정 현대화 로드맵 초안을 작성하면서 KSP 팀이 제안한 리스크 기반 선별감사 모형을 핵심 전략 과제로 반영하여 검토 중에 있습니다."',
    contextBefore: '... [평가팀 질의] 자문단이 제시한 세무 리스크 분석 체계가 실제 정책 및 제도에 어떻게 활용되고 있습니까? ...',
    contextAfter: '... 다만 정식 국가 조세전략(Reforms-2030)으로 최종 확정 및 내각 비준까지는 추가 법령 개정이 요구되어 내부 검토를 지속 중입니다.'
  },
  L1: {
    id: 'L1',
    chunk: 'doc04-p29-para3',
    doc: '우즈베키스탄_KSP_종합평가_중간보고.pdf',
    ver: 'v1',
    page: 29,
    kind: 'internal',
    docType: '중간평가결과보고서',
    speaker: '평가 측 (중간보고서 서술)',
    speakerType: 'evaluator',
    text: '향후 3~5년 내 실제 시스템 구축 사업(EDCF 차관 또는 세계은행 차관)과 연계될 경우 탈세 방지 및 세입 증대에 실질적 기여를 할 것으로 기대된다.',
    contextBefore: '... 본 정책자문 결과물은 정보화전략계획(ISP) 수준의 구체성을 확보하고 있어, 수원국의 차관 사업 추진 의지가 확고할 경우 ...',
    contextAfter: '... 다만 현재로서는 차관 협약이 공식 체결되지 않았으므로 제도적 운영 성과와 정량적 세입 효과는 사후 모니터링을 통해 추적할 필요가 있음.'
  },
  E1: {
    id: 'E1',
    chunk: 'doc05-p5-row7',
    doc: '중간평가_사업관리점검표.pdf',
    ver: 'v1',
    page: 5,
    kind: 'internal',
    docType: '사업관리 점검표',
    speaker: '평가 측 (사업관리 점검)',
    speakerType: 'evaluator',
    text: '우즈베키스탄 국세청장의 직접 지시로 국장급 전담 카운터파트가 매 회의마다 100% 참석하여 자문단의 질문에 즉각 대응함.',
    contextBefore: '... [점검항목: 협력국 고위직 리더십 및 참여도] ...',
    contextAfter: '... 이러한 강력한 오너십이 자문 과업의 진척과 실무 데이터 수급에 결정적인 촉진 요인으로 작용하였음.'
  },
  C1: {
    id: 'C1',
    chunk: 'doc06-p3-para2',
    doc: 'PM_월간모니터링_보고_202509.pdf',
    ver: 'v1',
    page: 3,
    kind: 'internal',
    docType: '성과 추적 자료',
    speaker: 'PM (월간 모니터링)',
    speakerType: 'pm',
    text: '2025년 8월 국세청 조직개편으로 리스크기획과장 및 담당자 2인이 타 부서로 전보되어 1개월간 후속 소통이 일시 지연되었음.',
    contextBefore: '... 8월 중순 수원국 정부의 대대적인 직제 개편에 따라 협력창구 부서의 인사이동이 발생 ...',
    contextAfter: '... 9월 중순 신임 과장과의 킥오프 회의를 통해 과업 일정을 정상화하였으나, 중간 산출물에 대한 피드백 접수가 약 3주간 순연됨.'
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'UZ',
    code: 'KSP-2025-UZ-01',
    name: '우즈베키스탄 디지털 조세 행정 현대화 및 세무 리스크 분석 체계 구축',
    year: '2025/26',
    yearKey: 'cur',
    region: '중앙아시아',
    country: '우즈베키스탄',
    ministry: '우즈베키스탄 조세위원회(국세청)',
    implementer: '한국조세재정연구원 / (주)데이터컨설팅',
    pm_po: '김진우 선임연구원 (KDI PM)',
    reviewer: '평가팀 (담당: 홍아름 연구원)',
    pilot: true,
    example: false
  },
  {
    id: 'HU',
    code: 'KSP-2024-HU-02',
    name: '헝가리 첨단 배터리 산업 혁신 클러스터 육성 및 산학연 협력 생태계 조성',
    year: '2024/25',
    yearKey: 'prev',
    region: '유럽',
    country: '헝가리',
    ministry: '헝가리 국가경제부',
    implementer: '한국산업기술진흥원(KIAT)',
    pm_po: '이성민 팀장',
    reviewer: '평가팀',
    pilot: false,
    example: true,
    status: 'confirmed'
  },
  {
    id: 'VN',
    code: 'KSP-2025-VN-03',
    name: '베트남 메콩델타 스마트 수자원 관리 및 기후위기 대응 디지털 관측 플랫폼',
    year: '2025/26',
    yearKey: 'cur',
    region: '동남아시아',
    country: '베트남',
    ministry: '베트남 농업농촌개발부',
    implementer: '한국수자원공사(K-water)',
    pm_po: '박준호 연구위원',
    reviewer: '평가팀',
    pilot: false,
    example: true,
    status: 'not_reviewed'
  }
];

export const PLAN: PdmPlan = {
  activity: {
    t: '세무 빅데이터 기반 리스크 분석 정책 자문 및 현지 워크숍 수행',
    ind: '자문회의(4회) 및 현지 실무 워크숍(2회) 개최 완료'
  },
  output: {
    t: '정책 제언 보고서(국·영·러) 작성·전달 및 리스크 알고리즘 설계도 인도',
    ind: '제언 보고서 발간 및 협력기관 공식 이관 증빙'
  },
  short: {
    t: '디지털 세무행정 차기 로드맵 및 정책 초안 수립에 활용',
    ind: '협력기관 전략문서 내 제언 핵심과제 반영'
  },
  mid: {
    t: '리스크 기반 선별 세무조사 등 제도 운영 개선',
    ind: '선별감사 적용률 및 현장 세정 운영 변화 지표'
  },
  long: {
    t: '징세 효율화 달성 및 지하경제 양성화를 통한 세입 기반 확충',
    ind: '세수 증대율 및 자진신고 성실도 변화'
  },
  impact: {
    t: 'SDG 17.1 국내 재원 동원 역량 강화 및 조세행정 투명성 제고',
    ind: '국가 중장기 조세 투명성 지수 개선'
  }
};

export const NODE_DEF: Record<NodeKey, { label: string; num: string; prompt: string; type: string }> = {
  output: { label: '산출물', num: '④', prompt: 'output_v1', type: 'output' },
  short: { label: '단기성과', num: '⑤', prompt: 'short_term_v1', type: 'short_term_outcome' },
  midlong: { label: '중·장기성과', num: '⑥', prompt: 'mid_long_v1', type: 'mid_long_term_outcome' },
  contrib: { label: '기여요인', num: '⑦', prompt: 'factor_v1', type: 'contribution' },
  constraint: { label: '제약요인', num: '⑦', prompt: 'factor_v1', type: 'constraint' }
};

export const AI_DATA: Record<NodeKey, NodeAiData> = {
  output: {
    indicator: { label: PLAN.output.ind, met: '지표 충족', tone: 'ok' },
    claims: [
      {
        cid: 'o1',
        group: 'indicator',
        text: '정책 제언 보고서(국·영·러 3개 언어, 총 380쪽)를 작성하여 2025년 12월 15일 우즈베키스탄 국세청에 인쇄본과 전자문서로 공식 이관하였다. [O1]',
        quote: {
          O1: '정책 제언 보고서(국·영·러 3개 언어 총 380페이지)를 인쇄본 및 전자문서로 2025년 12월 15일 협력기관에 공식 이관 완료하였음'
        },
        link: '산출물 인도 사실을 직접 기술한 문서',
        limitations: [],
        sufficiency: 'sufficient'
      },
      {
        cid: 'o2',
        group: 'extra',
        text: '빅데이터 기반 세무 리스크 프로파일링 알고리즘 12종의 설계도와 현장 운영 매뉴얼을 인도하였다. [O2]',
        quote: {
          O2: '빅데이터 기반 12개 세무 리스크 프로파일링 알고리즘 설계도 및 현장 운영 매뉴얼 인도 완료'
        },
        link: 'PDM 산출물 지표 외 추가 인도물 (실질적 기술자문 결과물)',
        limitations: ['인도 일자·수령 부서는 원문에 없음'],
        sufficiency: 'sufficient'
      }
    ],
    unconfirmed: []
  },
  short: {
    indicator: { label: PLAN.short.ind, met: '부분 충족 (검토 중 단계)', tone: 'warn' },
    claims: [
      {
        cid: 's1',
        group: 'indicator',
        text: '우즈베키스탄 국세청은 KSP 팀이 제안한 리스크 기반 선별감사 모형을 2026년 세무행정 현대화 로드맵의 핵심 전략과제로 반영하였다. [S1]',
        quote: {
          S1: 'KSP 팀이 제안한 리스크 기반 선별감사 모형을 핵심 전략 과제로 반영하여 검토 중에 있습니다'
        },
        link: '자문 내용(선별감사 모형)과 협력기관의 활용 진술 연결',
        limitations: ['공식 로드맵 확정 문서 미확인', '실무진 인터뷰 단일 출처'],
        sufficiency: 'needs_more'
      }
    ],
    unconfirmed: [],
    suggest: 'KSP 팀이 제안한 리스크 기반 선별감사 모형이 우즈베키스탄 국세청의 2026년 차기 세무행정 현대화 로드맵 초안에 핵심 전략과제로 반영되어 검토 중인 것으로 보고되었다. [S1]',
    errType: '성과 과장',
    reason: '원문은 "반영하여 검토 중"(추진 단계)이며 완료형으로 단정할 근거가 부족함'
  },
  midlong: {
    indicator: { label: PLAN.mid.ind, met: '미확인 (근거 부족)', tone: 'warn' },
    claims: [
      {
        cid: 'm1',
        group: 'indicator',
        text: '향후 전자세정 고도화 시 제도 운영 개선과 징세 효율화가 기대된다는 협력기관의 의견이 제시되었다. [L1]',
        quote: {
          L1: '탈세 방지 및 세입 증대에 실질적 기여를 할 것으로 기대된다'
        },
        link: '기대 진술 — 실현 성과와 구분 필요',
        limitations: ['실제 제도 운영 변화 자료 없음'],
        sufficiency: 'insufficient'
      }
    ],
    unconfirmed: [
      '실제 제도 운영 변화와 장기 정책 효과는 등록 자료로 확인되지 않음 → 후속 운영 자료 필요',
      '차관 사업(EDCF/WB) 공식 협약 체결 이전이므로 장기 성과 산출 불가'
    ],
    suggest: '종합평가 중간보고는 향후 3~5년 내 EDCF 또는 세계은행 차관 기반 시스템 구축 사업과 연계될 경우 탈세 방지와 세입 증대에 기여할 것으로 기대된다고 서술하였다. [L1] 실제 제도 운영 변화와 장기 정책 효과는 현재 자료로 확인되지 않는다.',
    errType: '근거 불일치',
    reason: 'L1은 평가 측 중간보고 서술로 협력기관 의견이 아니며, 차관 사업 연계라는 전제 조건이 빠짐',
    evalResult: '성과 미확인',
    supplement: '후속 운영 자료'
  },
  contrib: {
    indicator: null,
    claims: [
      {
        cid: 'f1',
        group: 'internal',
        text: '우즈베키스탄 국세청장의 직접 지시로 국장급 전담 카운터파트가 매 회의에 참석해 자문단 질의에 즉각 대응한 것으로 기록되었다. [E1]',
        quote: {
          E1: '국세청장의 직접 지시로 국장급 전담 카운터파트가 매 회의마다 100% 참석하여 자문단의 질문에 즉각 대응함'
        },
        link: '협력기관 고위직 리더십 및 참여 → 단기성과(제언 검토·활용)와의 논리적 연결',
        limitations: ['"100% 참석"은 점검표 기재값, 회의록 대조 필요'],
        sufficiency: 'needs_more'
      }
    ],
    unconfirmed: []
  },
  constraint: {
    indicator: null,
    claims: [
      {
        cid: 'k1',
        group: 'internal',
        text: '2025년 8월 국세청 조직개편으로 리스크기획과장 등 담당자 2인이 전보되어 1개월간 후속 소통이 지연되었다. [C1]',
        quote: {
          C1: '2025년 8월 국세청 조직개편으로 리스크기획과장 및 담당자 2인이 타 부서로 전보되어 1개월간 후속 소통이 일시 지연되었음'
        },
        link: '담당자 교체 → 후속 협의 지연. 성과(단기·중장기)에 미친 영향은 미확인',
        limitations: ['성과 영향(project_impact) 미확인'],
        sufficiency: 'needs_more'
      }
    ],
    unconfirmed: [],
    external: [],
    project_impact: 'unconfirmed',
    note: '시안(8쪽)은 [C1]을 외부 보조자료로 예시했으나, 실제 출처는 내부 PM 월간 모니터링 보고이므로 내부 평가근거로 분류함',
    supportReason: '담당자 교체가 단기성과 지연·축소로 이어졌는지 확인할 후속 협의 기록 필요'
  }
};

export const LESSONS: LessonItem[] = [
  {
    tag: '기획팀 환류',
    text: '수원국 국세청의 조직개편 및 담당자 변경 위험에 대비해 PCP 단계부터 복수 부서 공동 참여 구조 의무화 권고',
    evi: ['C1'],
    state: 'ok'
  },
  {
    tag: '타당성 툴 연계',
    text: '본 사업의 세무 빅데이터 룰셋은 중앙아시아 인근국(카자흐스탄, 키르기스스탄) 신규 KSP 제안서 타당성 평가 시 벤치마크 표준으로 활용 가능',
    evi: [],
    state: 'warn'
  },
  {
    tag: '개발금융 연계',
    text: 'KSP 자문 산출물이 EDCF 타당성조사(F/S)의 P/N(Project Note) 기술 스펙으로 즉각 재활용될 수 있도록 데이터 스키마 표준 준수',
    evi: ['L1'],
    state: 'rec'
  }
];

export const PACKAGE_CHECK: PackageCheckItem[] = [
  {
    sev: 'h',
    rule: '발화 주체·조건 대조',
    where: '1. 장기성과',
    issue: '확정문은 "협력기관의 의견이 제시되었다"이나 [L1] 출처는 종합평가 중간보고(평가 측 서술)입니다. "EDCF·세계은행 차관 사업과 연계될 경우"라는 전제와 "3~5년 내" 기간도 빠졌습니다.',
    fix: '주체를 "종합평가 중간보고"로 바로잡고 조건·기간을 문장에 포함'
  },
  {
    sev: 'm',
    rule: '고유명사 대조',
    where: '1. 단기성과',
    issue: '확정문 "디지털전환 중기전략 초안" ↔ [S1] 원문 "2026년 차기 세무행정 현대화 로드맵 초안". 문서 명칭이 원문과 다릅니다.',
    fix: '원문 명칭 사용, 동일 문서 여부를 협력기관에 확인'
  },
  {
    sev: 'm',
    rule: '진술 성격 검증',
    where: '1. 단기성과',
    issue: '원문은 "핵심 전략 과제로 반영하여 검토 중"(추진 단계)입니다. 확정문 "주요 참고자료로 활용"은 성격이 달라 원문보다 약하게, 다른 내용으로 서술되었습니다.',
    fix: '"반영되어 검토 중인 것으로 보고됨"으로 원문 성격 유지'
  },
  {
    sev: 'm',
    rule: '서술 범위 누락',
    where: '1. 산출물',
    issue: '[O2](알고리즘 설계도 12종·현장 운영 매뉴얼)를 인용했지만 문장에는 보고서 전달만 있습니다.',
    fix: '성과지표 외 산출물로 별도 문장 추가'
  },
  {
    sev: 'm',
    rule: '근거 매핑 누락',
    where: '1. ToC 성과',
    issue: '[E1](기여)·[C1](제약)이 원천 근거에 매핑돼 있으나 확정 ToC에 기여·제약요인 서술이 없습니다.',
    fix: '⑦ 기여·제약요인 노드로 확정 후 ToC에 연결'
  },
  {
    sev: 'm',
    rule: '근거 없는 문장',
    where: '2. 환류 교훈',
    issue: '"[타당성 툴 연계] 룰셋을 인근국 벤치마크 표준으로 활용 가능"에는 근거 ID가 없습니다. 활용 가능성은 평가 데이터로 확인되지 않았습니다.',
    fix: '"검토 제안"으로 표현을 낮추거나 근거 보강'
  },
  {
    sev: 'l',
    rule: '출력 형식 중복',
    where: '1. 전체',
    issue: '인용 태그가 중복 출력됩니다 ("[O1] [O1, O2]", "[S1] [S1]", "[L1] [L1]").',
    fix: '내보내기 렌더러에서 claim.evidence_ids 기준 1회 출력'
  },
  {
    sev: 'l',
    rule: '근거 분류 정합성',
    where: '3. [C1]',
    issue: '[C1]은 내부 PM 월간 보고입니다. 시안 8쪽처럼 외부 보조자료로 분류하면 안 됩니다.',
    fix: 'kind=internal 로 등록'
  },
  {
    sev: 'l',
    rule: '중복 파일 방지',
    where: '자료 등록',
    issue: '동일 내용의 인수인계 패키지 파일이 2건 업로드되었습니다.',
    fix: 'SHA-256 해시로 중복 업로드 차단 (자료 등록 화면에 적용)'
  }
];

export const ERR_TYPES: Array<import('../types').ErrorType> = [
  '성과 과장',
  '근거 불일치',
  '진술 성격 오분류',
  'PDM 외 추정',
  '상충 근거 누락',
  '수치·고유명사 불일치',
  '기타'
];

export const ERR_STAGES = ['분류', '개선안 검토', '재검증', '시스템 반영'];

export const QUADS: Record<QuadrantType, { n: string; desc: string; color: string; bg: string }> = {
  policy: {
    n: '지식활용 및 정책 수용형',
    desc: '높은 지식공유 수준 / 정책 초안 반영 등 직접적 제도 활용',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
  },
  lead: {
    n: '확장 및 선도형',
    desc: '높은 지식공유 수준 + 대규모 후속 차관/투자 연계 확장',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  },
  explore: {
    n: '지식 축적 및 초기 탐색형',
    desc: '기초 연구 축적 및 문제 정의 단계 / 제한적 공유 수준',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
  },
  platform: {
    n: '플랫폼형',
    desc: '다자간 협력 네트워크 및 다국가 파급 플랫폼 형성',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
  }
};

export const NOTES: Record<string, string[]> = {
  list: [
    '주제분류 등 기타 분류체계는 삭제',
    '평가팀이 성과관리표(PDM)를 사전 등록하고 사업별 초기 ToC로 이동',
    '담당자·검토상태와 이전/당해 연도를 함께 확인'
  ],
  toc: [
    '계획 산출물·기대성과가 PDM에 있으면 계획정보로 표시',
    '실제 달성 내용과 기여·제약요인은 공란 또는 미검토',
    '단순 ToC와 상세 그래프 전환, 하단에서 사업 자료 입력'
  ],
  docs: [
    '업로드 전 민감정보와 마스킹 상태 확인, 원본·버전 관리',
    'Google Drive·옵시디언 연계는 원본 위치·동기화 범위 협의',
    '한 번 분석한 결과를 ④~⑦에서 검토, 자료 변경 시 영향 항목 재검토',
    '파일 다중 등록 가능, 동일 파일은 해시로 중복 차단'
  ],
  output: [
    '근거문장·문단과 출처 위치를 함께 확인하고 상충 근거를 병렬 제시',
    '원문에 없는 수치·사실은 차단, 산출물에는 외부 검색자료를 사용하지 않음',
    '확정·수정·제외 이력을 보존하고 ToC의 산출물 상태에 반영',
    '수정 완료를 누르지 않아도 최종본을 자동 저장하고 백오피스에 수정 중으로 표시'
  ],
  short: [
    '단순 관련성과 사업의 기여 주장을 구분하여 판단 근거 표시',
    'AI 최초 제안과 평가자 수정본을 함께 보존',
    '성과유형 탭·DAC 매핑·지식그래프 연계 노드 제거'
  ],
  midlong: [
    '중기와 장기성과를 모두 포함하고 실현·추진·기대 진술을 구분',
    '단일 신뢰도 점수 대신 원문 일치와 진술 성격을 별도 표시',
    '근거가 부족하면 미확인으로 남기고 중장기 성과를 자동 생성하지 않음'
  ],
  factors: [
    '기여·제약요인을 나누어 서술하고 각각 근거·판단 논리 연결',
    '외부자료는 출처·날짜·검색범위 표시, 공식 근거와 보조자료 구분',
    '국가 상황이 해당 사업에 영향을 미쳤는지는 별도로 검토'
  ],
  draft: [
    '④~⑦에서 확정한 성과·근거로 초안 생성, 미확인 사항은 한계로 명시',
    '문장 선택 시 성과·근거·출처를 확인하며 편집',
    '근거 검토 완료와 문안 최종 확정을 분리, PO 전달용 묶음 생성'
  ],
  portfolio: [
    '축·임계값·사업 단위 집계 기준을 확인한 뒤 분류',
    'AI 제안과 평가팀 확정을 구분하고 위치 수정 시 사유 기록',
    '현재 축은 표시 예시이며 온톨로지 최종 기준에 맞춰 확정'
  ],
  result: [
    '계획과 실제 결과를 나란히 표시, 미확인 상태도 최종 결과에 유지',
    '기여·제약요인을 관련 성과에 연결하고 노드 선택 시 근거 열기',
    '사업 유형 요약과 후속 확인사항을 기획팀 환류에 활용'
  ],
  admin: [
    '원문·AI 최초 제안·수정 확정본을 분리 보존하고 검토 이력 추적',
    '오류 유형을 검토한 뒤 규칙·프롬프트 개선과 재검증 수행',
    'PO 전달용 자료와 기획팀 환류용 자료를 구분하여 관리'
  ]
};

export const INITIAL_DOCS: DocumentItem[] = [
  {
    id: 'd00',
    name: '성과관리표(PDM)_KSP-2025-UZ-01.xlsx',
    cat: '사업 단계별 결과보고서',
    type: '계획자료',
    mask: 'cleared',
    base: true,
    ver: 'v1'
  },
  {
    id: 'd0p',
    name: '국문 PCP_KSP-2025-UZ-01.hwp',
    cat: '사업 단계별 결과보고서',
    type: '계획자료',
    mask: 'cleared',
    base: true,
    ver: 'v1'
  },
  {
    id: 'd05',
    name: '중간평가_사업관리점검표.pdf',
    cat: '중간평가결과보고서',
    type: '사업자료',
    mask: 'masked',
    ver: 'v1',
    chunks: ['E1']
  },
  {
    id: 'd04',
    name: '우즈베키스탄_KSP_종합평가_중간보고.pdf',
    cat: '중간평가결과보고서',
    type: '사업자료',
    mask: 'masked',
    ver: 'v1',
    chunks: ['L1']
  },
  {
    id: 'd03',
    name: '2026_우즈벡_현지_종료평가_심층인터뷰록.docx',
    cat: '인터뷰·회의록',
    type: '평가근거',
    mask: 'needs_review',
    detect: '인명(실무진 성명)·직위·유선번호 탐지 — 마스킹 확인 필요',
    ver: 'v1',
    chunks: ['S1']
  },
  {
    id: 'd01',
    name: '우즈베키스탄_KSP_최종사업종료보고서_v2.pdf',
    cat: '최종보고서(자문보고서)',
    type: '후속 근거',
    mask: 'cleared',
    ver: 'v2',
    chunks: ['O1']
  },
  {
    id: 'd02',
    name: '기술자문_성과증빙_부속서_2025.pdf',
    cat: '기타',
    type: '후속 근거',
    mask: 'cleared',
    ver: 'v1',
    chunks: ['O2']
  },
  {
    id: 'd06',
    name: 'PM_월간모니터링_보고_202509.pdf',
    cat: '성과 추적 자료',
    type: '후속 근거',
    mask: 'masked',
    ver: 'v1',
    chunks: ['C1']
  }
];
