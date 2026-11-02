'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Search,
  SlidersHorizontal,
  Info,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import {
  CEYPETCO_HISTORICAL_RECORDS,
  FUEL_PRODUCTS_META,
  MACRO_MILESTONES,
  getProductStats,
  FuelSeriesKey,
  HistoricalFuelRecord,
} from '@/lib/ceypetco-history-data';

type TimeRange = '1Y' | '3Y' | '5Y' | '10Y' | 'ALL';

export function FuelHistoryVisualizer() {
  const [activeProduct, setActiveProduct] = useState<FuelSeriesKey>('petrol92');
  const [compareProduct, setCompareProduct] = useState<FuelSeriesKey | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('5Y');
  const [showMilestones, setShowMilestones] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableYear, setTableYear] = useState<string>('all');
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 12;

  // Hover state on SVG chart
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const productMeta = FUEL_PRODUCTS_META[activeProduct];
  const compareMeta = compareProduct ? FUEL_PRODUCTS_META[compareProduct] : null;

  // Filter time series points according to timeRange
  const chartData = useMemo(() => {
    // Sort chronological ascending (1990 -> 2026) for chart rendering
    const valid = [...CEYPETCO_HISTORICAL_RECORDS]
      .filter((r) => r[activeProduct] !== null)
      .sort((a, b) => a.sortKey - b.sortKey);

    if (valid.length === 0) return [];

    const latestSortKey = valid[valid.length - 1].sortKey;
    let cutoff = 0;
    if (timeRange === '1Y') cutoff = latestSortKey - 10000;
    else if (timeRange === '3Y') cutoff = latestSortKey - 30000;
    else if (timeRange === '5Y') cutoff = latestSortKey - 50000;
    else if (timeRange === '10Y') cutoff = latestSortKey - 100000;

    return valid.filter((r) => r.sortKey >= cutoff);
  }, [activeProduct, timeRange]);

  // Product KPI stats
  const stats = useMemo(() => getProductStats(activeProduct), [activeProduct]);

  // SVG Chart Dimensions & Coordinate Mapping
  const chartWidth = 900;
  const chartHeight = 360;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const { points, minPrice, maxPrice, priceRange, pathD, areaD, comparePoints, comparePathD } = useMemo(() => {
    if (chartData.length === 0) {
      return {
        points: [],
        minPrice: 0,
        maxPrice: 100,
        priceRange: 100,
        pathD: '',
        areaD: '',
        comparePoints: [],
        comparePathD: '',
      };
    }

    const prices = chartData.map((d) => d[activeProduct] as number);
    if (compareProduct) {
      chartData.forEach((d) => {
        if (d[compareProduct] !== null) prices.push(d[compareProduct] as number);
      });
    }

    let min = Math.min(...prices);
    let max = Math.max(...prices);

    // Give visual breathing room
    min = Math.max(0, Math.floor(min * 0.95));
    max = Math.ceil(max * 1.05);
    const range = max - min || 1;

    const mapped = chartData.map((d, i) => {
      const x = padding.left + (i / Math.max(1, chartData.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (((d[activeProduct] as number) - min) / range) * innerHeight;
      return { x, y, record: d, price: d[activeProduct] as number };
    });

    let pD = '';
    mapped.forEach((pt, i) => {
      pD += `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
    });

    const aD =
      mapped.length > 0
        ? `${pD} L ${mapped[mapped.length - 1].x.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} L ${mapped[0].x.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} Z`
        : '';

    // Compare product mapping if active
    let cMapped: Array<{ x: number; y: number; price: number }> = [];
    let cD = '';
    if (compareProduct) {
      cMapped = chartData
        .filter((d) => d[compareProduct] !== null)
        .map((d, i, arr) => {
          const x = padding.left + (i / Math.max(1, arr.length - 1)) * innerWidth;
          const y = padding.top + innerHeight - (((d[compareProduct] as number) - min) / range) * innerHeight;
          return { x, y, price: d[compareProduct] as number };
        });
      cMapped.forEach((pt, i) => {
        cD += `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
      });
    }

    return {
      points: mapped,
      minPrice: min,
      maxPrice: max,
      priceRange: range,
      pathD: pD,
      areaD: aD,
      comparePoints: cMapped,
      comparePathD: cD,
    };
  }, [chartData, activeProduct, compareProduct, innerWidth, innerHeight, padding.left, padding.top]);

  // Handle pointer scrub over SVG
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current || points.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const scaleX = chartWidth / rect.width;
      const svgX = clientX * scaleX;

      // Find closest point by X coordinate
      let closestIdx = 0;
      let minDistance = Infinity;
      points.forEach((pt, idx) => {
        const dist = Math.abs(pt.x - svgX);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setHoverIndex(closestIdx);
    },
    [points, chartWidth]
  );

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  // Currently hovered record and delta vs previous revision
  const activeHoverPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;
  const hoverDelta = useMemo(() => {
    if (hoverIndex === null || hoverIndex === 0 || !points[hoverIndex] || !points[hoverIndex - 1]) return null;
    const curr = points[hoverIndex].price;
    const prev = points[hoverIndex - 1].price;
    const diff = curr - prev;
    const pct = prev !== 0 ? (diff / prev) * 100 : 0;
    return { diff, pct };
  }, [hoverIndex, points]);

  // Relevant milestones inside current chart range
  const visibleMilestones = useMemo(() => {
    if (!showMilestones || chartData.length === 0) return [];
    const minYear = chartData[0].year;
    const maxYear = chartData[chartData.length - 1].year;
    return MACRO_MILESTONES.filter((m) => m.year >= minYear && m.year <= maxYear);
  }, [showMilestones, chartData]);

  // Filtered table records
  const availableYears = useMemo(() => {
    const yrs = new Set(CEYPETCO_HISTORICAL_RECORDS.map((r) => r.year));
    return Array.from(yrs).sort((a, b) => b - a);
  }, []);

  const filteredRecords = useMemo(() => {
    return CEYPETCO_HISTORICAL_RECORDS.filter((r) => {
      if (tableYear !== 'all' && r.year.toString() !== tableYear) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDate = r.dateLabel.toLowerCase().includes(q);
        const matchesNote = r.note ? r.note.toLowerCase().includes(q) : false;
        const matchesPrice =
          (r.petrol92?.toString().includes(q) ?? false) ||
          (r.autoDiesel?.toString().includes(q) ?? false) ||
          (r.petrol95?.toString().includes(q) ?? false) ||
          (r.superDiesel?.toString().includes(q) ?? false);
        return matchesDate || matchesNote || matchesPrice;
      }
      return true;
    });
  }, [tableYear, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (tablePage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, tablePage]);

  // Export full archive to clean CSV
  const handleExportCsv = () => {
    const headers = [
      'Revision Date',
      'Year',
      'Petrol 95 (Rs)',
      'Petrol 92 (Rs)',
      'Auto Diesel (Rs)',
      'Super Diesel (Rs)',
      'Domestic Kerosene (Rs)',
      'Industrial Kerosene (Rs)',
      'Furnace 800 (Rs)',
      'Official Note',
    ];

    const rows = CEYPETCO_HISTORICAL_RECORDS.map((r) => [
      `"${r.dateLabel}"`,
      r.year,
      r.petrol95 ?? '',
      r.petrol92 ?? '',
      r.autoDiesel ?? '',
      r.superDiesel ?? '',
      r.kerosene ?? '',
      r.indKerosene ?? '',
      r.furnace800 ?? '',
      `"${r.note || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ceypetco_sri_lanka_fuel_price_history_1990_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] p-5 sm:p-8 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-line)] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-500 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Historical Archive · 1990–2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[var(--text-main)] tracking-tight">
            Sri Lanka Fuel Price History Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
            36 years of Ceylon Petroleum Corporation (CEYPETCO) official price revisions. Inspect long-term inflation, crisis volatility, and Singapore Platts formula trends.
          </p>
        </div>

        {/* Global CSV Download CTA */}
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-line)] text-xs font-mono font-bold text-[var(--text-main)] border border-[var(--border-line)] transition-all shrink-0 cursor-pointer shadow-sm group"
          title="Download complete 185-revision dataset as CSV"
        >
          <Download className="w-4 h-4 text-rose-500 group-hover:translate-y-0.5 transition-transform" />
          <span>Export Full Archive (CSV)</span>
        </button>
      </div>

      {/* Control Switcher Bar */}
      <div className="space-y-4">
        {/* Fuel Product Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(FUEL_PRODUCTS_META) as FuelSeriesKey[]).map((key) => {
            const meta = FUEL_PRODUCTS_META[key];
            const isActive = activeProduct === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveProduct(key);
                  if (compareProduct === key) setCompareProduct(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-[var(--bg-subtle)] hover:bg-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isActive ? '#ffffff' : meta.color }}
                />
                <span>{meta.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Bar: Timeframe Filters & Comparison Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs font-mono">
          {/* Timeframe Pills */}
          <div className="inline-flex items-center rounded-lg bg-[var(--bg-subtle)] p-1 border border-[var(--border-line)]">
            {(['1Y', '3Y', '5Y', '10Y', 'ALL'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-[var(--bg-card)] text-rose-500 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {range === 'ALL' ? '36Y (Max)' : range}
              </button>
            ))}
          </div>

          {/* Compare with Auto Diesel / Petrol 92 Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (compareProduct) setCompareProduct(null);
                else {
                  setCompareProduct(activeProduct === 'autoDiesel' ? 'petrol92' : 'autoDiesel');
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                compareProduct
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-line)]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {compareProduct
                  ? `Comparing with ${compareMeta?.shortLabel}`
                  : `Compare with ${activeProduct === 'autoDiesel' ? 'Petrol 92' : 'Auto Diesel'}`}
              </span>
            </button>

            <button
              onClick={() => setShowMilestones(!showMilestones)}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showMilestones
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-line)]'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Milestones</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Tiles for Active Fuel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)]">Current Pump Rate</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-[var(--text-main)]">
            Rs. {stats.current}.00
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
            Active Revision
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)]">All-Time High (ATH)</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-rose-500">
            Rs. {stats.allTimeHigh.price}.00
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">
            {stats.allTimeHigh.date || 'Crisis Peak'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)]">All-Time Low (ATL)</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-500">
            Rs. {stats.allTimeLow.price}.00
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">
            {stats.allTimeLow.date || '1990 Baseline'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)]">1-Year Price Trend</div>
          <div className={`text-xl sm:text-2xl font-extrabold font-mono flex items-center gap-1 ${
            stats.oneYearChange >= 0 ? 'text-rose-500' : 'text-emerald-500'
          }`}>
            {stats.oneYearChange >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span>Rs. {Math.abs(stats.oneYearChange)}</span>
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            {stats.oneYearPercent > 0 ? `+${stats.oneYearPercent.toFixed(1)}%` : `${stats.oneYearPercent.toFixed(1)}%`} in 12m
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-1 col-span-2 lg:col-span-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)]">5-Year Inflation Spike</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-500">
            +{stats.fiveYearPercent.toFixed(0)}%
          </div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">
            +Rs. {stats.fiveYearChange} since 2021
          </div>
        </div>
      </div>

      {/* Main SVG Interactive Chart Area */}
      <div className="relative rounded-xl border border-[var(--border-line)] bg-[var(--bg-page)] p-3 sm:p-4 overflow-hidden">
        {/* Dynamic Hover Tooltip HUD */}
        {activeHoverPoint && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none rounded-xl bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--border-line)] p-3 shadow-xl space-y-1 font-mono text-xs">
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{activeHoverPoint.record.dateLabel} ({activeHoverPoint.record.year})</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: productMeta.color }} />
              <span>{productMeta.shortLabel}:</span>
              <span>Rs. {activeHoverPoint.price}.00</span>
            </div>
            {hoverDelta && (
              <div className={`text-[11px] font-bold flex items-center gap-1 ${
                hoverDelta.diff > 0 ? 'text-rose-500' : hoverDelta.diff < 0 ? 'text-emerald-500' : 'text-zinc-400'
              }`}>
                {hoverDelta.diff > 0 ? <TrendingUp className="w-3 h-3" /> : hoverDelta.diff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>
                  {hoverDelta.diff > 0 ? `+Rs. ${hoverDelta.diff}` : hoverDelta.diff < 0 ? `-Rs. ${Math.abs(hoverDelta.diff)}` : 'No change'} ({hoverDelta.pct > 0 ? `+${hoverDelta.pct.toFixed(1)}%` : `${hoverDelta.pct.toFixed(1)}%`})
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal">vs prior revision</span>
              </div>
            )}
            {activeHoverPoint.record.note && (
              <div className="text-[10px] text-amber-600 dark:text-amber-400 max-w-xs pt-1 border-t border-[var(--border-line)] leading-tight">
                {activeHoverPoint.record.note}
              </div>
            )}
          </div>
        )}

        {/* The SVG Time-Series Surface */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto max-h-[420px] select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={productMeta.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={productMeta.color} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="compareGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={compareMeta?.color || '#10b981'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={compareMeta?.color || '#10b981'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Price Axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const yVal = padding.top + innerHeight * (1 - ratio);
            const priceVal = Math.round(minPrice + priceRange * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={yVal}
                  x2={padding.left + innerWidth}
                  y2={yVal}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 12}
                  y={yVal + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontFamily="monospace"
                  fill="currentColor"
                  opacity="0.5"
                >
                  Rs.{priceVal}
                </text>
              </g>
            );
          })}

          {/* Time axis labels */}
          {chartData.length > 0 && (
            <>
              <text
                x={padding.left}
                y={chartHeight - 12}
                textAnchor="start"
                fontSize="11"
                fontFamily="monospace"
                fill="currentColor"
                opacity="0.5"
              >
                {chartData[0].dateLabel}
              </text>
              <text
                x={padding.left + innerWidth / 2}
                y={chartHeight - 12}
                textAnchor="middle"
                fontSize="11"
                fontFamily="monospace"
                fill="currentColor"
                opacity="0.5"
              >
                {chartData[Math.floor(chartData.length / 2)].year}
              </text>
              <text
                x={padding.left + innerWidth}
                y={chartHeight - 12}
                textAnchor="end"
                fontSize="11"
                fontFamily="monospace"
                fill="currentColor"
                opacity="0.5"
              >
                {chartData[chartData.length - 1].dateLabel}
              </text>
            </>
          )}

          {/* Compare Series Area & Line (if active) */}
          {compareProduct && comparePathD && (
            <path
              d={comparePathD}
              fill="none"
              stroke={compareMeta?.color || '#10b981'}
              strokeWidth="2"
              strokeDasharray="5 3"
              opacity="0.75"
            />
          )}

          {/* Main Primary Fuel Series Area & Line */}
          {areaD && <path d={areaD} fill="url(#areaGradient)" />}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={productMeta.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Macro Milestone Vertical Marker Pins */}
          {showMilestones &&
            visibleMilestones.map((m) => {
              const matchedPoint = points.find((pt) => pt.record.year === m.year);
              if (!matchedPoint) return null;
              return (
                <g key={m.year} className="transition-opacity hover:opacity-100 opacity-60">
                  <line
                    x1={matchedPoint.x}
                    y1={padding.top}
                    x2={matchedPoint.x}
                    y2={padding.top + innerHeight}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle cx={matchedPoint.x} cy={padding.top + 6} r="4" fill="#f59e0b" />
                  <text
                    x={matchedPoint.x + 6}
                    y={padding.top + 10}
                    fontSize="10"
                    fontFamily="monospace"
                    fill="#f59e0b"
                    fontWeight="bold"
                  >
                    {m.year}
                  </text>
                </g>
              );
            })}

          {/* Active Hover Crosshair Line & Target Marker */}
          {activeHoverPoint && (
            <g>
              <line
                x1={activeHoverPoint.x}
                y1={padding.top}
                x2={activeHoverPoint.x}
                y2={padding.top + innerHeight}
                stroke={productMeta.color}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={activeHoverPoint.x}
                cy={activeHoverPoint.y}
                r="6"
                fill={productMeta.color}
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-pulse"
              />
            </g>
          )}
        </svg>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--border-line)] text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: productMeta.color }} />
              <span>{productMeta.label}</span>
            </span>
            {compareProduct && compareMeta && (
              <span className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                <span className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: compareMeta.color }} />
                <span>{compareMeta.label}</span>
              </span>
            )}
          </div>
          <span className="text-[11px]">Hover or drag pointer along graph to inspect revision dates</span>
        </div>
      </div>

      {/* Historical Milestones Explainer Bar */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Major Milestones in Sri Lanka Fuel Pricing Policy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          {MACRO_MILESTONES.map((m) => (
            <div
              key={m.date}
              className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-600 dark:text-amber-400">{m.year}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{m.date}</span>
              </div>
              <div className="font-bold text-[var(--text-main)]">{m.title}</div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-sans">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable Historical Archive Table */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-line)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-headline text-[var(--text-main)]">
              Search Historical Price Records (1990–2026)
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Showing {filteredRecords.length} official Ceylon Petroleum Corporation price revisions
            </p>
          </div>

          {/* Search Input & Year Select */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search date or price..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTablePage(1);
                }}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-line)] text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-rose-500 transition-colors w-44 sm:w-56"
              />
            </div>

            <select
              value={tableYear}
              onChange={(e) => {
                setTableYear(e.target.value);
                setTablePage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-line)] text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
            >
              <option value="all">All Years (1990–2026)</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-3">Petrol 95</th>
                <th className="py-3 px-3">Petrol 92</th>
                <th className="py-3 px-3">Auto Diesel</th>
                <th className="py-3 px-3">Super Diesel</th>
                <th className="py-3 px-3">Domestic Kero</th>
                <th className="py-3 px-4">Revision Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[var(--text-main)]">
                      <div className="flex items-center gap-2">
                        <span>{r.dateLabel}</span>
                        {r.sortKey === 20261101 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20">
                            Latest
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[var(--text-main)]">
                      {r.petrol95 !== null ? `Rs. ${r.petrol95}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                      {r.petrol92 !== null ? `Rs. ${r.petrol92}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {r.autoDiesel !== null ? `Rs. ${r.autoDiesel}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[var(--text-main)]">
                      {r.superDiesel !== null ? `Rs. ${r.superDiesel}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">
                      {r.kerosene !== null ? `Rs. ${r.kerosene}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-[var(--text-muted)] max-w-xs truncate">
                      {r.note || 'Regular Cost-Reflective Price Revision'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono">
                    No historical records found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Controls */}
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-2">
          <span>
            Page {tablePage} of {totalPages} ({filteredRecords.length} total entries)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="p-1.5 rounded-lg border border-[var(--border-line)] hover:bg-[var(--bg-subtle)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              disabled={tablePage === totalPages}
              className="p-1.5 rounded-lg border border-[var(--border-line)] hover:bg-[var(--bg-subtle)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
