import React from 'react';
import { Project, Role } from '../types';
import { ShieldCheck, UserCheck, Eye, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeProject: Project;
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  showNotes: boolean;
  onToggleNotes: () => void;
  onSelectScenario: (scenario: 'fresh' | 'final') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeProject,
  currentRole,
  onSelectRole,
  showNotes,
  onToggleNotes,
  onSelectScenario,
}) => {
  const tabs = [
    { id: 'list', label: '사업 목록' },
    { id: 'toc', label: '성과 경로' },
    { id: 'docs', label: '자료 등록' },
    { id: 'review', label: '평가 검토' },
    { id: 'report', label: '보고서·종합' },
    { id: 'admin', label: '평가팀 관리' },
  ];

  const roleLabels: Record<Role, { title: string; desc: string; icon: React.ReactNode }> = {
    evaluator: { title: '평가팀 모드', desc: '전 단계 분석 검토 및 최종 확정 권한', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    po: { title: 'PO 모드 (사업담당자)', desc: '자료 업로드 및 1차 검토/수정 의견 제출', icon: <UserCheck className="w-3.5 h-3.5" /> },
    planner: { title: '기획팀 모드', desc: '확정 성과 ToC 및 후속 사업 환류 조회', icon: <Eye className="w-3.5 h-3.5" /> },
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand & Project Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab('list')}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                KSP
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">AI 평가 워크벤치</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal -mt-0.5">ODA 지식 성과 온톨로지 플랫폼</span>
              </div>
            </div>

            {/* Active Project Chip */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 max-w-sm truncate">
              <span className="bg-indigo-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0">
                {activeProject.code}
              </span>
              <span className="truncate font-medium">{activeProject.name}</span>
              {activeProject.pilot && (
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full font-semibold shrink-0">
                  파일럿
                </span>
              )}
            </div>
          </div>

          {/* Controls: Role, Scenario, Notes */}
          <div className="flex items-center gap-2">
            {/* Role Switcher */}
            <div className="relative flex items-center">
              <select
                value={currentRole}
                onChange={(e) => onSelectRole(e.target.value as Role)}
                aria-label="사용자 권한 모드 선택"
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="evaluator">🛡️ 평가팀 (전단계/확정)</option>
                <option value="po">👤 PO (등록/1차검토)</option>
                <option value="planner">👁️ 기획팀 (환류조회)</option>
              </select>
            </div>

            {/* Scenario Preset */}
            <div className="hidden lg:flex items-center">
              <select
                onChange={(e) => {
                  if (e.target.value === 'fresh' || e.target.value === 'final') {
                    onSelectScenario(e.target.value);
                  }
                  e.target.value = '';
                }}
                defaultValue=""
                aria-label="시연 시나리오 프리셋"
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>시연 프리셋 선택…</option>
                <option value="fresh">새 사업 (자료 등록 전)</option>
                <option value="final">검토 완료 상태 (최종본)</option>
              </select>
            </div>

            {/* Design Notes Toggle */}
            <button
              onClick={onToggleNotes}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                showNotes
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
              title="화면별 '구성 및 검토 사항' 슬라이드 패널 토글"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">설계 가이드</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-1.5 border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
