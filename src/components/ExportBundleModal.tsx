import React, { useState } from 'react';
import { X, Copy, Check, Download, PackageCheck, FileJson, FileText } from 'lucide-react';

interface ExportBundleModalProps {
  audience: 'PO' | 'planning_team';
  bundleData: any;
  onClose: () => void;
}

export const ExportBundleModal: React.FC<ExportBundleModalProps> = ({
  audience,
  bundleData,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'md'>('json');

  const jsonString = JSON.stringify(bundleData, null, 2);

  const getMarkdownString = () => {
    if (audience === 'PO') {
      return `# [KSP 종료평가 산출물 패키지 - PO 전달용]
**사업명**: ${bundleData.project_id || '우즈베키스탄 조세 행정 현대화'}
**작성일시**: ${bundleData.created_at}
**문안 상태**: ${bundleData.items?.find((i: any) => i.type === 'report_draft')?.status || '검토 중'}

---

## 1. 확정 성과 및 산출물 문안
${(bundleData.items?.find((i: any) => i.type === 'confirmed_nodes')?.nodes || [])
  .map(
    (n: any) => `### [${n.node}]
${n.text} (근거: ${n.evidence.join(', ') || '없음'})
*확정자: ${n.confirmed_by} | 일시: ${n.confirmed_at}*`
  )
  .join('\n\n')}

---

## 2. 원천 근거 및 출처 목록
${(bundleData.items?.find((i: any) => i.type === 'sources')?.list || [])
  .map((s: string) => `- ${s}`)
  .join('\n')}

---

## 3. 평가 한계 및 후속 확인사항
${(bundleData.items?.find((i: any) => i.type === 'limitations')?.list || [])
  .map((l: string) => `- ${l}`)
  .join('\n')}
`;
    } else {
      return `# [KSP 지식 환류 및 포트폴리오 패키지 - 기획팀용]
**사업명**: ${bundleData.project_id || '우즈베키스탄 조세 행정 현대화'}
**포트폴리오 유형**: ${bundleData.items?.find((i: any) => i.type === 'portfolio_class')?.final_class || '미확정'}
**분류 사유**: ${bundleData.items?.find((i: any) => i.type === 'portfolio_class')?.reason || '—'}

---

## 1. 최종 평가결과 ToC 요약
${(bundleData.items?.find((i: any) => i.type === 'final_toc')?.nodes || [])
  .map((n: any) => `- **${n.node}**: [계획] ${n.plan} ➔ [실적] ${n.result}`)
  .join('\n')}

---

## 2. 사업 기획 및 운영 환류 교훈 (Lessons Learned)
${(bundleData.items?.find((i: any) => i.type === 'lessons')?.list || [])
  .map((l: any) => `- **[${l.tag}]** ${l.text} (근거: ${l.evidence?.join(', ') || '미연결'})`)
  .join('\n')}

---

## 3. 사후 성과 모니터링 과제
${(bundleData.items?.find((i: any) => i.type === 'follow_up')?.list || [])
  .map((f: string) => `- ${f}`)
  .join('\n')}
`;
    }
  };

  const currentContent = exportFormat === 'json' ? jsonString : getMarkdownString();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = exportFormat === 'json' ? 'json' : 'md';
    const blob = new Blob([currentContent], {
      type: exportFormat === 'json' ? 'application/json' : 'text/markdown',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ksp_export_${audience.toLowerCase()}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-xs px-2 py-0.5 rounded font-bold">
                export_bundle
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {audience === 'PO' ? '사업담당자 (PO) 전달용 묶음' : '기획팀 성과 환류용 묶음'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {audience === 'PO' ? 'PO 전달용 평가 종합 패키지' : '기획팀 지식 환류 & 포트폴리오 패키지'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector & Actions */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setExportFormat('json')}
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                exportFormat === 'json'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              JSON 스키마
            </button>
            <button
              onClick={() => setExportFormat('md')}
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                exportFormat === 'md'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Markdown 보고서
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료' : '클립보드 복사'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>파일 다운로드</span>
            </button>
          </div>
        </div>

        {/* Code / Text Preview */}
        <div className="flex-1 min-h-0 bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-auto leading-relaxed border border-slate-800">
          <pre>{currentContent}</pre>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>* 산출물과 근거, 출처, 한계가 독립적으로 번들링되어 덮어쓰기 없이 안전하게 이관됩니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
