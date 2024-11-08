import { useState, useRef } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { styles, colors } from './src/style/style';
import { Video } from 'expo-av';
import { useFonts } from 'expo-font';

export default function App() {
  const [ name, setName ] = useState('Nome da planta');
  const [ editStatus, setEditStatus ] = useState(false);
  const [ buttonEditStatus, setButtonEditStatus ] = useState({
    width: 20,
    src: require('./src/assets/images/pensil.png')
  });

  const plantNameInput = useRef(null);

  const [percentTemp, setPercentTemp] = useState('10%');
  const [percentHumSolo, setPercentHumSolo] = useState('20%');
  const [percentHumAr, setPercentHumAr] = useState('40%');
  let percentPlant = './src/assets/videos/100-seed.mp4';

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
              source={require(percentPlant)}
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
              </View>
            </View>

            <View style={styles.status}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/tint.png')}/>
                <Text style={styles.text}>Humidade do solo</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentHumSolo, ...styles.progressValue}}/>
              </View>
            </View>

            <View style={styles.status}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/wind.png')}/>
                <Text style={styles.text}>Humidade do ambiente</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentHumAr, ...styles.progressValue}}/>
              </View>
            </View>

            <View style={[styles.status, styles.energyLvl]}>
              <View style={styles.statusRow}>
                <Image style={styles.statusIcon} source={require('./src/assets/images/energy.png')}/>
                <Text style={styles.text}>Bateria do vaso</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Image source={require("./src/assets/images/backgroundProgressBar.png")} style={{width: percentHumSolo, ...styles.progressValue}}/>
              </View>
            </View>
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
}

