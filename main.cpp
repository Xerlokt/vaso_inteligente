#include "DHTesp.h"
#include <ArduinoJson.h>  // Biblioteca para lidar com JSON

// Definição dos pinos
const int DHT_PIN = 24;
const int SOIL_MOISTURE_PIN = 32;
const int BATTERY_PIN = 34;

// Sensores
DHTesp dhtSensor;
int soil_moisture_value;
float battery_voltage;

// Configuração inicial
void setup() {
  Serial.begin(115200);
  
  // Inicializa o sensor DHT22
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  // Configura o ADC do ESP32 para a leitura da umidade do solo e da bateria
  analogSetAttenuation(ADC_11db);  // Aumenta a faixa de tensão para 0 a 3.6V
}

// Função para calcular o percentual de carga da bateria
float calcularPercentualBateria() {
  int leitura_bateria = analogRead(BATTERY_PIN);  // Leitura analógica da tensão da bateria (0 a 4095)
  battery_voltage = (leitura_bateria / 4095.0) * 3.6;  // Converte para tensão (0 a 3.6V)

  // Mapeamento da tensão para o percentual da bateria
  if (battery_voltage >= 4.2) {
    return 100.0;  // Bateria cheia
  } else if (battery_voltage <= 3.0) {
    return 0.0;    // Bateria vazia
  } else {
    // Cálculo da porcentagem com base na faixa de 3.0V (vazio) a 4.2V (cheio)
    return (battery_voltage - 3.0) / (4.2 - 3.0) * 100.0;
  }
}

// Função para ler os dados dos sensores
void lerSensores(float &temperatura, float &umidade_ar, float &umidade_solo, float &percentual_bateria) {
  // Sensor de temperatura e umidade DHT22
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  temperatura = data.temperature;
  umidade_ar = data.humidity;

  // Sensor de umidade do solo
  int leitura_umidade_solo = analogRead(SOIL_MOISTURE_PIN);  // Leitura analógica (0 a 4095)
  umidade_solo = 100.0 - ((leitura_umidade_solo / 4095.0) * 100.0);  // Converte para porcentagem

  // Percentual de bateria
  percentual_bateria = calcularPercentualBateria();
}

// Função para exibir os dados como JSON
void exibirDadosJSON() {
  // Variáveis para armazenar os valores lidos
  float temperatura, umidade_ar, umidade_solo, percentual_bateria;

  // Lê os sensores
  lerSensores(temperatura, umidade_ar, umidade_solo, percentual_bateria);

  // Cria um objeto JSON
  StaticJsonDocument<200> doc;
  doc["temperatura_ambiente"] = temperatura;
  doc["umidade_ar"] = umidade_ar;
  doc["umidade_solo"] = umidade_solo;
  doc["nivel_bateria"] = percentual_bateria;

  // Converte para JSON e envia via Serial
  String jsonOutput;
  serializeJson(doc, jsonOutput);
  Serial.println(jsonOutput);
}

// Loop principal
void loop() {
  exibirDadosJSON();
  delay(2000);  // Aguarda 2 segundos antes da próxima leitura
}
