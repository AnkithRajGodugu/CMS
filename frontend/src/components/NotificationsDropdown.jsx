import { useContext, useState } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';

/**
 * NotificationsDropdown — reads from NotificationContext (single shared STOMP connection).
 * No WebSocket code here; NotificationProvider owns the ws lifecycle.
 */
const NotificationsDropdown = () => {
  const { notifications, unreadCount, connected, markRead, markAllRead } =
    useContext(NotificationContext);
  const [open, setOpen] = useState(false);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
    } catch (_) { /* best-effort */ }
    markAllRead();
  };

  return (
    <div className="dropdown dropdown-end">
      {/* Bell Button */}
      <button
        id="notifications-bell"
        tabIndex={0}
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
      >
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="badge badge-xs badge-primary indicator-item">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-base-200 mb-1">
            <span className="font-semibold text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              <span
                className={`badge badge-xs ${connected ? 'badge-success' : 'badge-ghost'}`}
                title={connected ? 'Live' : 'Offline'}
              >
                {connected ? '● Live' : '○ Offline'}
              </span>
              {unreadCount > 0 && (
                <button
                  className="text-xs text-primary underline"
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-sm py-6 text-base-content/50">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`px-3 py-2 rounded-lg mb-1 text-sm cursor-pointer ${
                  n.read ? 'opacity-60' : 'bg-primary/5 border-l-2 border-primary'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary capitalize">
                    {n.title || n.type || 'Event'}
                  </span>
                  <span className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <p className="text-base-content/70 mt-0.5 text-xs leading-relaxed">
                  {typeof n.message === 'string' ? n.message : JSON.stringify(n.message || '')}
                </p>
                {n.link && (
                  <a href={n.link} className="text-xs text-primary underline mt-1 block">
                    View details
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
