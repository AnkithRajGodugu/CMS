const MyInsurancePage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Insurance & Billing</h1>
                <p className="text-base-content/60">View your active coverage, copays, and recent claims.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Policy Card */}
                <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl h-fit">
                    <div className="card-body">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-sm uppercase tracking-wider opacity-80 font-semibold mb-1">Active Policy</h2>
                                <h3 className="text-2xl font-bold">BlueCross BlueShield</h3>
                                <p className="opacity-90">PPO Premium Bronze Plan</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <p className="text-xs opacity-70 uppercase tracking-wider">Member ID</p>
                                <p className="font-mono mt-1">XXX-XX-1234</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70 uppercase tracking-wider">Group #</p>
                                <p className="font-mono mt-1">987654</p>
                            </div>
                        </div>

                        <div className="divider bg-white/20 h-px my-4"></div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-80">Primary Care Copay</span>
                            <span className="font-bold border border-white/30 px-3 py-1 rounded-full">$25</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-3">
                            <span className="opacity-80">Specialist Copay</span>
                            <span className="font-bold border border-white/30 px-3 py-1 rounded-full">$50</span>
                        </div>
                        
                        <div className="mt-6 font-medium text-center bg-black/10 py-3 rounded-lg border border-white/20 hover:bg-black/20 transition-colors cursor-pointer">
                            View Digital ID Card
                        </div>
                    </div>
                </div>

                {/* Deductible / Out of Pocket Progress */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-base">In-Network Deductible</h2>
                            <div className="flex justify-between items-end mb-2 mt-2">
                                <span className="text-3xl font-bold">$1,250 <span className="text-sm font-normal text-base-content/60">spent</span></span>
                                <span className="text-sm font-medium text-base-content/60">Goal: $2,500</span>
                            </div>
                            <progress className="progress progress-error w-full h-3" value="50" max="100"></progress>
                            <p className="text-xs text-base-content/60 text-right mt-1">$1,250 remaining</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-base">Out-of-Pocket Maximum</h2>
                            <div className="flex justify-between items-end mb-2 mt-2">
                                <span className="text-3xl font-bold">$2,100 <span className="text-sm font-normal text-base-content/60">spent</span></span>
                                <span className="text-sm font-medium text-base-content/60">Limit: $6,000</span>
                            </div>
                            <progress className="progress progress-warning w-full h-3" value="35" max="100"></progress>
                            <p className="text-xs text-base-content/60 text-right mt-1">$3,900 remaining</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Claims History */}
            <div className="card bg-base-100 shadow-xl mt-6 border border-base-200">
                <div className="card-body">
                    <h2 className="card-title text-lg mb-4">Recent Claims</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-sm">
                            <thead>
                                <tr>
                                    <th>Date of Service</th>
                                    <th>Provider</th>
                                    <th>Service Type</th>
                                    <th>Patient Responsibility</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover">
                                    <td className="font-medium whitespace-nowrap">Oct 10, 2023</td>
                                    <td>City Lab Diagnostics</td>
                                    <td>Blood Work (CBC Panel)</td>
                                    <td className="font-bold">$0.00</td>
                                    <td><span className="badge badge-sm badge-success badge-outline">Paid</span></td>
                                </tr>
                                <tr className="hover">
                                    <td className="font-medium whitespace-nowrap">Sep 10, 2023</td>
                                    <td>Dr. Sarah Jenkins</td>
                                    <td>Annual Physical Checkup</td>
                                    <td className="font-bold">$25.00</td>
                                    <td><span className="badge badge-sm badge-success badge-outline">Paid</span></td>
                                </tr>
                                <tr className="hover">
                                    <td className="font-medium whitespace-nowrap">Aug 05, 2023</td>
                                    <td>City Imaging Center</td>
                                    <td>Chest X-Ray</td>
                                    <td className="font-bold">$75.00</td>
                                    <td><span className="badge badge-sm badge-warning badge-outline">Processing</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <button className="btn btn-ghost btn-sm btn-block mt-4 text-primary">View All Claims History</button>
                </div>
            </div>
        </div>
    );
};

export default MyInsurancePage;
