import network
import time
import machine
from machine import Pin, ADC
from dht import DHT22
from umqtt.simple import MQTTClient

# Configuração da rede Wi-Fi
ssid = 'nomeRede'
password = 'Senha'

# Conexão com a rede Wi-Fi
station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)

print("Conectando ao WiFi...")
while not station.isconnected():
    time.sleep(1)
print('Conectado ao WiFi')

# Configuração dos pinos
dht_pin = Pin(15)
dht_sensor = DHT22(dht_pin)
soil_moisture_pin = ADC(Pin(32))
soil_moisture_pin.atten(ADC.ATTN_11DB)
battery_pin = ADC(Pin(33))
battery_pin.atten(ADC.ATTN_11DB)

# Configuração do broker MQTT (HiveMQ)
mqtt_server = '955f29c5e6a74fd2a567c131e6ea7717.s1.eu.hivemq.cloud'  # URL do cluster HiveMQ #cluster fechado...
mqtt_port = 1883  # Porta para conexão não segura
client_id = 'ESP32_Sensor'
mqtt_topic_temp = 'sensores/temperatura'
mqtt_topic_hum = 'sensores/umidade'
mqtt_topic_soil = 'sensores/umidade_solo'
mqtt_topic_battery = 'sensores/bateria'

# Inicializando o cliente MQTT
client = MQTTClient(client_id, mqtt_server, port=mqtt_port)

# Tentar conectar ao broker MQTT
print(f"Tentando conectar ao broker MQTT em {mqtt_server} na porta {mqtt_port} com o client ID {client_id}")
try:
    client.connect()
    print("Conexão bem-sucedida ao broker MQTT")
except Exception as e:
    print(f"Erro ao conectar ao broker MQTT: {e}")
    print("Verifique o IP, porta, e se o broker está configurado corretamente.")

# Função para ler a porcentagem da bateria
def read_battery_percentage():
    battery_voltage = battery_pin.read() / 4095.0 * 3.3
    return min(100, max(0, (battery_voltage - 3.0) * 100 / (4.2 - 3.0)))

# Loop principal para coletar e enviar dados via MQTT
while True:
    try:
        # Coletando os dados do sensor DHT22
        time.sleep(2)  # Tempo para estabilizar o sensor
        dht_sensor.measure()
        temperature = dht_sensor.temperature()
        humidity = dht_sensor.humidity()

        # Coletando a umidade do solo
        soil_moisture = soil_moisture_pin.read() / 4095.0 * 100

        # Coletando o nível da bateria
        battery_percentage = read_battery_percentage()

        # Publicando os dados nos tópicos MQTT
        client.publish(mqtt_topic_temp, str(temperature))
        client.publish(mqtt_topic_hum, str(humidity))
        client.publish(mqtt_topic_soil, str(soil_moisture))
        client.publish(mqtt_topic_battery, str(battery_percentage))

        print(f'Dados publicados: Temp={temperature}°C, Umidade={humidity}%, Solo={soil_moisture}%, Bateria={battery_percentage}%')

        time.sleep(60)  # Enviar dados a cada 60 segundos

    except Exception as e:
        print(f'Erro ao coletar ou enviar dados: {e}')
        time.sleep(10)
