import { useState, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const typeIcons = {
    APPOINTMENT: { icon: '🗓️', color: 'text-blue-500', bg: 'bg-blue-50' },
    TRANSACTION: { icon: '💳', color: 'text-green-600', bg: 'bg-green-50' },
    CLAIM: { icon: '📋', color: 'text-purple-500', bg: 'bg-purple-50' },
    SECURITY: { icon: '🔐', color: 'text-red-500', bg: 'bg-red-50' },
    SYSTEM: { icon: '⚙️', color: 'text-base-content/60', bg: 'bg-base-200' },
};

function relativeTime(isoString) {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const NotificationsPage = () => {
    const { notifications, unreadCount, markAllRead, markRead } = useContext(NotificationContext);
    const [activeTab, setActiveTab] = useState('all');

    const filtered = notifications.filter(n => {
        if (activeTab === 'unread') return !n.read;
        if (activeTab === 'system') return n.type === 'SYSTEM' || n.type === 'SECURITY';
        return true;
    });

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-base-200 pb-5">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="badge badge-primary badge-md animate-pulse">{unreadCount} New</span>
                        )}
                    </h1>
                    <p className="text-base-content/60 mt-1 text-sm">Stay updated with your activity and alerts.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        className="btn btn-sm btn-outline text-primary border-primary/30 hover:bg-primary/10"
                        onClick={markAllRead}
                    >
                        ✓ Mark All Read
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-base-200/60 rounded-xl p-1 w-fit">
                {['all', 'unread', 'system'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                            activeTab === tab
                                ? 'bg-primary text-primary-content shadow'
                                : 'text-base-content/60 hover:text-base-content'
                        }`}
                    >
                        {tab === 'unread' ? `Unread (${unreadCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-base-content/40">
                        <div className="text-5xl mb-4">🔔</div>
                        <p className="font-medium">No notifications here yet.</p>
                        <p className="text-sm mt-1">
                            {activeTab === 'unread' ? 'You\'re all caught up!' : 'Activity will appear here.'}
                        </p>
                    </div>
                ) : (
                    filtered.map((notif) => {
                        const style = typeIcons[notif.type] || typeIcons['SYSTEM'];
                        const card = (
                            <div
                                key={notif.id}
                                className={`card border transition-all duration-200 hover:shadow-md ${
                                    notif.read
                                        ? 'bg-base-100 border-base-200'
                                        : 'bg-primary/5 border-primary/25 shadow-sm'
                                }`}
                            >
                                <div className="card-body p-4 sm:p-5 flex-row gap-4 items-start">
                                    {/* Icon */}
                                    <div className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${style.bg}`}>
                                        {style.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className={`font-semibold text-sm sm:text-base leading-snug ${notif.read ? 'text-base-content/75' : 'text-base-content'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-xs text-base-content/45 whitespace-nowrap flex-shrink-0 font-mono">
                                                {relativeTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-1 leading-relaxed ${notif.read ? 'text-base-content/55' : 'text-base-content/75'}`}>
                                            {notif.message}
                                        </p>
                                        {!notif.read && (
                                            <button
                                                className="btn btn-ghost btn-xs text-primary mt-2 hover:bg-primary/10 -ml-2"
                                                onClick={(e) => { e.preventDefault(); markRead(notif.id); }}
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>

                                    {/* Unread dot */}
                                    {!notif.read && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        );

                        return notif.link ? (
                            <Link key={notif.id} to={notif.link} className="block no-underline">
                                {card}
                            </Link>
                        ) : (
                            <div key={notif.id}>{card}</div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
