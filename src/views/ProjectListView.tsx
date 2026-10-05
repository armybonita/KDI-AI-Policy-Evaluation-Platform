import React, { useState } from 'react';
import { Project, NodeStatus } from '../types';
import { Search, Filter, ArrowRight, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, PlusCircle } from 'lucide-react';

interface ProjectListViewProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenToc: (projectId: string) => void;
  analysisDone: boolean;
  reviewedCount: number;
  totalNodesCount: number;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenToc,
  analysisDone,
  reviewedCount,
  totalNodesCount,
}) => {
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions = [...new Set(projects.map((p) => p.region))];

  const getComputedStatus = (p: Project): { label: string; tone: string; desc: string } => {
    if (p.example) {
      if (p.status === 'confirmed') return { label: '종료평가 완료', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300', desc: '과거 사업 평가자료' };
      return { label: '미검토', tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', desc: '분석 대기' };
    }
    if (!analysisDone) return { label: '미검토', tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', desc: '자료 등록 및 분석 대기' };
    if (reviewedCount === totalNodesCount) return { label: '검토 완료 (확정)', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300', desc: `${reviewedCount}/${totalNodesCount} 노드 확정` };
    if (reviewedCount > 0) return { label: '평가 검토 중', tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300', desc: `${reviewedCount}/${totalNodesCount} 노드 진행` };
    return { label: 'AI 분석 완료', tone: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300', desc: '평가자 검토 대기' };
  };

  const filteredProjects = projects.filter((p) => {
    if (yearFilter !== 'all' && p.yearKey !== yearFilter) return false;
    if (regionFilter !== 'all' && p.region !== regionFilter) return false;
    if (searchQuery) {
      const match = (p.name + p.code + p.country + p.ministry).toLowerCase();
      if (!match.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ① KSP 사업 목록 및 검토상태
            </h1>
            <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              성과관리표(PDM) · 국문 PCP 사전 등록
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            이전 연도 평가 완료 자료와 당해 연도 파일럿 사업을 통합 조회하여 프로세스를 검증합니다.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            PDM 사전등록
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs">
            <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
            국문 PCP 등록
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사업명, 국가, 사업코드 검색..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">연도: 전체</option>
            <option value="cur">당해 연도 (2025/26)</option>
            <option value="prev">이전 연도 (2024/25)</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">국가·지역: 전체</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((proj) => {
          const st = getComputedStatus(proj);
          const isSelected = proj.id === activeProjectId;

          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {proj.code}
                    </span>
                    {proj.pilot && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        25/26 파일럿
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.tone}`}>
                    {st.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {proj.name}
                </h3>

                {/* Meta details */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">국가 · 지역</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {proj.country} ({proj.region})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">협력국 부처</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[170px]">
                      {proj.ministry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">수행기관 / PM</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[170px]">
                      {proj.pm_po || '등록 담당자'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">평가자</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {proj.reviewer || '평가팀'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {proj.year} 사업
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(proj.id);
                    onOpenToc(proj.id);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <span>초기 ToC 열기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
