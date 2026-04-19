import { useState, useEffect, useRef } from 'react';
import { MQTT_BROKER, MQTT_PORT, MQTT_TOPIC } from '../constants/thresholds';

export function useMqtt() {
  const [lastMessage, setLastMessage] = useState(null);
  const [status, setStatus] = useState('connecting');
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Paho.MQTT.Client(
      MQTT_BROKER,
      MQTT_PORT,
      '/mqtt',
      `botanix_rn_${Math.random().toString(16).slice(2, 8)}`
    );

    client.onMessageArrived = (message) => {
      setLastMessage(message.payloadString);
    };

    client.onConnectionLost = (response) => {
      if (response.errorCode !== 0) {
        setStatus('disconnected');
      }
    };

    client.connect({
      onSuccess: () => {
        setStatus('connected');
        client.subscribe(MQTT_TOPIC);
      },
      onFailure: () => {
        setStatus('error');
      },
      useSSL: false,
    });

    clientRef.current = client;

    return () => {
      if (client.isConnected()) client.disconnect();
    };
  }, []);

  return { lastMessage, status };
}
