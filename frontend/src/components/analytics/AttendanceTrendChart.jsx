import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';

export const AttendanceTrendChart = ({
  title = 'Overall Attendance Trend',
  timeSeriesData,
  target = 75,
}) => {
  const points = timeSeriesData?.points || [];
  const [selectedPointIndex, setSelectedPointIndex] = useState(
    points.length > 0 ? points.length - 1 : null
  );

  const activePoint =
    selectedPointIndex !== null && points[selectedPointIndex]
      ? points[selectedPointIndex]
      : points[points.length - 1] || null;

  const width = 340;
  const height = 180;
  const padLeft = 36;
  const padRight = 14;
  const padTop = 18;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getY = (val) => {
    const clamped = Math.min(100, Math.max(0, val));
    return padTop + chartH - (clamped / 100) * chartH;
  };

  const getX = (idx, total) => {
    if (total <= 1) return padLeft + chartW / 2;
    return padLeft + (idx / (total - 1)) * chartW;
  };

  const targetY = getY(target);

  const coords = points.map((p, idx) => ({
    x: getX(idx, points.length),
    y: getY(p.percentage),
    point: p,
    idx,
  }));

  let linePath = '';
  let areaPath = '';

  if (coords.length === 1) {
    const c = coords[0];
    linePath = `M ${padLeft} ${c.y} L ${padLeft + chartW} ${c.y}`;
    areaPath = `M ${padLeft} ${c.y} L ${padLeft + chartW} ${c.y} L ${padLeft + chartW} ${padTop + chartH} L ${padLeft} ${padTop + chartH} Z`;
  } else if (coords.length > 1) {
    linePath = coords.reduce((acc, c, i) => {
      if (i === 0) return `M ${c.x} ${c.y}`;
      return `${acc} L ${c.x} ${c.y}`;
    }, '');

    const first = coords[0];
    const last = coords[coords.length - 1];
    areaPath = `${linePath} L ${last.x} ${padTop + chartH} L ${first.x} ${padTop + chartH} Z`;
  }

  const latestPercentage = points.length > 0 ? points[points.length - 1].percentage : 0;
  const isHealthy = latestPercentage >= target;
  const lineColor = isHealthy ? '#24D366' : '#F04444';

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[24px] p-4 sm:p-5 shadow-xl select-none space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-[#F4F5F7] tracking-tight">
              {title}
            </h3>
            <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[#9A9DA8]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11.5px] text-[#9A9DA8] font-medium mt-0.5">
            Cumulative percentage over time
          </p>
        </div>

        {activePoint && (
          <div className="text-right">
            <span
              className={`text-lg font-black tracking-tight leading-none ${
                activePoint.percentage >= target ? 'text-[#24D366]' : 'text-[#F04444]'
              }`}
            >
              {activePoint.percentage}%
            </span>
            <span className="text-[10px] text-[#9A9DA8] block font-medium">
              {activePoint.date}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activePoint && (
          <motion.div
            key={activePoint.dateKey || activePoint.date}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="p-2.5 rounded-xl bg-[#141414] border border-white/[0.04] flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#9A9DA8] font-medium">Cumulative:</span>
              <span className="font-bold text-white">
                {activePoint.attended}/{activePoint.total} classes
              </span>
            </div>
            {activePoint.dayHeld > 0 && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[#9A9DA8]">Logged:</span>
                <span className="text-[#24D366] font-bold">
                  +{activePoint.dayAttended}
                </span>
                <span className="text-[#9A9DA8]">/</span>
                <span className="text-[#F04444] font-bold">
                  -{activePoint.dayHeld - activePoint.dayAttended}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {points.length === 0 ? (
        <div className="py-10 text-center text-xs text-[#9A9DA8]">
          <Info className="w-5 h-5 mx-auto mb-2 text-[#9A9DA8]/60" />
          No attendance logs recorded in this period.
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.28" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[0, 25, 50, 75, 100].map((tick) => {
              const y = getY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1"
                    strokeDasharray={tick === target ? '0' : '2,3'}
                  />
                  <text
                    x={padLeft - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#9A9DA8"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            <line
              x1={padLeft}
              y1={targetY}
              x2={width - padRight}
              y2={targetY}
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              opacity="0.8"
            />
            <text
              x={width - padRight}
              y={targetY - 4}
              textAnchor="end"
              fill="#F59E0B"
              fontSize="8.5"
              fontWeight="600"
            >
              {target}% Target
            </text>

            {areaPath && (
              <path d={areaPath} fill="url(#trendGradient)" />
            )}

            {linePath && (
              <motion.path
                d={linePath}
                fill="none"
                stroke={lineColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            )}

            {coords.map((c) => {
              const isSelected = selectedPointIndex === c.idx;
              const pointColor = c.point.percentage >= target ? '#24D366' : '#F04444';

              return (
                <g
                  key={c.idx}
                  onClick={() => setSelectedPointIndex(c.idx)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#FFFFFF' : pointColor}
                    stroke="#1D1D1D"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="12"
                    fill="transparent"
                  />
                </g>
              );
            })}

            {coords.length > 0 && (
              <>
                <text
                  x={coords[0].x}
                  y={height - 8}
                  textAnchor={coords.length === 1 ? 'middle' : 'start'}
                  fill="#9A9DA8"
                  fontSize="9"
                  fontWeight="500"
                >
                  {coords[0].point.date}
                </text>
                {coords.length > 1 && (
                  <text
                    x={coords[coords.length - 1].x}
                    y={height - 8}
                    textAnchor="end"
                    fill="#9A9DA8"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {coords[coords.length - 1].point.date}
                  </text>
                )}
              </>
            )}
          </svg>
        </div>
      )}

      {points.length <= 1 && (
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-[#9A9DA8]">
          <Info className="w-3.5 h-3.5 text-[#9A9DA8] shrink-0" />
          <span>
            Daily trend points will appear automatically as you log classes over multiple dates.
          </span>
        </div>
      )}
    </div>
  );
};
