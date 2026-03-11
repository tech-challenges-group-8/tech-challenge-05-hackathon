import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Platform, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import focusSettingsService from '../../services/focus-settings/focusSettingsService';
import type { ResponseFocusSettingsDTO, FocusTask } from '../../services/focus-settings/types';
import { useAuth } from '../../auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_API_URL = 'http://localhost:3001/task-checklist';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

// Helper to extract YouTube video ID from various URL formats
export const extractYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const YOUTUBE_THEMES = [
  { id: 'lofi', name: 'Lofi', videoId: 'YOJsKatW-Ts' },
  { id: 'nature', name: 'Nature', videoId: 'eNUpTV9BGac' },
  { id: 'ambient', name: 'Ambient', videoId: 'MX-iaTDEyGI' },
  { id: 'jazz', name: 'Jazz', videoId: '71Gt46aX9Z4' },
];

export const CUSTOM_THEME_OPTION = { id: 'custom', name: '+', videoId: '' };

export interface FocusTimerContextData {
  settings: ResponseFocusSettingsDTO | null;
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  selectedThemeId: string;
  youtubeUrl: string;
  activeVideoId: string | null;
  isAudioPlaying: boolean;
  audioVolume: number;
  allThemes: any[];
  isFocusCompleteModalOpen: boolean;
  lastFocusDuration: number;
  isFloatingPlayerDismissed: boolean;
  playerRef: any;
  
  // Setters
  setSettings: React.Dispatch<React.SetStateAction<ResponseFocusSettingsDTO | null>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<TimerMode>>;
  setSelectedThemeId: React.Dispatch<React.SetStateAction<string>>;
  setYoutubeUrl: React.Dispatch<React.SetStateAction<string>>;
  setActiveVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsFocusCompleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFloatingPlayerDismissed: React.Dispatch<React.SetStateAction<boolean>>;

  // Functions
  toggleTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  handleModeSelect: (newMode: TimerMode) => void;
  toggleAudioPlay: () => void;
  handleTimerComplete: () => Promise<void>;
  closeFocusCompleteModal: () => void;
  submitTaskCompletionTime: (taskId: string | null) => Promise<void>;
  rewindAudio: () => void;
  
  // Task global state and functions
  tasks: FocusTask[];
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
}

const FocusTimerContext = createContext<FocusTimerContextData | undefined>(undefined);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<ResponseFocusSettingsDTO | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('FOCUS');
  
  // Audio Player State
  const [selectedThemeId, setSelectedThemeId] = useState('lofi');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number>(50);

  // Focus Complete Modal State
  const [isFocusCompleteModalOpen, setIsFocusCompleteModalOpen] = useState(false);
  const [lastFocusDuration, setLastFocusDuration] = useState(25); // the original setting duration
  const [isFloatingPlayerDismissed, setIsFloatingPlayerDismissed] = useState(false);
  
  // Tasks State
  const [tasks, setTasks] = useState<FocusTask[]>([]);
  
  const allThemes = useMemo(() => {
    const userThemes = settings?.audioThemes || [];
    return [...YOUTUBE_THEMES, ...userThemes, CUSTOM_THEME_OPTION];
  }, [settings?.audioThemes]);

  const playerRef = useRef<any>(null);

  // Web iframe controls for audio playing
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const iframe = window.document.getElementById('youtube-iframe-web') as any;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: isAudioPlaying ? 'playVideo' : 'pauseVideo'
        }), '*');
      }
    }
  }, [isAudioPlaying, activeVideoId]);

  // Web iframe controls for volume
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const iframe = window.document.getElementById('youtube-iframe-web') as any;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [audioVolume]
        }), '*');
      }
    }
  }, [audioVolume, activeVideoId]);

  const rewindAudio = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const iframe = window.document.getElementById('youtube-iframe-web') as any;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [0, true]
        }), '*');
        if (isAudioPlaying) {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        }
      }
    } else if (playerRef.current) {
      playerRef.current.seekTo(0, true);
    }
  }, [isAudioPlaying]);

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) {
        setSettings(null);
        return;
      }

      try {
        const data = await focusSettingsService.getSettings();
        
        // Fetch global tasks to sync
        const token = await AsyncStorage.getItem('authToken');
        const tasksRes = await axios.get(TASKS_API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const mappedTasks: FocusTask[] = tasksRes.data.map((t: any) => ({
          id: t.id,
          title: t.description,
          completed: t.completed,
          pomodoros: t.pomodoros || 0,
          timeSpent: t.timeSpent || 0
        }));

        setSettings({ ...data, tasks: mappedTasks });
        setTimeLeft(data.foco * 60);
      } catch (error) {
        console.error('Failed to load focus settings, falling back to defaults', error);
        const defaultData = focusSettingsService.getDefaultSettings();
        setSettings(defaultData);
        setTimeLeft(defaultData.foco * 60);
      }
    };
    fetchSettings();
  }, [currentUser]);

  const fetchTasks = useCallback(async () => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(TASKS_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const mappedTasks: FocusTask[] = response.data.map((t: any) => ({
        id: t.id,
        title: t.description,
        completed: t.completed,
        pomodoros: t.pomodoros || 0,
        timeSpent: t.timeSpent || 0
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching global tasks:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string) => {
    if (!title.trim()) return;
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        TASKS_API_URL,
        { description: title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTask: FocusTask = {
        id: response.data.id,
        title: response.data.description,
        completed: response.data.completed,
        pomodoros: response.data.pomodoros || 0,
        timeSpent: response.data.timeSpent || 0
      };

      setTasks(prev => [newTask, ...prev]);
      
      // Update settings for backward compatibility
      setSettings(prev => prev ? { ...prev, tasks: [newTask, ...(prev.tasks || [])] } as ResponseFocusSettingsDTO : null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = !task.completed;
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.patch(
        `${TASKS_API_URL}/${id}`,
        { isDone: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fully hydrate the task with the response
      const serverTask: FocusTask = {
        id: response.data.id,
        title: response.data.description,
        completed: response.data.completed,
        pomodoros: response.data.pomodoros || 0,
        timeSpent: response.data.timeSpent || 0
      };
      
      setTasks(prev => prev.map(t => t.id === id ? serverTask : t));
      setSettings(prev => prev ? { 
        ...prev, 
        tasks: prev.tasks.map(t => t.id === id ? serverTask : t) 
      } as ResponseFocusSettingsDTO : null);
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !newStatus } : t));
    }
  };

  const deleteTask = async (id: string) => {
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.delete(`${TASKS_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setTasks(previousTasks);
    }
  };

  const clearCompletedTasks = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => !t.completed));

    try {
      const token = await AsyncStorage.getItem('authToken');
      await Promise.all(
        completedTasks.map(t => axios.delete(`${TASKS_API_URL}/${t.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }))
      );
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
      setTasks(previousTasks);
    }
  };

  const handleTimerComplete = useCallback(async () => {
    setIsActive(false);

    if (Platform.OS === 'web' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Time is up!', {
          body: mode === 'FOCUS' ? 'Great job! Time for a break.' : 'Break is over! Ready to focus?',
        });
      }
    }

    if (mode === 'FOCUS') {
      // Prompt modal to assign task time before advancing the internal session count (or do both simultaneously)
      setLastFocusDuration(settings?.foco || 25);
      setIsFocusCompleteModalOpen(true);

      if (settings) {
        try {
          // Increment pomodoro count in backend
          const updatedSettings = await focusSettingsService.incrementPomodoroCount(settings.pomodorosCompleted);
          
          // Update local settings but preserve our global tasks
          setSettings({
            ...updatedSettings,
            tasks: tasks // Keep our synchronized tasks
          });
          
          const isLongBreak = (updatedSettings.pomodorosCompleted % 4 === 0);
          setMode(isLongBreak ? 'LONG_BREAK' : 'SHORT_BREAK');
          setTimeLeft((isLongBreak ? updatedSettings.pausaLonga : updatedSettings.pausaCurta) * 60);
        } catch (error) {
          const localCount = settings.pomodorosCompleted + 1;
          const isLongBreak = (localCount % 4 === 0);
          setMode(isLongBreak ? 'LONG_BREAK' : 'SHORT_BREAK');
          setTimeLeft((isLongBreak ? settings.pausaLonga : settings.pausaCurta) * 60);
          setSettings({
            ...settings, 
            pomodorosCompleted: localCount,
            tasks: tasks // Keep our synchronized tasks
          } as any);
        }
      }
    } else {
      setMode('FOCUS');
      if (settings) {
        setTimeLeft(settings.foco * 60);
      }
    }
  }, [mode, settings]);

  // Timer run loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerComplete]);

  // Automate audio (play on Focus, pause on Break)
  useEffect(() => {
    if (isActive && mode === 'FOCUS') {
      setIsAudioPlaying(true);
    } else {
      setIsAudioPlaying(false);
    }
  }, [isActive, mode]);

  // Sync active video ID
  useEffect(() => {
    if (selectedThemeId === 'custom') {
      if (youtubeUrl) {
        setActiveVideoId(extractYoutubeId(youtubeUrl));
      } else {
        setActiveVideoId(null);
      }
    } else {
      const theme = allThemes.find(t => t.id === selectedThemeId);
      setActiveVideoId(theme?.videoId || null);
    }
  }, [youtubeUrl, selectedThemeId, allThemes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsFloatingPlayerDismissed(false); // Resurface player on interaction
  };

  const resetTimer = () => {
    setIsActive(false);
    if (!settings) return;
    switch (mode) {
      case 'FOCUS': setTimeLeft(settings.foco * 60); break;
      case 'SHORT_BREAK': setTimeLeft(settings.pausaCurta * 60); break;
      case 'LONG_BREAK': setTimeLeft(settings.pausaLonga * 60); break;
    }
  };

  const skipTimer = () => {
    setTimeLeft(0);
  };

  // Synchronize timer if settings change while idle
  useEffect(() => {
    if (!isActive && settings) {
      switch (mode) {
        case 'FOCUS':
          setTimeLeft(settings.foco * 60);
          break;
        case 'SHORT_BREAK':
          setTimeLeft(settings.pausaCurta * 60);
          break;
        case 'LONG_BREAK':
          setTimeLeft(settings.pausaLonga * 60);
          break;
      }
    }
  }, [settings, mode, isActive]);

  const handleModeSelect = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setIsFloatingPlayerDismissed(false); // Resurface player on interaction
    if (!settings) return;
    switch (newMode) {
      case 'FOCUS': setTimeLeft(settings.foco * 60); break;
      case 'SHORT_BREAK': setTimeLeft(settings.pausaCurta * 60); break;
      case 'LONG_BREAK': setTimeLeft(settings.pausaLonga * 60); break;
    }
  };

  const toggleAudioPlay = () => setIsAudioPlaying(!isAudioPlaying);

  const closeFocusCompleteModal = () => setIsFocusCompleteModalOpen(false);

  const submitTaskCompletionTime = async (taskId: string | null) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      closeFocusCompleteModal();
      return;
    }

    const updatedPomodoros = (task.pomodoros || 0) + 1;
    const updatedTimeSpent = (task.timeSpent || 0) + lastFocusDuration;

    // Optimistic UI update
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          timeSpent: updatedTimeSpent,
          pomodoros: updatedPomodoros
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.patch(`${TASKS_API_URL}/${taskId}`, {
        pomodoros: updatedPomodoros,
        timeSpent: updatedTimeSpent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Hydrate from server response
      const serverTask: FocusTask = {
        id: response.data.id,
        title: response.data.description,
        completed: response.data.completed,
        pomodoros: response.data.pomodoros || 0,
        timeSpent: response.data.timeSpent || 0
      };

      setTasks(prev => prev.map(t => t.id === taskId ? serverTask : t));
    } catch(e) {
      console.error('Could not save task time assignment to global task list');
    }
    closeFocusCompleteModal();
  };

  return (
    <FocusTimerContext.Provider value={{
      settings, timeLeft, isActive, mode, selectedThemeId, youtubeUrl,
      activeVideoId, isAudioPlaying, audioVolume, allThemes, isFocusCompleteModalOpen,
      lastFocusDuration, isFloatingPlayerDismissed, playerRef,
      setSettings, setTimeLeft, setIsActive, setMode, setSelectedThemeId, setYoutubeUrl,
      setActiveVideoId, setIsAudioPlaying, setAudioVolume, setIsFocusCompleteModalOpen,
      setIsFloatingPlayerDismissed,
      toggleTimer, resetTimer, skipTimer, handleModeSelect, toggleAudioPlay, handleTimerComplete,
      closeFocusCompleteModal, submitTaskCompletionTime, rewindAudio,
      tasks, fetchTasks, addTask, toggleTask, deleteTask, clearCompletedTasks
    }}>
      {children}
      <View style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} pointerEvents="none">
        {activeVideoId ? (
          Platform.OS === 'web' ? (
            <iframe
              id="youtube-iframe-web"
              src={`https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&autoplay=${isAudioPlaying ? 1 : 0}&loop=1&playlist=${activeVideoId}&controls=0`}
              style={{ width: '200px', height: '200px', border: 'none' }}
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
          )
        ) : null}
      </View>
    </FocusTimerContext.Provider>
  );
};

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};
