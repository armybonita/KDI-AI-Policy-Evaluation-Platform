import React from 'react';
import { BookOpen, X, Info } from 'lucide-react';
import { NOTES } from '../data/mockData';

interface DesignNotesSidebarProps {
  noteKey: string;
  onClose: () => void;
}

export const DesignNotesSidebar: React.FC<DesignNotesSidebarProps> = ({ noteKey, onClose }) => {
  const notesList = NOTES[noteKey] || [
    '화면별 주요 기능 검토 지점',
    '온톨로지 정합성 및 원천 근거 일치성 확인',
    '평가팀 및 PO 권한별 처리 워크플로우'
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/60 rounded-xl p-4 shadow-sm h-fit sticky top-20">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
          <BookOpen className="w-4 h-4" />
          <span>구성 및 검토 사항</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="가이드 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {notesList.map((note, idx) => (
          <div
            key={idx}
            className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/40 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-slate-300"
          >
            <div className="inline-block bg-indigo-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded mb-1.5">
              0{idx + 1}
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 leading-normal flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <span>화면 시안(12쪽) 기준 검토 지점입니다. 가이드를 닫으면 화면이 넓어집니다.</span>
      </div>
    </aside>
  );
};
