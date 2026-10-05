import React, { useState } from 'react';
import { NodeKey, NodeState, Role } from '../types';
import { NODE_DEF, CHUNKS, LESSONS } from '../data/mockData';
import { stripCites, citesOf } from '../utils/verifier';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ReportSummaryViewProps {
  nodeStates: Record<NodeKey, NodeState>;
  isReportConfirmed: boolean;
  onConfirmReport: () => void;
  onOpenExportBundle: (audience: 'PO' | 'planning_team') => void;
  onOpenChunkModal: (chunkId: string) => void;
  onNavigateNode: (nodeKey: NodeKey) => void;
  currentRole: Role;
}

export const ReportSummaryView: React.FC<ReportSummaryViewProps> = ({
  nodeStates,
  isReportConfirmed,
  onConfirmReport,
  onOpenExportBundle,
  onOpenChunkModal,
  onNavigateNode,
  currentRole,
}) => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<NodeKey>('short');
  const [commentInput, setCommentInput] = useState<string>('');
  const [commentsList, setCommentsList] = useState<Array<{ text: string; at: string; by: string }>>([
    { text: '단기성과 문안에 대해 [S1] 실무진 인터뷰 단일 출처 한계를 3절에 명시함.', at: '2026-10-04 15:30', by: '평가팀 담당자' },
  ]);

  const allReviewed = Object.values(nodeStates).every(
    (n) => n.status === 'confirmed' || n.status === 'needs_support' || n.status === 'excluded'
  );

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        text: commentInput.trim(),
        at: new Date().toISOString().replace('T', ' ').slice(0, 16),
        by: '평가팀 담당자',
      },
    ]);
    setCommentInput('');
  };

  const selectedNodeState = nodeStates[selectedNodeKey];
  const selectedCites = citesOf(selectedNodeState?.text || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ⑧ 종료평가보고서 종합
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isReportConfirmed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              문안: {isReportConfirmed ? '최종 확정 완료' : '검토 중'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ④~⑦ 단계에서 확정한 성과와 근거를 실제 보고서 템플릿에 맞추어 자동 종합합니다. 미확인 사항은 한계로 명시됩니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none">
            <option>종료평가보고서 표준 템플릿</option>
            <option>요약 브리프 템플릿</option>
          </select>
        </div>
      </div>

      {/* Main Report Document & Citation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Report Document Layout (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-bold">
              KSP Evaluation Report Draft
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              [평가보고서] 우즈베키스탄 디지털 조세 행정 현대화 사업 종료평가
            </h2>
          </div>

          {/* Section 1: Outputs & Outcomes */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center justify-between">
              <span>1. 산출물 및 주요 성과 (Outputs &amp; Outcomes)</span>
              <span className="text-[11px] text-slate-400 font-normal">문장을 클릭하면 근거가 열립니다</span>
            </h3>

            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              <div
                onClick={() => setSelectedNodeKey('output')}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedNodeKey === 'output'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent hover:border-slate-200'
                }`}
              >
                <span className="font-semibold mr-1.5">[산출물]</span>
                {nodeStates.output.text || '산출물 분석 전'}
              </div>

              <div
                onClick={() => setSelectedNodeKey('short')}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedNodeKey === 'short'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent hover:border-slate-200'
                }`}
              >
                <span className="font-semibold mr-1.5">[단기성과]</span>
                {nodeStates.short.text || '단기성과 분석 전'}
              </div>

              <div
                onClick={() => setSelectedNodeKey('midlong')}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedNodeKey === 'midlong'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent hover:border-slate-200'
                }`}
              >
                <span className="font-semibold mr-1.5">[중·장기성과]</span>
                {nodeStates.midlong.text || '중·장기성과 분석 전'}
              </div>
            </div>
          </div>

          {/* Section 2: Factors */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
              2. 사업 기여요인 및 제약요인 (Key Factors)
            </h3>

            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              <div
                onClick={() => setSelectedNodeKey('contrib')}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedNodeKey === 'contrib'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent hover:border-slate-200'
                }`}
              >
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 mr-1.5">
                  [기여요인]
                </span>
                {nodeStates.contrib.text || '기여요인 분석 전'}
              </div>

              <div
                onClick={() => setSelectedNodeKey('constraint')}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedNodeKey === 'constraint'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent hover:border-slate-200'
                }`}
              >
                <span className="font-semibold text-amber-700 dark:text-amber-400 mr-1.5">
                  [제약요인]
                </span>
                {nodeStates.constraint.text || '제약요인 분석 전'}
              </div>
            </div>
          </div>

          {/* Section 3: Limitations & Follow-ups */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
              3. 평가의 한계 및 사후 모니터링 사항 (Limitations)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                중·장기 제도 운영 변화 및 징세 실질 성과는 현재 수집된 자문 종료 시점 문서만으로 단정할 수 없어 '성과 미확인'으로 분류함.
              </li>
              <li>
                단기성과(로드맵 초안 반영 검토)는 수원국 실무진 인터뷰 단일 출처에 의존하므로, 향후 공식 비준 문서 확보를 통한 교차 확인이 요구됨.
              </li>
              <li>
                조직개편에 따른 소통 지연이 최종 성과 발현에 미친 장기적 영향에 대해 후속 모니터링이 필요함.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Selected Sentence Grounding Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                선택 문장의 원천 근거
              </span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded">
                {NODE_DEF[selectedNodeKey].label}
              </span>
            </div>

            {selectedCites.length > 0 ? (
              <div className="space-y-3">
                {selectedCites.map((cid) => {
                  const chunk = CHUNKS[cid];
                  if (!chunk) return null;

                  return (
                    <div
                      key={cid}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-indigo-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                          [{chunk.id}] {chunk.docType}
                        </span>
                        <button
                          onClick={() => onOpenChunkModal(chunk.id)}
                          className="text-[11px] text-indigo-600 hover:underline flex items-center gap-0.5"
                        >
                          <span>원문·문맥 열기</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-lg border-l-2 border-amber-500">
                        "{chunk.text}"
                      </p>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                        <div>문서: {chunk.doc} (p.{chunk.page})</div>
                        <div>진술자: {chunk.speaker}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center">
                연결된 근거 ID가 없습니다.
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">검토 상태:</span>
              <span className="font-bold text-emerald-600">
                {selectedNodeState.status === 'confirmed' ? '평가팀 확정본' : '검토 중'}
              </span>
            </div>
          </div>

          {/* Comments and Revision Actions */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              검토 의견 및 수정 사유 이력
            </h4>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {commentsList.map((c, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs space-y-0.5 border border-slate-100 dark:border-slate-700/60"
                >
                  <p className="text-slate-700 dark:text-slate-300">{c.text}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {c.by} ({c.at})
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="검토 의견 추가..."
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddComment}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Export & Final Confirmation Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-200 block mb-0.5">
            산출물 내보내기 안내:
          </span>
          보고서 문안 + 확정 성과·근거 + 출처 목록이 패키징되어 PO 및 평가 관리 시스템에 안전하게 전송됩니다.
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onConfirmReport}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isReportConfirmed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isReportConfirmed ? '문안 최종 확정됨 (재확인)' : '문안 최종 확정'}
          </button>

          <button
            onClick={() => onOpenExportBundle('PO')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PO 전달용 묶음</span>
          </button>
        </div>
      </div>
    </div>
  );
};
