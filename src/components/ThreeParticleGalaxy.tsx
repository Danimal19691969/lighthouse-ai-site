import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  generateSaturnShape,
  generateGalaxyShape,
  generateBigBangShape,
  generateOceanWavesShape,
  generateWhoKnowsShape
} from './shapeGenerators';
import { applyMotion, MotionMode } from './MotionController';

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

interface ThreeParticleGalaxyProps {
  settings: ParticleSettingsState;
}

export default function ThreeParticleGalaxy({ settings }: ThreeParticleGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const color1UniformRef = useRef<{ value: THREE.Color } | null>(null);
  const color2UniformRef = useRef<{ value: THREE.Color } | null>(null);
  const settingsRef = useRef<ParticleSettingsState>(settings);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const phasesRef = useRef<Float32Array | null>(null);
  const currentShapeRef = useRef<string>(settings.shape);
  const basePositionsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;
    cameraRef.current = camera;

    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileDevice,
      powerPreference: isMobileDevice ? 'low-power' : 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const particleCount = isMobile ? 30000 : 150000;

    const getShapeData = (shape: string) => {
      switch (shape) {
        case 'galaxy': return generateGalaxyShape(particleCount);
        case 'bigBang': return generateBigBangShape(particleCount);
        case 'oceanWaves': return generateOceanWavesShape(particleCount);
        case 'whoKnows': return generateWhoKnowsShape(particleCount);
        default: return generateSaturnShape(particleCount);
      }
    };

    const shapeData = getShapeData(settings.shape);
    velocitiesRef.current = shapeData.velocities;
    phasesRef.current = shapeData.phases;
    basePositionsRef.current = new Float32Array(shapeData.positions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(shapeData.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(shapeData.colors, 3));

    const color1Uniform = { value: new THREE.Color(settings.color) };
    const color2Uniform = { value: new THREE.Color(settings.secondaryColor) };
    color1UniformRef.current = color1Uniform;
    color2UniformRef.current = color2Uniform;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: color1Uniform,
        color2: color2Uniform,
        pointSize: { value: settings.size * 0.1 },
        brightness: { value: settings.brightness / 100 }
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        uniform float pointSize;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float brightness;
        varying vec3 vColor;

        void main() {
          vec3 mixedColor = mix(color1, color2, vColor.r);
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - dist * 2.0) * brightness;
          gl_FragColor = vec4(mixedColor * brightness, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = Math.PI / 18;
    scene.add(particles);
    particlesRef.current = particles;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let lastTime = Date.now();

    const animate = () => {
      if (!particles || !renderer || !scene || !camera) return;

      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const currentSettings = settingsRef.current;
      const speedFactor = currentSettings.speed / 50;

      const positionAttribute = particles.geometry.getAttribute('position');
      const positionsArray = positionAttribute.array as Float32Array;
      const velocities = velocitiesRef.current;
      const phases = phasesRef.current;

      if (velocities && phases) {
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const phase = phases[i] + currentTime * 0.0003 * speedFactor;

          const wobbleX = Math.sin(phase * 2.3) * velocities[i3] * 2;
          const wobbleY = Math.cos(phase * 1.7) * velocities[i3 + 1] * 2;
          const wobbleZ = Math.sin(phase * 1.9) * velocities[i3 + 2] * 2;

          positionsArray[i3] += wobbleX * deltaTime;
          positionsArray[i3 + 1] += wobbleY * deltaTime;
          positionsArray[i3 + 2] += wobbleZ * deltaTime;
        }
        positionAttribute.needsUpdate = true;
      }

      const rotationSpeedFactor = currentSettings.rotationSpeed / 50;

      if (currentSettings.cursorInteractive) {
        targetRotationRef.current.x = mouseRef.current.y * 0.5;
        targetRotationRef.current.y += (mouseRef.current.x * 0.5 - targetRotationRef.current.y) * 0.1 + deltaTime * 0.05 * speedFactor * rotationSpeedFactor;
      } else {
        targetRotationRef.current.y += deltaTime * 0.15 * speedFactor * rotationSpeedFactor;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      applyMotion(
        particles,
        currentTime / 1000,
        currentSettings.motionMode,
        {
          speed: currentSettings.motionSpeed,
          intensity: currentSettings.motionIntensity
        },
        basePositionsRef.current,
        currentRotationRef.current
      );

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    settingsRef.current = settings;

    if (currentShapeRef.current !== settings.shape && particlesRef.current) {
      currentShapeRef.current = settings.shape;

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      const particleCount = isMobile ? 30000 : 150000;
      const getShapeData = (shape: string) => {
        switch (shape) {
          case 'galaxy': return generateGalaxyShape(particleCount);
          case 'bigBang': return generateBigBangShape(particleCount);
          case 'oceanWaves': return generateOceanWavesShape(particleCount);
          case 'whoKnows': return generateWhoKnowsShape(particleCount);
          default: return generateSaturnShape(particleCount);
        }
      };

      const shapeData = getShapeData(settings.shape);
      velocitiesRef.current = shapeData.velocities;
      phasesRef.current = shapeData.phases;
      basePositionsRef.current = new Float32Array(shapeData.positions);

      const geometry = particlesRef.current.geometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(shapeData.positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(shapeData.colors, 3));
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }

    if (!particlesRef.current) return;
    const material = particlesRef.current.material as THREE.ShaderMaterial;

    if (material.uniforms.pointSize) {
      material.uniforms.pointSize.value = settings.size * 0.1;
    }
    if (material.uniforms.brightness) {
      material.uniforms.brightness.value = settings.brightness / 100;
    }
    if (color1UniformRef.current) {
      color1UniformRef.current.value.set(settings.color);
    }
    if (color2UniformRef.current) {
      color2UniformRef.current.value.set(settings.secondaryColor);
    }
  }, [settings]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[5]"
      style={{
        filter: settings.blur > 0 ? `blur(${settings.blur * 0.5}px)` : 'none'
      }}
    />
  );
}
