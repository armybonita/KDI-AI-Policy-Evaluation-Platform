import React, { useState } from 'react';
import { QuadrantType, Role } from '../types';
import { QUADS } from '../data/mockData';
import { Grid, HelpCircle, ArrowRight, CheckCircle2, Sliders, AlertCircle, Bookmark } from 'lucide-react';

interface PortfolioViewProps {
  portfolioState: {
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
  };
  onUpdatePosition: (x: number, y: number, quad: QuadrantType, reason: string) => void;
  onNavigateResult: () => void;
  currentRole: Role;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  portfolioState,
  onUpdatePosition,
  onNavigateResult,
  currentRole,
}) => {
  const [posX, setPosX] = useState<number>(portfolioState.UZ.x || 65);
  const [posY, setPosY] = useState<number>(portfolioState.UZ.y || 70);
  const [reasonInput, setReasonInput] = useState<string>(
    portfolioState.UZ.reason ||
      'EDCF/세계은행 차관 연계는 기대 진술([L1])이므로 확장성 축의 확정 근거로는 유보하고, 단기성과(로드맵 초안 반영 검토)를 감안해 지식활용 및 정책 수용형으로 최종 확정함.'
  );
  const [selectedQuad, setSelectedQuad] = useState<QuadrantType>(
    portfolioState.UZ.final || 'policy'
  );
  const [isSaved, setIsSaved] = useState<boolean>(!!portfolioState.UZ.final);

  const handleSavePosition = () => {
    if (!reasonInput.trim()) {
      alert('위치 수정 및 확정 사유를 입력해 주세요.');
      return;
    }
    onUpdatePosition(posX, posY, selectedQuad, reasonInput.trim());
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ⑨ 성과 수준 평가 / 사업 단위 종합 / 포트폴리오
            </h1>
            <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              K-Scale &amp; 협력 확장 척도
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            KSP 지식 활용 단계와 후속 협력 확장성을 결합하여 사업의 전략적 포지셔닝을 4분면 매트릭스에 매핑합니다.
          </p>
        </div>

        <button
          onClick={onNavigateResult}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
        >
          <span>⑩ 평가 결과 ToC 보기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: 4-Quadrant Matrix + Evaluation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 4-Quadrant Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-indigo-600" />
              KSP 성과 포트폴리오 사분면 (4-Quadrant)
            </span>
            <span className="text-[11px] text-slate-400">
              온톨로지 축 기준 [임계값 검증]
            </span>
          </div>

          {/* Matrix Container */}
          <div className="relative aspect-4/3 w-full border-2 border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 p-4 overflow-hidden select-none">
            {/* Quadrant Axis Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-slate-300 dark:bg-slate-700 border-dashed" />
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-slate-300 dark:bg-slate-700 border-dashed" />

            {/* Quadrant Quadrants Background & Labels */}
            {/* Top-Left: 지식 축적 및 초기 탐색형 */}
            <div
              onClick={() => {
                setSelectedQuad('explore');
                setPosX(25);
                setPosY(75);
              }}
              className="absolute top-2 left-2 w-[47%] h-[47%] rounded-xl p-3 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                지식 축적 및 초기 탐색형
              </span>
              <span className="text-[10px] text-slate-400">
                (지식공유 高 / 협력확장 低)
              </span>
            </div>

            {/* Top-Right: 지식활용 및 정책 수용형 */}
            <div
              onClick={() => {
                setSelectedQuad('policy');
                setPosX(75);
                setPosY(75);
              }}
              className="absolute top-2 right-2 w-[47%] h-[47%] rounded-xl p-3 cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors text-right"
            >
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 block">
                지식활용 및 정책 수용형
              </span>
              <span className="text-[10px] text-indigo-400">
                (지식공유 高 / 협력확장 高)
              </span>
            </div>

            {/* Bottom-Left: 플랫폼형 */}
            <div
              onClick={() => {
                setSelectedQuad('platform');
                setPosX(25);
                setPosY(25);
              }}
              className="absolute bottom-2 left-2 w-[47%] h-[47%] rounded-xl p-3 cursor-pointer hover:bg-amber-50/40 dark:hover:bg-amber-950/30 transition-colors"
            >
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                플랫폼형
              </span>
              <span className="text-[10px] text-amber-400">
                (지식공유 低 / 협력확장 低)
              </span>
            </div>

            {/* Bottom-Right: 확장 및 선도형 */}
            <div
              onClick={() => {
                setSelectedQuad('lead');
                setPosX(75);
                setPosY(25);
              }}
              className="absolute bottom-2 right-2 w-[47%] h-[47%] rounded-xl p-3 cursor-pointer hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-colors text-right"
            >
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                확장 및 선도형
              </span>
              <span className="text-[10px] text-emerald-400">
                (지식공유 低 / 협력확장 高)
              </span>
            </div>

            {/* Placed Project Dots */}
            {/* Project A Dot */}
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md"
              style={{ left: `${portfolioState.A.x}%`, bottom: `${portfolioState.A.y}%` }}
            >
              <span>사업 A (확정)</span>
            </div>

            {/* Pilot Uzbekistan Dot */}
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg ring-4 ring-indigo-200 dark:ring-indigo-900 transition-all cursor-move"
              style={{ left: `${posX}%`, bottom: `${posY}%` }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>우즈베키스탄 (평가팀)</span>
            </div>

            {/* AI Initial Dot */}
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-amber-500/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-dashed border-white shadow-xs opacity-75"
              style={{ left: `80%`, bottom: `40%` }}
              title="AI 최초 분류 제안 위치"
            >
              <span>AI 최초 제안</span>
            </div>
          </div>

          {/* Axis Labels */}
          <div className="flex justify-between items-center text-xs font-medium text-slate-500 pt-1">
            <span>Y축: 지식공유수준 (K-Scale: K0 → K2)</span>
            <span>X축: 후속 협력 확장성 (Scalability)</span>
          </div>
        </div>

        {/* Right: Rationale & Tuning Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                분류 근거와 평가팀 검토
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                선택 사업: KSP-2025-UZ-01
              </h3>
            </div>

            {/* Current Classification Status */}
            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">AI 최초 분류:</span>
                <span className="font-semibold text-amber-600">
                  {QUADS[portfolioState.UZ.ai].n}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI 판단 논리:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-right">
                  EDCF 차관 연계 기대 서술 [L1]
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400">평가팀 확정 분류:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {QUADS[selectedQuad].n}
                </span>
              </div>
            </div>

            {/* Sliders for fine-tuning */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    후속 협력 확장성 (X축): {posX}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    지식공유 수준 (Y축): {posY}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Rationale Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                위치 수정 및 확정 사유 (Audit Rationale)
              </label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                rows={3}
                placeholder="사유를 입력하세요..."
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * 사유는 포트폴리오 관리 대장에 영구 기록됩니다.
            </span>
            <button
              onClick={handleSavePosition}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              {isSaved ? '위치 수정 저장' : '포트폴리오 확정'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
