import React from 'react';
import MobileCard from './MobileCard';

/**
 * ResponsiveTable — displays data as a standard table on ≥ md screens
 * and as stacked MobileCards on < md screens.
 *
 * Props:
 *   columns   — Array<{ key, label, className?, render? }>
 *   data      — Array<object>
 *   loading   — boolean
 *   emptyText — string (default "No data available")
 *   cardAccent— string (extra classes for card wrapper)
 *   rowKey    — string (field to use as React key, default 'id')
 *   rowHover  — string (hover class for table rows)
 *   getRowActions — (row) => ReactNode   (optional actions per card)
 *   theadClass — extra class for thead
 */
const ResponsiveTable = ({
    columns = [],
    data = [],
    loading = false,
    emptyText = 'No data available',
    cardAccent = '',
    rowKey = 'id',
    rowHover = 'hover:bg-base-200/50',
    getRowActions,
    theadClass = 'bg-base-200/60',
}) => {
    // ── Loading skeleton ────────────────────────────────────────
    if (loading) {
        return (
            <>
                {/* Mobile skeleton */}
                <div className="md:hidden space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-base-200 bg-base-100 p-4 space-y-2.5 animate-pulse">
                            {columns.map((col) => (
                                <div key={col.key} className="flex justify-between gap-4">
                                    <div className="h-3 w-16 bg-base-300 rounded" />
                                    <div className="h-3 bg-base-300 rounded" style={{ width: `${40 + (col.key.length * 7) % 40}%` }} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {/* Desktop skeleton */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-base-200 bg-base-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={theadClass}>
                                {columns.map((col) => (
                                    <th key={col.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-base-content/40">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3">
                                            <div className="h-4 bg-base-200 rounded animate-pulse" style={{ width: `${50 + (i * col.key.length * 3) % 40}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    // ── Empty state ─────────────────────────────────────────────
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium">{emptyText}</p>
            </div>
        );
    }

    return (
        <>
            {/* ── Mobile: Card list (< md) ──────────────────────── */}
            <div className="md:hidden space-y-3">
                {data.map((row, i) => (
                    <MobileCard
                        key={row[rowKey] ?? i}
                        columns={columns}
                        row={row}
                        accentColor={cardAccent}
                        actions={getRowActions ? getRowActions(row) : undefined}
                    />
                ))}
            </div>

            {/* ── Desktop: Standard table (≥ md) ───────────────── */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-base-200 bg-base-100 shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={theadClass}>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-base-content/50 ${col.className ?? ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {getRowActions && (
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-base-content/50">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200">
                        {data.map((row, i) => (
                            <tr key={row[rowKey] ?? i} className={`transition-colors duration-150 ${rowHover}`}>
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                                    </td>
                                ))}
                                {getRowActions && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getRowActions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ResponsiveTable;
