import React from 'react';

export const SkeletonView: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-3 space-y-5 animate-in fade-in duration-200">
      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {[80, 110, 95, 105, 85].map((width, idx) => (
          <div
            key={idx}
            style={{ width: `${width}px` }}
            className="h-8 rounded-2xl bg-slate-200/70 animate-pulse shrink-0"
          />
        ))}
      </div>

      {/* Category Section 1 */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-slate-200 animate-pulse" />
            <div className="w-28 h-4 rounded-md bg-slate-200 animate-pulse" />
          </div>
          <div className="w-12 h-3.5 rounded-full bg-slate-200 animate-pulse" />
        </div>

        {/* 3 Item Rows */}
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="py-2.5 px-3.5 rounded-2xl border border-slate-100 bg-white flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="h-4 rounded-md bg-slate-200/80 animate-pulse"
                  style={{ width: `${45 + (i * 15)}%` }}
                />
              </div>
              <div className="w-28 h-6 rounded-full bg-slate-100 animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Category Section 2 */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-slate-200 animate-pulse" />
            <div className="w-32 h-4 rounded-md bg-slate-200 animate-pulse" />
          </div>
          <div className="w-12 h-3.5 rounded-full bg-slate-200 animate-pulse" />
        </div>

        {/* 3 Item Rows */}
        <div className="space-y-1.5">
          {[4, 5, 6].map((i) => (
            <div
              key={i}
              className="py-2.5 px-3.5 rounded-2xl border border-slate-100 bg-white flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="h-4 rounded-md bg-slate-200/80 animate-pulse"
                  style={{ width: `${50 + (i * 7)}%` }}
                />
              </div>
              <div className="w-28 h-6 rounded-full bg-slate-100 animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
