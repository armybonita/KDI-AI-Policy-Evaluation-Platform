import React from 'react';
import { X, FileText, User, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Chunk } from '../types';
import { STANCE_LABELS, stanceOf } from '../utils/verifier';

interface ChunkModalProps {
  chunk: Chunk | null;
  onClose: () => void;
}

export const ChunkModal: React.FC<ChunkModalProps> = ({ chunk, onClose }) => {
  if (!chunk) return null;

  const stance = stanceOf(chunk.text);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                [{chunk.id}]
              </span>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                {chunk.docType}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                p.{chunk.page} · {chunk.ver}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 break-all">
              {chunk.doc}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          {/* Before Context */}
          {chunk.contextBefore && (
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">... 앞 문맥 (Before Context)</span>
              {chunk.contextBefore}
            </div>
          )}

          {/* Main Verbatim Quote */}
          <div className="bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              발췌 원문 (Verbatim Chunk)
            </span>
            <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              "{chunk.text}"
            </p>
          </div>

          {/* After Context */}
          {chunk.contextAfter && (
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">... 뒤 문맥 (After Context)</span>
              {chunk.contextAfter}
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">진술 주체 (Speaker)</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{chunk.speaker}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">진술 성격 (Stance)</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {STANCE_LABELS[stance]}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">근거 구분</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {chunk.kind === 'internal' ? '내부 평가근거' : '외부 보조자료'}
            </span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
