import { View, Text } from 'react-native';
import { styles } from '../style/style';

export default function StatusBadge({ text, color, textColor }) {
  return (
    <View style={{ ...styles.span, backgroundColor: color }}>
      <Text style={{ ...styles.text, color: textColor }}>{text}</Text>
    </View>
  );
}
