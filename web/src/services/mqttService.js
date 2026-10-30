import mqtt from 'mqtt';
import {
  MQTT_BROKER_URL,
  MQTT_TOPIC,
} from '../constants/thresholds';

/**
 * Cria e gerencia a conexão MQTT da aplicação Web.
 *
 * @param {{
 *   onMessage: (payload: string) => void,
 *   onStatus: (status: string) => void
 * }} callbacks
 *
 * @returns {{ destroy: () => void }}
 */
export function createMqttClient({ onMessage, onStatus }) {
  const clientId =
    `botanix_web_${Math.random().toString(16).slice(2, 10)}`;

  console.log('[MQTT] Iniciando...');
  console.log('[MQTT] Broker:', MQTT_BROKER_URL);
  console.log('[MQTT] Tópico:', MQTT_TOPIC);
  console.log('[MQTT] Client ID:', clientId);

  onStatus?.('connecting');

  const client = mqtt.connect(MQTT_BROKER_URL, {
    clientId,
    clean: true,
    reconnectPeriod: 3000,
    connectTimeout: 10000,
    keepalive: 30,
    protocolVersion: 4,
  });

  client.on('connect', () => {
    console.log('[MQTT] CONECTADO AO BROKER');

    onStatus?.('connected');

    client.subscribe(MQTT_TOPIC, { qos: 0 }, (err, granted) => {
      if (err) {
        console.error('[MQTT] ERRO AO ASSINAR:', err);
        onStatus?.('error');
        return;
      }

      console.log('[MQTT] INSCRITO NO TÓPICO:', MQTT_TOPIC);
      console.log('[MQTT] Granted:', granted);
    });
  });

  client.on('message', (topic, payload) => {
    const mensagem = payload.toString();

    console.log('============================');
    console.log('[MQTT] MENSAGEM RECEBIDA');
    console.log('[MQTT] Tópico:', topic);
    console.log('[MQTT] Payload:', mensagem);
    console.log('============================');

    if (topic === MQTT_TOPIC) {
      onMessage?.(mensagem);
    }
  });

  client.on('reconnect', () => {
    console.log('[MQTT] RECONECTANDO...');
    onStatus?.('connecting');
  });

  client.on('offline', () => {
    console.log('[MQTT] OFFLINE');
    onStatus?.('disconnected');
  });

  client.on('error', (err) => {
    console.error('[MQTT] ERRO:', err);
    onStatus?.('error');
  });

  return {
    destroy() {
      console.log('[MQTT] Encerrando cliente...');

      client.removeAllListeners();

      if (client.connected || client.reconnecting) {
        client.end(true);
      }
    },
  };
}