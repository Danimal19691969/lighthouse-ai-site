export interface ShapeGeneratorResult {
  positions: Float32Array;
  velocities: Float32Array;
  phases: Float32Array;
  colors: Float32Array;
}

export function generateSaturnShape(particleCount: number): ShapeGeneratorResult {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  const globeParticles = Math.floor(particleCount * 0.35);
  const ringParticles = particleCount - globeParticles;

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    if (i < globeParticles) {
      const radius = Math.pow(Math.random(), 0.6) * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    } else {
      const innerRadius = 50;
      const outerRadius = 130;
      const radius = innerRadius + Math.pow(Math.random(), 0.8) * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const spiralFactor = (radius - innerRadius) / (outerRadius - innerRadius);
      const spinAngle = spiralFactor * Math.PI * 0.5;

      const thickness = 3 + spiralFactor * 2;
      const randomY = (Math.random() - 0.5) * thickness;

      positions[i3] = Math.cos(angle + spinAngle) * radius;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(angle + spinAngle) * radius;
    }

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    phases[i] = Math.random() * Math.PI * 2;

    colors[i3] = Math.random();
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = Math.random();
  }

  return { positions, velocities, phases, colors };
}

export function generateGalaxyShape(particleCount: number): ShapeGeneratorResult {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  const arms = 4;
  const coreParticles = Math.floor(particleCount * 0.15);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    if (i < coreParticles) {
      const radius = Math.pow(Math.random(), 0.5) * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.3;
      positions[i3 + 2] = radius * Math.cos(phi);
    } else {
      const armIndex = Math.floor(Math.random() * arms);
      const radius = 20 + Math.pow(Math.random(), 0.7) * 100;
      const baseAngle = (armIndex / arms) * Math.PI * 2;
      const spiralTightness = 2.5;
      const spiralAngle = baseAngle + (radius / 100) * Math.PI * spiralTightness;
      const randomAngle = (Math.random() - 0.5) * 0.4;

      const thickness = 2 + (radius / 100) * 8;
      const randomY = (Math.random() - 0.5) * thickness;

      positions[i3] = Math.cos(spiralAngle + randomAngle) * radius;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(spiralAngle + randomAngle) * radius;
    }

    velocities[i3] = (Math.random() - 0.5) * 0.015;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.015;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;
    phases[i] = Math.random() * Math.PI * 2;

    colors[i3] = Math.random();
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = Math.random();
  }

  return { positions, velocities, phases, colors };
}

export function generateBigBangShape(particleCount: number): ShapeGeneratorResult {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const explosionStrength = Math.pow(Math.random(), 0.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = explosionStrength * 120;

    positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    positions[i3 + 2] = Math.cos(phi) * radius;

    velocities[i3] = Math.sin(phi) * Math.cos(theta) * 0.08;
    velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * 0.08;
    velocities[i3 + 2] = Math.cos(phi) * 0.08;

    phases[i] = Math.random() * Math.PI * 2;

    colors[i3] = explosionStrength;
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = 1 - explosionStrength;
  }

  return { positions, velocities, phases, colors };
}

export function generateOceanWavesShape(particleCount: number): ShapeGeneratorResult {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  const gridSize = Math.ceil(Math.sqrt(particleCount));

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    const gridX = (i % gridSize) / gridSize;
    const gridZ = Math.floor(i / gridSize) / gridSize;

    const x = (gridX - 0.5) * 200;
    const z = (gridZ - 0.5) * 200;

    const waveFreq1 = 0.03;
    const waveFreq2 = 0.05;
    const y = Math.sin(x * waveFreq1 + z * waveFreq2) * 15 +
              Math.cos(x * waveFreq2 - z * waveFreq1) * 10;

    positions[i3] = x + (Math.random() - 0.5) * 3;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z + (Math.random() - 0.5) * 3;

    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    phases[i] = Math.random() * Math.PI * 2;

    const depthFactor = (gridZ / gridSize);
    colors[i3] = depthFactor;
    colors[i3 + 1] = 0.5 + Math.random() * 0.5;
    colors[i3 + 2] = 1 - depthFactor * 0.5;
  }

  return { positions, velocities, phases, colors };
}

export function generateWhoKnowsShape(particleCount: number): ShapeGeneratorResult {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  const patterns = [
    'dinosaur',
    'square',
    'tree',
    'star',
    'asteroid',
    'thumbsUp',
    'heart',
    'smiley',
    'spaceship',
    'plusSymbol',
    'torus',
    'letterE',
    'letterA',
    'doubleHelix',
    'spiral',
    'pyramid',
    'cube',
    'lightning',
    'flower',
    'hourglass',
    'infinity',
    'diamond',
    'cylinder',
    'cone',
    'wave3d',
    'knot',
    'ribbon',
    'springCoil',
    'tornado',
    'mushroom',
    'rocket',
    'crown',
    'bridge',
    'castle',
    'lighthouse',
    'arrow',
    'crosshair',
    'hexagon',
    'octagon',
    'butterfly',
    'jellyfish',
    'octopus',
    'squid',
    'whale',
    'dolphin',
    'bird',
    'plane',
    'helicopter',
    'balloon',
    'parachute',
    'umbrella',
    'key',
    'anchor',
    'crescent',
    'cloud',
    'snowflake',
    'crystal'
  ];

  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    switch (selectedPattern) {
      case 'dinosaur': {
        const segment = Math.random();
        if (segment < 0.3) {
          const bodyX = (Math.random() - 0.5) * 100;
          const bodyY = -20 + (Math.random() - 0.5) * 30;
          const bodyZ = (Math.random() - 0.5) * 40;
          positions[i3] = bodyX;
          positions[i3 + 1] = bodyY;
          positions[i3 + 2] = bodyZ;
        } else if (segment < 0.45) {
          const neckT = Math.random();
          positions[i3] = 50 + neckT * 20;
          positions[i3 + 1] = -10 + neckT * 40;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
        } else if (segment < 0.55) {
          const r = Math.random() * 15;
          const theta = Math.random() * Math.PI * 2;
          positions[i3] = 70 + r * Math.cos(theta);
          positions[i3 + 1] = 30 + r * Math.sin(theta);
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
        } else if (segment < 0.75) {
          const tailT = Math.random();
          positions[i3] = -50 - tailT * 60;
          positions[i3 + 1] = -20 + Math.sin(tailT * Math.PI) * 30;
          positions[i3 + 2] = (Math.random() - 0.5) * 15;
        } else {
          const legSide = Math.random() < 0.5 ? -1 : 1;
          const legPos = Math.random() < 0.5 ? -20 : 20;
          const legT = Math.random();
          positions[i3] = legPos + (Math.random() - 0.5) * 15;
          positions[i3 + 1] = -35 - legT * 30;
          positions[i3 + 2] = legSide * (20 + (Math.random() - 0.5) * 10);
        }
        break;
      }
      case 'square': {
        const edge = Math.floor(Math.random() * 4);
        const t = Math.random();
        const size = 80;
        const depth = (Math.random() - 0.5) * 20;
        switch (edge) {
          case 0:
            positions[i3] = -size + t * size * 2;
            positions[i3 + 1] = size;
            positions[i3 + 2] = depth;
            break;
          case 1:
            positions[i3] = size;
            positions[i3 + 1] = size - t * size * 2;
            positions[i3 + 2] = depth;
            break;
          case 2:
            positions[i3] = size - t * size * 2;
            positions[i3 + 1] = -size;
            positions[i3 + 2] = depth;
            break;
          case 3:
            positions[i3] = -size;
            positions[i3 + 1] = -size + t * size * 2;
            positions[i3 + 2] = depth;
            break;
        }
        break;
      }
      case 'tree': {
        const segment = Math.random();
        if (segment < 0.25) {
          const trunkRadius = 8 + (Math.random() - 0.5) * 4;
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = trunkRadius * Math.cos(angle);
          positions[i3 + 1] = -80 + Math.random() * 60;
          positions[i3 + 2] = trunkRadius * Math.sin(angle);
        } else {
          const height = -20 + Math.random() * 100;
          const radius = 40 + (1 - (height + 20) / 100) * 30;
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * radius;
          positions[i3] = r * Math.cos(angle);
          positions[i3 + 1] = height;
          positions[i3 + 2] = r * Math.sin(angle);
        }
        break;
      }
      case 'star': {
        const points = 5;
        const outerRadius = 80;
        const innerRadius = 35;
        const pointIndex = Math.floor(Math.random() * points * 2);
        const angle = (pointIndex / (points * 2)) * Math.PI * 2;
        const radius = pointIndex % 2 === 0 ? outerRadius : innerRadius;
        const t = Math.random();
        const nextPointIndex = (pointIndex + 1) % (points * 2);
        const nextAngle = (nextPointIndex / (points * 2)) * Math.PI * 2;
        const nextRadius = nextPointIndex % 2 === 0 ? outerRadius : innerRadius;
        const x = (radius * Math.cos(angle) * (1 - t) + nextRadius * Math.cos(nextAngle) * t);
        const y = (radius * Math.sin(angle) * (1 - t) + nextRadius * Math.sin(nextAngle) * t);
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        break;
      }
      case 'asteroid': {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const noise = Math.sin(theta * 5) * Math.cos(phi * 7) * 0.3 +
                     Math.sin(theta * 11) * Math.sin(phi * 13) * 0.2;
        const radius = 60 + noise * 30;
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        break;
      }
      case 'thumbsUp': {
        const segment = Math.random();
        if (segment < 0.6) {
          const thumbHeight = Math.random();
          const radius = 12 + Math.sin(thumbHeight * Math.PI) * 3;
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = -30 + thumbHeight * 80;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else if (segment < 0.75) {
          const palmT = Math.random();
          positions[i3] = -15 - palmT * 25;
          positions[i3 + 1] = -40 + (Math.random() - 0.5) * 30;
          positions[i3 + 2] = (Math.random() - 0.5) * 25;
        } else {
          const fingerNum = Math.floor(Math.random() * 4);
          const fingerT = Math.random();
          positions[i3] = -40 - fingerT * 20;
          positions[i3 + 1] = -30 + fingerNum * 15 + (Math.random() - 0.5) * 5;
          positions[i3 + 2] = (Math.random() - 0.5) * 8;
        }
        break;
      }
      case 'heart': {
        const t = Math.random() * Math.PI * 2;
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        positions[i3] = heartX * 5;
        positions[i3 + 1] = heartY * 5;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        break;
      }
      case 'smiley': {
        const feature = Math.random();
        if (feature < 0.6) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 60 + (Math.random() - 0.5) * 5;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = radius * Math.sin(angle);
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        } else if (feature < 0.75) {
          const eyeSide = Math.random() < 0.5 ? -1 : 1;
          const r = Math.random() * 8;
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = eyeSide * 25 + r * Math.cos(angle);
          positions[i3 + 1] = 20 + r * Math.sin(angle);
          positions[i3 + 2] = (Math.random() - 0.5) * 5;
        } else {
          const smileT = Math.random();
          const angle = Math.PI * 0.3 + smileT * Math.PI * 0.4;
          const radius = 35;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = -15 - radius * Math.sin(angle);
          positions[i3 + 2] = (Math.random() - 0.5) * 5;
        }
        break;
      }
      case 'spaceship': {
        const segment = Math.random();
        if (segment < 0.4) {
          const bodyT = Math.random();
          const radius = 15 + Math.sin(bodyT * Math.PI) * 8;
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = (Math.random() - 0.5) * 20;
          positions[i3 + 2] = -40 + bodyT * 80;
        } else if (segment < 0.5) {
          const coneT = Math.random();
          const radius = 15 * (1 - coneT);
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = (Math.random() - 0.5) * 10;
          positions[i3 + 2] = 40 + coneT * 30;
        } else if (segment < 0.7) {
          const wingT = Math.random();
          const side = Math.random() < 0.5 ? -1 : 1;
          positions[i3] = side * (15 + wingT * 40);
          positions[i3 + 1] = (Math.random() - 0.5) * 10;
          positions[i3 + 2] = -10 + (Math.random() - 0.5) * 30;
        } else {
          const engineT = Math.random();
          const side = Math.floor(Math.random() * 3) - 1;
          positions[i3] = side * 10 + (Math.random() - 0.5) * 5;
          positions[i3 + 1] = (Math.random() - 0.5) * 10;
          positions[i3 + 2] = -40 - engineT * 25;
        }
        break;
      }
      case 'plusSymbol': {
        const segment = Math.random();
        const width = 20;
        const length = 80;
        if (segment < 0.5) {
          positions[i3] = (Math.random() - 0.5) * width;
          positions[i3 + 1] = (Math.random() - 0.5) * length;
          positions[i3 + 2] = (Math.random() - 0.5) * width;
        } else {
          positions[i3] = (Math.random() - 0.5) * length;
          positions[i3 + 1] = (Math.random() - 0.5) * width;
          positions[i3 + 2] = (Math.random() - 0.5) * width;
        }
        break;
      }
      case 'torus': {
        const torusRadius = 60;
        const tubeRadius = 25;
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        positions[i3] = (torusRadius + tubeRadius * Math.cos(v)) * Math.cos(u);
        positions[i3 + 1] = (torusRadius + tubeRadius * Math.cos(v)) * Math.sin(u);
        positions[i3 + 2] = tubeRadius * Math.sin(v);
        break;
      }
      case 'letterE': {
        const segment = Math.random();
        const height = 100;
        const width = 60;
        const thickness = 15;
        if (segment < 0.33) {
          positions[i3] = -width / 2 + Math.random() * width;
          positions[i3 + 1] = height / 2 + (Math.random() - 0.5) * thickness;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else if (segment < 0.66) {
          positions[i3] = -width / 2 + Math.random() * width;
          positions[i3 + 1] = (Math.random() - 0.5) * thickness;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else if (segment < 0.83) {
          positions[i3] = -width / 2 + Math.random() * width;
          positions[i3 + 1] = -height / 2 + (Math.random() - 0.5) * thickness;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else {
          positions[i3] = -width / 2 + (Math.random() - 0.5) * thickness;
          positions[i3 + 1] = (Math.random() - 0.5) * height;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        }
        break;
      }
      case 'letterA': {
        const segment = Math.random();
        const height = 100;
        const width = 80;
        const thickness = 15;
        if (segment < 0.35) {
          const leftT = Math.random();
          positions[i3] = -width / 2 + leftT * (width / 2) + (Math.random() - 0.5) * thickness;
          positions[i3 + 1] = -height / 2 + leftT * height;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else if (segment < 0.7) {
          const rightT = Math.random();
          positions[i3] = rightT * (width / 2) + (Math.random() - 0.5) * thickness;
          positions[i3 + 1] = -height / 2 + rightT * height;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else {
          const crossT = Math.random();
          positions[i3] = -width / 4 + crossT * (width / 2);
          positions[i3 + 1] = (Math.random() - 0.5) * thickness;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        }
        break;
      }
      case 'doubleHelix': {
        const t = (i / particleCount) * Math.PI * 8;
        const radius = 30;
        const strand = Math.random() < 0.5 ? 0 : Math.PI;
        positions[i3] = radius * Math.cos(t + strand);
        positions[i3 + 1] = t * 10 - 120;
        positions[i3 + 2] = radius * Math.sin(t + strand);
        break;
      }
      case 'spiral': {
        const t = (i / particleCount) * Math.PI * 10;
        const radius = t * 3;
        positions[i3] = radius * Math.cos(t);
        positions[i3 + 1] = t * 8 - 100;
        positions[i3 + 2] = radius * Math.sin(t);
        break;
      }
      case 'pyramid': {
        const level = Math.floor(Math.random() * 10);
        const maxWidth = 80;
        const levelWidth = maxWidth * (1 - level / 10);
        const x = (Math.random() - 0.5) * levelWidth;
        const z = (Math.random() - 0.5) * levelWidth;
        positions[i3] = x;
        positions[i3 + 1] = -60 + level * 12;
        positions[i3 + 2] = z;
        break;
      }
      case 'cube': {
        const face = Math.floor(Math.random() * 6);
        const size = 70;
        const u = (Math.random() - 0.5) * size;
        const v = (Math.random() - 0.5) * size;
        switch (face) {
          case 0: positions[i3] = size/2; positions[i3 + 1] = u; positions[i3 + 2] = v; break;
          case 1: positions[i3] = -size/2; positions[i3 + 1] = u; positions[i3 + 2] = v; break;
          case 2: positions[i3] = u; positions[i3 + 1] = size/2; positions[i3 + 2] = v; break;
          case 3: positions[i3] = u; positions[i3 + 1] = -size/2; positions[i3 + 2] = v; break;
          case 4: positions[i3] = u; positions[i3 + 1] = v; positions[i3 + 2] = size/2; break;
          case 5: positions[i3] = u; positions[i3 + 1] = v; positions[i3 + 2] = -size/2; break;
        }
        break;
      }
      case 'lightning': {
        const segment = Math.floor(Math.random() * 8);
        const zigzag = (segment % 2) * 40 - 20;
        positions[i3] = zigzag + (Math.random() - 0.5) * 15;
        positions[i3 + 1] = 80 - segment * 20 + (Math.random() - 0.5) * 8;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        break;
      }
      case 'flower': {
        const petals = 8;
        const t = Math.random() * Math.PI * 2;
        const petalIndex = Math.floor(Math.random() * petals);
        const petalAngle = (petalIndex / petals) * Math.PI * 2;
        const r = 30 + 20 * Math.cos((t - petalAngle) * petals / 2);
        const radius = Math.random() * r;
        positions[i3] = radius * Math.cos(t);
        positions[i3 + 1] = radius * Math.sin(t);
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        break;
      }
      case 'hourglass': {
        const t = Math.random();
        const y = (t - 0.5) * 100;
        const radius = 20 + Math.abs(Math.abs(t - 0.5) - 0.5) * 40;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        positions[i3] = r * Math.cos(angle);
        positions[i3 + 1] = y;
        positions[i3 + 2] = r * Math.sin(angle);
        break;
      }
      case 'infinity': {
        const t = Math.random() * Math.PI * 2;
        const scale = 40;
        positions[i3] = scale * Math.sin(t) / (1 + Math.cos(t) * Math.cos(t));
        positions[i3 + 1] = scale * Math.sin(t) * Math.cos(t) / (1 + Math.cos(t) * Math.cos(t));
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        break;
      }
      case 'diamond': {
        const t = Math.random();
        const segment = Math.floor(Math.random() * 8);
        const angle = (segment / 8) * Math.PI * 2;
        const radius = t < 0.5 ? t * 60 : (1 - t) * 60;
        const height = t < 0.5 ? t * 80 : -(1 - t) * 80;
        positions[i3] = radius * Math.cos(angle);
        positions[i3 + 1] = height;
        positions[i3 + 2] = radius * Math.sin(angle);
        break;
      }
      case 'cylinder': {
        const angle = Math.random() * Math.PI * 2;
        const radius = 40;
        const height = (Math.random() - 0.5) * 100;
        positions[i3] = radius * Math.cos(angle);
        positions[i3 + 1] = height;
        positions[i3 + 2] = radius * Math.sin(angle);
        break;
      }
      case 'cone': {
        const t = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const radius = (1 - t) * 50;
        positions[i3] = radius * Math.cos(angle);
        positions[i3 + 1] = t * 100 - 50;
        positions[i3 + 2] = radius * Math.sin(angle);
        break;
      }
      case 'wave3d': {
        const gridX = (i % 40) / 40;
        const gridZ = Math.floor(i / 40) / 40;
        const x = (gridX - 0.5) * 120;
        const z = (gridZ - 0.5) * 120;
        const y = Math.sin(x * 0.1) * 20 + Math.cos(z * 0.1) * 20;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        break;
      }
      case 'knot': {
        const t = Math.random() * Math.PI * 2;
        const p = 2, q = 3;
        const r = 30;
        positions[i3] = r * (2 + Math.cos(q * t)) * Math.cos(p * t);
        positions[i3 + 1] = r * (2 + Math.cos(q * t)) * Math.sin(p * t);
        positions[i3 + 2] = r * Math.sin(q * t);
        break;
      }
      case 'ribbon': {
        const t = (i / particleCount) * Math.PI * 6;
        const width = 20;
        const offset = (Math.random() - 0.5) * width;
        const radius = 40;
        positions[i3] = (radius + offset) * Math.cos(t);
        positions[i3 + 1] = t * 8 - 80;
        positions[i3 + 2] = (radius + offset) * Math.sin(t);
        break;
      }
      case 'springCoil': {
        const t = (i / particleCount) * Math.PI * 12;
        const radius = 25;
        positions[i3] = radius * Math.cos(t);
        positions[i3 + 1] = t * 6 - 100;
        positions[i3 + 2] = radius * Math.sin(t);
        break;
      }
      case 'tornado': {
        const t = Math.random();
        const angle = t * Math.PI * 8;
        const radius = t * 60;
        positions[i3] = radius * Math.cos(angle);
        positions[i3 + 1] = t * 120 - 60;
        positions[i3 + 2] = radius * Math.sin(angle);
        break;
      }
      case 'mushroom': {
        const segment = Math.random();
        if (segment < 0.4) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 50;
          const capCurve = Math.sqrt(50 * 50 - r * r);
          positions[i3] = r * Math.cos(angle);
          positions[i3 + 1] = 30 - capCurve * 0.3;
          positions[i3 + 2] = r * Math.sin(angle);
        } else {
          const angle = Math.random() * Math.PI * 2;
          const radius = 8 + Math.random() * 8;
          const height = -60 + Math.random() * 90;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = height;
          positions[i3 + 2] = radius * Math.sin(angle);
        }
        break;
      }
      case 'rocket': {
        const segment = Math.random();
        if (segment < 0.2) {
          const t = Math.random();
          const radius = 10 * (1 - t);
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = 50 + t * 30;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else if (segment < 0.6) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 10;
          const height = -50 + Math.random() * 100;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = height;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else {
          const finNum = Math.floor(Math.random() * 4);
          const finAngle = (finNum / 4) * Math.PI * 2;
          const t = Math.random();
          positions[i3] = (10 + t * 15) * Math.cos(finAngle);
          positions[i3 + 1] = -50 + (Math.random() - 0.5) * 20;
          positions[i3 + 2] = (10 + t * 15) * Math.sin(finAngle);
        }
        break;
      }
      case 'crown': {
        const segment = Math.random();
        const points = 7;
        if (segment < 0.4) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 45;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = -20 + (Math.random() - 0.5) * 15;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else {
          const pointIndex = Math.floor(Math.random() * points);
          const angle = (pointIndex / points) * Math.PI * 2;
          const t = Math.random();
          const radius = 45 - t * 10;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = -20 + t * 40;
          positions[i3 + 2] = radius * Math.sin(angle);
        }
        break;
      }
      case 'bridge': {
        const segment = Math.random();
        if (segment < 0.6) {
          const x = (Math.random() - 0.5) * 120;
          const arch = 40 - (x * x) / 180;
          positions[i3] = x;
          positions[i3 + 1] = -30 + arch;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
        } else {
          const pillarX = Math.random() < 0.5 ? -50 : 50;
          const pillarT = Math.random();
          positions[i3] = pillarX + (Math.random() - 0.5) * 15;
          positions[i3 + 1] = -70 + pillarT * 50;
          positions[i3 + 2] = (Math.random() - 0.5) * 15;
        }
        break;
      }
      case 'castle': {
        const tower = Math.floor(Math.random() * 5);
        const towerX = (tower - 2) * 35;
        const segment = Math.random();
        if (segment < 0.7) {
          const height = Math.random() * 80;
          positions[i3] = towerX + (Math.random() - 0.5) * 15;
          positions[i3 + 1] = -60 + height;
          positions[i3 + 2] = (Math.random() - 0.5) * 15;
        } else {
          const battlementT = Math.random();
          positions[i3] = towerX + (Math.random() - 0.5) * 20;
          positions[i3 + 1] = 20 + Math.floor(battlementT * 4) * 8;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
        }
        break;
      }
      case 'lighthouse': {
        const segment = Math.random();
        if (segment < 0.6) {
          const angle = Math.random() * Math.PI * 2;
          const height = Math.random() * 100;
          const radius = 15 - (height / 100) * 5;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = -60 + height;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else {
          const angle = Math.random() * Math.PI * 2;
          const radius = 18;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = 40 + (Math.random() - 0.5) * 12;
          positions[i3 + 2] = radius * Math.sin(angle);
        }
        break;
      }
      case 'arrow': {
        const segment = Math.random();
        if (segment < 0.3) {
          const t = Math.random();
          const width = (1 - t) * 40;
          positions[i3] = (Math.random() - 0.5) * width;
          positions[i3 + 1] = 20 + t * 60;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        } else {
          const t = Math.random();
          positions[i3] = (Math.random() - 0.5) * 15;
          positions[i3 + 1] = -60 + t * 80;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
        break;
      }
      case 'crosshair': {
        const segment = Math.random();
        if (segment < 0.15) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 50;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = radius * Math.sin(angle);
          positions[i3 + 2] = (Math.random() - 0.5) * 8;
        } else if (segment < 0.5) {
          positions[i3] = (Math.random() - 0.5) * 5;
          positions[i3 + 1] = (Math.random() - 0.5) * 100;
          positions[i3 + 2] = (Math.random() - 0.5) * 5;
        } else {
          positions[i3] = (Math.random() - 0.5) * 100;
          positions[i3 + 1] = (Math.random() - 0.5) * 5;
          positions[i3 + 2] = (Math.random() - 0.5) * 5;
        }
        break;
      }
      case 'hexagon': {
        const sides = 6;
        const side = Math.floor(Math.random() * sides);
        const t = Math.random();
        const size = 60;
        const angle1 = (side / sides) * Math.PI * 2;
        const angle2 = ((side + 1) / sides) * Math.PI * 2;
        positions[i3] = size * Math.cos(angle1) * (1 - t) + size * Math.cos(angle2) * t;
        positions[i3 + 1] = size * Math.sin(angle1) * (1 - t) + size * Math.sin(angle2) * t;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        break;
      }
      case 'octagon': {
        const sides = 8;
        const side = Math.floor(Math.random() * sides);
        const t = Math.random();
        const size = 55;
        const angle1 = (side / sides) * Math.PI * 2;
        const angle2 = ((side + 1) / sides) * Math.PI * 2;
        positions[i3] = size * Math.cos(angle1) * (1 - t) + size * Math.cos(angle2) * t;
        positions[i3 + 1] = size * Math.sin(angle1) * (1 - t) + size * Math.sin(angle2) * t;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        break;
      }
      case 'butterfly': {
        const t = Math.random() * Math.PI * 2;
        const r = Math.sin(t) * Math.cos(t) - Math.sin(4 * t) * 0.3;
        const scale = 50;
        const side = Math.random() < 0.5 ? 1 : -1;
        positions[i3] = side * scale * r * Math.cos(t);
        positions[i3 + 1] = scale * r * Math.sin(t);
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        break;
      }
      case 'jellyfish': {
        const segment = Math.random();
        if (segment < 0.4) {
          const t = Math.random();
          const radius = 35 * Math.sin(t * Math.PI);
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * radius;
          positions[i3] = r * Math.cos(angle);
          positions[i3 + 1] = 30 - t * 60;
          positions[i3 + 2] = r * Math.sin(angle);
        } else {
          const tentacle = Math.floor(Math.random() * 8);
          const tentAngle = (tentacle / 8) * Math.PI * 2;
          const t = Math.random();
          const wave = Math.sin(t * Math.PI * 4) * 10;
          positions[i3] = (20 + wave) * Math.cos(tentAngle);
          positions[i3 + 1] = -30 - t * 60;
          positions[i3 + 2] = (20 + wave) * Math.sin(tentAngle);
        }
        break;
      }
      case 'octopus': {
        const segment = Math.random();
        if (segment < 0.3) {
          const angle = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const radius = 25 + Math.random() * 10;
          positions[i3] = radius * Math.sin(phi) * Math.cos(angle);
          positions[i3 + 1] = 20 + radius * Math.cos(phi);
          positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(angle);
        } else {
          const arm = Math.floor(Math.random() * 8);
          const armAngle = (arm / 8) * Math.PI * 2;
          const t = Math.random();
          const curve = Math.sin(t * Math.PI * 2) * 15;
          positions[i3] = (25 + t * 40 + curve) * Math.cos(armAngle);
          positions[i3 + 1] = 20 - t * 80;
          positions[i3 + 2] = (25 + t * 40 + curve) * Math.sin(armAngle);
        }
        break;
      }
      case 'squid': {
        const segment = Math.random();
        if (segment < 0.35) {
          const angle = Math.random() * Math.PI * 2;
          const t = Math.random();
          const radius = 15 + t * 10;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = 30 - t * 80;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else if (segment < 0.5) {
          const finT = Math.random();
          const side = Math.random() < 0.5 ? 1 : -1;
          positions[i3] = side * (25 + finT * 20);
          positions[i3 + 1] = 20 - finT * 30;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
        } else {
          const tentacle = Math.floor(Math.random() * 10);
          const offset = (tentacle - 4.5) * 8;
          const t = Math.random();
          positions[i3] = offset + Math.sin(t * Math.PI * 3) * 8;
          positions[i3 + 1] = -50 - t * 50;
          positions[i3 + 2] = (Math.random() - 0.5) * 12;
        }
        break;
      }
      case 'whale': {
        const segment = Math.random();
        if (segment < 0.5) {
          const t = Math.random();
          const bodyRadius = 25 + Math.sin(t * Math.PI) * 15;
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * bodyRadius;
          positions[i3] = (t - 0.5) * 120;
          positions[i3 + 1] = r * Math.sin(angle);
          positions[i3 + 2] = r * Math.cos(angle);
        } else if (segment < 0.65) {
          const t = Math.random();
          positions[i3] = 50 + t * 30;
          positions[i3 + 1] = (Math.random() - 0.5) * 20;
          positions[i3 + 2] = (t * 2 - 1) * 40;
        } else {
          const flipperSide = Math.random() < 0.5 ? 1 : -1;
          const t = Math.random();
          positions[i3] = -20 + (Math.random() - 0.5) * 30;
          positions[i3 + 1] = flipperSide * (20 + t * 25);
          positions[i3 + 2] = (Math.random() - 0.5) * 15;
        }
        break;
      }
      case 'dolphin': {
        const t = (i / particleCount);
        const bodyX = (t - 0.5) * 100;
        const arch = -Math.abs(t - 0.5) * 80;
        const bodyRadius = 12 + Math.sin(t * Math.PI) * 8;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * bodyRadius;
        positions[i3] = bodyX;
        positions[i3 + 1] = arch + r * Math.sin(angle);
        positions[i3 + 2] = r * Math.cos(angle);
        break;
      }
      case 'bird': {
        const segment = Math.random();
        if (segment < 0.3) {
          const t = Math.random();
          const radius = 10 + t * 5;
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = (Math.random() - 0.5) * 20;
          positions[i3 + 2] = -20 + t * 40;
        } else {
          const side = Math.random() < 0.5 ? 1 : -1;
          const wingT = Math.random();
          const wingCurve = Math.sin(wingT * Math.PI) * 20;
          positions[i3] = side * (15 + wingT * 50);
          positions[i3 + 1] = wingCurve;
          positions[i3 + 2] = (Math.random() - 0.5) * 15;
        }
        break;
      }
      case 'plane': {
        const segment = Math.random();
        if (segment < 0.35) {
          const t = Math.random();
          const radius = 8 + t * 4;
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = (Math.random() - 0.5) * 15;
          positions[i3 + 2] = -50 + t * 100;
        } else if (segment < 0.45) {
          const noseT = Math.random();
          const radius = 8 * (1 - noseT);
          const angle = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = (Math.random() - 0.5) * 8;
          positions[i3 + 2] = 50 + noseT * 20;
        } else {
          const side = Math.random() < 0.5 ? 1 : -1;
          const wingT = Math.random();
          positions[i3] = side * (10 + wingT * 60);
          positions[i3 + 1] = (Math.random() - 0.5) * 8;
          positions[i3 + 2] = -10 + (Math.random() - 0.5) * 40;
        }
        break;
      }
      case 'helicopter': {
        const segment = Math.random();
        if (segment < 0.25) {
          const t = Math.random();
          const bladeAngle = (Math.floor(Math.random() * 4) / 4) * Math.PI * 2 + t * (Math.PI / 2);
          const radius = 10 + t * 50;
          positions[i3] = radius * Math.cos(bladeAngle);
          positions[i3 + 1] = 40 + (Math.random() - 0.5) * 5;
          positions[i3 + 2] = radius * Math.sin(bladeAngle);
        } else if (segment < 0.55) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 15;
          const height = -30 + Math.random() * 70;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = height;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else {
          const t = Math.random();
          positions[i3] = 15 + t * 30;
          positions[i3 + 1] = -20 + (Math.random() - 0.5) * 15;
          positions[i3 + 2] = (Math.random() - 0.5) * 12;
        }
        break;
      }
      case 'balloon': {
        const segment = Math.random();
        if (segment < 0.7) {
          const angle = Math.random() * Math.PI * 2;
          const t = Math.random();
          const phi = Math.acos(1 - 2 * t);
          const radius = 35 * (1 - t * 0.3);
          positions[i3] = radius * Math.sin(phi) * Math.cos(angle);
          positions[i3 + 1] = 20 + radius * Math.cos(phi);
          positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(angle);
        } else {
          const stringT = Math.random();
          positions[i3] = (Math.random() - 0.5) * 5;
          positions[i3 + 1] = 20 - stringT * 80;
          positions[i3 + 2] = (Math.random() - 0.5) * 5;
        }
        break;
      }
      case 'parachute': {
        const segment = Math.random();
        if (segment < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const t = Math.random();
          const radius = 45 * Math.sin(t * Math.PI / 2);
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = 50 - t * 30;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else {
          const line = Math.floor(Math.random() * 12);
          const lineAngle = (line / 12) * Math.PI * 2;
          const t = Math.random();
          positions[i3] = 40 * Math.cos(lineAngle) * (1 - t);
          positions[i3 + 1] = 20 - t * 60;
          positions[i3 + 2] = 40 * Math.sin(lineAngle) * (1 - t);
        }
        break;
      }
      case 'umbrella': {
        const segment = Math.random();
        if (segment < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const t = Math.random();
          const radius = t * 45;
          const dip = -Math.sin(t * Math.PI) * 15;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = 30 + dip;
          positions[i3 + 2] = radius * Math.sin(angle);
        } else {
          const poleT = Math.random();
          positions[i3] = (Math.random() - 0.5) * 4;
          positions[i3 + 1] = 30 - poleT * 80;
          positions[i3 + 2] = (Math.random() - 0.5) * 4;
        }
        break;
      }
      case 'key': {
        const segment = Math.random();
        if (segment < 0.4) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 20;
          positions[i3] = 50 + radius * Math.cos(angle);
          positions[i3 + 1] = radius * Math.sin(angle);
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        } else if (segment < 0.75) {
          const t = Math.random();
          positions[i3] = 50 - t * 80;
          positions[i3 + 1] = (Math.random() - 0.5) * 12;
          positions[i3 + 2] = (Math.random() - 0.5) * 8;
        } else {
          const tooth = Math.floor(Math.random() * 4);
          const toothT = Math.random();
          positions[i3] = -30 - tooth * 10;
          positions[i3 + 1] = -12 - toothT * 15;
          positions[i3 + 2] = (Math.random() - 0.5) * 6;
        }
        break;
      }
      case 'anchor': {
        const segment = Math.random();
        if (segment < 0.15) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 15;
          positions[i3] = radius * Math.cos(angle);
          positions[i3 + 1] = 50 + radius * Math.sin(angle);
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        } else if (segment < 0.5) {
          const shaftT = Math.random();
          positions[i3] = (Math.random() - 0.5) * 8;
          positions[i3 + 1] = 50 - shaftT * 100;
          positions[i3 + 2] = (Math.random() - 0.5) * 8;
        } else {
          const side = Math.random() < 0.5 ? 1 : -1;
          const armT = Math.random();
          positions[i3] = side * armT * 40;
          positions[i3 + 1] = -50 + armT * 25;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
        break;
      }
      case 'crescent': {
        const t = Math.random() * Math.PI * 1.5 + Math.PI * 0.25;
        const outerR = 50;
        const innerR = 35;
        const curve = Math.random() < 0.5 ? outerR : innerR;
        positions[i3] = curve * Math.cos(t);
        positions[i3 + 1] = curve * Math.sin(t);
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        break;
      }
      case 'cloud': {
        const bump = Math.floor(Math.random() * 5);
        const bumpX = (bump - 2) * 25;
        const bumpRadius = 20 + Math.random() * 15;
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * bumpRadius;
        positions[i3] = bumpX + r * Math.sin(phi) * Math.cos(angle);
        positions[i3 + 1] = r * Math.cos(phi);
        positions[i3 + 2] = r * Math.sin(phi) * Math.sin(angle);
        break;
      }
      case 'snowflake': {
        const arms = 6;
        const arm = Math.floor(Math.random() * arms);
        const angle = (arm / arms) * Math.PI * 2;
        const t = Math.random();
        const radius = t * 50;
        const branch = Math.random() < 0.3 ? (Math.random() - 0.5) * 20 : 0;
        positions[i3] = radius * Math.cos(angle) + branch * Math.cos(angle + Math.PI / 2);
        positions[i3 + 1] = radius * Math.sin(angle) + branch * Math.sin(angle + Math.PI / 2);
        positions[i3 + 2] = (Math.random() - 0.5) * 8;
        break;
      }
      case 'crystal': {
        const facet = Math.floor(Math.random() * 12);
        const angle = (facet / 12) * Math.PI * 2;
        const t = Math.random();
        const height = (t - 0.5) * 80;
        const radius = 30 - Math.abs(height) * 0.3;
        const r = Math.random() * radius;
        positions[i3] = r * Math.cos(angle);
        positions[i3 + 1] = height;
        positions[i3 + 2] = r * Math.sin(angle);
        break;
      }
    }

    const speed = 0.015 + Math.random() * 0.02;
    velocities[i3] = (Math.random() - 0.5) * speed;
    velocities[i3 + 1] = (Math.random() - 0.5) * speed;
    velocities[i3 + 2] = (Math.random() - 0.5) * speed;

    phases[i] = Math.random() * Math.PI * 2;

    colors[i3] = Math.random() * 0.6 + 0.4;
    colors[i3 + 1] = Math.random() * 0.6 + 0.4;
    colors[i3 + 2] = Math.random() * 0.6 + 0.4;
  }

  return { positions, velocities, phases, colors };
}
