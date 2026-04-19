import { View } from 'react-native';
import { Video } from 'expo-av';
import { styles } from '../style/style';

export default function PlantMascot({ videoSource }) {
  return (
    <View style={styles.plantBody}>
      <Video
        source={videoSource}
        style={styles.plantVideo}
        resizeMode="contain"
        isLooping
        isMuted
        shouldPlay
      />
    </View>
  );
}
