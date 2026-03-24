const MyCalendarPage = () => {
    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold">Content Calendar</h1>
                    <p className="text-base-content/60">Schedule posts, view deadlines, and manage events.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="join mr-4">
                        <button className="btn btn-sm join-item">«</button>
                        <button className="btn btn-sm join-item pointer-events-none w-32 font-bold">October 2023</button>
                        <button className="btn btn-sm join-item">»</button>
                    </div>
                    <button className="btn btn-sm btn-primary">Add Event</button>
                </div>
            </div>

            <div className="flex-1 card bg-base-100 shadow-xl border border-base-200 overflow-hidden flex flex-col">
                <div className="grid grid-cols-7 border-b border-base-200 bg-base-200/50 text-center font-semibold text-sm py-3 flex-shrink-0">
                    <div className="text-error/70">Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div className="text-error/70">Sat</div>
                </div>
                
                <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
                    {/* Week 1 */}
                    <div className="border-r border-b border-base-200 p-1 bg-base-200/20 text-base-content/40 min-h-[100px]"><span className="p-1">1</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">2</span>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">3</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">4</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">5</span>
                        <div className="mt-1 flex flex-col gap-1">
                            <div className="text-xs p-1 bg-info/10 text-info border border-info/20 rounded truncate cursor-pointer hover:bg-info/20">Blog: Weekly Update</div>
                        </div>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">6</span></div>
                    <div className="border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">7</span></div>
                    
                    {/* Week 2 */}
                    <div className="border-r border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">8</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">9</span>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">10</span>
                        <div className="mt-1 flex flex-col gap-1">
                            <div className="text-xs p-1 bg-warning/10 text-warning-content border border-warning/20 rounded truncate cursor-pointer hover:bg-warning/20">Social: Campaign Launch</div>
                        </div>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">11</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">12</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">13</span></div>
                    <div className="border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">14</span></div>
                    
                    {/* Week 3 */}
                    <div className="border-r border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">15</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">16</span>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">17</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">18</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">19</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">20</span>
                        <div className="mt-1 flex flex-col gap-1">
                            <div className="text-xs p-1 bg-success/10 text-success border border-success/20 rounded truncate cursor-pointer hover:bg-success/20">Newsletter Send</div>
                        </div>
                    </div>
                    <div className="border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">21</span></div>
                    
                    {/* Week 4 - CURRENT WEEK */}
                    <div className="border-r border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">22</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">23</span></div>
                    <div className="border-r border-b border-base-200 p-1 bg-primary/5 min-h-[100px] relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                        <span className="p-1 inline-block bg-primary text-primary-content rounded-full w-7 h-7 text-center leading-5 mt-1 ml-1 font-bold shadow-md shadow-primary/30">24</span>
                        <div className="mt-2 flex flex-col gap-1">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-error ml-1">Today</div>
                            <div className="text-xs p-1 bg-error/10 text-error border border-error/20 rounded truncate cursor-pointer hover:bg-error/20 font-medium">DUE: Q3 Media Copy</div>
                            <div className="text-xs p-1 bg-primary/10 text-primary border border-primary/20 rounded truncate cursor-pointer hover:bg-primary/20">Review Assets</div>
                            <div className="text-xs p-1 bg-base-200 border border-base-300 rounded truncate cursor-pointer hover:bg-base-300">Sync: 10:00 AM</div>
                        </div>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]">
                        <span className="p-1 font-medium">25</span>
                    </div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">26</span></div>
                    <div className="border-r border-b border-base-200 p-1 min-h-[100px]"><span className="p-1 font-medium">27</span></div>
                    <div className="border-b border-base-200 p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">28</span></div>
                    
                    {/* Week 5 */}
                    <div className="border-r p-1 bg-base-200/20 text-base-content/60 min-h-[100px]"><span className="p-1">29</span></div>
                    <div className="border-r p-1 min-h-[100px]">
                        <span className="p-1 font-medium">30</span>
                        <div className="mt-1 flex flex-col gap-1">
                            <div className="text-xs p-1 bg-secondary/10 text-secondary border border-secondary/20 rounded truncate cursor-pointer hover:bg-secondary/20">DUE: Q4 Draft</div>
                        </div>
                    </div>
                    <div className="border-r p-1 min-h-[100px]"><span className="p-1 font-medium">31</span></div>
                    <div className="border-r p-1 bg-base-200/20 text-base-content/40 min-h-[100px]"><span className="p-1">1</span></div>
                    <div className="border-r p-1 bg-base-200/20 text-base-content/40 min-h-[100px]"><span className="p-1">2</span></div>
                    <div className="border-r p-1 bg-base-200/20 text-base-content/40 min-h-[100px]"><span className="p-1">3</span></div>
                    <div className="p-1 bg-base-200/20 text-base-content/40 min-h-[100px]"><span className="p-1">4</span></div>
                </div>
            </div>
        </div>
    );
};

export default MyCalendarPage;
