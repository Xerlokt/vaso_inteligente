import { View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { styles } from '../style/style';

export default function PlantMascot({ videoSource }) {
  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={styles.plantBody}>
      <VideoView
        player={player}
        style={styles.plantVideo}
        contentFit="contain"
        nativeControls={false}
      />
    </View>
  );
}
