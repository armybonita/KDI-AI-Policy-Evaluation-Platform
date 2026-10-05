import React, { useRef } from 'react';
import { DocumentItem } from '../types';
import { computeFileSha256 } from '../utils/verifier';
import {
  UploadCloud,
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
  FolderSync
} from 'lucide-react';

interface DataRegistrationViewProps {
  docs: DocumentItem[];
  onUploadFiles: (files: FileList) => Promise<void>;
  onMaskDocument: (docId: string) => void;
  onRunAnalysis: () => void;
  onNavigateReview: () => void;
  analysisState: {
    state: 'idle' | 'running' | 'done';
    pct: number;
    log: Array<[string, string]>;
  };
  onOpenChunkModal: (chunkId: string) => void;
}

export const DataRegistrationView: React.FC<DataRegistrationViewProps> = ({
  docs,
  onUploadFiles,
  onMaskDocument,
  onRunAnalysis,
  onNavigateReview,
  analysisState,
  onOpenChunkModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingMaskingCount = docs.filter((d) => d.mask === 'needs_review' && !d.dup).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            ③ 사업 자료 등록과 분석 실행
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            평가팀이 파일을 항목별로 다중 업로드합니다. 민감정보 점검 및 SHA-256 중복 필터링을 거친 후 분석을 수행합니다.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
          >
            <UploadCloud className="w-4 h-4" />
            파일 다중 업로드
          </button>
          <button
            onClick={() => alert('Google Drive 및 옵시디언 메타데이터 동기화: 원본 저장소 범위 협의 후 실시간 연계됩니다.')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <FolderSync className="w-3.5 h-3.5 text-indigo-600" />
            기존 자료 불러오기
          </button>
        </div>
      </div>

      {/* Uploaded Documents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">등록 문서 및 자료 목록</span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs px-2 py-0.5 rounded-full">
              총 {docs.length}건
            </span>
          </div>
          {pendingMaskingCount > 0 && (
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              민감정보 마스킹 검토 필요 ({pendingMaskingCount}건)
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-4 font-semibold">문서·자료 명칭</th>
                <th className="py-2.5 px-3 font-semibold">분류</th>
                <th className="py-2.5 px-3 font-semibold">용도/유형</th>
                <th className="py-2.5 px-3 font-semibold">민감정보 점검</th>
                <th className="py-2.5 px-3 font-semibold">등록 상태</th>
                <th className="py-2.5 px-3 font-semibold">버전</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {docs.map((doc) => {
                return (
                  <tr
                    key={doc.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      doc.dup ? 'opacity-50 bg-slate-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 break-all">
                        {doc.name}
                      </div>
                      {doc.detect && (
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                          {doc.detect}
                        </div>
                      )}
                      {doc.chunks && analysisState.state === 'done' && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400">추출 청크:</span>
                          {doc.chunks.map((cid) => (
                            <button
                              key={cid}
                              onClick={() => onOpenChunkModal(cid)}
                              className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800 transition-colors"
                            >
                              [{cid}]
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {doc.cat}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {doc.type}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {doc.mask === 'needs_review' ? (
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                            검토 필요
                          </span>
                          {!doc.dup && (
                            <button
                              onClick={() => onMaskDocument(doc.id)}
                              className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold px-2 py-0.5 rounded text-[11px] hover:opacity-90 transition-opacity"
                            >
                              마스킹 확인
                            </button>
                          )}
                        </div>
                      ) : doc.mask === 'masked' ? (
                        <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                          마스킹 완료
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                          확인 완료
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {doc.dup ? (
                        <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                          중복 (차단)
                        </span>
                      ) : doc.base ? (
                        <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium px-2 py-0.5 rounded text-[11px]">
                          기존 자료
                        </span>
                      ) : doc.mask === 'needs_review' ? (
                        <span className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-medium px-2 py-0.5 rounded text-[11px]">
                          등록 대기
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                          등록 가능
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {doc.ver}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration & Analysis Trigger Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sync Settings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              연계 설정 <span className="text-amber-600 text-xs font-semibold">[구현 범위 협의]</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            원본 저장소 / 파일 버전 / Google Drive 연계 / 옵시디언(Obsidian) 메타데이터 연결
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              동기화 및 롤백 정책:
            </span>
            자료 변경 시 기존 확정본은 영구 보존(append-only)되며, 수정된 문서의 영향을 받는 노드만 ‘재검토 대상’으로 자동 플래그됩니다.
          </div>
        </div>

        {/* Analysis Execution Box */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                AI 분석 파이프라인 실행
              </h3>
              {analysisState.state === 'done' && (
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  분석 및 검증 완료
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {analysisState.state !== 'idle' && (
              <div className="space-y-1.5 mb-3">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${analysisState.pct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Log Stream */}
            {analysisState.log.length > 0 && (
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] space-y-1 max-h-36 overflow-y-auto leading-relaxed border border-slate-800">
                {analysisState.log.map(([type, msg], i) => (
                  <div
                    key={i}
                    className={type === 'w' ? 'text-amber-400 font-medium' : 'text-emerald-400'}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {analysisState.state === 'idle' && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pendingMaskingCount > 0
                  ? `민감정보 검토 대기 자료(${pendingMaskingCount}건)가 남아 있어 분석을 시작할 수 없습니다. 상단 표에서 '마스킹 확인'을 진행해 주세요.`
                  : '모든 자료의 마스킹 점검이 완료되었습니다. 분석을 실행하면 ④ 산출물 ~ ⑦ 기여·제약요인 노드의 초안과 검증 결과가 생성됩니다.'}
              </p>
            )}
          </div>

          {/* Action Trigger */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * 출처 청크 대조 &amp; 가드레일 자동 검증 포함
            </span>

            {analysisState.state === 'done' ? (
              <button
                onClick={onNavigateReview}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <span>④ 평가 검토로 이동</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onRunAnalysis}
                disabled={pendingMaskingCount > 0 || analysisState.state === 'running'}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>자료 확인 후 분석 실행</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
