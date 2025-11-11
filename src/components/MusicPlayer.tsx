import { X } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface Song {
  id: number;
  name: string;
  url: string;
}

interface MusicPlayerProps {
  songs: Song[];
  onClose: () => void;
  isPowerOn: boolean;
  setIsPowerOn: (value: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentSongIndex: number;
  setCurrentSongIndex: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

export default function MusicPlayer({
  songs,
  onClose,
  isPowerOn,
  setIsPowerOn,
  isPlaying,
  setIsPlaying,
  currentSongIndex,
  setCurrentSongIndex,
  volume,
  setVolume,
  audioRef
}: MusicPlayerProps) {
  const powerSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    audioRef.current.src = songs[currentSongIndex].url;

    if (isPlaying && isPowerOn) {
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }

    const audio = audioRef.current;
    const handleEnded = () => {
      setCurrentSongIndex((currentSongIndex + 1) % songs.length);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentSongIndex, songs]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && isPowerOn) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isPowerOn]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup power sound when component unmounts
  useEffect(() => {
    return () => {
      if (powerSoundRef.current) {
        powerSoundRef.current.pause();
        powerSoundRef.current.src = '';
        powerSoundRef.current = null;
      }
    };
  }, []);

  const togglePower = () => {
    if (!powerSoundRef.current) {
      powerSoundRef.current = new Audio('/music-player-toggle.mp3');
      powerSoundRef.current.volume = 0.3;
    }
    powerSoundRef.current.currentTime = 0;
    powerSoundRef.current.play().catch(err => console.log('Power sound failed:', err));

    setIsPowerOn(!isPowerOn);
    if (isPowerOn) {
      setIsPlaying(false);
    }
  };

  const selectSong = (index: number) => {
    if (!isPowerOn) return;
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPowerOn) return;
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[149] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] w-[420px] shadow-2xl">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #8b4513 0%, #654321 30%, #3d2817 70%, #2d1810 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 text-amber-200/70 hover:text-amber-200 transition-colors bg-black/40 rounded-full p-1.5 border border-amber-900/50 hover:bg-black/60"
          >
            <X size={18} />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2
                className="text-5xl font-bold text-amber-100"
                style={{
                  fontFamily: 'cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                Retrosonic
              </h2>
            </div>

            <div
              className="mb-6 bg-gradient-to-br from-slate-900/80 to-slate-950/90 rounded-xl border-4 border-amber-900/40 p-4"
              style={{
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <div className="bg-black rounded-lg px-4 py-3 font-mono text-center border-2 border-amber-900/30"
                style={{
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9)'
                }}
              >
                {isPowerOn ? (
                  <>
                    <div className="text-green-400 text-xs mb-2 font-bold tracking-widest animate-pulse">● NOW PLAYING</div>
                    <div className="text-green-400 text-base font-semibold truncate">{songs[currentSongIndex].name}</div>
                  </>
                ) : (
                  <div className="text-gray-700 text-base font-semibold py-3">━━━ POWER OFF ━━━</div>
                )}
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <button
                onClick={togglePower}
                className="group relative"
              >
                <div
                  className="px-8 py-4 rounded-xl transition-all duration-300 border-4"
                  style={{
                    background: isPowerOn
                      ? 'linear-gradient(145deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)'
                      : 'linear-gradient(145deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
                    boxShadow: isPowerOn
                      ? '0 0 30px rgba(220, 38, 38, 0.6), 0 0 60px rgba(220, 38, 38, 0.3), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 8px rgba(0,0,0,0.4)'
                      : '0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 8px rgba(0,0,0,0.5)',
                    borderColor: isPowerOn ? '#7f1d1d' : '#1f2937',
                    transform: 'perspective(100px) rotateX(5deg)'
                  }}
                >
                  <span className="text-xl font-black tracking-widest" style={{
                    color: isPowerOn ? '#fecaca' : '#9ca3af',
                    textShadow: isPowerOn ? '0 0 10px rgba(254, 202, 202, 0.5)' : 'none'
                  }}>
                    {isPowerOn ? 'ON' : 'OFF'}
                  </span>
                </div>
              </button>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-3">
              {songs.slice(0, 6).map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => selectSong(index)}
                  disabled={!isPowerOn}
                  className="relative group"
                >
                  <div
                    className={`w-full aspect-square rounded-2xl transition-all duration-200 flex items-center justify-center ${
                      isPowerOn && currentSongIndex === index && isPlaying
                        ? 'animate-pulse'
                        : ''
                    }`}
                    style={{
                      background: isPowerOn
                        ? currentSongIndex === index && isPlaying
                          ? 'linear-gradient(145deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
                          : 'linear-gradient(145deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%)'
                        : 'linear-gradient(145deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
                      boxShadow: isPowerOn
                        ? currentSongIndex === index && isPlaying
                          ? '0 8px 16px rgba(251, 191, 36, 0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,0,0,0.3)'
                          : '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,0,0,0.2)'
                        : 'inset 0 4px 8px rgba(0,0,0,0.6)',
                      border: '3px solid rgba(0,0,0,0.3)',
                      cursor: isPowerOn ? 'pointer' : 'not-allowed',
                      transform: 'perspective(100px) rotateX(10deg)'
                    }}
                  >
                    <span
                      className={`text-4xl font-black ${
                        isPowerOn ? 'text-amber-950' : 'text-gray-800'
                      }`}
                      style={{
                        textShadow: isPowerOn ? '1px 1px 2px rgba(255,255,255,0.4)' : 'none'
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div
              className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 rounded-xl p-4 border-4 border-amber-900/40"
              style={{
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.7)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="text-xs text-amber-200 font-bold tracking-widest">VOLUME</div>
                <div className="flex-1 relative h-8 flex items-center">
                  <div
                    className="absolute inset-x-0 h-4 bg-black/80 rounded-full border-2 border-amber-900/50"
                    style={{
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{
                        width: `${volume * 100}%`,
                        background: isPowerOn
                          ? 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
                          : 'linear-gradient(90deg, #4b5563 0%, #374151 100%)',
                        boxShadow: isPowerOn
                          ? '0 0 8px rgba(251, 191, 36, 0.6)'
                          : 'none'
                      }}
                    />
                  </div>
                  <div
                    className="absolute h-7 w-7 rounded-full transition-all duration-150 pointer-events-none"
                    style={{
                      left: `calc(${volume * 100}% - 14px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: isPowerOn
                        ? 'linear-gradient(145deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
                        : 'linear-gradient(145deg, #6b7280 0%, #4b5563 100%)',
                      boxShadow: isPowerOn
                        ? '0 4px 8px rgba(0,0,0,0.4), 0 0 12px rgba(251, 191, 36, 0.5), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)'
                        : '0 2px 4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
                      border: '2px solid rgba(0,0,0,0.3)'
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={!isPowerOn}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    style={{
                      cursor: isPowerOn ? 'pointer' : 'not-allowed'
                    }}
                  />
                </div>
                <div className="text-sm text-amber-200 font-bold tracking-wider w-12 text-right tabular-nums">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            </div>
          </div>

          <div
            className="h-3"
            style={{
              background: 'linear-gradient(90deg, #8b4513 0%, #654321 30%, #4a2c14 60%, #3d2817 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      </div>
    </>
  );
}
