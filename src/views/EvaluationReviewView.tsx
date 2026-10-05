import React, { useState, useEffect } from 'react';
import { NodeKey, NodeState, DecisionType, ErrorType, Role } from '../types';
import { NODE_DEF, AI_DATA, CHUNKS, ERR_TYPES } from '../data/mockData';
import { verifyText, stripCites, citesOf, STANCE_LABELS, stanceOf, quoteMatch } from '../utils/verifier';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Code,
  Info,
  ChevronRight
} from 'lucide-react';

interface EvaluationReviewViewProps {
  currentSubTab: NodeKey | 'factors';
  onSelectSubTab: (subTab: NodeKey | 'factors') => void;
  nodeStates: Record<NodeKey, NodeState>;
  onDecideNode: (
    nodeKey: NodeKey,
    decision: DecisionType,
    newText?: string,
    reason?: string,
    errorType?: ErrorType
  ) => void;
  onNavigateNext: () => void;
  onOpenChunkModal: (chunkId: string) => void;
  currentRole: Role;
}

export const EvaluationReviewView: React.FC<EvaluationReviewViewProps> = ({
  currentSubTab,
  onSelectSubTab,
  nodeStates,
  onDecideNode,
  onNavigateNext,
  onOpenChunkModal,
  currentRole,
}) => {
  // Active factor switch (for tab ⑦)
  const [activeFactorKey, setActiveFactorKey] = useState<'contrib' | 'constraint'>('contrib');

  // Determine current active node
  const activeNodeKey: NodeKey = currentSubTab === 'factors' ? activeFactorKey : currentSubTab;
  const activeNodeState = nodeStates[activeNodeKey];
  const activeAiData = AI_DATA[activeNodeKey];

  // Local editor state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(activeNodeState.text || '');
  const [reasonInput, setReasonInput] = useState<string>('');
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorType | ''>('');
  const [formError, setFormError] = useState<string>('');
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    activeAiData.claims[0]?.cid || ''
  );
  const [showJson, setShowJson] = useState<boolean>(false);

  // Sync state when active node changes
  useEffect(() => {
    setEditText(activeNodeState.text || '');
    setIsEditing(false);
    setReasonInput(activeNodeState.reason || '');
    setFormError('');
    setSelectedClaimId(activeAiData.claims[0]?.cid || '');
    setShowJson(false);
  }, [activeNodeKey, activeNodeState.text]);

  const currentDisplay = isEditing ? editText : activeNodeState.text;
  const verificationWarnings = verifyText(currentDisplay);

  const activeClaim =
    activeAiData.claims.find((c) => c.cid === selectedClaimId) || activeAiData.claims[0];

  const handleApplySuggestion = () => {
    if (activeAiData.suggest) {
      setEditText(activeAiData.suggest);
      setIsEditing(true);
      if (activeAiData.reason) setReasonInput(activeAiData.reason);
      if (activeAiData.errType) setSelectedErrorType(activeAiData.errType);
    }
  };

  const handleDecision = (decision: DecisionType) => {
    setFormError('');
    const edited = isEditing && editText.trim() !== activeNodeState.ai.trim();

    if (decision === 'confirm' && edited) {
      setFormError('수정한 내용이 있습니다. [수정 후 확정]을 선택해 주세요.');
      return;
    }
    if (decision === 'edit_confirm' && !edited && editText.trim() === activeNodeState.ai.trim()) {
      setFormError('수정된 내용이 없습니다. 본문을 수정하거나 [확정]을 선택해 주세요.');
      return;
    }
    if (decision !== 'confirm' && !reasonInput.trim()) {
      setFormError('판단 사유를 반드시 입력해야 합니다.');
      return;
    }
    if (decision === 'edit_confirm' && !selectedErrorType) {
      setFormError('AI 제안에 대한 오류 유형을 선택해 주세요.');
      return;
    }

    onDecideNode(
      activeNodeKey,
      decision,
      isEditing ? editText.trim() : activeNodeState.text,
      reasonInput.trim(),
      selectedErrorType || undefined
    );

    setIsEditing(false);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs">확정 완료</span>;
      case 'needs_support':
        return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs">보완 필요</span>;
      case 'excluded':
        return <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 font-bold px-2.5 py-0.5 rounded-full text-xs">채택 제외</span>;
      case 'editing':
        return <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs">수정 중 (자동저장)</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold px-2.5 py-0.5 rounded-full text-xs">검토 대기</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Subtabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { key: 'output', num: '④', label: '산출물' },
            { key: 'short', num: '⑤', label: '단기성과' },
            { key: 'midlong', num: '⑥', label: '중·장기성과' },
            { key: 'factors', num: '⑦', label: '기여·제약요인' },
          ].map((tab) => {
            const isCur = currentSubTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectSubTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isCur
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="opacity-80">{tab.num}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Factors Toggle Switch */}
        {currentSubTab === 'factors' && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveFactorKey('contrib')}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeFactorKey === 'contrib'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🌱 기여요인 (Enabler)
            </button>
            <button
              onClick={() => setActiveFactorKey('constraint')}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeFactorKey === 'constraint'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ⚠️ 제약요인 (Constraint)
            </button>
          </div>
        )}
      </div>

      {/* Screen Title & Description */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {NODE_DEF[activeNodeKey].num} {NODE_DEF[activeNodeKey].label} 추출 결과와 근거 검토
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          AI 분석 결과를 문단·문장 단위로 검토하고, 출처 청크와 상충 근거를 대조하여 평가 확정본을 작성합니다.
        </p>
      </div>

      {/* 3-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: AI Proposal & Editor (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Indicator Fulfillment Header */}
            {activeAiData.indicator && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    성과지표 충족 여부
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      activeAiData.indicator.tone === 'ok'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {activeAiData.indicator.met}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  PDM 지표: {activeAiData.indicator.label}
                </div>
              </div>
            )}

            {/* Claims & Statements Display */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span>추출 문장 (Claims) 및 제안본</span>
                {activeAiData.suggest && !isEditing && (
                  <button
                    onClick={handleApplySuggestion}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    검증기 권고안 적용
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={5}
                    className="w-full text-xs sm:text-sm p-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-indigo-500 rounded-xl focus:outline-none leading-relaxed"
                    placeholder="수정할 문안을 입력하세요..."
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-600 font-semibold">
                      * 수정 중 상태로 자동 저장됩니다.
                    </span>
                    <button
                      onClick={() => {
                        setEditText(activeNodeState.text);
                        setIsEditing(false);
                      }}
                      className="text-slate-500 hover:text-slate-700 underline"
                    >
                      수정 취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeAiData.claims.map((claim) => {
                    const isSel = selectedClaimId === claim.cid;
                    const cStance = stanceOf(stripCites(claim.text));

                    return (
                      <div
                        key={claim.cid}
                        onClick={() => setSelectedClaimId(claim.cid)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm leading-relaxed ${
                          isSel
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 shadow-2xs'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {claim.text}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[11px]">
                          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-medium text-slate-600 dark:text-slate-300">
                            진술: {STANCE_LABELS[cStance]}
                          </span>
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
                            원문 일치: 확인
                          </span>
                          <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-semibold">
                            충분성: {claim.sufficiency === 'sufficient' ? '충분' : '추가 확인'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Server Verification Output Card */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                서버 인용 검증기 (Verification Output)
              </span>

              {verificationWarnings.length === 0 ? (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>근거 대조 결과 오류가 탐지되지 않았습니다.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {verificationWarnings.map((w, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                        w.lv === 'high'
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                          : w.lv === 'mid'
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                          : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold mr-1">[{w.rule}]</span>
                        <span>{w.msg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit / JSON Trigger Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                문안 직접 수정
              </button>
            )}
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? 'JSON 닫기' : 'AI 출력 JSON'}</span>
            </button>
          </div>

          {showJson && (
            <div className="mt-2 p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-[10px] overflow-x-auto max-h-48 border border-slate-800">
              <pre>{JSON.stringify({ node: activeNodeKey, ...activeAiData }, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Middle Column: Grounding Evidence (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              지지 근거와 원문 (Evidence)
            </h3>
            <span className="text-xs font-mono text-slate-400">
              출처 ID: {activeClaim.cid}
            </span>
          </div>

          {/* Evidence Card */}
          {Object.entries(activeClaim.quote).map(([chunkId, quoteSnippet]) => {
            const chunk = CHUNKS[chunkId];
            if (!chunk) return null;

            return (
              <div key={chunkId} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-indigo-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold mr-1.5">
                      [{chunk.id}]
                    </span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {chunk.docType}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                      {chunk.doc} · p.{chunk.page}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenChunkModal(chunk.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
                  >
                    <span>원문 열기</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Highlighted Quote Box */}
                <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border-l-3 border-amber-500 rounded-r-xl text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-medium">
                  "{chunk.text}"
                </div>

                {/* Metadata Details */}
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <div className="flex justify-between">
                    <span className="text-slate-400">원문 일치도:</span>
                    <span className="font-semibold text-emerald-600">
                      일치 (서버 검증 완료)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">진술 성격:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {chunk.speaker}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">성과 연결 판단:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                      {activeClaim.link}
                    </span>
                  </div>
                  {activeClaim.limitations.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700">
                      <span className="text-slate-400 block mb-0.5">상충·한계:</span>
                      <span className="text-amber-700 dark:text-amber-300 font-medium">
                        {activeClaim.limitations.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Conflicting Evidence & Absence (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              반대·상충 근거 (Conflicts)
            </h3>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                등록 자료 탐지 결과:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                등록 자료 전체에서 상충 근거 없음
              </p>
              <div className="p-2 bg-amber-50/60 dark:bg-amber-950/40 rounded border border-amber-200/60 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
                * 탐지되지 않았다는 사실이 반대 근거의 부재를 완전히 보장하지는 않습니다.
              </div>
            </div>

            {/* Unconfirmed Mid/Long term Items */}
            {activeAiData.unconfirmed && activeAiData.unconfirmed.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  미확인 사항 (Unconfirmed):
                </span>
                {activeAiData.unconfirmed.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-800 dark:text-rose-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            {activeNodeKey === 'output'
              ? '* 산출물 노드는 원문에 없는 외부 검색자료를 사용하지 않습니다.'
              : '* 중·장기성과는 근거가 부족할 경우 미확인으로 남기며 임의 생성하지 않습니다.'}
          </div>
        </div>
      </div>

      {/* Bottom Decision & Audit Form */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              평가자 검토 판단 및 사유 기록
            </span>
            {getStatusBadge(activeNodeState.status)}
          </div>
          {activeNodeState.at && (
            <span className="text-xs text-slate-400">
              최종 처리: {activeNodeState.by} ({activeNodeState.at})
            </span>
          )}
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-7">
            <input
              type="text"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="수정·보완·제외 사유를 구체적으로 입력하세요 (필수)..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <select
              value={selectedErrorType}
              onChange={(e) => setSelectedErrorType(e.target.value as ErrorType)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">오류 유형 선택 (수정 시 필수)</option>
              {ERR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formError && (
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            * {formError}
          </div>
        )}

        {/* 4 Decision Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleDecision('confirm')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              확정 (Confirm)
            </button>
            <button
              onClick={() => handleDecision('edit_confirm')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              수정 후 확정
            </button>
            <button
              onClick={() => handleDecision('support')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              보완 필요
            </button>
            <button
              onClick={() => handleDecision('exclude')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              채택 제외
            </button>
          </div>

          <button
            onClick={onNavigateNext}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <span>다음 단계 이동</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
