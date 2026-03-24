const MyHealthRecordsPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Health Records</h1>
                    <p className="text-base-content/60">View your lab results, documents, and visit summaries.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Filters Sidebar */}
                <div className="col-span-1 border-r border-base-200 pr-0 lg:pr-6 hidden lg:block space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Record Type</h3>
                        <div className="flex flex-col gap-2">
                            <label className="label cursor-pointer justify-start gap-3 py-1">
                                <input type="checkbox" defaultChecked className="checkbox checkbox-sm checkbox-primary" />
                                <span className="label-text">Lab Results</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 py-1">
                                <input type="checkbox" defaultChecked className="checkbox checkbox-sm checkbox-primary" />
                                <span className="label-text">Visit Summaries</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 py-1">
                                <input type="checkbox" defaultChecked className="checkbox checkbox-sm checkbox-primary" />
                                <span className="label-text">Imaging & Scans</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 py-1">
                                <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                                <span className="label-text">Vaccinations</span>
                            </label>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div>
                        <h3 className="font-semibold mb-3">Timeframe</h3>
                        <select className="select select-bordered w-full select-sm">
                            <option>Past 6 Months</option>
                            <option>Past Year</option>
                            <option>Past 3 Years</option>
                            <option>All Time</option>
                        </select>
                    </div>
                </div>

                {/* Timeline Main Content */}
                <div className="col-span-1 lg:col-span-3">
                    {/* Mobile Filters Toggle */}
                    <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-2">
                        <button className="btn btn-sm btn-primary rounded-full">All Types</button>
                        <button className="btn btn-sm btn-outline rounded-full">Lab Results</button>
                        <button className="btn btn-sm btn-outline rounded-full">Visit Summaries</button>
                        <button className="btn btn-sm btn-outline rounded-full">Past 6 Months</button>
                    </div>

                    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                        
                        {/* Timeline Item 1 */}
                        <li>
                            <div className="timeline-middle">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                            </div>
                            <div className="timeline-start md:text-end mb-10 w-full md:w-auto mt-1 md:mt-0">
                                <time className="font-mono text-sm opacity-50 block mb-1">Oct 10, 2023</time>
                                <div className="text-lg font-black">Complete Blood Count (CBC)</div>
                                <div className="text-base-content/60 text-sm mb-2">Ordered by Dr. Michael Ross</div>
                                
                                <div className="card bg-base-100 shadow-lg border border-base-200 mt-2 text-start">
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="badge badge-success">Normal Range</div>
                                            <button className="btn btn-ghost btn-xs text-primary">View PDF</button>
                                        </div>
                                        <p className="text-sm">All values are within normal limits. White blood cell count and hemoglobin levels are healthy.</p>
                                    </div>
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        
                        {/* Timeline Item 2 */}
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                            </div>
                            <div className="timeline-end mb-10 w-full md:w-auto mt-1 md:mt-0">
                                <time className="font-mono text-sm opacity-50 block mb-1">Sep 10, 2023</time>
                                <div className="text-lg font-black">Annual Physical Summary</div>
                                <div className="text-base-content/60 text-sm mb-2">Dr. Sarah Jenkins</div>
                                
                                <div className="card bg-base-100 shadow-lg border border-base-200 mt-2">
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="badge badge-ghost">Visit Summary</div>
                                            <button className="btn btn-ghost btn-xs text-primary">View Notes</button>
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            <div className="bg-base-200/50 p-2 rounded text-sm">
                                                <span className="font-semibold">Diagnosis:</span> Essential hypertension (controlled)
                                            </div>
                                            <div className="bg-base-200/50 p-2 rounded text-sm">
                                                <span className="font-semibold">Vitals:</span> BP 120/80, HR 72, Temp 98.6°F
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="bg-base-300" />
                        </li>

                        {/* Timeline Item 3 */}
                        <li>
                            <hr className="bg-base-300" />
                            <div className="timeline-middle">
                                <div className="w-8 h-8 rounded-full bg-base-300 text-base-content flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>
                            <div className="timeline-start md:text-end mb-10 w-full md:w-auto mt-1 md:mt-0">
                                <time className="font-mono text-sm opacity-50 block mb-1">Aug 05, 2023</time>
                                <div className="text-lg font-black">Chest X-Ray</div>
                                <div className="text-base-content/60 text-sm mb-2">City Imaging Center</div>
                                
                                <div className="card bg-base-100 shadow-lg border border-base-200 mt-2 text-start">
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="badge badge-ghost border-zinc-300">Imaging/Scan</div>
                                            <button className="btn btn-ghost btn-xs">View Report</button>
                                        </div>
                                        <div className="aspect-video bg-base-200 rounded-lg flex items-center justify-center mt-2 border border-base-300 overflow-hidden relative group cursor-pointer">
                                            <div className="absolute inset-0 bg-base-300 animate-pulse opacity-20"></div>
                                            <svg className="w-10 h-10 opacity-30 group-hover:opacity-50 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div className="flex justify-center mt-6">
                        <button className="btn btn-outline text-base-content/60">Load Older Records</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyHealthRecordsPage;
