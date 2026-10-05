import React, { useState, useEffect } from 'react';
import {
  Project,
  Role,
  NodeKey,
  NodeState,
  DocumentItem,
  Revision,
  ReviewAction,
  ErrorCase,
  QuadrantType,
  DecisionType,
  ErrorType
} from './types';
import {
  PROJECTS,
  PLAN,
  NODE_DEF,
  AI_DATA,
  CHUNKS,
  INITIAL_DOCS,
  LESSONS,
  QUADS
} from './data/mockData';
import { computeSha256, computeFileSha256 } from './utils/verifier';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { DesignNotesSidebar } from './components/DesignNotesSidebar';
import { ChunkModal } from './components/ChunkModal';
import { ExportBundleModal } from './components/ExportBundleModal';
import { ProjectListView } from './views/ProjectListView';
import { InitialTocView } from './views/InitialTocView';
import { DataRegistrationView } from './views/DataRegistrationView';
import { EvaluationReviewView } from './views/EvaluationReviewView';
import { ReportSummaryView } from './views/ReportSummaryView';
import { PortfolioView } from './views/PortfolioView';
import { ComprehensiveResultView } from './views/ComprehensiveResultView';
import { AdminManagementView } from './views/AdminManagementView';

export default function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('list');
  const [reviewSubTab, setReviewSubTab] = useState<NodeKey | 'factors'>('output');
  const [reportSubTab, setReportSubTab] = useState<'draft' | 'portfolio' | 'result'>('draft');
  const [currentRole, setCurrentRole] = useState<Role>('evaluator');
  const [showNotes, setShowNotes] = useState<boolean>(true);

  // Active Project
  const [activeProjectId, setActiveProjectId] = useState<string>('UZ');
  const activeProject = PROJECTS.find((p) => p.id === activeProjectId) || PROJECTS[0];

  // Documents & Hashes
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [knownHashes, setKnownHashes] = useState<Record<string, string>>({});

  // Analysis State
  const [analysisState, setAnalysisState] = useState<{
    state: 'idle' | 'running' | 'done';
    pct: number;
    log: Array<[string, string]>;
  }>({
    state: 'idle',
    pct: 0,
    log: [],
  });

  // Nodes State
  const initialNodeStates: Record<NodeKey, NodeState> = {
    output: { status: 'pending', text: '', ai: '' },
    short: { status: 'pending', text: '', ai: '' },
    midlong: { status: 'pending', text: '', ai: '' },
    contrib: { status: 'pending', text: '', ai: '' },
    constraint: { status: 'pending', text: '', ai: '' },
  };
  const [nodeStates, setNodeStates] = useState<Record<NodeKey, NodeState>>(initialNodeStates);

  // Audit Logs & Revisions
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [reviewActions, setReviewActions] = useState<ReviewAction[]>([]);
  const [errors, setErrors] = useState<ErrorCase[]>([]);

  // Portfolio State
  const [portfolioState, setPortfolioState] = useState<{
    UZ: {
      ai: QuadrantType;
      final: QuadrantType | null;
      reason: string;
      pending: QuadrantType | null;
      x: number;
      y: number;
    };
    A: {
      ai: QuadrantType;
      final: QuadrantType;
      x: number;
      y: number;
    };
  }>({
    UZ: {
      ai: 'lead',
      final: null,
      reason: '',
      pending: null,
      x: 75,
      y: 72,
    },
    A: {
      ai: 'policy',
      final: 'policy',
      x: 82,
      y: 68,
    },
  });

  // Report & Final Delivery State
  const [isReportConfirmed, setIsReportConfirmed] = useState<boolean>(false);
  const [isResultSent, setIsResultSent] = useState<boolean>(false);

  // Modals & Toast State
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);
  const [exportBundleAudience, setExportBundleAudience] = useState<'PO' | 'planning_team' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Helper: push revision
  const pushRevision = async (
    nodeKey: NodeKey,
    kind: 'ai_initial' | 'reviewer_edit' | 'confirmed',
    text: string,
    reason?: string
  ) => {
    const revId = `rev-${(revisions.length + 1).toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const hash = await computeSha256(text);

    const newRev: Revision = {
      id: revId,
      node: nodeKey,
      kind,
      text,
      by: kind === 'ai_initial' ? 'AI 엔진 (gemini-3.8-flash)' : '평가팀 담당자',
      at: timestamp,
      model: 'gemini-3.8-flash',
      prompt: NODE_DEF[nodeKey].prompt,
      hash,
      docVer: ['v1', 'v2'],
      reason,
    };

    setRevisions((prev) => [newRev, ...prev]);
  };

  // Run Analysis Simulation
  const handleRunAnalysis = () => {
    const unmasked = docs.filter((d) => d.mask === 'needs_review' && !d.dup);
    if (unmasked.length > 0) {
      showToast('민감정보 마스킹 검토가 완료되지 않은 문서가 있습니다.');
      return;
    }

    setAnalysisState({ state: 'running', pct: 0, log: [] });

    const steps: Array<[string, string]> = [
      ['ok', '1. 텍스트 추출 및 청크화 — 문서 8건, 총 6개 핵심 평가 청크 인덱싱 완료'],
      ['ok', '2. 사업 범위 검색 — project_id=KSP-2025-UZ-01 온톨로지 경계 설정'],
      ['ok', '3. AI 제안문 생성 — ④ 산출물 (prompt: output_v1)'],
      ['ok', '4. AI 제안문 생성 — ⑤ 단기성과 (prompt: short_term_v1)'],
      ['ok', '5. AI 제안문 생성 — ⑥ 중·장기성과 (prompt: mid_long_v1)'],
      ['ok', '6. AI 제안문 생성 — ⑦ 기여·제약요인 (prompt: factor_v1)'],
      ['ok', '7. 서버 검증 1단계: JSON 스키마 유효성 검사 — 5개 노드 통과'],
      ['ok', '8. 서버 검증 2단계: 청크 인용 대조 — quote 6건 원문 일치도 확인'],
      ['w', '9. 서버 검증 3단계: 수치·진술성격 대조 — 경고 3건 감지 (평가팀 검토로 인계)'],
      ['ok', '10. 서버 검증 4단계: PDM 외 추정 차단 가드레일 적용 완료'],
      ['ok', '11. 초기 리비전 저장 — revision(kind=ai_initial) 5건 보존 완료'],
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const [type, msg] = steps[currentStep];
        const timeStr = new Date().toTimeString().slice(0, 8);
        setAnalysisState((prev) => ({
          state: 'running',
          pct: Math.round(((currentStep + 1) / steps.length) * 100),
          log: [...prev.log, [type, `[${timeStr}] ${msg}`]],
        }));
        currentStep++;
      } else {
        clearInterval(interval);
        setAnalysisState((prev) => ({ ...prev, state: 'done', pct: 100 }));

        // Populate initial AI nodes
        const updatedNodes: Record<NodeKey, NodeState> = {
          output: {
            status: 'not_reviewed',
            text: AI_DATA.output.claims.map((c) => c.text).join(' '),
            ai: AI_DATA.output.claims.map((c) => c.text).join(' '),
          },
          short: {
            status: 'not_reviewed',
            text: AI_DATA.short.claims.map((c) => c.text).join(' '),
            ai: AI_DATA.short.claims.map((c) => c.text).join(' '),
          },
          midlong: {
            status: 'not_reviewed',
            text: AI_DATA.midlong.claims.map((c) => c.text).join(' '),
            ai: AI_DATA.midlong.claims.map((c) => c.text).join(' '),
          },
          contrib: {
            status: 'not_reviewed',
            text: AI_DATA.contrib.claims.map((c) => c.text).join(' '),
            ai: AI_DATA.contrib.claims.map((c) => c.text).join(' '),
          },
          constraint: {
            status: 'not_reviewed',
            text: AI_DATA.constraint.claims.map((c) => c.text).join(' '),
            ai: AI_DATA.constraint.claims.map((c) => c.text).join(' '),
          },
        };
        setNodeStates(updatedNodes);

        // Record initial revisions
        Object.entries(updatedNodes).forEach(([k, v]) => {
          pushRevision(k as NodeKey, 'ai_initial', v.text);
        });

        showToast('AI 분석 및 가드레일 검증이 완료되었습니다. ④~⑦ 단계에서 검토하세요.');
      }
    }, 240);
  };

  // Node Decision Action
  const handleDecideNode = (
    nodeKey: NodeKey,
    decision: DecisionType,
    newText?: string,
    reason?: string,
    errorType?: ErrorType
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const targetText = newText || nodeStates[nodeKey].text;

    const statusMap: Record<DecisionType, any> = {
      confirm: 'confirmed',
      edit_confirm: 'confirmed',
      support: 'needs_support',
      exclude: 'excluded',
    };

    const newStatus = statusMap[decision];

    setNodeStates((prev) => ({
      ...prev,
      [nodeKey]: {
        ...prev[nodeKey],
        status: newStatus,
        text: targetText,
        decision,
        reason,
        by: '평가팀 담당자',
        at: timestamp,
      },
    }));

    // Record revision
    if (decision === 'edit_confirm' || decision === 'confirm') {
      pushRevision(
        nodeKey,
        decision === 'edit_confirm' ? 'reviewer_edit' : 'confirmed',
        targetText,
        reason
      );
    }

    // Record Action
    setReviewActions((prev) => [
      {
        id: `act-${Date.now()}`,
        node: nodeKey,
        decision,
        reason: reason || '',
        actor: '평가팀 담당자',
        at: timestamp,
        docVer: ['v1', 'v2'],
      },
      ...prev,
    ]);

    // Record Error Case if edited
    if (decision === 'edit_confirm' && errorType) {
      setErrors((prev) => [
        {
          id: `ERR-${(prev.length + 1).toString().padStart(3, '0')}`,
          node: nodeKey,
          type: errorType,
          stage: 0,
          fix: reason || '',
          retest: '대기',
          at: timestamp,
          ai: nodeStates[nodeKey].ai,
          final: targetText,
        },
        ...prev,
      ]);
    }

    showToast(`${NODE_DEF[nodeKey].label}: [${decision}] 판단이 영구 기록되었습니다.`);
  };

  // File Upload with SHA-256 Duplication Check
  const handleUploadFiles = async (files: FileList) => {
    const newDocItems: DocumentItem[] = [];
    let duplicateCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hash = await computeFileSha256(file);
      const isDuplicate = Object.values(knownHashes).includes(hash);

      const docItem: DocumentItem = {
        id: `doc-${Date.now()}-${i}`,
        name: file.name,
        cat: file.name.includes('보고서') ? '최종보고서' : '기타자료',
        type: '후속 근거',
        mask: 'needs_review',
        detect: '민감정보 자동 탐지 대기 (평가팀 마스킹 확인 필요)',
        ver: 'v1',
        hash,
        dup: isDuplicate,
      };

      if (!isDuplicate) {
        setKnownHashes((prev) => ({ ...prev, [file.name]: hash }));
      } else {
        duplicateCount++;
      }

      newDocItems.push(docItem);
    }

    setDocs((prev) => [...prev, ...newDocItems]);

    if (duplicateCount > 0) {
      showToast(`${newDocItems.length}개 파일 업로드됨 (${duplicateCount}개 동일 해시 중복 차단)`);
    } else {
      showToast(`${newDocItems.length}개 파일이 정상 등록되었습니다.`);
    }
  };

  // Masking confirmation
  const handleMaskDocument = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, mask: 'masked', detect: '마스킹 확인 완료' } : d))
    );
    showToast('민감정보 마스킹 확인이 완료되었습니다.');
  };

  // Scenario Presets
  const handleSelectScenario = (scenario: 'fresh' | 'final') => {
    if (scenario === 'fresh') {
      setDocs(INITIAL_DOCS);
      setAnalysisState({ state: 'idle', pct: 0, log: [] });
      setNodeStates(initialNodeStates);
      setRevisions([]);
      setReviewActions([]);
      setErrors([]);
      setIsReportConfirmed(false);
      setIsResultSent(false);
      setCurrentTab('list');
      showToast('처음 상태(자료 등록 전)로 초기화되었습니다.');
    } else if (scenario === 'final') {
      setDocs(INITIAL_DOCS.map((d) => ({ ...d, mask: 'cleared', ingested: true })));
      setAnalysisState({
        state: 'done',
        pct: 100,
        log: [
          ['ok', '전체 8건 문서 전수 분석 및 가드레일 검증 통과 완료'],
          ['ok', '평가팀 최종 확정 및 지식 환류 완료 상태'],
        ],
      });

      const finalNodes: Record<NodeKey, NodeState> = {
        output: {
          status: 'confirmed',
          text: AI_DATA.output.claims.map((c) => c.text).join(' '),
          ai: AI_DATA.output.claims.map((c) => c.text).join(' '),
          decision: 'confirm',
          by: '평가팀 담당자',
          at: '2026-10-04 16:00',
        },
        short: {
          status: 'confirmed',
          text: AI_DATA.short.suggest || '',
          ai: AI_DATA.short.claims.map((c) => c.text).join(' '),
          decision: 'edit_confirm',
          reason: AI_DATA.short.reason,
          by: '평가팀 담당자',
          at: '2026-10-04 16:15',
        },
        midlong: {
          status: 'confirmed',
          text: AI_DATA.midlong.suggest || '',
          ai: AI_DATA.midlong.claims.map((c) => c.text).join(' '),
          decision: 'edit_confirm',
          reason: AI_DATA.midlong.reason,
          by: '평가팀 담당자',
          at: '2026-10-04 16:30',
        },
        contrib: {
          status: 'confirmed',
          text: AI_DATA.contrib.claims.map((c) => c.text).join(' '),
          ai: AI_DATA.contrib.claims.map((c) => c.text).join(' '),
          decision: 'confirm',
          by: '평가팀 담당자',
          at: '2026-10-04 16:45',
        },
        constraint: {
          status: 'needs_support',
          text: AI_DATA.constraint.claims.map((c) => c.text).join(' '),
          ai: AI_DATA.constraint.claims.map((c) => c.text).join(' '),
          decision: 'support',
          reason: AI_DATA.constraint.supportReason,
          by: '평가팀 담당자',
          at: '2026-10-04 17:00',
        },
      };

      setNodeStates(finalNodes);
      setPortfolioState((prev) => ({
        ...prev,
        UZ: {
          ...prev.UZ,
          final: 'policy',
          reason: 'EDCF 차관 연계는 기대 진술([L1])이므로 지식활용 및 정책 수용형으로 최종 확정함.',
        },
      }));

      setErrors([
        {
          id: 'ERR-001',
          node: 'short',
          type: '성과 과장',
          stage: 2,
          fix: '원문 "반영하여 검토 중"(추진 단계)을 완료형으로 단정하지 않도록 프롬프트 룰셋 개정',
          retest: '통과',
          at: '2026-10-04 16:15',
          ai: AI_DATA.short.claims.map((c) => c.text).join(' '),
          final: AI_DATA.short.suggest || '',
        },
      ]);

      setIsReportConfirmed(true);
      setIsResultSent(true);
      setCurrentTab('report');
      setReportSubTab('result');
      showToast('검토 완료 상태(시나리오 프리셋)로 전환되었습니다.');
    }
  };

  // Export Bundle Builder
  const buildBundleData = (audience: 'PO' | 'planning_team') => {
    if (audience === 'PO') {
      return {
        project_id: activeProject.name,
        code: activeProject.code,
        audience: 'PO',
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
        items: [
          { type: 'report_draft', status: isReportConfirmed ? '확정 완료' : '검토 중' },
          {
            type: 'confirmed_nodes',
            nodes: Object.entries(nodeStates)
              .filter(([_, n]) => n.status === 'confirmed' || n.status === 'needs_support')
              .map(([k, n]) => ({
                node: NODE_DEF[k as NodeKey].label,
                text: n.text,
                evidence: Object.keys(CHUNKS).filter((cid) => n.text.includes(`[${cid}]`)),
                confirmed_by: n.by || '평가팀',
                confirmed_at: n.at || '—',
              })),
          },
          {
            type: 'sources',
            list: Object.values(CHUNKS).map((c) => `[${c.id}] ${c.doc} (p.${c.page}, ${c.speaker})`),
          },
          {
            type: 'limitations',
            list: [
              '중·장기 제도 운영 변화 및 징세 실질 성과는 현재 수집된 문서만으로 단정할 수 없어 성과 미확인으로 분류함.',
              '단기성과는 실무진 인터뷰 단일 출처에 의존하므로 향후 공식 비준 문서 확보 필요.',
            ],
          },
        ],
      };
    } else {
      return {
        project_id: activeProject.name,
        code: activeProject.code,
        audience: 'planning_team',
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
        items: [
          {
            type: 'portfolio_class',
            ai_class: QUADS[portfolioState.UZ.ai].n,
            final_class: portfolioState.UZ.final ? QUADS[portfolioState.UZ.final].n : '미확정',
            reason: portfolioState.UZ.reason || '—',
          },
          {
            type: 'final_toc',
            nodes: [
              { node: '활동', plan: PLAN.activity.t, result: '수행 확인 완료' },
              { node: '산출물', plan: PLAN.output.t, result: '제언 보고서 및 알고리즘 설계도 인도' },
              { node: '단기성과', plan: PLAN.short.t, result: '차기 로드맵 초안 핵심과제 반영 검토 중' },
              { node: '중기성과', plan: PLAN.mid.t, result: '미확인 (후속 운영 데이터 필요)' },
              { node: '장기성과', plan: PLAN.long.t, result: '미확인 (차관 사업 연계 전)' },
            ],
          },
          {
            type: 'lessons',
            list: LESSONS,
          },
          {
            type: 'follow_up',
            list: [
              '수원국 국가 조세전략(Reforms-2030) 내각 비준 여부 추적',
              '리스크 모형 적용 후 세무조사 실적 데이터 확보',
              'EDCF 차관 F/S 연계 여부 모니터링',
            ],
          },
        ],
      };
    }
  };

  // Note Key for sidebar
  const getNoteKey = (): string => {
    if (currentTab === 'list') return 'list';
    if (currentTab === 'toc') return 'toc';
    if (currentTab === 'docs') return 'docs';
    if (currentTab === 'review') {
      if (reviewSubTab === 'output') return 'output';
      if (reviewSubTab === 'short') return 'short';
      if (reviewSubTab === 'midlong') return 'midlong';
      if (reviewSubTab === 'factors') return 'factors';
    }
    if (currentTab === 'report') {
      if (reportSubTab === 'draft') return 'draft';
      if (reportSubTab === 'portfolio') return 'portfolio';
      if (reportSubTab === 'result') return 'result';
    }
    if (currentTab === 'admin') return 'admin';
    return 'list';
  };

  const reviewedCount = Object.values(nodeStates).filter(
    (n) => n.status === 'confirmed' || n.status === 'needs_support' || n.status === 'excluded'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeProject={activeProject}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes(!showNotes)}
        onSelectScenario={handleSelectScenario}
      />

      {/* Stepper */}
      <Stepper
        currentTab={currentTab}
        reviewSubTab={reviewSubTab}
        reportSubTab={reportSubTab}
        onNavigateStep={(stepIdx) => {
          if (stepIdx === 0) setCurrentTab('list');
          if (stepIdx === 1) setCurrentTab('toc');
          if (stepIdx === 2) setCurrentTab('docs');
          if (stepIdx === 3) {
            setCurrentTab('review');
            setReviewSubTab('output');
          }
          if (stepIdx === 4) {
            setCurrentTab('review');
            setReviewSubTab('short');
          }
          if (stepIdx === 5) {
            setCurrentTab('review');
            setReviewSubTab('midlong');
          }
          if (stepIdx === 6) {
            setCurrentTab('review');
            setReviewSubTab('factors');
          }
          if (stepIdx === 7) {
            setCurrentTab('report');
            setReportSubTab('draft');
          }
          if (stepIdx === 8) {
            setCurrentTab('report');
            setReportSubTab('portfolio');
          }
          if (stepIdx === 9) {
            setCurrentTab('report');
            setReportSubTab('result');
          }
        }}
        nodeStatuses={{
          output: nodeStates.output.status,
          short: nodeStates.short.status,
          midlong: nodeStates.midlong.status,
          contrib: nodeStates.contrib.status,
          constraint: nodeStates.constraint.status,
        }}
        isAnalysisDone={analysisState.state === 'done'}
        isReportConfirmed={isReportConfirmed}
        isPortfolioConfirmed={!!portfolioState.UZ.final}
        isResultSent={isResultSent}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Active View Container */}
          <main className="flex-1 min-w-0 w-full">
            {currentTab === 'list' && (
              <ProjectListView
                projects={PROJECTS}
                activeProjectId={activeProjectId}
                onSelectProject={setActiveProjectId}
                onOpenToc={(id) => {
                  setActiveProjectId(id);
                  setCurrentTab('toc');
                }}
                analysisDone={analysisState.state === 'done'}
                reviewedCount={reviewedCount}
                totalNodesCount={5}
              />
            )}

            {currentTab === 'toc' && (
              <InitialTocView
                project={activeProject}
                plan={PLAN}
                onNavigateDocs={() => setCurrentTab('docs')}
                onOpenNodeReview={(nodeKey) => {
                  setCurrentTab('review');
                  setReviewSubTab(nodeKey as any);
                }}
                analysisDone={analysisState.state === 'done'}
              />
            )}

            {currentTab === 'docs' && (
              <DataRegistrationView
                docs={docs}
                onUploadFiles={handleUploadFiles}
                onMaskDocument={handleMaskDocument}
                onRunAnalysis={handleRunAnalysis}
                onNavigateReview={() => {
                  setCurrentTab('review');
                  setReviewSubTab('output');
                }}
                analysisState={analysisState}
                onOpenChunkModal={(cid) => setActiveChunkId(cid)}
              />
            )}

            {currentTab === 'review' && (
              <EvaluationReviewView
                currentSubTab={reviewSubTab}
                onSelectSubTab={setReviewSubTab}
                nodeStates={nodeStates}
                onDecideNode={handleDecideNode}
                onNavigateNext={() => {
                  if (reviewSubTab === 'output') setReviewSubTab('short');
                  else if (reviewSubTab === 'short') setReviewSubTab('midlong');
                  else if (reviewSubTab === 'midlong') setReviewSubTab('factors');
                  else {
                    setCurrentTab('report');
                    setReportSubTab('draft');
                  }
                }}
                onOpenChunkModal={(cid) => setActiveChunkId(cid)}
                currentRole={currentRole}
              />
            )}

            {currentTab === 'report' && (
              <div className="space-y-6">
                {/* Report Subnavigation */}
                <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    onClick={() => setReportSubTab('draft')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      reportSubTab === 'draft'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ⑧ 종료평가보고서 종합
                  </button>
                  <button
                    onClick={() => setReportSubTab('portfolio')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      reportSubTab === 'portfolio'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ⑨ 성과 포트폴리오
                  </button>
                  <button
                    onClick={() => setReportSubTab('result')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      reportSubTab === 'result'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ⑩ 평가 결과 ToC 및 성과 스토리
                  </button>
                </div>

                {reportSubTab === 'draft' && (
                  <ReportSummaryView
                    nodeStates={nodeStates}
                    isReportConfirmed={isReportConfirmed}
                    onConfirmReport={() => {
                      setIsReportConfirmed(true);
                      showToast('종료평가보고서 문안이 최종 확정되었습니다.');
                    }}
                    onOpenExportBundle={(aud) => setExportBundleAudience(aud)}
                    onOpenChunkModal={(cid) => setActiveChunkId(cid)}
                    onNavigateNode={(nk) => {
                      setCurrentTab('review');
                      setReviewSubTab(nk === 'contrib' || nk === 'constraint' ? 'factors' : nk);
                    }}
                    currentRole={currentRole}
                  />
                )}

                {reportSubTab === 'portfolio' && (
                  <PortfolioView
                    portfolioState={portfolioState}
                    onUpdatePosition={(x, y, quad, reason) => {
                      setPortfolioState((prev) => ({
                        ...prev,
                        UZ: {
                          ...prev.UZ,
                          final: quad,
                          reason,
                          x,
                          y,
                        },
                      }));
                      showToast('포트폴리오 위치 및 사유가 저장되었습니다.');
                    }}
                    onNavigateResult={() => setReportSubTab('result')}
                    currentRole={currentRole}
                  />
                )}

                {reportSubTab === 'result' && (
                  <ComprehensiveResultView
                    nodeStates={nodeStates}
                    portfolioClass={portfolioState.UZ.final || 'policy'}
                    onOpenExportBundle={(aud) => setExportBundleAudience(aud)}
                    onNavigateReport={() => setReportSubTab('draft')}
                    isResultSent={isResultSent}
                    onSendResult={() => {
                      setIsResultSent(true);
                      showToast('종합 결과가 평가팀 관리 시스템으로 전달되었습니다.');
                    }}
                    currentRole={currentRole}
                  />
                )}
              </div>
            )}

            {currentTab === 'admin' && (
              <AdminManagementView
                nodeStates={nodeStates}
                revisions={revisions}
                errors={errors}
                onAdvanceErrorStage={(idx) => {
                  setErrors((prev) =>
                    prev.map((e, i) =>
                      i === idx
                        ? {
                            ...e,
                            stage: Math.min(3, e.stage + 1),
                            retest: e.stage + 1 >= 2 ? '통과' : '대기',
                          }
                        : e
                    )
                  );
                  showToast('오류 개선 파이프라인 단계가 진행되었습니다.');
                }}
                onOpenExportBundle={(aud) => setExportBundleAudience(aud)}
                onOpenChunkModal={(cid) => setActiveChunkId(cid)}
                currentRole={currentRole}
              />
            )}
          </main>

          {/* Right Sidebar: Design Notes (Slide Guide) */}
          {showNotes && (
            <DesignNotesSidebar
              noteKey={getNoteKey()}
              onClose={() => setShowNotes(false)}
            />
          )}
        </div>
      </div>

      {/* Chunk Modal */}
      {activeChunkId && (
        <ChunkModal
          chunk={CHUNKS[activeChunkId]}
          onClose={() => setActiveChunkId(null)}
        />
      )}

      {/* Export Bundle Modal */}
      {exportBundleAudience && (
        <ExportBundleModal
          audience={exportBundleAudience}
          bundleData={buildBundleData(exportBundleAudience)}
          onClose={() => setExportBundleAudience(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
