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
  ChevronLeft,
  ChevronRight,
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
} from '@/lib/ceypetco-history-data';

type TimeRange = '1Y' | '3Y' | '5Y' | '10Y' | 'ALL';
type ChartStyle = 'area' | 'line' | 'stepped';

const TICKER_SYMBOLS: Record<FuelSeriesKey, string> = {
  petrol92: 'CEYPETCO:PET92',
  petrol95: 'CEYPETCO:PET95',
  autoDiesel: 'CEYPETCO:DIESEL',
  superDiesel: 'CEYPETCO:SUPERD',
  kerosene: 'CEYPETCO:KERO',
  indKerosene: 'CEYPETCO:INDKERO',
};

export function FuelHistoryVisualizer() {
  const [activeProduct, setActiveProduct] = useState<FuelSeriesKey>('petrol92');
  const [compareProduct, setCompareProduct] = useState<FuelSeriesKey | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('5Y');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');
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

  // Latest revision price & delta vs previous revision
  const latestRevision = useMemo(() => {
    if (chartData.length === 0) return { price: 0, delta: 0, pct: 0, date: '' };
    const latest = chartData[chartData.length - 1];
    const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;
    const price = (latest[activeProduct] as number) || 0;
    const prevPrice = prev ? ((prev[activeProduct] as number) || 0) : price;
    const delta = price - prevPrice;
    const pct = prevPrice !== 0 ? (delta / prevPrice) * 100 : 0;
    return { price, delta, pct, date: latest.dateLabel };
  }, [chartData, activeProduct]);

  // SVG Chart Dimensions & TradingView Layout (Price Scale on Right)
  const chartWidth = 960;
  const chartHeight = 380;
  const padding = { top: 30, right: 70, bottom: 35, left: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const {
    points,
    minPrice,
    maxPrice,
    priceRange,
    pathD,
    areaD,
    steppedPathD,
    comparePoints,
    comparePathD,
  } = useMemo(() => {
    if (chartData.length === 0) {
      return {
        points: [],
        minPrice: 0,
        maxPrice: 100,
        priceRange: 100,
        pathD: '',
        areaD: '',
        steppedPathD: '',
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

    // Give visual breathing room (TradingView autoscale padding)
    min = Math.max(0, Math.floor(min * 0.95));
    max = Math.ceil(max * 1.05);
    const range = max - min || 1;

    const mapped = chartData.map((d, i) => {
      const x = padding.left + (i / Math.max(1, chartData.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (((d[activeProduct] as number) - min) / range) * innerHeight;
      return { x, y, record: d, price: d[activeProduct] as number };
    });

    // Linear / Curve Path
    let pD = '';
    mapped.forEach((pt, i) => {
      pD += `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
    });

    // Stepped Path (Constant price until revision date)
    let sD = '';
    mapped.forEach((pt, i) => {
      if (i === 0) {
        sD += `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
      } else {
        const prev = mapped[i - 1];
        sD += `L ${pt.x.toFixed(1)} ${prev.y.toFixed(1)} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
      }
    });

    const activeD = chartStyle === 'stepped' ? sD : pD;
    const aD =
      mapped.length > 0
        ? `${activeD} L ${mapped[mapped.length - 1].x.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} L ${mapped[0].x.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} Z`
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
      steppedPathD: sD,
      comparePoints: cMapped,
      comparePathD: cD,
    };
  }, [chartData, activeProduct, compareProduct, chartStyle, innerWidth, innerHeight, padding.left, padding.top]);

  // Handle pointer scrub over SVG
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current || points.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const scaleX = chartWidth / rect.width;
      const svgX = clientX * scaleX;

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
    <section className="rounded-xl bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] overflow-hidden shadow-2xl font-sans">
      {/* TradingView Top Ticker Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#2a2e39] bg-[#1e222d] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Symbol Identification & Quote Box */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2962ff]/15 border border-[#2962ff]/30 flex items-center justify-center text-[#2962ff] shrink-0 font-mono font-bold text-sm">
              🇱🇰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base sm:text-lg text-[#f0f3fa] tracking-tight">
                  {TICKER_SYMBOLS[activeProduct]}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#089981]/15 text-[#089981] border border-[#089981]/30">
                  MARKET REGULATED
                </span>
              </div>
              <div className="text-xs text-[#787b86] font-mono">
                {productMeta.label} · Ceylon Petroleum Corp (CEYPETCO) · LKR
              </div>
            </div>
          </div>

          {/* Real-Time Price Callout */}
          <div className="flex items-baseline gap-3 pl-0 sm:pl-4 sm:border-l sm:border-[#2a2e39]">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#f0f3fa] tabular-nums">
              Rs. {latestRevision.price}.00
            </div>
            {latestRevision.delta !== 0 ? (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  latestRevision.delta > 0
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-[#089981]/15 text-[#089981] border border-[#089981]/30'
                }`}
              >
                {latestRevision.delta > 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {latestRevision.delta > 0 ? `+${latestRevision.delta}` : latestRevision.delta} (
                  {latestRevision.pct > 0 ? `+${latestRevision.pct.toFixed(2)}` : latestRevision.pct.toFixed(2)}%)
                </span>
              </span>
            ) : (
              <span className="text-xs font-mono text-[#787b86]">Unchanged</span>
            )}
          </div>
        </div>

        {/* Global CSV Download CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#2a2e39] hover:bg-[#363a45] text-xs font-mono font-bold text-[#d1d4dc] hover:text-white border border-[#363a45] transition-all cursor-pointer group shadow-sm"
            title="Download complete 185-revision dataset as CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#2962ff] group-hover:translate-y-0.5 transition-transform" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* TradingView Secondary Action & Period Toolbar */}
      <div className="px-4 py-2.5 border-b border-[#2a2e39] bg-[#1e222d]/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Fuel Ticker Selector Strip */}
        <div className="flex flex-wrap items-center gap-1.5">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] border border-[#2a2e39]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isActive ? '#ffffff' : meta.color }}
                />
                <span>{meta.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Chart Options: Timeframe + Chart Type + Compare */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Buttons */}
          <div className="inline-flex items-center rounded bg-[#131722] p-0.5 border border-[#2a2e39]">
            {(['1Y', '3Y', '5Y', '10Y', 'ALL'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  timeRange === range ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {range === 'ALL' ? '36Y' : range}
              </button>
            ))}
          </div>

          {/* Chart Display Mode: Area vs Line vs Stepped */}
          <div className="inline-flex items-center rounded bg-[#131722] p-0.5 border border-[#2a2e39]">
            <button
              onClick={() => setChartStyle('area')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                chartStyle === 'area' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
              title="Area Gradient"
            >
              Area
            </button>
            <button
              onClick={() => setChartStyle('line')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                chartStyle === 'line' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
              title="Technical Line"
            >
              Line
            </button>
            <button
              onClick={() => setChartStyle('stepped')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                chartStyle === 'stepped' ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
              title="Step-wise Revision Ladder"
            >
              Step
            </button>
          </div>

          {/* Compare Toggle */}
          <button
            onClick={() => {
              if (compareProduct) setCompareProduct(null);
              else {
                setCompareProduct(activeProduct === 'autoDiesel' ? 'petrol92' : 'autoDiesel');
              }
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              compareProduct
                ? 'bg-[#089981]/15 text-[#089981] border-[#089981]/30 font-bold'
                : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc] border-[#2a2e39]'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{compareProduct ? `Vs ${compareMeta?.shortLabel}` : '+ Compare'}</span>
          </button>

          {/* Milestones Flag Toggle */}
          <button
            onClick={() => setShowMilestones(!showMilestones)}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              showMilestones
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                : 'bg-[#131722] text-[#787b86] hover:text-[#d1d4dc] border-[#2a2e39]'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>Events</span>
          </button>
        </div>
      </div>

      {/* Main SVG Interactive TradingView Canvas */}
      <div className="relative bg-[#131722] p-2 sm:p-4 select-none">
        {/* Top-Left Chart Legend HUD */}
        <div className="absolute top-4 left-6 z-20 pointer-events-none font-mono text-xs space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold flex items-center gap-1.5 text-[#f0f3fa]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: productMeta.color }} />
              <span>{TICKER_SYMBOLS[activeProduct]}</span>
            </span>

            {activeHoverPoint ? (
              <>
                <span className="text-[#787b86]">·</span>
                <span className="text-[#d1d4dc]">
                  Date: <span className="text-white font-bold">{activeHoverPoint.record.dateLabel}</span>
                </span>
                <span className="text-[#787b86]">·</span>
                <span className="text-[#d1d4dc]">
                  Price: <span className="text-[#2962ff] font-bold">Rs. {activeHoverPoint.price}.00</span>
                </span>
                {hoverDelta && (
                  <>
                    <span className="text-[#787b86]">·</span>
                    <span
                      className={`font-bold flex items-center gap-0.5 ${
                        hoverDelta.diff > 0
                          ? 'text-amber-400'
                          : hoverDelta.diff < 0
                          ? 'text-[#089981]'
                          : 'text-[#787b86]'
                      }`}
                    >
                      {hoverDelta.diff > 0 ? '▲ +' : hoverDelta.diff < 0 ? '▼ -' : '■ '}
                      Rs. {Math.abs(hoverDelta.diff)} ({hoverDelta.pct > 0 ? `+${hoverDelta.pct.toFixed(2)}` : hoverDelta.pct.toFixed(2)}%)
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <span className="text-[#787b86]">·</span>
                <span className="text-[#787b86]">
                  Latest: <span className="text-[#f0f3fa] font-bold">Rs. {latestRevision.price}.00</span>
                </span>
                <span className="text-[#787b86]">·</span>
                <span className="text-[#787b86]">Singapore Platts Index Basis</span>
              </>
            )}
          </div>

          {activeHoverPoint?.record.note && (
            <div className="text-[11px] text-amber-400/90 max-w-lg truncate">
              ⚑ {activeHoverPoint.record.note}
            </div>
          )}
        </div>

        {/* SVG Drawing Canvas */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto max-h-[440px] touch-none cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id="tvAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={productMeta.color} stopOpacity="0.22" />
              <stop offset="60%" stopColor={productMeta.color} stopOpacity="0.05" />
              <stop offset="100%" stopColor={productMeta.color} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="tvCompareGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={compareMeta?.color || '#089981'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={compareMeta?.color || '#089981'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Right Y-Axis Line & Bottom X-Axis Line */}
          <line
            x1={padding.left + innerWidth}
            y1={padding.top}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight}
            stroke="#2a2e39"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight}
            stroke="#2a2e39"
            strokeWidth="1"
          />

          {/* Horizontal Dotted Price Grid Lines & Right Price Scale */}
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
                  stroke="#2a2e39"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={padding.left + innerWidth + 8}
                  y={yVal + 3.5}
                  textAnchor="start"
                  fontSize="11"
                  fontFamily="monospace"
                  fill="#787b86"
                >
                  {priceVal}.00
                </text>
              </g>
            );
          })}

          {/* Vertical Dotted Timeline Grid Lines */}
          {chartData.length > 0 &&
            [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const xVal = padding.left + innerWidth * ratio;
              const idx = Math.min(chartData.length - 1, Math.floor((chartData.length - 1) * ratio));
              const label = chartData[idx]?.year || '';
              return (
                <g key={ratio}>
                  <line
                    x1={xVal}
                    y1={padding.top}
                    x2={xVal}
                    y2={padding.top + innerHeight}
                    stroke="#2a2e39"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={xVal}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="monospace"
                    fill="#787b86"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

          {/* Compare Series Line (if active) */}
          {compareProduct && comparePathD && (
            <path
              d={comparePathD}
              fill="none"
              stroke={compareMeta?.color || '#089981'}
              strokeWidth="1.75"
              strokeDasharray="4 3"
              opacity="0.85"
            />
          )}

          {/* Main Primary Fuel Series Area (if active) */}
          {chartStyle === 'area' && areaD && <path d={areaD} fill="url(#tvAreaGradient)" />}

          {/* Main Primary Fuel Series Technical Line */}
          {chartStyle === 'stepped' && steppedPathD ? (
            <path
              d={steppedPathD}
              fill="none"
              stroke={productMeta.color}
              strokeWidth="2"
              strokeLinecap="square"
            />
          ) : pathD ? (
            <path
              d={pathD}
              fill="none"
              stroke={productMeta.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Macro Milestone Vertical Event Markers */}
          {showMilestones &&
            visibleMilestones.map((m) => {
              const matchedPoint = points.find((pt) => pt.record.year === m.year);
              if (!matchedPoint) return null;
              return (
                <g key={m.year} className="opacity-75 hover:opacity-100 transition-opacity">
                  <line
                    x1={matchedPoint.x}
                    y1={padding.top}
                    x2={matchedPoint.x}
                    y2={padding.top + innerHeight}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={matchedPoint.x - 14}
                    y={padding.top}
                    width="28"
                    height="14"
                    rx="3"
                    fill="#1e222d"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                  <text
                    x={matchedPoint.x}
                    y={padding.top + 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fill="#f59e0b"
                    fontWeight="bold"
                  >
                    {m.year}
                  </text>
                </g>
              );
            })}

          {/* Interactive TradingView Reticle / Crosshair */}
          {activeHoverPoint && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={activeHoverPoint.x}
                y1={padding.top}
                x2={activeHoverPoint.x}
                y2={padding.top + innerHeight}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Horizontal Crosshair Line */}
              <line
                x1={padding.left}
                y1={activeHoverPoint.y}
                x2={padding.left + innerWidth}
                y2={activeHoverPoint.y}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Target Highlight Circle */}
              <circle
                cx={activeHoverPoint.x}
                cy={activeHoverPoint.y}
                r="4.5"
                fill={productMeta.color}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Pinned Right Y-Axis Price Tag (TradingView Style) */}
              <rect
                x={padding.left + innerWidth + 1}
                y={activeHoverPoint.y - 10}
                width="64"
                height="20"
                rx="2"
                fill="#2962ff"
              />
              <text
                x={padding.left + innerWidth + 33}
                y={activeHoverPoint.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#ffffff"
              >
                {activeHoverPoint.price}.00
              </text>

              {/* Pinned Bottom X-Axis Date Tag (TradingView Style) */}
              <rect
                x={Math.max(padding.left, Math.min(chartWidth - 90, activeHoverPoint.x - 38))}
                y={chartHeight - padding.bottom + 1}
                width="76"
                height="18"
                rx="2"
                fill="#1e222d"
                stroke="#2962ff"
                strokeWidth="1"
              />
              <text
                x={Math.max(padding.left + 38, Math.min(chartWidth - 52, activeHoverPoint.x))}
                y={chartHeight - padding.bottom + 13}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#f0f3fa"
              >
                {activeHoverPoint.record.dateLabel}
              </text>
            </g>
          )}
        </svg>

        {/* Bottom Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#2a2e39] text-xs font-mono text-[#787b86]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-[#d1d4dc]">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: productMeta.color }} />
              <span>{productMeta.label}</span>
            </span>
            {compareProduct && compareMeta && (
              <span className="flex items-center gap-1.5 font-bold text-[#089981]">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-[#089981]" />
                <span>{compareMeta.label}</span>
              </span>
            )}
          </div>
          <span className="text-[11px]">Click or drag crosshair along canvas to inspect exact revision points</span>
        </div>
      </div>

      {/* TradingView Terminal KPI Bar (Zero Red) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#2a2e39] border-t border-[#2a2e39] bg-[#1e222d] text-xs font-mono">
        <div className="p-4 space-y-1">
          <div className="text-[11px] text-[#787b86]">Current Benchmark</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#f0f3fa]">
            Rs. {stats.current}.00
          </div>
          <div className="text-[10px] text-[#089981] font-semibold">Active Revision</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[11px] text-[#787b86]">All-Time High (ATH)</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
            Rs. {stats.allTimeHigh.price}.00
          </div>
          <div className="text-[10px] text-[#787b86]">{stats.allTimeHigh.date || 'June 2022 Crisis Peak'}</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[11px] text-[#787b86]">All-Time Low (ATL)</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#787b86]">
            Rs. {stats.allTimeLow.price}.00
          </div>
          <div className="text-[10px] text-[#787b86]">{stats.allTimeLow.date || 'March 1990 Baseline'}</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[11px] text-[#787b86]">1-Year Net Change</div>
          <div
            className={`text-xl sm:text-2xl font-bold font-mono flex items-center gap-1 ${
              stats.oneYearChange > 0 ? 'text-amber-400' : 'text-[#089981]'
            }`}
          >
            {stats.oneYearChange > 0 ? (
              <ArrowUpRight className="w-5 h-5" />
            ) : (
              <ArrowDownRight className="w-5 h-5" />
            )}
            <span>Rs. {Math.abs(stats.oneYearChange)}</span>
          </div>
          <div className="text-[10px] text-[#787b86]">
            {stats.oneYearPercent > 0 ? `+${stats.oneYearPercent.toFixed(1)}%` : `${stats.oneYearPercent.toFixed(1)}%`} in 12m
          </div>
        </div>

        <div className="p-4 space-y-1 col-span-2 lg:col-span-1">
          <div className="text-[11px] text-[#787b86]">5-Year Expansion</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#2962ff]">
            +{stats.fiveYearPercent.toFixed(0)}%
          </div>
          <div className="text-[10px] text-[#787b86]">+Rs. {stats.fiveYearChange} since 2021</div>
        </div>
      </div>

      {/* Historical Milestones Explainer Bar */}
      <div className="p-4 sm:p-5 border-t border-[#2a2e39] bg-[#131722] space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#787b86] font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Major Milestones in Sri Lanka Fuel Pricing Policy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          {MACRO_MILESTONES.map((m) => (
            <div
              key={m.date}
              className="p-3.5 rounded-lg bg-[#1e222d] border border-[#2a2e39] space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400">{m.year}</span>
                <span className="text-[10px] text-[#787b86]">{m.date}</span>
              </div>
              <div className="font-bold text-[#f0f3fa]">{m.title}</div>
              <p className="text-[11px] text-[#787b86] leading-relaxed font-sans">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable Historical Archive Table */}
      <div className="p-4 sm:p-5 border-t border-[#2a2e39] bg-[#1e222d] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-mono text-[#f0f3fa]">
              Historical Price Revisions Tape (1990–2026)
            </h3>
            <p className="text-xs font-mono text-[#787b86]">
              Showing {filteredRecords.length} official Ceylon Petroleum Corporation records
            </p>
          </div>

          {/* Search Input & Year Select */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
              <input
                type="text"
                placeholder="Search date or price..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTablePage(1);
                }}
                className="pl-8 pr-3 py-1.5 rounded bg-[#131722] border border-[#2a2e39] text-xs font-mono text-[#d1d4dc] focus:outline-none focus:border-[#2962ff] transition-colors w-44 sm:w-56"
              />
            </div>

            <select
              value={tableYear}
              onChange={(e) => {
                setTableYear(e.target.value);
                setTablePage(1);
              }}
              className="px-3 py-1.5 rounded bg-[#131722] border border-[#2a2e39] text-xs font-mono text-[#d1d4dc] focus:outline-none focus:border-[#2962ff] transition-colors cursor-pointer"
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
        <div className="rounded-lg border border-[#2a2e39] bg-[#131722] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2a2e39] bg-[#1e222d] text-[11px] uppercase tracking-wider text-[#787b86]">
                <th className="py-2.5 px-4">Effective Date</th>
                <th className="py-2.5 px-3">Petrol 95</th>
                <th className="py-2.5 px-3">Petrol 92</th>
                <th className="py-2.5 px-3">Auto Diesel</th>
                <th className="py-2.5 px-3">Super Diesel</th>
                <th className="py-2.5 px-3">Domestic Kero</th>
                <th className="py-2.5 px-4">Revision Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1e222d]/60 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[#f0f3fa]">
                      <div className="flex items-center gap-2">
                        <span>{r.dateLabel}</span>
                        {r.sortKey === 20261101 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2962ff]/15 text-[#2962ff] font-bold border border-[#2962ff]/30">
                            Latest
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#8c52ff]">
                      {r.petrol95 !== null ? `Rs. ${r.petrol95}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#2962ff]">
                      {r.petrol92 !== null ? `Rs. ${r.petrol92}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#089981]">
                      {r.autoDiesel !== null ? `Rs. ${r.autoDiesel}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#00bcd4]">
                      {r.superDiesel !== null ? `Rs. ${r.superDiesel}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-amber-400">
                      {r.kerosene !== null ? `Rs. ${r.kerosene}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-[#787b86] max-w-xs truncate">
                      {r.note || 'Regular Cost-Reflective Price Revision'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#787b86] font-mono">
                    No historical records found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Controls */}
        <div className="flex items-center justify-between text-xs font-mono text-[#787b86] pt-1">
          <span>
            Page {tablePage} of {totalPages} ({filteredRecords.length} total entries)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="p-1.5 rounded border border-[#2a2e39] bg-[#131722] hover:bg-[#2a2e39] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-[#d1d4dc]" />
            </button>
            <button
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              disabled={tablePage === totalPages}
              className="p-1.5 rounded border border-[#2a2e39] bg-[#131722] hover:bg-[#2a2e39] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-[#d1d4dc]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
