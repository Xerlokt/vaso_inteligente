import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { MQTT_BROKER, MQTT_PORT, MQTT_TOPIC } from '../constants/thresholds';

export function useMqtt() {
  const [lastMessage, setLastMessage] = useState(null);
  const [status, setStatus] = useState('connecting');
  const clientRef = useRef(null);

  useEffect(() => {
    const clientId = `botanix_rn_${Math.random().toString(16).slice(2, 8)}`;
    const client = mqtt.connect(`ws://${MQTT_BROKER}:${MQTT_PORT}/mqtt`, {
      clientId,
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      setStatus('connected');
      client.subscribe(MQTT_TOPIC);
    });

    client.on('message', (_topic, payload) => {
      setLastMessage(payload.toString());
    });

    client.on('error', () => setStatus('error'));
    client.on('close', () => setStatus('disconnected'));
    client.on('reconnect', () => setStatus('connecting'));

    clientRef.current = client;

    return () => {
      client.end(true);
    };
  }, []);

  return { lastMessage, status };
}
