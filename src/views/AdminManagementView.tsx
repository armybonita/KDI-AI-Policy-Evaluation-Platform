import React, { useState } from 'react';
import { NodeKey, NodeState, Revision, ErrorCase, Role } from '../types';
import { NODE_DEF, CHUNKS, AI_DATA, PACKAGE_CHECK, ERR_TYPES, ERR_STAGES, LESSONS } from '../data/mockData';
import { stripCites } from '../utils/verifier';
import {
  ShieldAlert,
  History,
  FileCheck,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  ChevronRight,
  ShieldCheck,
  Users
} from 'lucide-react';

interface AdminManagementViewProps {
  nodeStates: Record<NodeKey, NodeState>;
  revisions: Revision[];
  errors: ErrorCase[];
  onAdvanceErrorStage: (errorIndex: number) => void;
  onOpenExportBundle: (audience: 'PO' | 'planning_team') => void;
  onOpenChunkModal: (chunkId: string) => void;
  currentRole: Role;
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({
  nodeStates,
  revisions,
  errors,
  onAdvanceErrorStage,
  onOpenExportBundle,
  onOpenChunkModal,
  currentRole,
}) => {
  const [adminTab, setAdminTab] = useState<'check' | 'history' | 'errors' | 'bundles' | 'feedback'>('check');
  const [selectedHistoryNode, setSelectedHistoryNode] = useState<NodeKey>('short');

  // Error distribution
  const errorCounts: Record<string, number> = {};
  ERR_TYPES.forEach((t) => (errorCounts[t] = 0));
  errors.forEach((e) => {
    errorCounts[e.type] = (errorCounts[e.type] || 0) + 1;
  });

  const maxErrorCount = Math.max(1, ...Object.values(errorCounts));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          평가팀 관리 화면과 지식 환류 (Admin &amp; Feedback)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          원문·AI 최초 제안·수정 확정본을 분리 보존(append-only)하고, 오류 유형을 체계적으로 분류하여 프롬프트 규칙을 개선합니다.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'check', label: '인수인계 패키지 점검', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { key: 'history', label: '사업별 수정 이력', icon: <History className="w-3.5 h-3.5" /> },
          { key: 'errors', label: `오류 검토 (${errors.length})`, icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { key: 'bundles', label: '최종산출물 패키지', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { key: 'feedback', label: '환류 및 권한 체계', icon: <Users className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isCur = adminTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isCur
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Package Check */}
      {adminTab === 'check' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                인수인계 패키지 자동 대조 검증 결과 (KSP-2025-UZ-01)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                평가 결과 확정 문장과 원천 근거 청크 매핑의 정합성을 서버 검증 규칙으로 전수 대조한 결과입니다.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                높음 1
              </span>
              <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                중간 5
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                낮음 3
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-4 font-semibold">심각도</th>
                  <th className="py-2.5 px-3 font-semibold">검증 규칙</th>
                  <th className="py-2.5 px-3 font-semibold">위치</th>
                  <th className="py-2.5 px-4 font-semibold">발견 내용</th>
                  <th className="py-2.5 px-4 font-semibold">조치 사항</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {PACKAGE_CHECK.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.sev === 'h' ? (
                        <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          높음 (High)
                        </span>
                      ) : item.sev === 'm' ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          중간 (Mid)
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px]">
                          낮음 (Low)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.rule}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">
                      {item.where}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 leading-relaxed max-w-sm">
                      {item.issue}
                    </td>
                    <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-medium leading-relaxed max-w-xs">
                      {item.fix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: History (3-column comparison) */}
      {adminTab === 'history' && (
        <div className="space-y-4">
          {/* Node Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {Object.keys(NODE_DEF).map((k) => (
              <button
                key={k}
                onClick={() => setSelectedHistoryNode(k as NodeKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedHistoryNode === k
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-600'
                }`}
              >
                {NODE_DEF[k as NodeKey].num} {NODE_DEF[k as NodeKey].label}
              </button>
            ))}
          </div>

          {/* 3-Column Version Compare */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 block">1. 원천 출처 근거</span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                "{CHUNKS[AI_DATA[selectedHistoryNode].claims[0]?.cid === 's1' ? 'S1' : 'O1']?.text || '출처 청크'}"
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-amber-600 block">2. AI 최초 제안 (Initial Proposal)</span>
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed line-through decoration-rose-500">
                {AI_DATA[selectedHistoryNode].claims[0]?.text || 'AI 초안'}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-emerald-600 block">3. 평가팀 최종 확정본 (Confirmed)</span>
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-semibold leading-relaxed">
                {nodeStates[selectedHistoryNode].text || '확정본'}
              </div>
            </div>
          </div>

          {/* Audit Revisions Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                변경 이력 대장 (Append-only Audit Log)
              </span>
              <span className="text-slate-400">덮어쓰기 금지 · SHA-256 무결성 서명</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200">
                    <th className="py-2.5 px-4">Revision ID</th>
                    <th className="py-2.5 px-3">유형 (Kind)</th>
                    <th className="py-2.5 px-3">작성자</th>
                    <th className="py-2.5 px-3">일시</th>
                    <th className="py-2.5 px-3">프롬프트/해시</th>
                    <th className="py-2.5 px-4">수정 본문 요약</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {revisions
                    .filter((r) => r.node === selectedHistoryNode)
                    .map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{rev.id}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rev.kind === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rev.kind === 'reviewer_edit'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rev.kind}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{rev.by}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{rev.at}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                          {rev.prompt} | {rev.hash?.slice(0, 8)}...
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 max-w-sm truncate">
                          {stripCites(rev.text)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Error Categorization & Prompt Loop */}
      {adminTab === 'errors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Error Distribution Chart (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100">
              오류 유형별 발생 집계 (Error Distribution)
            </h3>

            <div className="space-y-3">
              {ERR_TYPES.map((type) => {
                const count = errorCounts[type] || 0;
                const pct = (count / maxErrorCount) * 100;

                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{type}</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{count}건</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-200">
              * 누적된 오류 사례는 프롬프트 엔지니어링 가드레일 및 단위 테스트 케이스로 자동 전환됩니다.
            </div>
          </div>

          {/* Error Improvement Loop Pipeline (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100">
              오류 검토 및 시스템 환류 파이프라인
            </h3>

            {errors.length > 0 ? (
              <div className="space-y-3">
                {errors.map((err, idx) => (
                  <div
                    key={err.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {err.type}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {NODE_DEF[err.node].label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{err.at}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-500">
                        <span className="font-bold text-rose-600 mr-1">[AI 오류 초안]</span>
                        {stripCites(err.ai)}
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="font-bold text-emerald-600 mr-1">[평가자 확정]</span>
                        {stripCites(err.final)}
                      </div>
                    </div>

                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                        개선 메모 (Fix Note):
                      </span>
                      {err.fix}
                    </div>

                    {/* 4-Stage Progress Stepper */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1.5">
                        {ERR_STAGES.map((stName, sIdx) => (
                          <span
                            key={stName}
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              sIdx <= err.stage
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {stName}
                          </span>
                        ))}
                      </div>

                      {err.stage < 3 && (
                        <button
                          onClick={() => onAdvanceErrorStage(idx)}
                          className="px-2.5 py-1 bg-slate-800 text-white rounded text-[11px] hover:bg-slate-900 transition-colors"
                        >
                          다음 단계: {ERR_STAGES[err.stage + 1]}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-10 text-center">
                수정 후 확정한 오류 사례가 아직 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Bundles */}
      {adminTab === 'bundles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <span className="text-xs font-bold text-indigo-600 block">audience: PO (사업담당자)</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">PO 전달용 묶음 패키지</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              확정된 종료평가보고서 문안과 원천 근거 매핑 목록, 출처 증빙, 평가 한계가 하나의 패키지로 묶여 PO 시스템으로 이관됩니다.
            </p>
            <button
              onClick={() => onOpenExportBundle('PO')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PO 패키지 생성 및 다운로드</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <span className="text-xs font-bold text-emerald-600 block">audience: planning_team (기획팀)</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">기획팀 환류용 묶음 패키지</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              최종 ToC 비교 결과, 성과 포트폴리오 4분면 분류, 사업 기획/운영 교훈, 사후 모니터링 체크리스트가 기획 환류용으로 생성됩니다.
            </p>
            <button
              onClick={() => onOpenExportBundle('planning_team')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>기획팀 패키지 생성 및 다운로드</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Feedback and Roles */}
      {adminTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Feedback Lessons (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100">
              사업 기획 및 타당성 조사 환류 교훈 (Lessons Learned)
            </h3>

            <div className="space-y-2.5">
              {LESSONS.map((l, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {l.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      {l.evi.map((cid) => (
                        <button
                          key={cid}
                          onClick={() => onOpenChunkModal(cid)}
                          className="bg-slate-200 text-slate-700 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded hover:bg-indigo-100"
                        >
                          [{cid}]
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {l.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Role Permission Matrix (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100">
              사용자 역할 및 데이터 권한 체계
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <th className="py-2 px-3">역할 (Role)</th>
                    <th className="py-2 px-2">현재 (PoC)</th>
                    <th className="py-2 px-2">향후 (Target)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-bold">평가팀</td>
                    <td className="py-2.5 px-2">전단계 수행 / 확정</td>
                    <td className="py-2.5 px-2 font-semibold text-indigo-600">검토 확인 / 최종확정</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold">사업담당자 (PO)</td>
                    <td className="py-2.5 px-2 text-slate-400">—</td>
                    <td className="py-2.5 px-2">자료 등록 / 1차 검토</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold">기획팀</td>
                    <td className="py-2.5 px-2 text-slate-400">—</td>
                    <td className="py-2.5 px-2">확정 ToC / 환류 조회</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 leading-relaxed">
              * 평가팀에 종합 결과 전달 및 최종 승인 완료 후에는 PO가 임의로 결과를 덮어쓸 수 없는 override 불가 정책이 적용됩니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
