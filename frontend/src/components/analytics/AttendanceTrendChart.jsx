import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const AttendanceTrendChart = ({
  title = 'Attendance Trend',
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

  const width = 330;
  const height = 150;
  const padLeft = 32;
  const padRight = 12;
  const padTop = 16;
  const padBottom = 26;

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
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[22px] p-4 shadow-xl select-none space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-[#F4F5F7] tracking-tight">
            {title}
          </h3>
          <TrendingUp className="w-3.5 h-3.5 text-[#9A9DA8]" />
        </div>

        {activePoint && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#9A9DA8]">{activePoint.date}:</span>
            <span
              className={`font-bold ${
                activePoint.percentage >= target ? 'text-[#24D366]' : 'text-[#F04444]'
              }`}
            >
              {activePoint.percentage}%
            </span>
          </div>
        )}
      </div>

      {points.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#9A9DA8]">
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
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[0, 50, 100].map((tick) => {
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
              strokeWidth="1"
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
              {target}%
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
                transition={{ duration: 0.5, ease: 'easeOut' }}
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
                    r={isSelected ? 5.5 : 3.5}
                    fill={isSelected ? '#FFFFFF' : pointColor}
                    stroke="#1D1D1D"
                    strokeWidth="2"
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
                  y={height - 6}
                  textAnchor={coords.length === 1 ? 'middle' : 'start'}
                  fill="#9A9DA8"
                  fontSize="8.5"
                  fontWeight="500"
                >
                  {coords[0].point.date}
                </text>
                {coords.length > 1 && (
                  <text
                    x={coords[coords.length - 1].x}
                    y={height - 6}
                    textAnchor="end"
                    fill="#9A9DA8"
                    fontSize="8.5"
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
    </div>
  );
};
