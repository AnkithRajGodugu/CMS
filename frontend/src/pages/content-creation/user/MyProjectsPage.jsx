const MyProjectsPage = () => {
    const projects = [
        {
            id: 'PRJ-24A',
            name: 'Website Rebrand 2024',
            description: 'Overhaul of main corporate website focusing on modern aesthetic and improved conversion rates.',
            progress: 75,
            status: 'On Track',
            dueDate: 'Nov 15, 2023',
            team: ['SJ', 'MR', 'AK'],
            tasksTotal: 24,
            tasksDone: 18,
            color: 'primary'
        },
        {
            id: 'PRJ-24B',
            name: 'Q4 Product Launch Campaign',
            description: 'Multi-channel marketing campaign for the new Analytics Pro feature set.',
            progress: 30,
            status: 'At Risk',
            dueDate: 'Oct 31, 2023',
            team: ['MR', 'TJ'],
            tasksTotal: 45,
            tasksDone: 14,
            color: 'error'
        },
        {
            id: 'PRJ-24C',
            name: 'Annual Security Compliance Report',
            description: 'Gather and format all necessary documentation for Q4 SOC2 audit.',
            progress: 90,
            status: 'On Track',
            dueDate: 'Oct 28, 2023',
            team: ['AK'],
            tasksTotal: 10,
            tasksDone: 9,
            color: 'success'
        },
        {
            id: 'PRJ-24D',
            name: 'Customer Success Video Series',
            description: 'Produce 5 short interviews with top clients for the YouTube channel.',
            progress: 15,
            status: 'Delayed',
            dueDate: 'Dec 01, 2023',
            team: ['SJ', 'TJ', 'ML', 'RS'],
            tasksTotal: 15,
            tasksDone: 2,
            color: 'warning'
        }
    ];

    const getStatusBadge = (status) => {
        if (status === 'On Track') return 'badge-success badge-outline';
        if (status === 'At Risk') return 'badge-error badge-outline';
        if (status === 'Delayed') return 'badge-warning badge-outline';
        return 'badge-ghost';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold">My Projects</h1>
                    <p className="text-base-content/60">Track high-level progress of your assigned initiatives.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm">Filter</button>
                    <button className="btn btn-primary btn-sm">New Project</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="card-body p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-xs font-mono font-bold opacity-50">{project.id}</div>
                                <span className={`badge badge-sm font-medium ${getStatusBadge(project.status)}`}>{project.status}</span>
                            </div>
                            
                            <h2 className="card-title text-xl mb-1 group-hover:text-primary transition-colors">{project.name}</h2>
                            <p className="text-sm text-base-content/70 line-clamp-2 h-10 mb-4">{project.description}</p>
                            
                            <div className="my-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-semibold">Progress</span>
                                    <span className="text-sm font-bold text-base-content/70">{project.progress}%</span>
                                </div>
                                <progress className={`progress progress-${project.color} w-full`} value={project.progress} max="100"></progress>
                            </div>

                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-base-200">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs uppercase tracking-wider font-semibold opacity-50">Due Date</span>
                                    <span className={`text-sm font-medium ${project.color === 'error' ? 'text-error' : ''}`}>{project.dueDate}</span>
                                </div>
                                
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs uppercase tracking-wider font-semibold opacity-50">Team</span>
                                    <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                                        {project.team.map((initials, idx) => (
                                            <div key={idx} className="avatar placeholder">
                                                <div className="w-8 bg-neutral text-neutral-content">
                                                    <span className="text-xs">{initials}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProjectsPage;
