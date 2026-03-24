import { useState } from 'react';

const MyTasksPage = () => {
    // Simple state for demonstration. A real app would use a proper drag-and-drop library like dnd-kit or react-beautiful-dnd
    const [tasks, setTasks] = useState({
        todo: [
            { id: 1, title: 'Draft Q4 Newsletter', project: 'Marketing', due: 'Oct 30', priority: 'Medium' },
            { id: 2, title: 'Update Team Bios on About Page', project: 'Website Ops', due: 'Nov 05', priority: 'Low' },
            { id: 3, title: 'Research Competitor SEO strategies', project: 'Growth', due: 'Next Week', priority: 'Medium' }
        ],
        inProgress: [
            { id: 4, title: 'Finalize Q3 Social Media Copy', project: 'Q3 Marketing', due: 'Today', priority: 'High' },
            { id: 5, title: 'Write Blog Post: Top 10 Industry Trends', project: 'Content Blog', due: 'Tomorrow', priority: 'Medium' }
        ],
        review: [
            { id: 6, title: 'Review new homepage assets', project: 'Rebranding', due: 'Today', priority: 'High' }
        ],
        done: [
            { id: 7, title: 'Write October Press Release', project: 'PR', due: 'Oct 15', priority: 'Medium' },
            { id: 8, title: 'Proofread Case Study: Acme Corp', project: 'Sales Enablement', due: 'Oct 20', priority: 'Low' }
        ]
    });

    const getPriorityBadge = (p) => {
        if (p === 'High') return 'badge-error';
        if (p === 'Medium') return 'badge-warning';
        return 'badge-info';
    };

    const TaskCard = ({ task }) => (
        <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing">
            <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className={`badge badge-xs ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                    <button className="btn btn-ghost btn-xs px-1 hover:bg-base-200 text-base-content/50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>
                <h3 className="font-semibold text-sm leading-tight mb-2">{task.title}</h3>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-base-200">
                    <div className="text-xs font-mono bg-base-200 px-2 py-1 rounded text-base-content/70">{task.project}</div>
                    <div className={`text-xs font-medium flex items-center gap-1 ${task.due === 'Today' ? 'text-error' : 'text-base-content/60'}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {task.due}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold">My Tasks</h1>
                    <p className="text-base-content/60">Organize and track your content creation workflow.</p>
                </div>
                <div className="flex gap-2">
                    <div className="join">
                        <input className="input input-sm input-bordered join-item" placeholder="Search tasks..." />
                        <button className="btn btn-sm btn-ghost join-item border border-base-200 bg-base-100">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </button>
                    </div>
                    <button className="btn btn-sm btn-primary">Add Task</button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start pb-8">
                
                {/* To Do Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full bg-base-200/50 rounded-xl p-3 border border-base-300 shadow-inner">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="font-bold flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-base-content/20"></span>
                            To Do
                            <span className="badge badge-sm badge-ghost">{tasks.todo.length}</span>
                        </h2>
                        <button className="btn btn-ghost btn-xs">+</button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                        {tasks.todo.map(task => <TaskCard key={task.id} task={task} />)}
                        <button className="btn btn-ghost btn-sm w-full text-base-content/50 border border-dashed border-base-300 mt-2">+ Add Task</button>
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full bg-primary/5 rounded-xl p-3 border border-primary/10 shadow-inner">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="font-bold flex items-center gap-2 text-primary">
                            <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                            In Progress
                            <span className="badge badge-sm badge-primary badge-outline">{tasks.inProgress.length}</span>
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                        {tasks.inProgress.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>

                {/* Review Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full bg-info/5 rounded-xl p-3 border border-info/10 shadow-inner">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="font-bold flex items-center gap-2 text-info">
                            <span className="w-3 h-3 rounded-full bg-info"></span>
                            Review
                            <span className="badge badge-sm badge-info badge-outline">{tasks.review.length}</span>
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                        {tasks.review.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>

                {/* Done Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full bg-success/5 rounded-xl p-3 border border-success/10 shadow-inner">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="font-bold flex items-center gap-2 text-success">
                            <span className="w-3 h-3 rounded-full bg-success"></span>
                            Done
                            <span className="badge badge-sm badge-success badge-outline">{tasks.done.length}</span>
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                        {tasks.done.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>

            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--bc) / 0.2); border-radius: 4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: hsl(var(--bc) / 0.3); }
            `}</style>
        </div>
    );
};

export default MyTasksPage;
