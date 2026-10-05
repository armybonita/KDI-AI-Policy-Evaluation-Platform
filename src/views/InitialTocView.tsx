import React, { useState } from 'react';
import { Project, PdmPlan } from '../types';
import { ArrowRight, ChevronRight, Layers, Network, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface InitialTocViewProps {
  project: Project;
  plan: PdmPlan;
  onNavigateDocs: () => void;
  onOpenNodeReview: (nodeKey: string) => void;
  analysisDone: boolean;
}

export const InitialTocView: React.FC<InitialTocViewProps> = ({
  project,
  plan,
  onNavigateDocs,
  onOpenNodeReview,
  analysisDone,
}) => {
  const [tocMode, setTocMode] = useState<'simple' | 'graph'>('simple');

  const tocNodes = [
    { key: 'activity', name: '활동', plan: plan.activity.t, ind: plan.activity.ind, actual: '기등록', status: 'done', link: null },
    { key: 'output', name: '산출물', plan: plan.output.t, ind: plan.output.ind, actual: analysisDone ? '작성·전달' : '기등록', status: 'done', link: 'output' },
    { key: 'short', name: '단기성과', plan: plan.short.t, ind: plan.short.ind, actual: analysisDone ? '검토 진행' : '미검토', status: analysisDone ? 'active' : 'pending', link: 'short' },
    { key: 'mid', name: '중기성과', plan: plan.mid.t, ind: plan.mid.ind, actual: analysisDone ? '미확인/검토' : '미검토', status: 'pending', link: 'midlong' },
    { key: 'long', name: '장기성과', plan: plan.long.t, ind: plan.long.ind, actual: analysisDone ? '미확인' : '미검토', status: 'pending', link: 'midlong' },
    { key: 'impact', name: '영향', plan: plan.impact.t, ind: plan.impact.ind, actual: '기등록', status: 'done', link: null },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ② 초기 ToC (성과 경로)와 PDM 계획정보
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            사업 기획 요약(활동·산출물은 기등록, 단기/중장기 성과는 비워 향후 과업 필요성 표시). 계획 대비 실적 비교의 기준선이 됩니다.
          </p>
        </div>

        {/* Mode Toggle & Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTocMode('simple')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                tocMode === 'simple'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              단순 ToC
            </button>
            <button
              onClick={() => setTocMode('graph')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                tocMode === 'graph'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              상세 그래프
            </button>
          </div>
        </div>
      </div>

      {/* Main Status Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full font-semibold">
          계획정보: PDM 등록본
        </span>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full font-medium">
          실제 성과: {analysisDone ? '자료 분석 완료 (평가 검토 단계)' : '분석 전 (미검토)'}
        </span>
      </div>

      {/* ToC Chain Container */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
          {tocNodes.map((node, idx) => (
            <div key={node.key} className="flex flex-col relative group">
              <div
                onClick={() => node.link && onOpenNodeReview(node.link)}
                className={`flex-1 p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  node.link ? 'cursor-pointer hover:border-indigo-400 hover:shadow-xs' : ''
                } ${
                  node.status === 'done'
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-900 border-dashed border-amber-300 dark:border-amber-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-bold text-sm text-indigo-700 dark:text-indigo-400">
                      {node.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        node.actual === '기등록' || node.actual === '작성·전달'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {node.actual}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">계획 (PDM)</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">
                      {node.plan}
                    </p>
                  </div>
                </div>

                {tocMode === 'graph' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
                    <span className="text-slate-400 block">지표:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                      {node.ind}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contributing & Constraining Factors */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              🌱 기여요인 (Enabling Factors)
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {analysisDone ? '협력기관 전담 참여 [확정]' : '미검토 (자료 분석 후 도출)'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              ⚠️ 제약요인 (Constraining Factors)
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {analysisDone ? '담당자 교체 영향 [보완 필요]' : '미검토 (자료 분석 후 도출)'}
            </span>
          </div>
        </div>
      </div>

      {/* Strict Guardrail Banner */}
      <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">인공지능 추정 차단 원칙 (Guardrail)</span>
          <span>성과관리표(PDM), 국문 PCP에 없는 항목은 비워두고, AI가 추정하여 임의로 채우지 않습니다.</span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNavigateDocs}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          <span>③ 사업 자료 입력 및 등록으로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
