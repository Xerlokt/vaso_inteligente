import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { styles, colors } from './src/style/style';
import { Video } from 'expo-av';
import { useFonts } from 'expo-font';

// Inicializa a biblioteca MQTT
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default function App() {
  // Estados para os dados MQTT  
  const [temperatura, setTemperatura] = useState(0);
  const [percentTemp, setPercentTemp] = useState('0%');
  const [percentHumSolo, setPercentHumSolo] = useState('0%');
  const [percentHumAr, setPercentHumAr] = useState('0%');
  const [baterryLvl, setBaterryLvl] = useState('0%');

  // Estados para mensagens de status
  const [spans, setSpans] = useState([]);
  
  // Estados para informações sobre o nome da planta
  const [ name, setName ] = useState('Nome da planta');
  const [ editStatus, setEditStatus ] = useState(false);
  const [ buttonEditStatus, setButtonEditStatus ] = useState({
    width: 20,
    src: require('./src/assets/images/pensil.png')
  });
  
  const plantNameInput = useRef(null);
  
  // Estados para escolha da imagem de exibição
  const [percentPlant, setPercentPlant] = useState(require('./src/assets/videos/100-seed.mp4'));

  // Função para configurar e manipular os dados do MQTT
  useEffect(() => {
    const mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8000, '/mqtt', 'react_native_client_id');

    mqttClient.onMessageArrived = (message) => {
      try {
        const data = JSON.parse(message.payloadString);

        // Atualiza os valores dos status do vaso
        setTemperatura(data.temperatura)
        setPercentTemp(`${temperatura*100/50}%`);
        setPercentHumSolo(`${data.umidade_solo}%`);
        setPercentHumAr(`${data.umidade_ar}%`);
        setPercentHumAr(`${data.nivel_bateria}%`);

        // Atualiza mensagens de status
        const warnings = [];
        if (data.umidade_solo < 30){
          warnings.push("A planta está com pouca umidade no solo.");
          setSpans(lastSpans => lastSpans.push({text:"Preciso de mais água", color: colors.greenblue, textColor: colors.darkGreenblue}));
        }else{
          setSpans(lastSpans => lastSpans.pop({text:"Preciso de mais água", color: colors.greenblue, textColor: colors.darkGreenblue}));
        }

        if (data.umidade_ar < 40){
          warnings.push("A umidade do ar está muito baixa para a planta.");
          setSpans(lastSpans => lastSpans.push({text: "Está muito seco", color: colors.yellow, textColor: colors.darkYellow}));
        }else{
          setSpans(lastSpans => lastSpans.pop({text: "Está muito seco", color: colors.yellow, textColor: colors.darkYellow}));
        }

        if (data.temperatura > 35){
          warnings.push("A temperatura está muito alta para a planta.");
          setSpans(lastSpans => lastSpans.push({text:"Está muito quente", color: colors.red, textColor: colors.darkRed}));
        }else if(data.temperatura > 6){
          setSpans(lastSpans => lastSpans.push({text: "Está muito frio", color: colors.blue, textColor: colors.darkBlue}));
        }else{
          setSpans(lastSpans => lastSpans.pop({text: "Está muito frio", color: colors.blue, textColor: colors.darkBlue}));
          setSpans(lastSpans => lastSpans.pop({text:"Está muito quente", color: colors.red, textColor: colors.darkRed}));
        }

        // Verifica se o status do ambiente está OK ou não

        if(spans.length() > 1 && spans.includes("Tudo certo!")){
          spans.pop("Tudo certo!");
        }else if(spans.length() == 0){
          spans.push("Tudo certo!")
        }

        // Define qual imagem do mascote será exibida de acordo com o número de problemas no ambiente

        if(spans.length() == 1){
          setPercentPlant(require('./src/assets/videos/100-seed.mp4'));
        }else if(spans.length() == 2){
          setPercentPlant(require('./src/assets/videos/60-seed.mp4'));
        }else if(spans.length() == 3){
          setPercentPlant(require('./src/assets/videos/30-seed.mp4'));
        }else{
          setPercentPlant(require('./src/assets/videos/0-seed.mp4'));
        }

        setStatusMessages(warnings);
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


  const updateName = () => {
    setEditStatus((lastState) => {
      const newStatus = !lastState;

      if(newStatus){
        setButtonEditStatus({width: 30, src: require('./src/assets/images/confirm.png')});
      }else{
        setButtonEditStatus({width: 20, src: require('./src/assets/images/pensil.png')});
      }

      return newStatus;
    });
  }
  

  let [fontsLoaded] = useFonts({
    'KumbhSansBlack': require('./src/assets/fonts/KumbhSans-Black.ttf'),
    'KumbhSansExtraBold': require('./src/assets/fonts/KumbhSans-ExtraBold.ttf'),
    'KumbhSansBold': require('./src/assets/fonts/KumbhSans-Bold.ttf'),
    'KumbhSansSemiBold': require('./src/assets/fonts/KumbhSans-SemiBold.ttf'),
    'KumbhSansMedium': require('./src/assets/fonts/KumbhSans-Medium.ttf'),
    'KumbhSansRegular': require('./src/assets/fonts/KumbhSans-Regular.ttf'),
    'KumbhSansLight': require('./src/assets/fonts/KumbhSans-Light.ttf'),
    'KumbhSansExtraLight': require('./src/assets/fonts/KumbhSans-ExtraLight.ttf'),
    'KumbhSansThin': require('./src/assets/fonts/KumbhSans-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={require('./src/assets/images/backgroundSky.jpg')} style={styles.backgroundSky}/>
      <View style={styles.mainContent}>
        <View style={styles.vaseStatus}>
          <View style={styles.plantBody}>
            <Video
              source={percentPlant}
              style={styles.plantVideo}
              resizeMode='contain'
              isLooping
              isMuted
              shouldPlay
            />
          </View>
          <View style={styles.plantName}>
            <TouchableOpacity onPress={() => updateName()}>
              <TextInput ref={plantNameInput} value={name} onChangeText={(text) => setName(text)} editable={editStatus} style={styles.nameTitle}></TextInput>
            </TouchableOpacity>
            <TouchableOpacity style={styles.renameIconContainer} onPress={() => updateName()}>
              <Image style={{...styles.renameIcon, width: buttonEditStatus.width}} source={buttonEditStatus.src}/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.boxOfSpans}>
          {spans.map(span, () => {
            return (
              <View style={{...styles.span, backgroundColor: span.color, color: span.txtColor}}>
                <Image src={percentPlant}></Image>
                <Text style={styles.text}>{span.text}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.environmentStatus}>
          <View style={styles.environmentStatusSection}>
            <Text style={styles.environmentStatusTitle}>Status</Text>
            <View style={styles.horizontalRow}></View>
          </View>

          <View style={styles.statusGroup}>
            <View style={styles.status}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/termometer+.png')}/>
                <Text style={styles.text}>Temperatura</Text>
              </View>
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentTemp, ...styles.progressValue}}/>
                <Text>{temperatura}</Text>
              </View>
            </View>

            <View style={styles.status}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/tint.png')}/>
                <Text style={styles.text}>Humidade do solo</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentHumSolo, ...styles.progressValue}}/>
                <Text>{percentHumSolo}</Text>
              </View>
            </View>

            <View style={styles.status}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/wind.png')}/>
                <Text style={styles.text}>Humidade do ambiente</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentHumAr, ...styles.progressValue}}/>
                <Text>{percentHumAr}</Text>
              </View>
            </View>

            <View style={[styles.status, styles.energyLvl]}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/energy.png')}/>
                <Text style={styles.text}>Bateria do vaso</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentHumSolo, ...styles.progressValue}}/>
                <Text>{baterryLvl}</Text>
              </View>
            </View>
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
}

