import React from 'react';

/**
 * MobileCard — renders a single data row as a responsive card on mobile.
 *
 * Usage:
 *   <MobileCard
 *     columns={[{ key: 'name', label: 'Name' }, ...]}
 *     row={rowObject}
 *     accentColor="bg-blue-50 border-blue-100"
 *     actions={<button>...</button>}
 *   />
 */
const MobileCard = ({ columns = [], row = {}, accentColor = '', actions }) => {
    return (
        <div className={`rounded-2xl border bg-base-100 shadow-sm overflow-hidden ${accentColor}`}>
            <div className="px-4 py-3 space-y-2.5">
                {columns.map((col) => {
                    const value = col.render
                        ? col.render(row[col.key], row)
                        : row[col.key];

                    if (value === undefined || value === null) return null;

                    return (
                        <div
                            key={col.key}
                            className="flex items-start justify-between gap-3 py-1 border-b border-base-200/60 last:border-0"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 pt-0.5 flex-shrink-0 min-w-[80px]">
                                {col.label}
                            </span>
                            <span className="text-sm font-medium text-base-content text-right flex-1 min-w-0 break-words">
                                {value}
                            </span>
                        </div>
                    );
                })}
            </div>
            {actions && (
                <div className="px-4 py-2.5 bg-base-200/40 border-t border-base-200 flex items-center gap-2 flex-wrap">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default MobileCard;
