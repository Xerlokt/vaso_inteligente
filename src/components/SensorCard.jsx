import { View, Text, Image } from 'react-native';
import { styles } from '../style/style';

export default function SensorCard({ icon, label, value, percent, extraStyle }) {
  return (
    <View style={[styles.status, extraStyle]}>
      <View style={styles.statusRow}>
        <Image style={styles.statusIcon} source={icon} />
        <Text style={styles.text}>{label}</Text>
      </View>
      <View style={styles.progressBar}>
        <Image
          source={require('../assets/images/backgroundProgressBar.png')}
          style={{ width: percent, ...styles.progressValue }}
        />
        <Text>{value}</Text>
      </View>
    </View>
  );
}
