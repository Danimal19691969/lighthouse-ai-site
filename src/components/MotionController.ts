import * as THREE from 'three';
import { SimplexNoise } from './SimplexNoise';

export type MotionMode = 'rotate' | 'ripple' | 'pulse' | 'expand' | 'contract' | 'vortex' | 'noise' | 'random';

export interface MotionParams {
  speed: number;
  intensity: number;
}

export const availableMotions: { value: MotionMode; label: string }[] = [
  { value: 'rotate', label: 'Rotate' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'expand', label: 'Expand' },
  { value: 'contract', label: 'Contract' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'noise', label: 'Noise Drift' },
  { value: 'random', label: 'Random' }
];

const noiseGenerator = new SimplexNoise();

let randomModeIndex = 0;
let lastRandomSwitch = 0;
let randomSwitchInterval = 8000;

export function applyMotion(
  particles: THREE.Points,
  time: number,
  mode: MotionMode,
  params: MotionParams,
  basePositions: Float32Array | null,
  rotationRef: { x: number; y: number }
): void {
  let actualMode = mode;

  if (mode === 'random') {
    const currentTime = Date.now();
    if (currentTime - lastRandomSwitch > randomSwitchInterval) {
      randomModeIndex = (randomModeIndex + 1) % 6;
      lastRandomSwitch = currentTime;
      randomSwitchInterval = 8000 + Math.random() * 4000;
    }
    const modes: MotionMode[] = ['rotate', 'ripple', 'pulse', 'expand', 'vortex', 'noise'];
    actualMode = modes[randomModeIndex];
  }

  const geometry = particles.geometry;
  const positionAttribute = geometry.getAttribute('position');
  const positions = positionAttribute.array as Float32Array;

  switch (actualMode) {
    case 'rotate':
      applyRotateMotion(particles, time, params, rotationRef);
      break;

    case 'ripple':
      applyRippleMotion(positions, basePositions, time, params);
      positionAttribute.needsUpdate = true;
      break;

    case 'pulse':
      applyPulseMotion(particles, time, params);
      break;

    case 'expand':
      applyExpandMotion(positions, basePositions, time, params);
      positionAttribute.needsUpdate = true;
      break;

    case 'contract':
      applyContractMotion(positions, basePositions, time, params);
      positionAttribute.needsUpdate = true;
      break;

    case 'vortex':
      applyVortexMotion(positions, basePositions, time, params);
      positionAttribute.needsUpdate = true;
      break;

    case 'noise':
      applyNoiseMotion(positions, basePositions, time, params);
      positionAttribute.needsUpdate = true;
      break;
  }
}

function applyRotateMotion(
  particles: THREE.Points,
  time: number,
  params: MotionParams,
  rotationRef: { x: number; y: number }
): void {
  particles.rotation.x = Math.PI / 18 + rotationRef.x;
  particles.rotation.y = rotationRef.y;
}

function applyRippleMotion(
  positions: Float32Array,
  basePositions: Float32Array | null,
  time: number,
  params: MotionParams
): void {
  if (!basePositions) return;

  const waveFreq = 0.05;
  const waveSpeed = params.speed * 2;
  const amp = params.intensity * 15;

  for (let i = 0; i < positions.length; i += 3) {
    const baseX = basePositions[i];
    const baseY = basePositions[i + 1];
    const baseZ = basePositions[i + 2];

    const d = Math.sqrt(baseX * baseX + baseZ * baseZ);
    const ripple = Math.sin(d * waveFreq - time * waveSpeed) * amp;

    positions[i] = baseX;
    positions[i + 1] = baseY + ripple;
    positions[i + 2] = baseZ;
  }
}

function applyPulseMotion(
  particles: THREE.Points,
  time: number,
  params: MotionParams
): void {
  const scale = 1 + Math.sin(time * params.speed) * params.intensity * 0.3;
  particles.scale.set(scale, scale, scale);
}

function applyExpandMotion(
  positions: Float32Array,
  basePositions: Float32Array | null,
  time: number,
  params: MotionParams
): void {
  if (!basePositions) return;

  const wave = Math.sin(time * params.speed * 0.5);
  const scale = 1 + (wave * 0.5 + 0.5) * params.intensity * 0.5;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = basePositions[i] * scale;
    positions[i + 1] = basePositions[i + 1] * scale;
    positions[i + 2] = basePositions[i + 2] * scale;
  }
}

function applyContractMotion(
  positions: Float32Array,
  basePositions: Float32Array | null,
  time: number,
  params: MotionParams
): void {
  if (!basePositions) return;

  const wave = Math.sin(time * params.speed * 0.5);
  const scale = 1 - (wave * 0.5 + 0.5) * params.intensity * 0.3;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = basePositions[i] * scale;
    positions[i + 1] = basePositions[i + 1] * scale;
    positions[i + 2] = basePositions[i + 2] * scale;
  }
}

function applyVortexMotion(
  positions: Float32Array,
  basePositions: Float32Array | null,
  time: number,
  params: MotionParams
): void {
  if (!basePositions) return;

  for (let i = 0; i < positions.length; i += 3) {
    const baseX = basePositions[i];
    const baseY = basePositions[i + 1];
    const baseZ = basePositions[i + 2];

    const angle = time * params.speed * 0.5 + baseY * 0.01 * params.intensity;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    positions[i] = cosA * baseX - sinA * baseZ;
    positions[i + 1] = baseY;
    positions[i + 2] = sinA * baseX + cosA * baseZ;
  }
}

function applyNoiseMotion(
  positions: Float32Array,
  basePositions: Float32Array | null,
  time: number,
  params: MotionParams
): void {
  if (!basePositions) return;

  const noiseScale = 0.01;
  const noiseSpeed = params.speed * 0.2;
  const amp = params.intensity * 8;

  for (let i = 0; i < positions.length; i += 3) {
    const baseX = basePositions[i];
    const baseY = basePositions[i + 1];
    const baseZ = basePositions[i + 2];

    const noiseX = noiseGenerator.noise3D(
      baseX * noiseScale,
      baseY * noiseScale,
      time * noiseSpeed
    ) * amp;

    const noiseY = noiseGenerator.noise3D(
      baseY * noiseScale,
      baseZ * noiseScale,
      time * noiseSpeed + 100
    ) * amp;

    const noiseZ = noiseGenerator.noise3D(
      baseZ * noiseScale,
      baseX * noiseScale,
      time * noiseSpeed + 200
    ) * amp;

    positions[i] = baseX + noiseX;
    positions[i + 1] = baseY + noiseY;
    positions[i + 2] = baseZ + noiseZ;
  }
}
