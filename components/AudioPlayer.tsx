import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Play, Pause, RotateCcw, Volume2, Loader } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AudioPlayerProps {
  fileUrl: string;
  title?: string;
  onPlaybackStatusUpdate?: (status: any) => void;
}

export function AudioPlayer({ fileUrl, title, onPlaybackStatusUpdate }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Animations
  const playButtonScale = useSharedValue(1);
  const waveAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const loadingRotation = useSharedValue(0);

  useEffect(() => {
    // Configure audio session
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };

    configureAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      loadingRotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      loadingRotation.value = withTiming(0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isPlaying) {
      waveAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      waveAnimation.value = withTiming(0.3, { duration: 300 });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (duration && position) {
      progressAnimation.value = withTiming(position / duration, { duration: 100 });
    }
  }, [position, duration]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: fileUrl },
        { 
          shouldPlay: false,
          isLooping: false,
          volume: 1.0,
        }
      );
      
      setSound(newSound);
      
      // Set up status updates
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis || null);
          setPosition(status.positionMillis || null);
          setIsPlaying(status.isPlaying);
          
          if (onPlaybackStatusUpdate) {
            onPlaybackStatusUpdate(status);
          }

          // Auto-stop when finished
          if (status.didJustFinish) {
            runOnJS(setIsPlaying)(false);
            runOnJS(setPosition)(0);
          }
        } else if (status.error) {
          runOnJS(setError)('Error loading audio');
          console.error('Audio playback error:', status.error);
        }
      });

    } catch (error) {
      setError('Gagal memuat file audio');
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playPause = async () => {
    try {
      playButtonScale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );

      if (!sound) {
        await loadAudio();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      setError('Gagal memutar audio');
      console.error('Error playing audio:', error);
    }
  };

  const restart = async () => {
    try {
      if (sound) {
        await sound.setPositionAsync(0);
        if (!isPlaying) {
          await sound.playAsync();
        }
      }
    } catch (error) {
      setError('Gagal mengulang audio');
      console.error('Error restarting audio:', error);
    }
  };

  const seekTo = async (percentage: number) => {
    try {
      if (sound && duration) {
        const newPosition = duration * percentage;
        await sound.setPositionAsync(newPosition);
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const formatTime = (milliseconds: number | null) => {
    if (!milliseconds) return '0:00';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Animated styles
  const playButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const waveAnimatedStyle = useAnimatedStyle(() => ({
    opacity: waveAnimation.value,
    transform: [{ scale: 0.8 + waveAnimation.value * 0.2 }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value * 100}%`,
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loadingRotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: width - 32 }]}>
      <View style={styles.header}>
        <Volume2 size={16} color="#10B981" />
        <Text style={styles.title} numberOfLines={1}>
          {title || 'Audio Setoran'}
        </Text>
        {isPlaying && (
          <Animated.View style={waveAnimatedStyle}>
            <View style={styles.waveIndicator} />
          </Animated.View>
        )}
      </View>
      
      <View style={styles.controls}>
        <Pressable 
          style={[styles.controlButton, !sound && styles.controlButtonDisabled]}
          onPress={restart}
          disabled={!sound}
        >
          <RotateCcw size={16} color={sound ? "#6B7280" : "#D1D5DB"} />
        </Pressable>
        
        <Animated.View style={playButtonAnimatedStyle}>
          <Pressable 
            style={[styles.playButton, isLoading && styles.playButtonDisabled]}
            onPress={playPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Animated.View style={loadingAnimatedStyle}>
                <Loader size={20} color="white" />
              </Animated.View>
            ) : isPlaying ? (
              <Pause size={20} color="white" />
            ) : (
              <Play size={20} color="white" style={{ marginLeft: 2 }} />
            )}
          </Pressable>
        </Animated.View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Interactive Progress Bar */}
      {duration && (
        <View style={styles.progressContainer}>
          <Pressable 
            style={styles.progressBar}
            onPress={(event) => {
              const { locationX } = event.nativeEvent;
              const progressBarWidth = width - 64; // Account for padding
              const percentage = locationX / progressBarWidth;
              seekTo(Math.max(0, Math.min(1, percentage)));
            }}
          >
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
            <View style={styles.progressThumb} />
          </Pressable>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    flex: 1,
  },
  waveIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonDisabled: {
    opacity: 0.6,
  },
  timeContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    right: -3,
    top: -3,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});