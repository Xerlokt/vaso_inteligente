import mqtt from 'mqtt';
import { MQTT_BROKER_URL, MQTT_TOPIC } from '../constants/thresholds';

/**
 * @param {{ onMessage: (payload: string) => void, onStatus: (status: string) => void }} options
 * @returns {{ destroy: () => void }}
 */
export function createMqttClient({ onMessage, onStatus }) {
  const clientId = `botanix_web_${Math.random().toString(16).slice(2, 10)}`;

  const client = mqtt.connect(MQTT_BROKER_URL, {
    clientId,
    reconnectPeriod: 3000,
    connectTimeout: 10000,
    clean: true,
    keepalive: 30,
  });

  onStatus('connecting');

  client.on('connect', () => {
    onStatus('connected');
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) console.error('[MQTT] subscribe error:', err);
    });
  });

  client.on('message', (_topic, payload) => {
    onMessage(payload.toString());
  });

  client.on('reconnect', () => onStatus('connecting'));
  client.on('disconnect', () => onStatus('disconnected'));
  client.on('error', () => onStatus('error'));
  client.on('offline', () => onStatus('disconnected'));

  return {
    destroy() {
      client.end(true);
    },
  };
}
