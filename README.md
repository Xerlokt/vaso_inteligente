# Botanix — Vaso Inteligente

Sistema integrado de monitoramento de plantas composto por firmware IoT (ESP32), aplicativo mobile (React Native) e aplicação web (React). Os dados dos sensores são transmitidos em tempo real via protocolo MQTT.

---

## Arquitetura do Sistema

```
┌─────────────────┐        MQTT (JSON)        ┌───────────────────┐
│   ESP32 + DHT22 │ ─────────────────────────► │  HiveMQ Broker    │
│  + Sensor Solo  │   broker.hivemq.com:1883   │  (nuvem pública)  │
└─────────────────┘                            └────────┬──────────┘
                                                        │
                                          ┌─────────────┴─────────────┐
                                          │                           │
                               ┌──────────▼──────────┐   ┌───────────▼──────────┐
                               │  App Mobile (Expo)  │   │   App Web (React)    │
                               │  MQTT via WebSocket │   │  MQTT via WebSocket  │
                               │  porta 8000         │   │  porta 8083          │
                               └─────────────────────┘   └──────────────────────┘
```

### Payload MQTT

Tópico: `sensor_dados_json_001`

```json
{
  "umidade_solo": 72.5,
  "temperatura": 24.3,
  "umidade_ar": 61.0
}
```

O ESP32 publica esse JSON a cada **15 segundos**.

---

## Componentes

### 1. Firmware ESP32 (`POI4_Esp32.py`)

MicroPython rodando no ESP32. Lê dois sensores e publica via MQTT.

| Sensor | Pino | Dado coletado |
|---|---|---|
| DHT22 | GPIO 14 | Temperatura (°C) e umidade do ar (%) |
| Capacitivo de solo | GPIO 32 (ADC) | Umidade do solo (0–100%) |

### 2. App Mobile (`App.js` + `src/`)

React Native com Expo. Recebe os dados via MQTT e exibe:
- Mascote animado (4 estados de saúde da planta)
- Badges de alerta coloridos
- Barras de progresso dos sensores
- Nome da planta editável

### 3. App Web (`web/`)

React + Vite. Mesmas funcionalidades do mobile, otimizada para browser:
- Mascote SVG animado com CSS `@keyframes`
- Layout responsivo com fundo atmosférico animado
- Dados persistidos no `localStorage` (nome da planta)
- Banner de status da conexão MQTT em tempo real

---

## Regras de Alerta

| Condição | Alerta |
|---|---|
| Umidade do solo < 30% | "Preciso de mais água" |
| Umidade do ar < 40% | "Está muito seco" |
| Temperatura > 35°C | "Está muito quente" |
| Temperatura < 6°C | "Está muito frio" |
| Nenhum problema | "Tudo certo!" |

O número de alertas ativos define o estado visual do mascote:

| Alertas | Estado | Animação |
|---|---|---|
| 0 | Saudável (100%) | Bob suave + brilho verde + flor |
| 1 | Bem (60%) | Balanço lento |
| 2 | Estressada (30%) | Inclinação + caída |
| 3+ | Murcha (0%) | Caída + pulso vermelho |

---

## Guia de Uso

### Pré-requisitos

- **ESP32** com MicroPython instalado
- **Python 3** (para ferramentas de flash, ex: Thonny ou ampy)
- **Node.js 18+** (para o app web)
- **Expo Go** no celular (para o app mobile)

---

### 1. Configurar o ESP32

Abra `POI4_Esp32.py` e edite as credenciais Wi-Fi:

```python
SSID = "nome_da_sua_rede"
PASSWORD = "sua_senha"
```

Faça upload do arquivo para o ESP32 (via Thonny ou ampy) e reinicie o dispositivo. O LED interno piscará ao conectar ao Wi-Fi e iniciará a publicação dos dados.

---

### 2. Rodar o App Web

```bash
cd web
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador. O banner no topo mostrará o status da conexão MQTT. Assim que o ESP32 publicar dados, os valores aparecem automaticamente.

Para build de produção:

```bash
npm run build
npm run preview
```

---

### 3. Rodar o App Mobile

Na raiz do projeto:

```bash
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS). O app conecta automaticamente ao broker MQTT e exibe os dados em tempo real.

---

### 4. Funcionamento sem o ESP32

Ambos os apps funcionam normalmente sem o hardware — o mascote ficará no estado saudável padrão e os sensores exibirão `—` até o primeiro dado chegar. É possível simular o ESP32 publicando manualmente no broker via qualquer cliente MQTT:

**Tópico:** `sensor_dados_json_001`  
**Broker:** `broker.hivemq.com:1883`

```json
{ "umidade_solo": 25, "temperatura": 38, "umidade_ar": 35 }
```

---

## Estrutura de Pastas

```
vaso_inteligente/
├── App.js                  # Entrada do app mobile
├── POI4_Esp32.py           # Firmware MicroPython do ESP32
├── package.json            # Dependências do mobile (Expo)
├── src/
│   ├── components/         # Componentes React Native reutilizáveis
│   ├── constants/          # Configurações MQTT e limiares dos sensores
│   ├── hooks/              # useMqtt, useSensorData
│   ├── utils/              # Lógica pura (healthUtils)
│   ├── style/              # Design tokens e StyleSheet
│   └── assets/             # Fontes, imagens e vídeos
└── web/
    ├── index.html
    ├── package.json        # Dependências do web (Vite + mqtt)
    └── src/
        ├── components/     # Layout, PlantMascot, SensorCard, etc.
        ├── constants/      # Configurações MQTT e limiares
        ├── hooks/          # useMqtt, useSensorData, usePlantName
        ├── services/       # mqttService (factory do cliente MQTT)
        ├── utils/          # Lógica pura (healthUtils)
        ├── styles/         # tokens.css, fonts.css, global.css
        └── assets/         # Fontes e imagens (copiadas do mobile)
```

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| IoT | MicroPython + umqtt.simple |
| Broker | HiveMQ (público, gratuito) |
| Mobile | React Native 0.74 + Expo 51 |
| Web | React 18 + Vite 5 |
| MQTT Web | mqtt.js 5 (WebSocket) |
| Estilo | CSS Modules + KumbhSans |
