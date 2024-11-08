import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Inicializa a biblioteca MQTT
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

const App = () => {
  const [humidityAir, setHumidityAir] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humiditySoil, setHumiditySoil] = useState(null);

  useEffect(() => {
    const mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8000, '/mqtt', 'react_native_client_id');

    mqttClient.onMessageArrived = (message) => {
      try {
        const data = JSON.parse(message.payloadString);
        setHumidityAir(data.umidade_ar);
        setTemperature(data.temperatura);
        setHumiditySoil(data.umidade_solo);
      } catch (error) {
        console.error('Failed to parse incoming message:', error);
      }
    };

    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection Lost:', responseObject.errorMessage);
      }
    };

    mqttClient.connect({
      onSuccess: () => {
        console.log('Connected to MQTT Broker');
        mqttClient.subscribe('sensor_dados_json_001');
      },
      onFailure: (err) => {
        console.error('Connection failed: ', err);
      },
      useSSL: false,
    });

    return () => {
      if (mqttClient.isConnected()) {
        mqttClient.disconnect();
        console.log('Disconnected from MQTT Broker');
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Umidade do Solo: {humiditySoil !== null ? `${humiditySoil.toFixed(1)}%` : 'Carregando...'}
      </Text>
      <Text style={styles.text}>
        Temperatura: {temperature !== null ? `${temperature.toFixed(1)}°C` : 'Carregando...'}
      </Text>
      <Text style={styles.text}>
        Umidade do Ar: {humidityAir !== null ? `${humidityAir.toFixed(1)}%` : 'Carregando...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
});

export default App;