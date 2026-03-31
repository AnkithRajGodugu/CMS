import { createContext } from 'react';

/**
 * NotificationContext
 *
 * Shape of context value:
 * {
 *   notifications: Array<{ id, type, title, message, read, createdAt, link? }>,
 *   unreadCount: number,
 *   connected: boolean,
 *   addNotification: (notification) => void,
 *   markRead: (id) => void,
 *   markAllRead: () => void,
 *   clearAll: () => void,
 * }
 */
export const NotificationContext = createContext({
    notifications: [],
    unreadCount: 0,
    connected: false,
    addNotification: () => {},
    markRead: () => {},
    markAllRead: () => {},
    clearAll: () => {},
});
