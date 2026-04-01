import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { AuthContext } from '../../context/auth';
import { NotificationContext } from '../../context/NotificationContext';
import { getToken } from '../../utils/auth';
import api from '../../services/api';

const WS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/ws`;

export const NotificationProvider = ({ children }) => {
  const { user, sector, isAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  // Derived
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch initial notification history from REST API
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    api.get('/notifications?page=0&size=50')
      .then(res => {
        if (res.data?.notifications) {
          setNotifications(res.data.notifications.map(n => ({
            id: n.id,
            type: n.type || 'SYSTEM',
            title: n.title || 'Notification',
            message: n.message || '',
            read: n.read,
            createdAt: n.createdAt,
            link: n.link || null,
          })));
        }
      })
      .catch(err => console.warn('Could not fetch notification history:', err));
  }, [isAuthenticated, user?.id]);

  // Add a notification to the list (from live WebSocket)
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [
      {
        id: notification.id || Date.now(),
        type: notification.type || 'INFO',
        title: notification.title || notification.type || 'Notification',
        message: notification.message || (typeof notification.payload === 'string' ? notification.payload : JSON.stringify(notification.payload || '')),
        read: false,
        createdAt: notification.timestamp || new Date().toISOString(),
        link: notification.data?.link || notification.link || null,
      },
      ...prev.slice(0, 99), // keep max 100
    ]);
  }, []);

  const markRead = useCallback((id) => {
    api.post(`/notifications/${id}/read`).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    api.post('/notifications/read-all').catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
      return;
    }

    const token = getToken();
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}?token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        if (import.meta.env.DEV) console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setConnected(true);
      console.log('NotificationProvider: Connected to WebSocket');

      // 1. Subscribe to Sector Updates
      if (sector?.code) {
        const sectorTopic = `/topic/${sector.code.toLowerCase()}/updates`;
        client.subscribe(sectorTopic, (message) => {
          try {
            const notification = JSON.parse(message.body);
            addNotification(notification);
            toast(notification.message || 'New sector update', {
              description: `Sector: ${sector?.name || sector?.code}`,
              action: notification.data?.link ? {
                label: 'View',
                onClick: () => window.location.href = notification.data.link,
              } : null,
            });
          } catch (e) {
            console.error('Failed to parse sector notification:', e);
          }
        });
        console.log(`Subscribed to ${sectorTopic}`);
      }

      // 2. Subscribe to Private User Notifications
      const userQueue = `/user/queue/notifications`;
      client.subscribe(userQueue, (message) => {
        try {
          const notification = JSON.parse(message.body);
          addNotification(notification);
          toast(notification.message || 'New notification', {
            description: 'Private',
            action: notification.data?.link ? {
              label: 'View',
              onClick: () => window.location.href = notification.data.link,
            } : null,
          });
        } catch (e) {
          console.error('Failed to parse private notification:', e);
        }
      });
      console.log(`Subscribed to ${userQueue}`);
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    client.onDisconnect = () => {
      setConnected(false);
      console.log('NotificationProvider: Disconnected from WebSocket');
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [isAuthenticated, user?.id, sector?.code, addNotification]);

  const contextValue = {
    notifications,
    unreadCount,
    connected,
    addNotification,
    markRead,
    markAllRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
