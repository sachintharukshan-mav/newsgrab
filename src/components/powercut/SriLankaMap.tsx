'use client';

import React, { useState, useId } from 'react';
import {
  DistrictInfo,
  SRI_LANKA_DISTRICTS,
  GROUP_COLORS,
  DaySchedule
} from '@/data/powercut-schedule';
import { Language } from '@/lib/types';
import { MapPin, Zap, CheckCircle2, X, Crosshair, Clock } from 'lucide-react';

interface SriLankaMapProps {
  selectedDistrict: DistrictInfo | null;
  onSelectDistrict: (district: DistrictInfo | null) => void;
  hoveredDistrict?: DistrictInfo | null;
  onHoverDistrict?: (district: DistrictInfo | null) => void;
  highlightGroup: number | null;
  onHighlightGroup?: (groupId: number | null) => void;
  activeCutGroupId: number | null;
  currentLang?: Language;
  activeSchedule?: DaySchedule;
  className?: string;
}

export const SriLankaMap: React.FC<SriLankaMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  hoveredDistrict: externalHoveredDistrict,
  onHoverDistrict,
  highlightGroup,
  onHighlightGroup,
  activeCutGroupId,
  currentLang = 'en',
  activeSchedule,
  className = ''
}) => {
  const [internalHoveredDistrict, setInternalHoveredDistrict] = useState<DistrictInfo | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapId = useId();

  const currentHovered = externalHoveredDistrict !== undefined ? externalHoveredDistrict : internalHoveredDistrict;

  const handleMouseEnterDistrict = (d: DistrictInfo) => {
    setInternalHoveredDistrict(d);
    if (onHoverDistrict) onHoverDistrict(d);
  };

  const handleMouseLeaveDistrict = () => {
    setInternalHoveredDistrict(null);
    if (onHoverDistrict) onHoverDistrict(null);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getDistrictName = (d: DistrictInfo) => {
    if (currentLang === 'si') return d.sinhalaName;
    if (currentLang === 'ta') return d.tamilName;
    return d.name;
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* 1. Prominent Uber-Style Group Buttons */}
      <div className="w-full mb-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Filter Map by Group:</span>
          {selectedDistrict && (
            <button
              onClick={() => onSelectDistrict(null)}
              className="text-[11px] text-[#276ef1] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Crosshair className="w-3 h-3" />
              <span>Reset Selected District</span>
            </button>
          )}
        </div>

        {/* Group Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {/* All Island Button */}
          <button
            onClick={() => onHighlightGroup && onHighlightGroup(null)}
            className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
              highlightGroup === null
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-[#161b22] text-stone-300 border-[#30363d] hover:border-stone-400 hover:bg-[#1c2128]'
            }`}
          >
            <span className="font-sans font-bold text-xs">All Island</span>
            <span className="text-[10px] opacity-75 font-mono">25 Districts</span>
          </button>

          {/* Group 01 to 04 Buttons */}
          {[1, 2, 3, 4].map((gId) => {
            const isSelected = highlightGroup === gId;
            const slot = activeSchedule?.slots.find(s => s.groupId === gId);
            const isGroupActiveNow = activeCutGroupId === gId;

            return (
              <button
                key={gId}
                onClick={() => onHighlightGroup && onHighlightGroup(isSelected ? null : gId)}
                onMouseEnter={() => onHighlightGroup && onHighlightGroup(gId)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#276ef1] text-white border-[#276ef1] shadow-md ring-2 ring-[#276ef1]/40'
                    : isGroupActiveNow
                    ? 'bg-red-500/15 text-red-400 border-red-500/50 hover:bg-red-500/25'
                    : 'bg-[#161b22] text-stone-300 border-[#30363d] hover:border-[#276ef1] hover:bg-[#1c2128]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs">Group 0{gId}</span>
                  {isGroupActiveNow && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] font-mono opacity-80 truncate mt-0.5">
                  {slot ? slot.start : '1h slot'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sri Lanka Map Canvas: Clean Matte Charcoal with High-Contrast Hover Highlight */}
      <div className="relative w-full max-w-[440px] aspect-[450/793] flex items-center justify-center p-2 bg-[#090d12] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Subtle Map Matrix Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #30363d 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        />

        <svg
          viewBox="0 0 450 793"
          className="w-full h-full relative z-10 transition-all duration-300"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeaveDistrict}
          role="region"
          aria-label="Interactive Sri Lanka Power Cut Map"
        >
          <defs>
            <filter id={`uber-hover-glow-${mapId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#276ef1" floodOpacity="0.75" />
            </filter>
            <filter id={`uber-pin-shadow-${mapId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Sri Lanka Landmass Districts */}
          {SRI_LANKA_DISTRICTS.map((d) => {
            const isSelected = selectedDistrict?.id === d.id;
            const isHovered = currentHovered?.id === d.id;
            const hasActiveCut = activeCutGroupId !== null && d.groups.includes(activeCutGroupId);
            const isGroupHighlighted = highlightGroup !== null && d.groups.includes(highlightGroup);

            // Default State: Clean Muted Charcoal Slate
            let fillColor = '#171c24';
            let strokeColor = '#2d333b';
            let strokeWidth = '1';
            let opacity = 0.95;
            let filterStyle = undefined;

            // Group Highlight
            if (highlightGroup !== null) {
              if (isGroupHighlighted) {
                fillColor = '#1e293b';
                strokeColor = '#276ef1';
                strokeWidth = '1.75';
                opacity = 1;
              } else {
                fillColor = '#101318';
                opacity = 0.35;
              }
            }

            // Real-time Active Outage
            if (hasActiveCut) {
              strokeColor = '#e11900';
              strokeWidth = '2';
              fillColor = '#2a1618';
              opacity = 1;
            }

            // PROMINENT HOVER HIGHLIGHT: When hovering over specific district block
            if (isHovered) {
              fillColor = '#276ef1'; // Bold Uber Electric Blue on hover!
              strokeColor = '#93c5fd'; // Glowing bright electric border
              strokeWidth = '3';
              opacity = 1;
              filterStyle = `url(#uber-hover-glow-${mapId})`;
            }

            // Selected District (Locked Pin)
            if (isSelected) {
              fillColor = isHovered ? '#276ef1' : '#1d3356';
              strokeColor = '#60a5fa';
              strokeWidth = '3';
              opacity = 1;
            }

            return (
              <g
                key={d.id}
                className="cursor-pointer group focus:outline-none"
                onClick={() => onSelectDistrict(isSelected ? null : d)}
                onMouseEnter={() => handleMouseEnterDistrict(d)}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${d.name} District - Groups ${d.groups.join(', ')}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDistrict(isSelected ? null : d);
                  }
                }}
              >
                <path
                  d={d.pathD}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={opacity}
                  filter={filterStyle}
                  className="transition-all duration-150"
                />

                {/* District Label Text */}
                {d.center && (
                  <g className="pointer-events-none">
                    {isHovered || isSelected ? (
                      <g>
                        <rect
                          x={d.center.x - 22}
                          y={d.center.y - 8}
                          width="44"
                          height="16"
                          rx="8"
                          fill="#000000"
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                        <text
                          x={d.center.x}
                          y={d.center.y + 1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-[9.5px] font-sans font-black fill-white tracking-tight"
                        >
                          {d.name}
                        </text>
                      </g>
                    ) : (
                      <text
                        x={d.center.x}
                        y={d.center.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[9px] font-sans tracking-tight transition-all duration-150 ${
                          isGroupHighlighted
                            ? 'font-bold fill-[#58a6ff]'
                            : 'font-medium fill-[#8b949e] opacity-80'
                        }`}
                      >
                        {d.name.length > 8 ? d.name.substring(0, 7) + '..' : d.name}
                      </text>
                    )}
                  </g>
                )}

                {/* Active Outage Warning Beacon */}
                {hasActiveCut && d.center && (
                  <g transform={`translate(${d.center.x}, ${d.center.y - 12})`} className="pointer-events-none">
                    <circle r="6" fill="#e11900" className="animate-ping opacity-75" />
                    <circle r="3.5" fill="#e11900" stroke="#ffffff" strokeWidth="1" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Elevated Stroke Overlay for Hovered/Selected District (prevents neighboring SVG paths from clipping its border) */}
          {(currentHovered || selectedDistrict) && (() => {
            const activeD = currentHovered || selectedDistrict!;
            const isHovered = currentHovered?.id === activeD.id;
            return (
              <path
                d={activeD.pathD}
                fill="none"
                stroke={isHovered ? '#93c5fd' : '#60a5fa'}
                strokeWidth={isHovered ? '3.5' : '3'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={isHovered ? `url(#uber-hover-glow-${mapId})` : undefined}
                className="pointer-events-none transition-all duration-150"
              />
            );
          })()}

          {/* Uber Destination Pin Marker for Selected District */}
          {selectedDistrict?.center && (
            <g
              transform={`translate(${selectedDistrict.center.x}, ${selectedDistrict.center.y - 18})`}
              className="pointer-events-none"
              filter={`url(#uber-pin-shadow-${mapId})`}
            >
              <circle r="9" fill="#276ef1" className="animate-ping opacity-60" />
              <path
                d="M 0,-14 C -6,-14 -11,-9 -11,-3 C -11,4 0,16 0,16 C 0,16 11,4 11,-3 C 11,-9 6,-14 0,-14 Z"
                fill="#000000"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle cx="0" cy="-3" r="3.5" fill="#ffffff" />
            </g>
          )}
        </svg>

        {/* 3. Floating Detail Card on Map Bottom */}
        {(currentHovered || selectedDistrict) && (
          <div className="absolute bottom-3 inset-x-3 z-30 bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded-xl p-3.5 shadow-2xl text-white font-sans animate-in fade-in slide-in-from-bottom-2 duration-150">
            {(() => {
              const target = currentHovered || selectedDistrict!;
              const hasActiveCut = activeCutGroupId !== null && target.groups.includes(activeCutGroupId);

              return (
                <div>
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0">
                        <MapPin className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-tight leading-tight">
                          {getDistrictName(target)}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {target.province} Province
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasActiveCut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e11900]/20 text-[#ff4d4f] border border-[#e11900]/40 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4f]" />
                          Outage Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#06c167]/15 text-[#06c167] border border-[#06c167]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Grid Normal
                        </span>
                      )}

                      {selectedDistrict && (
                        <button
                          onClick={() => onSelectDistrict(null)}
                          className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                          aria-label="Dismiss card"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] block">CEB Groups</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {target.groups.map(g => (
                          <span
                            key={g}
                            className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono font-bold bg-[#276ef1]/20 text-[#58a6ff] border border-[#276ef1]/40"
                          >
                            Group 0{g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-stone-400 text-[10px] block">Available Stations</span>
                      <span className="font-mono text-stone-200 text-xs font-semibold">
                        {target.gssNames.length} Grid Stations
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <p className="text-[11px] font-mono text-[var(--text-muted)] text-center mt-2.5">
        Hover over any district block on the map to highlight it and preview its schedule.
      </p>
    </div>
  );
};
