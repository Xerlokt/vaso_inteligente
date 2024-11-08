import network
import time
import json
from umqtt.simple import MQTTClient
import random
from machine import Pin
import dht
from machine import ADC

# Configurações da rede Wi-Fi
SSID = 'Carlos.Coelho'
PASSWORD = 'qwer1234'

# Configurações do broker MQTT
BROKER = 'broker.hivemq.com'
PORT = 1883
CLIENT_ID = 'esp32_client_id'
TOPICO_PUBLISH = 'sensor_dados_json_001'

# Configura o sensor DHT22 e o sensor de umidade de solo
sensor_dht = dht.DHT22(Pin(14))
umidade_solo_sensor = ADC(Pin(33))
umidade_solo_sensor.atten(ADC.ATTN_11DB)  # Configuração para leitura de faixa completa

def conectar_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        print('Conectando ao Wi-Fi...')
        time.sleep(1)

    print('Conectado ao Wi-Fi:', wlan.ifconfig())
    return wlan

def ler_sensores():
    # Leitura dos sensores
    sensor_dht.measure()
    temperatura = sensor_dht.temperature()
    umidade_ar = sensor_dht.humidity()
    umidade_solo = umidade_solo_sensor.read() / 4095 * 100  # Converte para percentual

    print(f"Leitura atual dos sensores - Umidade do Solo: {umidade_solo}%, Temperatura: {temperatura}°C, Umidade do Ar: {umidade_ar}%")
    return umidade_solo, temperatura, umidade_ar

def publicar_mqtt(client):
    umidade_solo, temperatura, umidade_ar = ler_sensores()
    dados = {
        "umidade_solo": umidade_solo,
        "temperatura": temperatura,
        "umidade_ar": umidade_ar
    }
    dados_json = json.dumps(dados)
    client.publish(TOPICO_PUBLISH, dados_json)
    print(f'Dados publicados no tópico {TOPICO_PUBLISH}')

def main():
    wlan = conectar_wifi()
    client = MQTTClient(CLIENT_ID, BROKER, port=PORT)
    client.connect()
    print(f'Conectado ao broker MQTT {BROKER}')

    try:
        while True:
            publicar_mqtt(client)
            time.sleep(15)  # Publica a cada 15 segundos
    except KeyboardInterrupt:
        print("\nInterrupção detectada. Desconectando do broker MQTT...")
    finally:
        client.disconnect()
        print('Desconectado do broker MQTT')
        wlan.active(False)
        print('Desconectado do Wi-Fi')

if __name__ == '__main__':
    main()
