import network
import time
import json
from umqtt.simple import MQTTClient
from machine import Pin, ADC
import dht

# Configurações da rede Wi-Fi
SSID = 'Carlos.Coelho'
PASSWORD = 'Co3lhoH@me'

# Configurações do broker MQTT
BROKER = 'broker.hivemq.com'
PORT = 1883
CLIENT_ID = 'esp32_client_id'
TOPICO_PUBLISH = 'sensor_dados_json_001'

# Configura o sensor DHT22 e o sensor de umidade de solo
sensor_dht = dht.DHT22(Pin(14))
umidade_solo_sensor = ADC(Pin(32))
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

def ler_dht():
    # Retorna (temperatura, umidade_ar) ou None se o DHT22 não responder
    for tentativa in range(2):
        try:
            sensor_dht.measure()
            return round(sensor_dht.temperature(), 2), round(sensor_dht.humidity(), 2)
        except Exception as e:
            print(f'DHT22 indisponível (tentativa {tentativa + 1}): {e}')
            time.sleep(2)  # DHT22 precisa de ~2s entre leituras
    return None

def ler_solo():
    # Retorna a umidade do solo em % ou None se a leitura falhar
    try:
        valor = umidade_solo_sensor.read() / 4095 * 100
        return round(100 - valor, 2)  # Inverte o valor
    except Exception as e:
        print(f'Sensor de solo indisponível: {e}')
        return None

def coletar_dados():
    # Inclui apenas os sensores que funcionaram
    dados = {}

    leitura_dht = ler_dht()
    if leitura_dht is not None:
        dados['temperatura'], dados['umidade_ar'] = leitura_dht

    umidade_solo = ler_solo()
    if umidade_solo is not None:
        dados['umidade_solo'] = umidade_solo

    return dados

def publicar_mqtt(client):
    dados = coletar_dados()

    if not dados:
        print('Nenhum sensor funcionando. Nada a publicar.')
        return

    print('Leitura atual dos sensores:', dados)
    client.publish(TOPICO_PUBLISH, json.dumps(dados))
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
