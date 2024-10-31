import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Client } from 'mqtt';

export default function App() {
  const [data, setData] = useState({
    temperature: null,
    humidity: null,
    soilMoisture: null,
    batteryPercentage: null,
  });

  useEffect(() => {
    // Configuração do cliente MQTT
    const client = new Client({
      uri: 'mqtt://IP_DO_BROKER:1883', // Substitua pelo IP do seu broker MQTT
      clientId: 'ReactNativeClient',
    });

    client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
      client.subscribe('sensores/temperatura');
      client.subscribe('sensores/umidade');
      client.subscribe('sensores/umidade_solo');
      client.subscribe('sensores/bateria');
    });

    client.on('message', (topic, message) => {
      const value = parseFloat(message.toString());
      setData((prevData) => {
        switch (topic) {
          case 'sensores/temperatura':
            return { ...prevData, temperature: value };
          case 'sensores/umidade':
            return { ...prevData, humidity: value };
          case 'sensores/umidade_solo':
            return { ...prevData, soilMoisture: value };
          case 'sensores/bateria':
            return { ...prevData, batteryPercentage: value };
          default:
            return prevData;
        }
      });
    });

    client.connect();

    return () => {
      client.disconnect();
    };
  }, []);

  if (!data.temperature || !data.humidity || !data.soilMoisture || !data.batteryPercentage) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoramento de Sensores</Text>
      <Text style={styles.label}>Temperatura: {data.temperature}°C</Text>
      <Text style={styles.label}>Umidade do Ar: {data.humidity}%</Text>
      <Text style={styles.label}>Umidade do Solo: {data.soilMoisture}%</Text>
      <Text style={styles.label}>Bateria: {data.batteryPercentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
});
