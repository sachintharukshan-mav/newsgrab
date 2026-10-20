'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  POWER_CUT_GROUPS,
  POWER_CUT_SCHEDULES,
  SRI_LANKA_DISTRICTS,
  DistrictInfo,
  PowerCutGroup,
  getRealtimeCutStatus,
  RealtimeCutStatus,
  PROVINCE_COLORS,
  GROUP_COLORS
} from '@/data/powercut-schedule';
import { SriLankaMap } from './SriLankaMap';
import { PowerCutExpiredNotice } from './PowerCutExpiredNotice';
import { Language } from '@/lib/types';
import {
  Zap,
  Search,
  Clock,
  MapPin,
  AlertTriangle,
  Calendar,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';

interface PowerCutTrackerProps {
  currentLang?: Language;
}

export const PowerCutTracker: React.FC<PowerCutTrackerProps> = ({
  currentLang = 'en'
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-20');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);
  const [highlightGroup, setHighlightGroup] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeCutStatus | null>(null);
  const hasInitializedDateRef = useRef(false);

  // Poll Sri Lanka time every 15 seconds to update real-time countdown & active outage badge
  useEffect(() => {
    const update = () => {
      const status = getRealtimeCutStatus();
      setRealtimeStatus(status);
      if (!hasInitializedDateRef.current && status.isScheduleDay && status.dateStr) {
        setSelectedDate(status.dateStr);
        hasInitializedDateRef.current = true;
      }
    };
    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeSchedule = useMemo(() => {
    return POWER_CUT_SCHEDULES.find(s => s.date === selectedDate) || POWER_CUT_SCHEDULES[1];
  }, [selectedDate]);

  const inspectingDistrict = hoveredDistrict || selectedDistrict || SRI_LANKA_DISTRICTS[0];

  // Search filter across towns, GSS names, groups, and districts
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const matches: {
      type: 'gss' | 'town' | 'group' | 'district';
      title: string;
      subtitle: string;
      district: string;
      group: number;
      feeders: string[];
      timeSlot: string;
    }[] = [];

    // Support direct group queries (e.g. "Group 1", "Group 4", "G1", "G04")
    const isGroupQuery = /^(group\s*[1-4]|g0?[1-4])$/i.test(q);
    const matchedGroupId = isGroupQuery ? parseInt(q.replace(/\D/g, ''), 10) : null;

    if (matchedGroupId) {
      const group = POWER_CUT_GROUPS.find(g => g.id === matchedGroupId);
      if (group) {
        const slot = activeSchedule.slots.find(s => s.groupId === group.id)?.displayTime || 'TBD';
        group.gssList.slice(0, 10).forEach(entry => {
          matches.push({
            type: 'gss',
            title: `${entry.gss} (${entry.district})`,
            subtitle: `Feeders: ${entry.feeders.join(', ')} • Areas: ${entry.majorAreas.slice(0, 3).join(', ')}`,
            district: entry.district,
            group: group.id,
            feeders: entry.feeders,
            timeSlot: slot
          });
        });
        return matches;
      }
    }

    // Search in groups & GSS
    POWER_CUT_GROUPS.forEach(group => {
      const slot = activeSchedule.slots.find(s => s.groupId === group.id)?.displayTime || 'TBD';

      group.gssList.forEach(entry => {
        const matchesGss = entry.gss.toLowerCase().includes(q);
        const matchesDistrict = entry.district.toLowerCase().includes(q);
        const matchedTown = entry.majorAreas.find(area => area.toLowerCase().includes(q));

        if (matchesGss) {
          matches.push({
            type: 'gss',
            title: `${entry.gss} Grid Sub-Station`,
            subtitle: `Feeders: ${entry.feeders.join(', ')} • Areas: ${entry.majorAreas.slice(0, 3).join(', ')}`,
            district: entry.district,
            group: group.id,
            feeders: entry.feeders,
            timeSlot: slot
          });
        } else if (matchedTown) {
          matches.push({
            type: 'town',
            title: `${matchedTown}`,
            subtitle: `Served by ${entry.gss} GSS (Feeders: ${entry.feeders.join(', ')})`,
            district: entry.district,
            group: group.id,
            feeders: entry.feeders,
            timeSlot: slot
          });
        } else if (matchesDistrict && !matchesGss) {
          matches.push({
            type: 'district',
            title: `${entry.district} — ${entry.gss} GSS`,
            subtitle: `Feeders: ${entry.feeders.join(', ')}`,
            district: entry.district,
            group: group.id,
            feeders: entry.feeders,
            timeSlot: slot
          });
        }
      });
    });

    return matches.slice(0, 10);
  }, [searchQuery, activeSchedule]);

  const activeCutGroupId = realtimeStatus?.activeGroup?.id || null;

  if (realtimeStatus?.isExpired) {
    return <PowerCutExpiredNotice />;
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Real-time Status Alert Broadsheet Banner */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-card)] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-line)] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <ShieldAlert className="w-3.5 h-3.5" />
                PUCSL / CEB Official Schedule
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Oct 19 – 21, 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[var(--text-main)]">
              Sri Lanka Power Interruption Tracker
            </h1>
            <p className="text-sm font-sans text-[var(--text-muted)] mt-1 max-w-2xl">
              Official 1-hour rotational load-shedding schedule across Groups 1, 2, 3, and 4 approved by the Public Utilities Commission of Sri Lanka (PUCSL).
            </p>
          </div>

          {/* Right Live Clock & Status Badge */}
          <div className="flex flex-col sm:items-end justify-center font-mono">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Clock className="w-3.5 h-3.5" />
              <span>Colombo Local Time:</span>
              <span className="font-bold text-[var(--text-main)]">
                {realtimeStatus?.formattedTime || '11:30 AM'}
              </span>
            </div>

            <div className="mt-2">
              {activeCutGroupId !== null ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/40 text-xs font-bold rounded-sm animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Group 0{activeCutGroupId} Outage in Progress</span>
                  {realtimeStatus?.minutesRemainingInActive && (
                    <span className="text-[10px] font-normal opacity-85">
                      (~{realtimeStatus.minutesRemainingInActive}m left)
                    </span>
                  )}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-medium rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>National Grid Operating Normally</span>
                  {realtimeStatus?.nextSlot && (
                    <span className="text-[10px] text-[var(--text-muted)]">
                      (Next: G0{realtimeStatus.nextGroup?.id} at {realtimeStatus.nextSlot.start})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-[var(--text-muted)] flex items-center gap-1 font-semibold mr-1">
            <Calendar className="w-3.5 h-3.5" />
            Date:
          </span>
          {POWER_CUT_SCHEDULES.map(schedule => {
            const isSelected = selectedDate === schedule.date;
            return (
              <button
                key={schedule.date}
                onClick={() => setSelectedDate(schedule.date)}
                className={`px-3 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-[var(--text-main)] bg-[var(--text-main)] text-[var(--bg-page)] font-bold shadow-sm'
                    : 'border-[var(--border-line)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                }`}
              >
                {schedule.dayLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Instant "Find My Area / Sub-station" Search Input */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-card)] p-4 sm:p-5">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
          Find Your Area, Town, or Grid Sub-Station (GSS)
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your town or sub-station (e.g. Dehiwala, Kandy, Panadura, Wattala, Group 1, Feeder 3)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-line)] focus:border-[var(--text-main)] text-sm font-sans text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-xs font-mono">
          <span className="text-[var(--text-muted)] text-[11px]">Popular:</span>
          {['Colombo', 'Kandy', 'Galle', 'Dehiwala', 'Negombo', 'Kurunegala', 'Jaffna', 'Ratmalana', 'Group 1', 'Group 4'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2 py-0.5 bg-[var(--bg-card-hover)] hover:bg-[var(--border-line)] border border-[var(--border-line)] text-[var(--text-main)] text-[11px] transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Dropdown / Preview */}
        {searchResults.length > 0 && (
          <div className="mt-4 border-t border-[var(--border-line)] pt-3 space-y-2">
            <div className="text-xs font-mono text-[var(--text-muted)] font-semibold">
              Found {searchResults.length} matching area(s):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const matchedDist = SRI_LANKA_DISTRICTS.find(d => d.name.toLowerCase() === item.district.toLowerCase());
                    if (matchedDist) setSelectedDistrict(matchedDist);
                    setHighlightGroup(item.group);
                    setSearchQuery('');
                    // Dismiss keyboard/dropdown and smoothly orient to map view on mobile
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      const mapEl = document.getElementById('powercut-map-section');
                      if (mapEl) {
                        mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                  className="p-2.5 border border-[var(--border-line)] bg-[var(--bg-page)] hover:border-[var(--text-main)] transition-colors cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-crimson)]">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                        Group 0{item.group}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {item.subtitle}
                    </p>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      District: <strong>{item.district}</strong>
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[var(--text-main)] block">
                      {item.timeSlot}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      1-Hour Outage
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Main Split View: Sri Lanka Map & Group Buttons (Left) + Live District Inspector (Right) */}
      <section id="powercut-map-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-20">
        {/* Left Column: Sri Lanka Map with Group Buttons */}
        <div className="lg:col-span-6 border border-[var(--border-line)] bg-[var(--bg-card)] p-4 sm:p-5 rounded-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-line)] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#276ef1]" />
              <h2 className="font-serif font-bold text-base text-[var(--text-main)]">
                Islandwide Interactive Map
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              25 Districts
            </span>
          </div>

          <SriLankaMap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            hoveredDistrict={hoveredDistrict}
            onHoverDistrict={setHoveredDistrict}
            highlightGroup={highlightGroup}
            onHighlightGroup={setHighlightGroup}
            activeCutGroupId={activeCutGroupId}
            currentLang={currentLang}
            activeSchedule={activeSchedule}
          />
        </div>

        {/* Right Column: Live District / Feeder Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-[var(--border-line)] bg-[var(--bg-card)] p-5 animate-in fade-in duration-150 rounded-sm shadow-sm">
            <div className="flex items-start justify-between border-b border-[var(--border-line)] pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <MapPin className="w-5 h-5 text-[#276ef1]" />
                  <h3 className="font-serif font-black text-2xl text-[var(--text-main)]">
                    {inspectingDistrict.name} District
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-[#1c2128] text-stone-200 border border-[#30363d] shadow-xs">
                    {inspectingDistrict.province} Province
                  </span>
                  {hoveredDistrict && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#276ef1]/20 text-[#58a6ff] border border-[#276ef1]/40">
                      ⚡ Hover Preview
                    </span>
                  )}
                  {selectedDistrict?.id === inspectingDistrict.id && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-black">
                      📍 Pinned
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                  Sinhala: {inspectingDistrict.sinhalaName} • Tamil: {inspectingDistrict.tamilName}
                </p>
              </div>

              {selectedDistrict && (
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="px-2.5 py-1 text-xs font-mono border border-[var(--border-line)] bg-[var(--bg-page)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer rounded-xs"
                >
                  ✕ Clear Pin
                </button>
              )}
            </div>

            {/* Time Slots in this District for Today */}
            <div className="mb-5">
              <h4 className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] mb-2.5 flex items-center justify-between">
                <span>Scheduled Interruption Windows ({activeSchedule.dayLabel})</span>
                <span className="text-[10px] lowercase text-[var(--text-muted)]">1 hour / group</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {inspectingDistrict.groups.map(gId => {
                  const slot = activeSchedule.slots.find(s => s.groupId === gId);
                  const isActive = activeCutGroupId === gId;
                  const groupMeta = GROUP_COLORS[gId];
                  return (
                    <div
                      key={gId}
                      className={`p-3.5 border transition-all rounded-xs ${
                        isActive
                          ? 'border-red-500 bg-red-500/10 shadow-sm ring-1 ring-red-500'
                          : `border-[var(--border-line)] bg-[var(--bg-page)] hover:${groupMeta.accentBorder}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono font-bold text-xs px-2 py-0.5 rounded-xs text-white shadow-xs"
                          style={{ backgroundColor: groupMeta.fill }}
                        >
                          Group 0{gId}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono text-red-500 font-bold animate-pulse flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            Active Now
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-serif font-black text-[var(--text-main)] mt-2">
                        {slot?.displayTime || 'No cut scheduled'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Substations & Feeder Lines in this District */}
            <div>
              <h4 className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] mb-2.5">
                Grid Sub-Stations (GSS) & Feeder Lines in {inspectingDistrict.name}
              </h4>

              <div className="space-y-2.5">
                {POWER_CUT_GROUPS.map(group => {
                  const gssEntries = group.gssList.filter(
                    entry => entry.district.toLowerCase() === inspectingDistrict.name.toLowerCase()
                  );
                  if (gssEntries.length === 0) return null;

                  return (
                    <div key={group.id} className="border border-[var(--border-line)] bg-[var(--bg-page)] p-3">
                      <div className="flex items-center justify-between border-b border-[var(--border-line)] pb-1.5 mb-2">
                        <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                          {group.name} Feeders in {inspectingDistrict.name}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          {activeSchedule.slots.find(s => s.groupId === group.id)?.displayTime}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {gssEntries.map((entry, idx) => (
                          <div key={idx} className="text-xs font-mono bg-[var(--bg-card)] p-2 border border-[var(--border-line)]">
                            <div className="font-bold text-[var(--text-main)]">
                              {entry.gss} GSS
                            </div>
                            <div className="text-[11px] text-[var(--accent-crimson)] font-semibold mt-0.5">
                              Feeder No(s): {entry.feeders.join(', ')}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] truncate mt-1">
                              Areas: {entry.majorAreas.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* 4. Group Cards (01, 02, 03, 04) with Full Official Feeder Accordion */}
          <div className="border border-[var(--border-line)] bg-[var(--bg-card)] p-5 rounded-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-line)] pb-3 mb-4">
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Today&apos;s 4-Group Rotational Schedule
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {activeSchedule.dayLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POWER_CUT_GROUPS.map(group => {
                const slot = activeSchedule.slots.find(s => s.groupId === group.id);
                const isActive = activeCutGroupId === group.id;
                const isExpanded = expandedGroup === group.id;
                const groupMeta = GROUP_COLORS[group.id];

                return (
                  <div
                    key={group.id}
                    onMouseEnter={() => setHighlightGroup(group.id)}
                    onMouseLeave={() => setHighlightGroup(null)}
                    className={`border transition-all p-4 rounded-sm ${
                      isActive
                        ? 'border-red-500 bg-red-500/5 shadow-sm ring-1 ring-red-500'
                        : `border-[var(--border-line)] bg-[var(--bg-page)] hover:${groupMeta.accentBorder}`
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-xs text-white shadow-xs"
                            style={{ backgroundColor: groupMeta.fill }}
                          >
                            {group.name}
                          </span>
                          {isActive ? (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-mono font-bold uppercase rounded-xs animate-pulse">
                              Active Now
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-[var(--bg-card)] border border-[var(--border-line)] text-[10px] font-mono text-[var(--text-muted)]">
                              1 Hour
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1.5 font-sans">
                          {group.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-sm text-[var(--text-main)] block">
                          {slot?.displayTime}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {group.gssList.length} Grid Stations
                        </span>
                      </div>
                    </div>

                    {/* Quick Area Highlights */}
                    <div className="mt-3 text-[11px] font-mono text-[var(--text-muted)] border-t border-[var(--border-line)] pt-2.5">
                      <strong className="text-[var(--text-main)]">Key Sub-Stations:</strong>{' '}
                      {group.gssList.slice(0, 5).map(e => e.gss).join(', ')}...
                    </div>

                    {/* Accordion Toggle for Complete Feeder List from PDF */}
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                      className="w-full mt-3 pt-2 border-t border-[var(--border-line)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    >
                      <span>
                        {isExpanded ? 'Hide Full Feeder List' : `View All ${group.gssList.length} GSS Feeders`}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 max-h-60 overflow-y-auto space-y-1.5 text-xs font-mono pr-1 border-t border-[var(--border-line)] pt-2">
                        {group.gssList.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1 border-b border-[var(--border-line)]/50 text-[11px]">
                            <span className="font-semibold text-[var(--text-main)]">
                              {entry.gss} ({entry.district})
                            </span>
                            <span className="text-[var(--accent-crimson)]">
                              Feeders: {entry.feeders.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

      {/* 5. Official Advisory, Technical Background & Emergency Hotlines */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-card)] p-5 text-xs font-sans text-[var(--text-muted)] space-y-3">
        <div className="flex items-center gap-2 text-sm font-serif font-bold text-[var(--text-main)]">
          <Info className="w-4 h-4 text-[var(--accent-crimson)]" />
          <span>Official PUCSL & CEB Advisory Context</span>
        </div>
        <p>
          The Public Utilities Commission of Sri Lanka (PUCSL) approved this 1-hour rotational power management schedule following an unscheduled generation shortfall caused by the tripping and maintenance outage of Unit 1 at the <strong>Lakvijaya (Norochcholai) Coal Power Plant</strong>. Actual disconnection and restoration times may fluctuate by 15–30 minutes based on real-time national grid frequency stabilization.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-line)] font-mono text-[11px]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[var(--text-main)] font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
              CEB Hotline: <strong>1987</strong>
            </span>
            <span className="flex items-center gap-1.5 text-[var(--text-main)] font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
              LECO Hotline: <strong>1901</strong>
            </span>
            <span className="text-[var(--text-muted)]">
              PUCSL Consumer Affairs: <strong>0112 392 607</strong>
            </span>
          </div>

          <div className="text-[var(--text-muted)]">
            Published for Public Information under Fair Dealing (SL IP Act No. 36 of 2003 § 12)
          </div>
        </div>
      </section>
    </div>
  );
};
