import { useState, useCallback } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { useFonts } from 'expo-font';

import { styles, colors } from './src/style/style';
import { useSensorData } from './src/hooks/useSensorData';

import PlantMascot from './src/components/PlantMascot';
import PlantName   from './src/components/PlantName';
import StatusBadge from './src/components/StatusBadge';
import SensorCard  from './src/components/SensorCard';

const ALL_GOOD = {
  key: 'ok',
  text: 'Tudo certo!',
  color: colors.green,
  textColor: colors.darkGreen,
};

export default function App() {
  const { sensorData, warnings, videoSource, percents } = useSensorData();

  const [name, setName]           = useState('Nome da planta');
  const [isEditing, setIsEditing] = useState(false);
  const [editButtonState, setEditButtonState] = useState({
    width: 20,
    src: require('./src/assets/images/pensil.png'),
  });

  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => {
      const next = !prev;
      setEditButtonState(
        next
          ? { width: 30, src: require('./src/assets/images/confirm.png') }
          : { width: 20, src: require('./src/assets/images/pensil.png') }
      );
      return next;
    });
  }, []);

  const [fontsLoaded] = useFonts({
    KumbhSansBlack:      require('./src/assets/fonts/KumbhSans-Black.ttf'),
    KumbhSansExtraBold:  require('./src/assets/fonts/KumbhSans-ExtraBold.ttf'),
    KumbhSansBold:       require('./src/assets/fonts/KumbhSans-Bold.ttf'),
    KumbhSansSemiBold:   require('./src/assets/fonts/KumbhSans-SemiBold.ttf'),
    KumbhSansMedium:     require('./src/assets/fonts/KumbhSans-Medium.ttf'),
    KumbhSansRegular:    require('./src/assets/fonts/KumbhSans-Regular.ttf'),
    KumbhSansLight:      require('./src/assets/fonts/KumbhSans-Light.ttf'),
    KumbhSansExtraLight: require('./src/assets/fonts/KumbhSans-ExtraLight.ttf'),
    KumbhSansThin:       require('./src/assets/fonts/KumbhSans-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const displayWarnings = warnings.length > 0 ? warnings : [ALL_GOOD];

  return (
    <ScrollView style={styles.container}>
      <Image source={require('./src/assets/images/backgroundSky.jpg')} style={styles.backgroundSky} />

      <View style={styles.mainContent}>
        <View style={styles.vaseStatus}>
          <PlantMascot videoSource={videoSource} />
          <PlantName
            name={name}
            isEditing={isEditing}
            onToggleEdit={toggleEdit}
            onNameChange={setName}
            editButtonState={editButtonState}
          />
        </View>

        <View style={styles.boxOfSpans}>
          {displayWarnings.map((w) => (
            <StatusBadge key={w.key} text={w.text} color={w.color} textColor={w.textColor} />
          ))}
        </View>

        <View style={styles.environmentStatus}>
          <View style={styles.environmentStatusSection}>
            <Text style={styles.environmentStatusTitle}>Status</Text>
            <View style={styles.horizontalRow} />
          </View>

          <View style={styles.statusGroup}>
            <SensorCard
              icon={require('./src/assets/images/termometer+.png')}
              label="Temperatura"
              value={`${sensorData?.temperatura ?? 0}°C`}
              percent={percents.temp}
            />
            <SensorCard
              icon={require('./src/assets/images/tint.png')}
              label="Humidade do solo"
              value={percents.soil}
              percent={percents.soil}
            />
            <SensorCard
              icon={require('./src/assets/images/wind.png')}
              label="Humidade do ambiente"
              value={percents.air}
              percent={percents.air}
            />
            <SensorCard
              icon={require('./src/assets/images/energy.png')}
              label="Bateria do vaso"
              value={percents.battery}
              percent={percents.battery}
              extraStyle={styles.energyLvl}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
