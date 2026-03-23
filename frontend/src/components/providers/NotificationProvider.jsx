import React, { useEffect, useRef, useState, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { AuthContext } from '../../context/auth';
import { NotificationContext } from '../../context/NotificationContext';

const WS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8082'}/ws`;

export const NotificationProvider = ({ children }) => {
  const { user, sector, isAuthenticated } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => {
        if (import.meta.env.DEV) console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setConnected(true);
      console.log('Connected to WebSocket');

      // 1. Subscribe to Sector Updates
      if (sector?.code) {
        const sectorTopic = `/topic/${sector.code.toLowerCase()}/updates`;
        client.subscribe(sectorTopic, (message) => {
          const notification = JSON.parse(message.body);
          handleIncomingNotification(notification, 'sector');
        });
        console.log(`Subscribed to ${sectorTopic}`);
      }

      // 2. Subscribe to Private User Notifications
      const userQueue = `/user/queue/notifications`;
      client.subscribe(userQueue, (message) => {
        const notification = JSON.parse(message.body);
        handleIncomingNotification(notification, 'private');
      });
      console.log(`Subscribed to ${userQueue}`);
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.onDisconnect = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [isAuthenticated, user, sector?.code]);

  const handleIncomingNotification = (notification, source) => {
    const { type, message, data } = notification;

    // Show toast with custom styling based on type
    toast(message || 'New update received', {
      description: source === 'sector' ? `Sector: ${sector?.name}` : 'Private',
      action: data?.link ? {
        label: 'View',
        onClick: () => window.location.href = data.link
      } : null,
    });
  };

  return (
    <NotificationContext.Provider value={{ connected }}>
      {children}
    </NotificationContext.Provider>
  );
};
