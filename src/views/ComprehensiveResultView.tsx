import React, { useState } from 'react';
import { NodeKey, NodeState, QuadrantType, Role } from '../types';
import { PLAN, QUADS, LESSONS } from '../data/mockData';
import {
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Download,
  Share2
} from 'lucide-react';

interface ComprehensiveResultViewProps {
  nodeStates: Record<NodeKey, NodeState>;
  portfolioClass: QuadrantType;
  onOpenExportBundle: (audience: 'PO' | 'planning_team') => void;
  onNavigateReport: () => void;
  isResultSent: boolean;
  onSendResult: () => void;
  currentRole: Role;
}

export const ComprehensiveResultView: React.FC<ComprehensiveResultViewProps> = ({
  nodeStates,
  portfolioClass,
  onOpenExportBundle,
  onNavigateReport,
  isResultSent,
  onSendResult,
  currentRole,
}) => {
  const [viewMode, setViewMode] = useState<'result' | 'plan'>('result');

  const resultNodes = [
    {
      key: 'activity',
      name: '활동',
      plan: PLAN.activity.t,
      actual: '정책 자문 및 실무 워크숍 수행 완료',
      status: '확정',
      tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      key: 'output',
      name: '산출물',
      plan: PLAN.output.t,
      actual: '제언 보고서 작성·전달 및 알고리즘 설계도 인도',
      status: nodeStates.output.status === 'confirmed' ? '확정' : '검토 중',
      tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      key: 'short',
      name: '단기성과',
      plan: PLAN.short.t,
      actual: '차기 로드맵 초안 핵심과제 반영 및 검토 중',
      status: nodeStates.short.status === 'confirmed' ? '확정' : '검토 중',
      tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      key: 'mid',
      name: '중기성과',
      plan: PLAN.mid.t,
      actual: '제도 운영 개선 (기대 진술 / 실질 데이터 미확보)',
      status: '미확인',
      tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      key: 'long',
      name: '장기성과',
      plan: PLAN.long.t,
      actual: '징세 효율화 및 세수 증대 (후속 차관 연계 전 미확인)',
      status: '미확인',
      tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
  ];

  const storyParagraph = `[KSP 성과 스토리] 정책 자문을 통해 작성·전달된 제언 보고서(국·영·러 380쪽)와 세무 리스크 프로파일링 알고리즘 설계도는 수원국 국세청의 2026년 차기 세무행정 현대화 로드맵 초안에 핵심 전략과제로 반영되어 내부 검토 중인 것으로 보고되었다. 이 과정에서 국세청 고위직의 강력한 오너십과 국장급 전담 카운터파트의 지속적 참여가 핵심적인 기여요인으로 작용하였다. 다만 2025년 8월 수원국 조직개편에 따른 담당자 교체로 후속 소통이 일시 지연되었으며, 제도 운영 개선과 장기적 세입 증대 효과는 현 시점에서 확인되지 않아 사후 모니터링 과제로 남긴다.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ⑩ 평가 결과를 반영한 ToC와 종합 결과
            </h1>
            <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              사업 유형: {QUADS[portfolioClass]?.n || '지식활용 및 정책 수용형'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            초기 PDM 계획정보와 최종 검토 결과를 대비하여 사업의 실현 성과와 평가 한계를 한눈에 확인합니다.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('result')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
              viewMode === 'result'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            평가 결과 ToC
          </button>
          <button
            onClick={() => setViewMode('plan')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
              viewMode === 'plan'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            초기 계획 보기
          </button>
        </div>
      </div>

      {/* Resulting ToC Chain */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {resultNodes.map((node) => (
            <div
              key={node.key}
              className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-indigo-700 dark:text-indigo-400">
                    {node.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${node.tone}`}>
                    {node.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {viewMode === 'plan' ? 'PDM 계획' : '최종 평가 실적'}
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {viewMode === 'plan' ? node.plan : node.actual}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contributing & Constraining Factors */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                🌱 핵심 기여요인 (Enabler)
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                협력기관 국장급 전담 카운터파트의 지속적 참여 및 고위직 리더십
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
              확정
            </span>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                ⚠️ 주요 제약요인 (Constraint)
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                수원국 조직개편에 따른 실무자 전보로 후속 소통 일시 지연
              </span>
            </div>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
              보완 필요
            </span>
          </div>
        </div>
      </div>

      {/* Outcome Story Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            확정 ToC 기반 성과 스토리 (Narrative Synthesis)
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700 font-medium">
          {storyParagraph}
        </p>
      </div>

      {/* Monitoring and Feedback */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
            📡 사후 성과 모니터링 사항
          </span>
          <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
            <li>차기 조세개혁 로드맵(2026-2030) 내각 비준 및 법제화 여부 추적</li>
            <li>실제 리스크 기반 선별감사 모형 적용에 따른 세무조사 실적 확보</li>
            <li>EDCF / 세계은행 차관 기반 후속 시스템 구축 사업 연계 점검</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
            💡 기획 / 운영 환류 사항 (Lessons Learned)
          </span>
          <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
            <li>수원국 잦은 인사이동 위험에 대비해 복수 부서 공동 참여 체계 제도화</li>
            <li>후속 차관 사업 연계를 위한 사전 기술스펙(F/S 요건) 표준 준수</li>
            <li>동일 권역(중앙아 인근국) 유사 사업 타당성 평가 시 벤치마크 활용</li>
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateReport}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            근거·보고서 열기
          </button>
          <button
            onClick={() => onOpenExportBundle('planning_team')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>기획팀 환류 묶음</span>
          </button>
        </div>

        <button
          onClick={onSendResult}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isResultSent
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isResultSent ? '평가팀 전달 완료 (재전달)' : '종합 결과 평가팀에 전달'}</span>
        </button>
      </div>
    </div>
  );
};
