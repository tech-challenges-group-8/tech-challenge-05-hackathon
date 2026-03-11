import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import type { ResponseFocusSettingsDTO } from '../../services/focus-settings/types';
import type { TimerMode } from './usePomodoro';

export const extractYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const YOUTUBE_THEMES = [
  { id: 'lofi', name: 'Lofi', videoId: 'YOJsKatW-Ts' },
  { id: 'nature', name: 'Nature', videoId: 'eNUpTV9BGac' },
  { id: 'ambient', name: 'Ambient', videoId: 'MX-iaTDEyGI' },
  { id: 'jazz', name: 'Jazz', videoId: '71Gt46aX9Z4' },
];

export const CUSTOM_THEME_OPTION = { id: 'custom', name: '+', videoId: '' };

interface UseAudioPlayerOptions {
  settings: ResponseFocusSettingsDTO | null;
  isActive: boolean;
  mode: TimerMode;
}

export function useAudioPlayer({ settings, isActive, mode }: UseAudioPlayerOptions) {
  const [selectedThemeId, setSelectedThemeId] = useState('lofi');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number>(50);
  const [isFloatingPlayerDismissed, setIsFloatingPlayerDismissed] = useState(false);

  const allThemes = useMemo(() => {
    const userThemes = settings?.audioThemes || [];
    return [...YOUTUBE_THEMES, ...userThemes, CUSTOM_THEME_OPTION];
  }, [settings?.audioThemes]);

  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && mode === 'FOCUS') {
      setIsAudioPlaying(true);
    } else {
      setIsAudioPlaying(false);
    }
  }, [isActive, mode]);

  useEffect(() => {
    if (selectedThemeId === 'custom') {
      if (youtubeUrl) {
        setActiveVideoId(extractYoutubeId(youtubeUrl));
      } else {
        setActiveVideoId(null);
      }
      return;
    }

    const theme = allThemes.find((item) => item.id === selectedThemeId);
    setActiveVideoId(theme?.videoId || null);
  }, [youtubeUrl, selectedThemeId, allThemes]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const iframe = window.document.getElementById('youtube-iframe-web') as any;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: isAudioPlaying ? 'playVideo' : 'pauseVideo',
        }),
        '*',
      );
    }
  }, [isAudioPlaying, activeVideoId]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const iframe = window.document.getElementById('youtube-iframe-web') as any;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [audioVolume],
        }),
        '*',
      );
    }
  }, [audioVolume, activeVideoId]);

  const toggleAudioPlay = useCallback(() => {
    setIsAudioPlaying((current) => !current);
  }, []);

  const rewindAudio = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const iframe = window.document.getElementById('youtube-iframe-web') as any;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [0, true],
          }),
          '*',
        );
        if (isAudioPlaying) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo' }),
            '*',
          );
        }
      }
      return;
    }

    if (playerRef.current) {
      playerRef.current.seekTo(0, true);
    }
  }, [isAudioPlaying]);

  const playNextTheme = useCallback(() => {
    const currentIndex = allThemes.findIndex((item) => item.id === selectedThemeId);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allThemes.length) {
      nextIndex = 0;
    }

    const nextTheme = allThemes[nextIndex];
    if (nextTheme.id !== 'custom') {
      setSelectedThemeId(nextTheme.id);
      return;
    }

    nextIndex = (nextIndex + 1) % allThemes.length;
    setSelectedThemeId(allThemes[nextIndex].id);
  }, [allThemes, selectedThemeId]);

  const selectTheme = useCallback((themeId: string) => {
    setSelectedThemeId(themeId);
  }, []);

  const setCustomYoutubeUrl = useCallback((url: string) => {
    setYoutubeUrl(url);
  }, []);

  const setVolume = useCallback((volume: number) => {
    const safeVolume = Math.max(0, Math.min(100, Math.round(volume)));
    setAudioVolume(safeVolume);
  }, []);

  const changeVolume = useCallback((delta: number) => {
    setAudioVolume((current) => {
      const next = current + delta;
      return Math.max(0, Math.min(100, next));
    });
  }, []);

  const dismissFloatingPlayer = useCallback(() => {
    setIsFloatingPlayerDismissed(true);
  }, []);

  const showFloatingPlayer = useCallback(() => {
    setIsFloatingPlayerDismissed(false);
  }, []);

  return {
    selectedThemeId,
    youtubeUrl,
    activeVideoId,
    isAudioPlaying,
    audioVolume,
    isFloatingPlayerDismissed,
    allThemes,
    playerRef,
    toggleAudioPlay,
    rewindAudio,
    playNextTheme,
    selectTheme,
    setCustomYoutubeUrl,
    setVolume,
    changeVolume,
    dismissFloatingPlayer,
    showFloatingPlayer,
  };
}
