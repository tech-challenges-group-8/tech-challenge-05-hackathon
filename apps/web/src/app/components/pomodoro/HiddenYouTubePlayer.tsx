import { Platform, View, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useFocusTimer } from '../../context/FocusTimerContext';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  webPlayer: {
    width: 200,
    height: 200,
    borderWidth: 0,
  },
});

export function HiddenYouTubePlayer() {
  const { activeVideoId, isAudioPlaying, audioVolume, playerRef } = useFocusTimer();

  if (!activeVideoId) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {Platform.OS === 'web' ? (
        <iframe
          id="youtube-iframe-web"
          src={`https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&autoplay=${isAudioPlaying ? 1 : 0}&loop=1&playlist=${activeVideoId}&controls=0`}
          style={styles.webPlayer as any}
          allow="autoplay; encrypted-media"
          title="youtube"
        />
      ) : (
        <YoutubePlayer
          ref={playerRef}
          height={200}
          width={200}
          play={isAudioPlaying}
          videoId={activeVideoId}
          volume={audioVolume}
          webViewProps={{
            injectedJavaScript: `
              document.querySelector('video').loop = true;
              true;
            `,
          }}
        />
      )}
    </View>
  );
}
