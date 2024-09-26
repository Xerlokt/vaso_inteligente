#include "DHTesp.h"
#include <ArduinoJson.h>  // Biblioteca para lidar com JSON

const int DHT_PIN = 24;
int _moisture, sensor_analog;
const int sensor_pin = 32;

DHTesp dhtSensor;

void setup() {
  Serial.begin(115200);
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);
}

void loop() {

  // Sensor de Temperatura + Umidade Ambiente DHT22
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  float temperatura = data.temperature;
  float umidade = data.humidity;

  // Sensor de Umidade do Solo
  sensor_analog = analogRead(sensor_pin); // Para ESP32 retorna de 0 a 4095
  _moisture = (100 - ((sensor_analog / 4095.00) * 100));

  // Criando objeto JSON
  StaticJsonDocument<200> doc;
  doc["temperatura_ambiente"] = temperatura;
  doc["umidade_ar"] = umidade;
  doc["umidade_solo"] = _moisture;

  // Convertendo para JSON e enviando para o Serial
  String jsonOutput;
  serializeJson(doc, jsonOutput);
  Serial.println(jsonOutput);

  delay(2000);
}
