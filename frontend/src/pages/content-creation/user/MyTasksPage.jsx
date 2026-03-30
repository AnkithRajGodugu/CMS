import { useState, useMemo } from 'react';
import { FaPlus, FaTimes, FaSearch, FaEllipsisH, FaArrowRight } from 'react-icons/fa';
import { toast } from 'sonner';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'bg-base-content/20', ringColor: '' },
  { key: 'inProgress', label: 'In Progress', color: 'bg-primary', ringColor: 'border-primary/10 bg-primary/5' },
  { key: 'review', label: 'Review', color: 'bg-info', ringColor: 'border-info/10 bg-info/5' },
  { key: 'done', label: 'Done', color: 'bg-success', ringColor: 'border-success/10 bg-success/5' },
];

const getPriorityBadge = (p) => {
  if (p === 'High') return 'badge-error';
  if (p === 'Medium') return 'badge-warning';
  return 'badge-info';
};

let nextId = 100;

const MyTasksPage = () => {
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

  const [search, setSearch] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addToColumn, setAddToColumn] = useState('todo');
  const [newTask, setNewTask] = useState({ title: '', project: '', due: '', priority: 'Medium' });
  const [taskMenu, setTaskMenu] = useState(null); // { taskId, column }

  const allTasks = useMemo(() =>
    Object.values(tasks).flat(),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    const filtered = {};
    Object.entries(tasks).forEach(([col, items]) => {
      filtered[col] = items.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.project.toLowerCase().includes(q)
      );
    });
    return filtered;
  }, [tasks, search]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const task = { id: ++nextId, ...newTask };
    setTasks(prev => ({
      ...prev,
      [addToColumn]: [...prev[addToColumn], task]
    }));
    toast.success(`Task "${task.title}" added to ${COLUMNS.find(c => c.key === addToColumn)?.label}!`);
    setIsAddTaskOpen(false);
    setNewTask({ title: '', project: '', due: '', priority: 'Medium' });
  };

  const openAddForColumn = (col) => {
    setAddToColumn(col);
    setIsAddTaskOpen(true);
  };

  const moveTask = (taskId, fromCol, toCol) => {
    const task = tasks[fromCol].find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
      [toCol]: [...prev[toCol], task]
    }));
    toast.success(`"${task.title}" moved to ${COLUMNS.find(c => c.key === toCol)?.label}`);
    setTaskMenu(null);
  };

  const deleteTask = (taskId, col) => {
    const task = tasks[col].find(t => t.id === taskId);
    setTasks(prev => ({
      ...prev,
      [col]: prev[col].filter(t => t.id !== taskId)
    }));
    toast.error(`"${task?.title}" deleted`);
    setTaskMenu(null);
  };

  const getNextColumn = (currentCol) => {
    const idx = COLUMNS.findIndex(c => c.key === currentCol);
    return idx < COLUMNS.length - 1 ? COLUMNS[idx + 1].key : null;
  };

  const TaskCard = ({ task, column }) => (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:border-primary/30 transition-all">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`badge badge-xs ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
          <div className="relative">
            <button
              className="btn btn-ghost btn-xs px-1 hover:bg-base-200 text-base-content/50"
              onClick={(e) => {
                e.stopPropagation();
                setTaskMenu(taskMenu?.taskId === task.id ? null : { taskId: task.id, column });
              }}
            >
              <FaEllipsisH className="w-4 h-4" />
            </button>
            {taskMenu?.taskId === task.id && taskMenu?.column === column && (
              <div className="absolute right-0 top-8 z-50 bg-base-100 border border-base-200 rounded-xl shadow-2xl p-2 w-44 space-y-1">
                {getNextColumn(column) && (
                  <button
                    className="btn btn-ghost btn-xs w-full justify-start gap-2 text-primary"
                    onClick={() => moveTask(task.id, column, getNextColumn(column))}
                  >
                    <FaArrowRight /> Move to {COLUMNS.find(c => c.key === getNextColumn(column))?.label}
                  </button>
                )}
                {COLUMNS.filter(c => c.key !== column).map(c => (
                  c.key !== getNextColumn(column) && (
                    <button
                      key={c.key}
                      className="btn btn-ghost btn-xs w-full justify-start gap-2"
                      onClick={() => moveTask(task.id, column, c.key)}
                    >
                      → {c.label}
                    </button>
                  )
                ))}
                <div className="divider my-1 opacity-30"></div>
                <button
                  className="btn btn-ghost btn-xs w-full justify-start gap-2 text-error"
                  onClick={() => deleteTask(task.id, column)}
                >
                  <FaTimes /> Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-sm leading-tight mb-2">{task.title}</h3>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-base-200">
          <div className="text-xs font-mono bg-base-200 px-2 py-1 rounded text-base-content/70">{task.project}</div>
          <div className={`text-xs font-medium flex items-center gap-1 ${task.due === 'Today' ? 'text-error' : 'text-base-content/60'}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {task.due}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}
      onClick={() => taskMenu && setTaskMenu(null)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-base-content/60">Organize and track your content creation workflow. ({allTasks.length} tasks)</p>
        </div>
        <div className="flex gap-2">
          <div className="join">
            <div className="join-item input input-sm input-bordered flex items-center gap-2 bg-base-100">
              <FaSearch className="text-base-content/30 text-xs" />
              <input
                className="bg-transparent outline-none text-sm w-32"
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-ghost btn-xs btn-circle" onClick={() => setSearch('')}><FaTimes className="text-xs" /></button>
              )}
            </div>
          </div>
          <button className="btn btn-sm btn-primary gap-1" onClick={() => openAddForColumn('todo')}>
            <FaPlus /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-8 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks[col.key] || [];
          return (
            <div
              key={col.key}
              className={`w-80 flex-shrink-0 flex flex-col h-full rounded-xl p-3 border shadow-inner ${col.ringColor || 'bg-base-200/50 border-base-300'}`}
            >
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="font-bold flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${col.color} ${col.key === 'inProgress' ? 'animate-pulse' : ''}`}></span>
                  {col.label}
                  <span className={`badge badge-sm badge-ghost`}>{colTasks.length}</span>
                </h2>
                <button
                  className="btn btn-ghost btn-xs text-primary font-bold"
                  onClick={() => openAddForColumn(col.key)}
                >
                  +
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {colTasks.length === 0 && search ? (
                  <p className="text-center opacity-30 italic text-xs py-4">No matches</p>
                ) : (
                  colTasks.map(task => <TaskCard key={task.id} task={task} column={col.key} />)
                )}
                <button
                  className="btn btn-ghost btn-sm w-full text-base-content/50 border border-dashed border-base-300 mt-2 gap-1"
                  onClick={() => openAddForColumn(col.key)}
                >
                  <FaPlus className="text-xs" /> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaPlus className="text-primary" /> Add Task to {COLUMNS.find(c => c.key === addToColumn)?.label}
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsAddTaskOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="form-control">
                <label className="label text-sm">Task Title</label>
                <input
                  type="text"
                  className="input input-bordered"
                  required
                  autoFocus
                  placeholder="e.g. Write blog post..."
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label text-sm">Project</label>
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    placeholder="e.g. Marketing"
                    value={newTask.project}
                    onChange={e => setNewTask({...newTask, project: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label text-sm">Due</label>
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    placeholder="e.g. Tomorrow"
                    value={newTask.due}
                    onChange={e => setNewTask({...newTask, due: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label text-sm">Priority</label>
                <select className="select select-bordered select-sm"
                  value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label text-sm">Add to Column</label>
                <select className="select select-bordered select-sm"
                  value={addToColumn} onChange={e => setAddToColumn(e.target.value)}>
                  {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsAddTaskOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm text-white gap-1"><FaPlus /> Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
