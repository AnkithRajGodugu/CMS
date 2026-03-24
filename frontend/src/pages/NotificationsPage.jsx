import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const NotificationsPage = () => {
    const { notifications, unreadCount, markAllRead, markRead } = useContext(NotificationContext);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center sm:items-end border-b border-base-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} New</span>}
                    </h1>
                    <p className="text-base-content/60 mt-1">Stay updated with system alerts and account activities.</p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn btn-sm btn-outline text-primary" onClick={markAllRead}>
                        Mark All as Read
                    </button>
                )}
            </div>

            <div className="tabs tabs-boxed bg-base-200/50 p-1 w-fit mb-6">
                <button className="tab px-6 tab-active bg-primary text-primary-content">All</button>
                <button className="tab px-6">Unread</button>
                <button className="tab px-6">System</button>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-base-content/50">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <p>No new notifications at this time.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`card shadow-sm border ${notif.read ? 'bg-base-100 border-base-200' : 'bg-primary/5 border-primary/20'} transition-colors`}>
                            <div className="card-body p-4 sm:p-5 flex-row gap-4 items-start">
                                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.read ? 'bg-base-200 text-base-content/50' : 'bg-primary/20 text-primary'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-base sm:text-lg ${notif.read ? 'text-base-content/80' : 'text-base-content'}`}>{notif.title}</h3>
                                        <span className="text-xs text-base-content/50 font-mono whitespace-nowrap ml-4">
                                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 ${notif.read ? 'text-base-content/60' : 'text-base-content/80'}`}>{notif.message}</p>
                                    
                                    {!notif.read && (
                                        <button 
                                            className="btn btn-ghost btn-xs text-primary mt-3 hover:bg-primary/10"
                                            onClick={() => markRead(notif.id)}
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                                {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
