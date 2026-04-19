import { useState, useEffect, useRef } from 'react';
import { createMqttClient } from '../services/mqttService';

/**
 * @returns {{ lastMessage: string | null, status: string }}
 */
export function useMqtt() {
  const [lastMessage, setLastMessage] = useState(null);
  const [status, setStatus] = useState('connecting');
  const clientRef = useRef(null);

  useEffect(() => {
    const instance = createMqttClient({
      onMessage: setLastMessage,
      onStatus: setStatus,
    });
    clientRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, []);

  return { lastMessage, status };
}
