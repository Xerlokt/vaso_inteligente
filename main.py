import dht
import machine
import json
import time

# Configurações dos sensores
dht_pin = machine.Pin(24, machine.Pin.IN)  # Pino onde o DHT22 está conectado
dht_sensor = dht.DHT22(dht_pin)            # Inicializa o sensor DHT22

soil_moisture_pin = machine.Pin(32)        # Pino para o sensor de umidade do solo
soil_moisture_sensor = machine.ADC(soil_moisture_pin)  # Configura ADC para leitura analógica
soil_moisture_sensor.atten(machine.ADC.ATTN_11DB)      # Ajuste da faixa de tensão (0 a 3.6V)

battery_pin = machine.ADC(machine.Pin(34)) # Pino ADC para medir a tensão da bateria
battery_pin.atten(machine.ADC.ATTN_11DB)   # Ajuste para medir tensões até 3.6V

# Função para calcular o nível de bateria
def calcular_percentual_bateria():
    leitura_bateria = battery_pin.read()    # Leitura analógica da bateria (0-4095)
    tensao_bateria = leitura_bateria / 4095.0 * 3.6  # Converte para tensão (0 a 3.6V)

    # Mapeamento da tensão para percentual (aproximado)
    if tensao_bateria >= 4.2:
        return 100
    elif tensao_bateria <= 3.0:
        return 0
    else:
        # Calcula o percentual com base em uma faixa de 3.0V (0%) a 4.2V (100%)
        return (tensao_bateria - 3.0) / (4.2 - 3.0) * 100

def ler_sensores():
    # Lê temperatura e umidade do ar do sensor DHT22
    dht_sensor.measure()
    temperatura = dht_sensor.temperature()  # Temperatura em graus Celsius
    umidade_ar = dht_sensor.humidity()      # Umidade do ar em porcentagem (%)

    # Lê umidade do solo
    leitura_analogica_solo = soil_moisture_sensor.read()  # Valor analógico (0 a 4095)
    umidade_solo = 100 - (leitura_analogica_solo / 4095.0 * 100)  # Converte para porcentagem

    # Calcula o nível de bateria em porcentagem
    percentual_bateria = calcular_percentual_bateria()

    # Cria um dicionário com as leituras
    dados_sensores = {
        "temperatura_ambiente": temperatura,
        "umidade_ar": umidade_ar,
        "umidade_solo": umidade_solo,
        "nivel_bateria": percentual_bateria  # Percentual da bateria
    }

    return dados_sensores

def exibir_dados_json():
    # Obtém os dados dos sensores
    dados = ler_sensores()

    # Converte o dicionário para formato JSON
    dados_json = json.dumps(dados, indent=4)  # 'indent=4' para formatar o JSON de maneira mais legível
    print(dados_json)

# Loop principal: lê e exibe os dados a cada 2 segundos
while True:
    exibir_dados_json()
    time.sleep(2)  # Aguarda 2 segundos antes da próxima leitura
