import { Sparkles, Music } from 'lucide-react';
import { useState, useRef } from 'react';

export interface SparkleSettings {
  enabled: boolean;
  particleSize: number;
  speed: number;
  opacity: number;
  brightness: number;
  hueShift: number;
  particleBlur: number;
  color: string;
  secondaryColor: string;
}

interface SparkleControlsProps {
  onSettingsChange: (settings: SparkleSettings) => void;
  onMusicPlayerToggle: () => void;
}

export default function SparkleControls({ onSettingsChange, onMusicPlayerToggle }: SparkleControlsProps) {
  const [settings, setSettings] = useState<SparkleSettings>({
    enabled: false,
    particleSize: 2,
    speed: 1.5,
    opacity: 1,
    brightness: 70,
    hueShift: 180,
    particleBlur: 0,
    color: '#22d3ee',
    secondaryColor: '#3b82f6',
  });
  const sparkleAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicIconAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSparkles = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    if (!sparkleAudioRef.current) {
      sparkleAudioRef.current = new Audio('/sparkle-toggle.mp3');
      sparkleAudioRef.current.volume = 0.3;
    }
    sparkleAudioRef.current.currentTime = 0;
    sparkleAudioRef.current.play().catch(() => {});
  };

  const handleMusicPlayerToggle = () => {
    if (!musicIconAudioRef.current) {
      musicIconAudioRef.current = new Audio('/music-player-icon-click.mp3');
      musicIconAudioRef.current.volume = 0.3;
    }
    musicIconAudioRef.current.currentTime = 0;
    musicIconAudioRef.current.play().catch(() => {});
    onMusicPlayerToggle();
  };

  return (
    <>
      <button
        onClick={handleMusicPlayerToggle}
        className="fixed bottom-[13.5rem] right-8 z-40 bg-slate-900/90 border-2 border-amber-500/40 p-3 rounded-full hover:bg-slate-800/90 hover:border-amber-400 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
        aria-label="Toggle Music Player"
      >
        <Music size={24} className="text-amber-400" />
      </button>
      <button
        onClick={toggleSparkles}
        className={`fixed bottom-[9.5rem] right-8 z-40 bg-slate-900/90 border-2 p-3 rounded-full transition-all shadow-lg ${
          settings.enabled
            ? 'border-purple-500 shadow-purple-500/60 animate-pulse'
            : 'border-purple-500/40 shadow-purple-500/20 hover:bg-slate-800/90 hover:border-purple-400 hover:shadow-purple-500/40'
        }`}
        aria-label="Toggle Sparkle Cursor"
      >
        <Sparkles size={24} className={settings.enabled ? 'text-purple-300' : 'text-purple-400'} />
      </button>
    </>
  );
}
