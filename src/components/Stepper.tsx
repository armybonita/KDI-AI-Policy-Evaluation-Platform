import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { NodeKey, NodeStatus } from '../types';

interface StepperProps {
  currentTab: string;
  reviewSubTab: NodeKey | 'factors';
  reportSubTab: 'draft' | 'portfolio' | 'result';
  onNavigateStep: (stepIndex: number) => void;
  nodeStatuses: Record<NodeKey, NodeStatus>;
  isAnalysisDone: boolean;
  isReportConfirmed: boolean;
  isPortfolioConfirmed: boolean;
  isResultSent: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  currentTab,
  reviewSubTab,
  reportSubTab,
  onNavigateStep,
  nodeStatuses,
  isAnalysisDone,
  isReportConfirmed,
  isPortfolioConfirmed,
  isResultSent,
}) => {
  const steps = [
    { num: '①', label: '사업 목록', group: 'list' },
    { num: '②', label: '초기 ToC', group: 'toc' },
    { num: '③', label: '자료 등록', group: 'docs' },
    { num: '④', label: '산출물', group: 'review_output', loop: true },
    { num: '⑤', label: '단기성과', group: 'review_short', loop: true },
    { num: '⑥', label: '중·장기성과', group: 'review_midlong', loop: true },
    { num: '⑦', label: '기여·제약', group: 'review_factors', loop: true },
    { num: '⑧', label: '보고서', group: 'report_draft' },
    { num: '⑨', label: '포트폴리오', group: 'report_portfolio' },
    { num: '⑩', label: '종합 결과', group: 'report_result' },
  ];

  const getCurrentStepIndex = () => {
    if (currentTab === 'list') return 0;
    if (currentTab === 'toc') return 1;
    if (currentTab === 'docs') return 2;
    if (currentTab === 'review') {
      if (reviewSubTab === 'output') return 3;
      if (reviewSubTab === 'short') return 4;
      if (reviewSubTab === 'midlong') return 5;
      if (reviewSubTab === 'factors') return 6;
    }
    if (currentTab === 'report') {
      if (reportSubTab === 'draft') return 7;
      if (reportSubTab === 'portfolio') return 8;
      if (reportSubTab === 'result') return 9;
    }
    return -1;
  };

  const isStepDone = (idx: number) => {
    if (idx === 0) return true;
    if (idx === 1) return true;
    if (idx === 2) return isAnalysisDone;
    if (idx === 3) return ['confirmed', 'needs_support', 'excluded'].includes(nodeStatuses.output);
    if (idx === 4) return ['confirmed', 'needs_support', 'excluded'].includes(nodeStatuses.short);
    if (idx === 5) return ['confirmed', 'needs_support', 'excluded'].includes(nodeStatuses.midlong);
    if (idx === 6) return ['confirmed', 'needs_support', 'excluded'].includes(nodeStatuses.contrib) && ['confirmed', 'needs_support', 'excluded'].includes(nodeStatuses.constraint);
    if (idx === 7) return isReportConfirmed;
    if (idx === 8) return isPortfolioConfirmed;
    if (idx === 9) return isResultSent;
    return false;
  };

  const currentIdx = getCurrentStepIndex();

  if (currentTab === 'admin') return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {steps.map((step, idx) => {
            const isCur = idx === currentIdx;
            const isDone = isStepDone(idx) && !isCur;

            return (
              <React.Fragment key={step.label}>
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <button
                  onClick={() => onNavigateStep(idx)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    isCur
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : step.loop
                      ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                  title={step.loop ? '④~⑦ 단계는 보완자료 발생 시 순환 검토 가능' : undefined}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      isCur
                        ? 'bg-indigo-600 text-white font-bold'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                  </span>
                  <span>{step.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
