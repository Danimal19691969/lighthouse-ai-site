import { Settings, X } from 'lucide-react';
import { MotionMode, availableMotions } from './MotionController';

interface ParticleSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: ParticleSettingsState) => void;
  settings: ParticleSettingsState;
}

export interface ParticleSettingsState {
  cursorInteractive: boolean;
  brightness: number;
  speed: number;
  size: number;
  blur: number;
  color: string;
  secondaryColor: string;
  rotationSpeed: number;
  shape: 'saturn' | 'galaxy' | 'bigBang' | 'oceanWaves' | 'whoKnows';
  motionMode: MotionMode;
  motionSpeed: number;
  motionIntensity: number;
}

export default function ParticleSettings({ isOpen, onClose, onSettingsChange, settings }: ParticleSettingsProps) {
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 40);
    const lightness = 50 + Math.floor(Math.random() * 30);
    const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
    return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const updateSetting = <K extends keyof ParticleSettingsState>(key: K, value: ParticleSettingsState[K]) => {
    let newSettings = { ...settings, [key]: value };

    if (key === 'shape' && value === 'whoKnows') {
      newSettings = {
        ...newSettings,
        brightness: 50 + Math.floor(Math.random() * 51),
        speed: 5 + Math.floor(Math.random() * 46),
        size: 5 + Math.floor(Math.random() * 21),
        blur: 0,
        color: generateRandomColor(),
        secondaryColor: generateRandomColor(),
        rotationSpeed: 20 + Math.floor(Math.random() * 61)
      };
    }

    onSettingsChange(newSettings);
  };

  const randomizeColors = () => {
    const newSettings = {
      ...settings,
      color: generateRandomColor(),
      secondaryColor: generateRandomColor(),
      brightness: 50 + Math.floor(Math.random() * 51)
    };
    onSettingsChange(newSettings);
  };

  const randomizeEverything = () => {
    const shapes: ParticleSettingsState['shape'][] = ['saturn', 'galaxy', 'bigBang', 'oceanWaves', 'whoKnows'];
    const currentShape = settings.shape;
    let newShape: ParticleSettingsState['shape'];

    if (currentShape === 'whoKnows') {
      const otherShapes = shapes.filter(s => s !== 'whoKnows');
      newShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
    } else {
      newShape = 'whoKnows';
    }

    const newSettings = {
      ...settings,
      shape: newShape,
      brightness: 50 + Math.floor(Math.random() * 51),
      speed: 5 + Math.floor(Math.random() * 46),
      size: 5 + Math.floor(Math.random() * 21),
      blur: 0,
      color: generateRandomColor(),
      secondaryColor: generateRandomColor(),
      rotationSpeed: 20 + Math.floor(Math.random() * 61)
    };
    onSettingsChange(newSettings);

    setTimeout(() => {
      onSettingsChange({
        ...newSettings,
        shape: 'whoKnows'
      });
    }, 50);
  };

  const resetToDefaults = () => {
    const defaults: ParticleSettingsState = {
      cursorInteractive: false,
      brightness: 80,
      speed: 13,
      size: 10,
      blur: 0,
      color: '#5eee20',
      secondaryColor: '#c026d3',
      rotationSpeed: 50,
      shape: 'oceanWaves',
      motionMode: 'rotate',
      motionSpeed: 1,
      motionIntensity: 0.5
    };
    onSettingsChange(defaults);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[159] bg-black/30"
        onClick={onClose}
      />
      <div
        className="fixed bottom-20 right-8 z-[160] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl p-5 w-[320px] max-w-[calc(100vw-4rem)] max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-cyan-100 text-base">Particle Effects</h3>
          <button
            onClick={onClose}
            className="text-cyan-300 hover:text-cyan-100 transition-colors bg-black/20 rounded-full p-1 hover:bg-black/30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100 font-medium mb-1">
                <Settings size={16} className="text-cyan-400" />
                <span>Cursor Interactive</span>
              </div>
              <p className="text-xs text-cyan-200/70">Particles follow your cursor</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cursorInteractive}
                onChange={(e) => updateSetting('cursorInteractive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-cyan-100 font-medium">Particle Shape</div>
            <button
              onClick={randomizeEverything}
              className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/30"
            >
              AGAIN
            </button>
          </div>
          <div className="space-y-2">
            {[
              { value: 'saturn', label: 'Saturn' },
              { value: 'galaxy', label: 'Galaxy' },
              { value: 'bigBang', label: 'Big Bang' },
              { value: 'oceanWaves', label: 'Ocean Waves' },
              { value: 'whoKnows', label: 'Who Knows?' }
            ].map((shape) => (
              <label key={shape.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="shape"
                  checked={settings.shape === shape.value}
                  onChange={() => updateSetting('shape', shape.value as ParticleSettingsState['shape'])}
                  className="w-4 h-4 text-cyan-500 bg-slate-700 border-cyan-500/40 focus:ring-cyan-500 focus:ring-2"
                />
                <span className="text-sm text-cyan-200 group-hover:text-cyan-100 transition-colors">{shape.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-cyan-200 mb-2 block">Brightness: {settings.brightness}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.brightness}
              onChange={(e) => updateSetting('brightness', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-cyan-200 mb-2 block">Speed: {settings.speed}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.speed}
              onChange={(e) => updateSetting('speed', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-cyan-200 mb-2 block">Size: {settings.size}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.size}
              onChange={(e) => updateSetting('size', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-cyan-200 mb-2 block">Blur: {settings.blur}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.blur}
              onChange={(e) => updateSetting('blur', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-cyan-200 mb-2 block">Rotation Speed: {settings.rotationSpeed}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.rotationSpeed}
              onChange={(e) => updateSetting('rotationSpeed', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 rounded-xl p-4">
          <div className="text-cyan-100 font-medium mb-3">Motion System</div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-cyan-200 mb-2 block">Motion Type</label>
              <select
                value={settings.motionMode}
                onChange={(e) => updateSetting('motionMode', e.target.value as MotionMode)}
                className="w-full bg-slate-700 text-cyan-100 border-2 border-purple-500/40 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              >
                {availableMotions.map((motion) => (
                  <option key={motion.value} value={motion.value}>
                    {motion.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-cyan-200 mb-2 block">Motion Speed: {settings.motionSpeed.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={settings.motionSpeed}
                onChange={(e) => updateSetting('motionSpeed', Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-cyan-200 mb-2 block">Motion Intensity: {(settings.motionIntensity * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.motionIntensity}
                onChange={(e) => updateSetting('motionIntensity', Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-cyan-200">Primary Color</label>
              <button
                onClick={randomizeColors}
                className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/30"
              >
                Color Mix
              </button>
            </div>
            <input
              type="color"
              value={settings.color}
              onChange={(e) => updateSetting('color', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-2 border-cyan-500/40"
            />
          </div>
          <div>
            <label className="text-sm text-cyan-200 mb-2 block">Secondary Color</label>
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => updateSetting('secondaryColor', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-2 border-cyan-500/40"
            />
          </div>
          <button
            onClick={resetToDefaults}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
}
