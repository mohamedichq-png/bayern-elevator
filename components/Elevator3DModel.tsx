"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, CameraControls, Text, Html } from "@react-three/drei";
import { useConfiguratorStore, MaterialOption, LightingType } from "@/store/useConfiguratorStore";
import { elevatorAudio } from "@/lib/audioChime";
import * as THREE from "three";
import { 
  DoorOpen, 
  DoorClosed, 
  Building2, 
  Box, 
  Camera as CameraIcon, 
  Expand, 
  Shrink, 
  Eye, 
  EyeOff, 
  Compass, 
  Layers, 
  Sparkles, 
  Square, 
  KeySquare, 
  ShieldCheck, 
  CircleDot 
} from "lucide-react";

// Helper to create Three.js PBR material
function ElevatorMaterial({ mat }: { mat: MaterialOption }) {
  if (mat.transmission) {
    return (
      <meshPhysicalMaterial
        color={mat.color}
        metalness={mat.metalness || 0}
        roughness={mat.roughness || 0}
        transmission={mat.transmission}
        thickness={mat.thickness || 0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={0.9}
        transparent
        opacity={0.85}
      />
    );
  }
  return (
    <meshStandardMaterial
      color={mat.color}
      metalness={mat.metalness ?? 0.4}
      roughness={mat.roughness ?? 0.5}
    />
  );
}

// ----------------------------------------------------
// DIGITAL POSITION INDICATOR (PI)
// ----------------------------------------------------
function PositionIndicatorDisplay({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const { piStyle, currentFloor, haloColor } = useConfiguratorStore();
  const [dotPulse, setDotPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setDotPulse(p => !p), 800);
    return () => clearInterval(interval);
  }, []);

  const getScreenColor = () => {
    if (piStyle === 'tft_color') return '#0f172a';
    if (piStyle === 'segmented_led') return '#18181b';
    return '#050505';
  };

  const getTextColor = () => {
    if (piStyle === 'tft_color') return '#38bdf8';
    if (piStyle === 'segmented_led') return '#f97316';
    return haloColor === 'emerald' ? '#10b981' : haloColor === 'red' ? '#ef4444' : haloColor === 'amber' ? '#f59e0b' : '#60a5fa';
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Screen Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.36, 0.18, 0.015]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Screen Display Area */}
      <mesh position={[0, 0, 0.009]}>
        <planeGeometry args={[0.33, 0.15]} />
        <meshBasicMaterial color={getScreenColor()} />
      </mesh>
      {/* Dynamic Digital Text */}
      <group position={[0, 0, 0.011]}>
        <Text
          position={[-0.07, 0.01, 0]}
          fontSize={0.075}
          color={getTextColor()}
          anchorX="center"
          anchorY="middle"
        >
          {`${currentFloor}`}
        </Text>
        <Text
          position={[0.05, 0.015, 0]}
          fontSize={0.05}
          color={dotPulse ? getTextColor() : '#334155'}
          anchorX="center"
          anchorY="middle"
        >
          ▲
        </Text>
        <Text
          position={[0, -0.048, 0]}
          fontSize={0.02}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          BAYERN SYSTEMS
        </Text>
      </group>
    </group>
  );
}

// Generate deterministic starlight points outside render to ensure purity
const STAR_COUNT = 140;
const STAR_POSITIONS = new Float32Array(STAR_COUNT * 3);
for (let i = 0; i < STAR_COUNT; i++) {
  // Deterministic pseudo-random distribution
  const pseudoX = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  const pseudoZ = Math.cos(i * 39.346 + 11.135) * 23421.631;
  STAR_POSITIONS[i * 3] = ((pseudoX - Math.floor(pseudoX)) - 0.5) * 2.7;
  STAR_POSITIONS[i * 3 + 1] = 1.48; // Ceiling plane height
  STAR_POSITIONS[i * 3 + 2] = ((pseudoZ - Math.floor(pseudoZ)) - 0.5) * 2.7;
}

// ----------------------------------------------------
// FIBER-OPTIC STARLIGHT CEILING (Volks & Diamond Style)
// ----------------------------------------------------
function StarlightFiberCeiling() {
  const starsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.getElapsedTime();
      starsRef.current.rotation.y = Math.sin(time * 0.05) * 0.02;
    }
  });

  return (
    <group>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[STAR_POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#e0f2fe"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Soft Ambient Starlight Glow */}
      <pointLight position={[0, 1.4, 0]} intensity={0.6} color="#60a5fa" distance={3} />
    </group>
  );
}

// ----------------------------------------------------
// 3D INTERACTIVE HOTSPOT PIN
// ----------------------------------------------------
function InteractiveHotspot({ 
  position, 
  label, 
  labelAr, 
  stepId, 
  icon: Icon 
}: { 
  position: [number, number, number]; 
  label: string; 
  labelAr: string; 
  stepId: number; 
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { language, showHotspots, setActiveStep, setViewMode } = useConfiguratorStore();
  const [isHovered, setIsHovered] = useState(false);

  if (!showHotspots) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    elevatorAudio.playButtonClick();
    setActiveStep(stepId);
    if (stepId === 11) {
      setViewMode('hall');
    } else if (stepId === 1) {
      setViewMode('shaft');
    } else {
      setViewMode('cab');
    }
  };

  return (
    <group position={position}>
      <Html center distanceFactor={8} zIndexRange={[100, 0]}>
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            group relative flex items-center justify-center transition-all duration-300 transform
            ${isHovered ? 'scale-125 z-50' : 'scale-100'}
          `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Pulsating Glowing Ring */}
          <span className="absolute inline-flex h-8 w-8 rounded-full bg-bayern-red/30 animate-ping" />
          
          {/* Inner Badge */}
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-bayern-red text-white shadow-lg shadow-bayern-red/50 border border-white/40 cursor-pointer hover:bg-red-700 transition-colors">
            <Icon className="w-3.5 h-3.5" />
          </span>

          {/* Floating Tooltip Pill */}
          <div className={`
            absolute left-1/2 -translate-x-1/2 bottom-9 px-2.5 py-1 rounded-lg bg-gray-900/90 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl border border-white/10 backdrop-blur-md transition-all duration-200 pointer-events-none
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
          `}>
            {language === 'ar' ? labelAr : label}
            <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900/90" />
          </div>
        </button>
      </Html>
    </group>
  );
}

// ----------------------------------------------------
// CAR OPERATING PANEL (COP)
// ----------------------------------------------------
function CarOperatingPanel() {
  const { 
    copType, 
    copPlacement, 
    copInterface, 
    pushbuttonStyle, 
    haloColor, 
    activeButtons, 
    pressFloorButton,
    fireServiceEnabled,
    emergencyPhoneEnabled
  } = useConfiguratorStore();

  const posX = copPlacement === 'left' ? -1.42 : copPlacement === 'right' ? 1.42 : 0;
  const posZ = copPlacement === 'center' ? -1.42 : 0.4;
  const rotY = copPlacement === 'center' ? 0 : copPlacement === 'left' ? Math.PI / 2 : -Math.PI / 2;
  const copHeight = copType === 'full_height' ? 2.8 : 1.4;

  const getHaloRGB = () => {
    switch (haloColor) {
      case 'red': return '#ef4444';
      case 'emerald': return '#10b981';
      case 'white': return '#f8fafc';
      case 'amber': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const getButtonRadius = () => {
    if (pushbuttonStyle === 'round_braille') return [0.035, 0.035, 0.015, 32] as const;
    return [0.06, 0.06, 0.015] as const;
  };

  const floors = ['6', '5', '4', '3', '2', '1', 'G', 'B'];

  return (
    <group position={[posX, copType === 'full_height' ? 0 : -0.1, posZ]} rotation={[0, rotY, 0]}>
      {/* COP Faceplate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.42, copHeight, 0.02]} />
        {copType === 'glass' ? (
          <meshPhysicalMaterial color="#0f172a" transmission={0.7} thickness={0.4} roughness={0.05} metalness={0.9} />
        ) : copType === 'premium' ? (
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        ) : (
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} />
        )}
      </mesh>

      {/* Position Indicator Display */}
      <PositionIndicatorDisplay position={[0, copHeight / 2 - 0.2, 0.015]} rotation={[0, 0, 0]} />

      {/* Touchscreen Glass vs Mechanical Pushbuttons */}
      {copInterface === 'touchscreen' ? (
        <group position={[0, -0.05, 0.015]}>
          <mesh>
            <planeGeometry args={[0.36, 0.65]} />
            <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
          </mesh>
          <Text position={[0, 0.25, 0.005]} fontSize={0.035} color="#38bdf8" anchorX="center">
            SMART TOUCH INTERFACE
          </Text>
          <group position={[0, -0.05, 0.005]}>
            {floors.slice(0, 6).map((floor, idx) => {
              const col = idx % 2 === 0 ? -0.09 : 0.09;
              const row = Math.floor(idx / 2) * -0.12 + 0.12;
              const isActive = activeButtons.includes(floor);
              return (
                <group 
                  key={floor} 
                  position={[col, row, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    elevatorAudio.playFloorSelect();
                    pressFloorButton(floor);
                  }}
                >
                  <mesh>
                    <planeGeometry args={[0.13, 0.09]} />
                    <meshStandardMaterial 
                      color={isActive ? getHaloRGB() : "#1e293b"} 
                      emissive={isActive ? getHaloRGB() : "#000000"} 
                      emissiveIntensity={isActive ? 0.8 : 0} 
                    />
                  </mesh>
                  <Text position={[0, 0, 0.005]} fontSize={0.045} color={isActive ? '#ffffff' : '#94a3b8'}>
                    {floor}
                  </Text>
                </group>
              );
            })}
          </group>
        </group>
      ) : (
        <group position={[0, -0.1, 0.015]}>
          {floors.map((floor, idx) => {
            const col = idx % 2 === 0 ? -0.08 : 0.08;
            const row = Math.floor(idx / 2) * -0.12 + 0.18;
            const isActive = activeButtons.includes(floor);
            return (
              <group 
                key={floor} 
                position={[col, row, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  elevatorAudio.playFloorSelect();
                  pressFloorButton(floor);
                }}
              >
                <mesh position={[0, 0, 0.008]}>
                  {pushbuttonStyle === 'round_braille' ? (
                    <cylinderGeometry args={getButtonRadius()} />
                  ) : (
                    <boxGeometry args={getButtonRadius()} />
                  )}
                  <meshStandardMaterial 
                    color={isActive ? getHaloRGB() : "#e2e8f0"} 
                    metalness={0.9} 
                    roughness={0.2}
                    emissive={isActive ? getHaloRGB() : "#000000"}
                    emissiveIntensity={isActive ? 1.2 : 0}
                  />
                </mesh>
                <Text position={[0, 0, 0.02]} fontSize={0.035} color={isActive ? "#ffffff" : "#1e293b"}>
                  {floor}
                </Text>
              </group>
            );
          })}
        </group>
      )}

      {/* Fire Phase II Key Switch */}
      {fireServiceEnabled && (
        <group position={[-0.1, -copHeight / 2 + 0.15, 0.015]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <Text position={[0, -0.04, 0.01]} fontSize={0.015} color="#dc2626">FIRE SERVICE</Text>
        </group>
      )}

      {/* Emergency Phone Intercom Grille */}
      {emergencyPhoneEnabled && (
        <group position={[0.1, -copHeight / 2 + 0.15, 0.015]}>
          <mesh>
            <boxGeometry args={[0.08, 0.06, 0.008]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <Text position={[0, -0.04, 0.01]} fontSize={0.015} color="#e2e8f0">INTERCOM</Text>
        </group>
      )}
    </group>
  );
}

// ----------------------------------------------------
// DOORS (TELESCOPIC SLIDING VS GLASS SWING)
// ----------------------------------------------------
function ElevatorDoors() {
  const { doorState, doorOpeningType, doorFinish, doorMechanism } = useConfiguratorStore();
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const swingDoorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const speed = delta * 3.5;
    const isOpen = doorState === 'open';

    if (doorMechanism === 'glass_swing') {
      if (swingDoorRef.current) {
        const targetAngle = isOpen ? -Math.PI / 2.2 : 0;
        swingDoorRef.current.rotation.y = THREE.MathUtils.lerp(swingDoorRef.current.rotation.y, targetAngle, speed);
      }
    } else if (doorOpeningType === 'center') {
      if (leftDoorRef.current && rightDoorRef.current) {
        const targetLeft = isOpen ? -1.35 : -0.7;
        const targetRight = isOpen ? 1.35 : 0.7;
        leftDoorRef.current.position.x = THREE.MathUtils.lerp(leftDoorRef.current.position.x, targetLeft, speed);
        rightDoorRef.current.position.x = THREE.MathUtils.lerp(rightDoorRef.current.position.x, targetRight, speed);
      }
    } else if (doorOpeningType === 'left') {
      if (leftDoorRef.current && rightDoorRef.current) {
        const target = isOpen ? -1.35 : 0;
        leftDoorRef.current.position.x = THREE.MathUtils.lerp(leftDoorRef.current.position.x, target, speed);
        rightDoorRef.current.position.x = THREE.MathUtils.lerp(rightDoorRef.current.position.x, target, speed);
      }
    } else {
      if (leftDoorRef.current && rightDoorRef.current) {
        const target = isOpen ? 1.35 : 0;
        leftDoorRef.current.position.x = THREE.MathUtils.lerp(leftDoorRef.current.position.x, target, speed);
        rightDoorRef.current.position.x = THREE.MathUtils.lerp(rightDoorRef.current.position.x, target, speed);
      }
    }
  });

  if (doorMechanism === 'glass_swing') {
    return (
      <group position={[0, 0, 1.48]}>
        {/* Door Frame Architrave */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.7, 0.1, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.1, 2.8, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[0.1, 2.8, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Pivot Hinge & Swing Glass Leaf */}
        <group ref={swingDoorRef} position={[-0.75, 0, 0]}>
          <mesh position={[0.75, 0, 0]}>
            <boxGeometry args={[1.5, 2.7, 0.03]} />
            <ElevatorMaterial mat={doorFinish} />
          </mesh>
          {/* Luxury Stainless Steel Door Handle */}
          <mesh position={[1.4, 0, 0.04]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>
    );
  }

  return (
    <group position={[0, 0, 1.48]}>
      {/* Left Sliding Leaf */}
      <group ref={leftDoorRef} position={[-0.7, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.4, 2.8, 0.04]} />
          <ElevatorMaterial mat={doorFinish} />
        </mesh>
        {/* Rubber Astragal Safety Buffer */}
        <mesh position={[0.69, 0, 0]}>
          <boxGeometry args={[0.02, 2.8, 0.045]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Sliding Leaf */}
      <group ref={rightDoorRef} position={[0.7, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.4, 2.8, 0.04]} />
          <ElevatorMaterial mat={doorFinish} />
        </mesh>
        {/* Rubber Astragal Safety Buffer */}
        <mesh position={[-0.69, 0, 0]}>
          <boxGeometry args={[0.02, 2.8, 0.045]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------
// SHAFT STRUCTURAL ENCLOSURE (Panoramic Glass / Steel Frame / Masonry)
// ----------------------------------------------------
function ShaftStructureEnclosure() {
  const { shaftStructure } = useConfiguratorStore();

  if (shaftStructure === 'none') return null;

  if (shaftStructure === 'glass_panoramic') {
    return (
      <group>
        {/* 4 Corner Steel Structural Columns */}
        {[
          [-1.65, 0, -1.65],
          [1.65, 0, -1.65],
          [-1.65, 0, 1.65],
          [1.65, 0, 1.65]
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.12, 4.5, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Horizontal Perimeter Structural Beams */}
        {[-2.1, 0, 2.1].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[0, 0, -1.65]}>
              <boxGeometry args={[3.3, 0.08, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[-1.65, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[3.3, 0.08, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[1.65, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[3.3, 0.08, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Clear Glass Shaft Panes */}
        <mesh position={[0, 0, -1.65]}>
          <planeGeometry args={[3.2, 4.2]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.95} thickness={0.6} roughness={0.02} transparent opacity={0.6} />
        </mesh>
        <mesh position={[-1.65, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.2, 4.2]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.95} thickness={0.6} roughness={0.02} transparent opacity={0.6} />
        </mesh>
        <mesh position={[1.65, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3.2, 4.2]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.95} thickness={0.6} roughness={0.02} transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }

  if (shaftStructure === 'steel_frame') {
    return (
      <group>
        {/* Steel Truss Columns */}
        {[
          [-1.65, 0, -1.65],
          [1.65, 0, -1.65],
          [-1.65, 0, 1.65],
          [1.65, 0, 1.65]
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.15, 4.5, 0.15]} />
            <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Diagonal Steel Cross Bracing */}
        <mesh position={[0, 0, -1.65]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[4.2, 0.04, 0.04]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -1.65]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[4.2, 0.04, 0.04]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  if (shaftStructure === 'masonry_enclosed') {
    return (
      <group>
        {/* Enclosed Hoistway Walls */}
        <mesh position={[0, 0, -1.75]}>
          <boxGeometry args={[3.6, 4.5, 0.1]} />
          <meshStandardMaterial color="#52525b" roughness={0.9} />
        </mesh>
        <mesh position={[-1.75, 0, 0]}>
          <boxGeometry args={[0.1, 4.5, 3.6]} />
          <meshStandardMaterial color="#52525b" roughness={0.9} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <boxGeometry args={[0.1, 4.5, 3.6]} />
          <meshStandardMaterial color="#52525b" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return null;
}

// ----------------------------------------------------
// CAB INTERIOR & ACCESSORIES
// ----------------------------------------------------
function CabInterior() {
  const {
    backWallMaterial,
    sideWallMaterial,
    floorMaterial,
    ceilingMaterial,
    revealFinish,
    handrailType,
    handrailLocation,
    mirrorStyle,
    cameraDomeEnabled,
    lighting
  } = useConfiguratorStore();

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.9, 2.9]} />
        <ElevatorMaterial mat={floorMaterial} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.9, 2.9]} />
        <ElevatorMaterial mat={ceilingMaterial} />
      </mesh>

      {/* Starlight Fiberoptic Dots */}
      {(ceilingMaterial.id === 'ceil-4' || lighting === 'starlight') && <StarlightFiberCeiling />}

      {/* Back Wall Panel */}
      <mesh position={[0, 0, -1.45]}>
        <planeGeometry args={[2.9, 2.9]} />
        <ElevatorMaterial mat={backWallMaterial} />
      </mesh>

      {/* Left Wall Panel */}
      <mesh position={[-1.45, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.9, 2.9]} />
        <ElevatorMaterial mat={sideWallMaterial} />
      </mesh>

      {/* Right Wall Panel */}
      <mesh position={[1.45, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.9, 2.9]} />
        <ElevatorMaterial mat={sideWallMaterial} />
      </mesh>

      {/* Architectural Reveals / Trims */}
      {[-1.44, 1.44].map((x, i) => (
        <mesh key={i} position={[x, 0, -1.44]}>
          <boxGeometry args={[0.04, 2.9, 0.04]} />
          <ElevatorMaterial mat={revealFinish} />
        </mesh>
      ))}

      {/* Mirror */}
      {mirrorStyle !== 'none' && (
        <mesh position={[0, mirrorStyle === 'half' ? 0.35 : 0, -1.43]}>
          <planeGeometry args={[2.2, mirrorStyle === 'half' ? 1.4 : 2.6]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            metalness={0.98}
            roughness={0.02}
            clearcoat={1}
            reflectivity={1}
          />
        </mesh>
      )}

      {/* Handrails */}
      {handrailType !== 'none' && (
        <group position={[0, -0.4, 0]}>
          {/* Rear Handrail */}
          <mesh position={[0, 0, -1.35]}>
            {handrailType === 'round' ? (
              <cylinderGeometry args={[0.03, 0.03, 2.4, 16]} />
            ) : handrailType === 'flat' ? (
              <boxGeometry args={[2.4, 0.03, 0.06]} />
            ) : (
              <cylinderGeometry args={[0.025, 0.045, 2.4, 16]} />
            )}
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Side Handrails if set to 'all' */}
          {handrailLocation === 'all' && (
            <>
              <mesh position={[-1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.03, 0.03, 2.4, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.03, 0.03, 2.4, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* Camera Dome */}
      {cameraDomeEnabled && (
        <group position={[1.2, 1.35, -1.2]}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#000000" transmission={0.8} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ----------------------------------------------------
// HALL VIEW (Outside Landing & Call Station)
// ----------------------------------------------------
function HallLandingView() {
  const { hallWallMaterial, hallStationStyle, hallLanternStyle, currentFloor } = useConfiguratorStore();

  return (
    <group position={[0, 0, 1.55]}>
      {/* Lobby Architectural Wall */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <ElevatorMaterial mat={hallWallMaterial} />
      </mesh>

      {/* Landing Call Station Button */}
      <group position={[1.2, 0, 0.02]}>
        <mesh>
          <boxGeometry args={[0.16, 0.32, hallStationStyle === 'surface' ? 0.03 : 0.01]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0.018]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.05, 0.018]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Hall Lantern / Arrival Indicator */}
      <group position={[0, 1.75, 0.02]}>
        <mesh>
          <boxGeometry args={[0.35, 0.12, 0.02]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {hallLanternStyle === 'digital' ? (
          <Text position={[0, 0, 0.015]} fontSize={0.06} color="#38bdf8">
            {`FLOOR ${currentFloor}`}
          </Text>
        ) : (
          <group position={[0, 0, 0.015]}>
            <Text position={[-0.06, 0, 0]} fontSize={0.06} color="#10b981">▲</Text>
            <Text position={[0.06, 0, 0]} fontSize={0.06} color="#ef4444">▼</Text>
          </group>
        )}
      </group>
    </group>
  );
}

// ----------------------------------------------------
// DYNAMIC LIGHTING ENVIRONMENT
// ----------------------------------------------------
function DynamicLightingEnvironment({ lighting }: { lighting: LightingType }) {
  const getLightingProps = () => {
    switch (lighting) {
      case 'warm':
        return { ambient: '#fff7ed', ambientIntensity: 0.8, pointColor: '#ffedd5', pointIntensity: 1.6 };
      case 'cool':
        return { ambient: '#f0f9ff', ambientIntensity: 0.7, pointColor: '#bae6fd', pointIntensity: 1.5 };
      case 'day':
        return { ambient: '#ffffff', ambientIntensity: 0.9, pointColor: '#ffffff', pointIntensity: 1.8 };
      case 'night':
        return { ambient: '#0f172a', ambientIntensity: 0.3, pointColor: '#38bdf8', pointIntensity: 0.8 };
      case 'cove':
        return { ambient: '#fefce8', ambientIntensity: 0.6, pointColor: '#fef08a', pointIntensity: 2.0 };
      case 'starlight':
        return { ambient: '#020617', ambientIntensity: 0.25, pointColor: '#60a5fa', pointIntensity: 0.6 };
      case 'sunset':
        return { ambient: '#fef3c7', ambientIntensity: 0.75, pointColor: '#f97316', pointIntensity: 1.7 };
      default:
        return { ambient: '#ffffff', ambientIntensity: 0.8, pointColor: '#ffffff', pointIntensity: 1.5 };
    }
  };

  const lp = getLightingProps();

  return (
    <>
      <ambientLight color={lp.ambient} intensity={lp.ambientIntensity} />
      <pointLight position={[0, 1.35, 0]} color={lp.pointColor} intensity={lp.pointIntensity} distance={5} />
      <spotLight position={[0, 3, 2]} angle={0.6} penumbra={0.8} intensity={1.2} castShadow />
      <Environment preset="city" />
    </>
  );
}

// ----------------------------------------------------
// MAIN 3D MODEL COMPONENT
// ----------------------------------------------------
export default function Elevator3DModel() {
  const {
    viewMode,
    setViewMode,
    doorState,
    toggleDoorState,
    lighting,
    showHotspots,
    setShowHotspots
  } = useConfiguratorStore();

  const cameraControlsRef = useRef<CameraControls>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smooth camera positioning based on view mode
  useEffect(() => {
    if (!cameraControlsRef.current) return;
    if (viewMode === 'hall') {
      cameraControlsRef.current.setLookAt(0, 0, 4.5, 0, 0, 1.5, true);
    } else if (viewMode === 'shaft') {
      cameraControlsRef.current.setLookAt(3.5, 2.2, 3.5, 0, 0, 0, true);
    } else {
      cameraControlsRef.current.setLookAt(0, 0, 0.3, 0, 0, -1.4, true);
    }
  }, [viewMode]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden select-none">
      {/* 3D Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 0.3], fov: 65 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <DynamicLightingEnvironment lighting={lighting} />
        <CameraControls ref={cameraControlsRef} makeDefault minDistance={0.1} maxDistance={8} />

        <group position={[0, 0, 0]}>
          {/* Cab Interior */}
          <CabInterior />
          
          {/* Operating Panel */}
          <CarOperatingPanel />

          {/* Elevator Doors */}
          <ElevatorDoors />

          {/* External Shaft Structure */}
          <ShaftStructureEnclosure />

          {/* Hall Landing View */}
          {viewMode === 'hall' && <HallLandingView />}

          {/* 3D Interactive Hotspot Pins */}
          {viewMode === 'cab' && (
            <>
              <InteractiveHotspot position={[1.4, 0.2, 0.4]} label="Operating Panel (COP)" labelAr="لوحة التحكم والأزرار" stepId={6} icon={KeySquare} />
              <InteractiveHotspot position={[0, 1.35, 0]} label="Ceiling & Starlight" labelAr="السقف وإضاءة النجوم" stepId={5} icon={Sparkles} />
              <InteractiveHotspot position={[0, -1.35, 0]} label="Floor Materials" labelAr="أرضيات الرخام والجرانيت" stepId={5} icon={Square} />
              <InteractiveHotspot position={[0, 0.3, -1.4]} label="Wall Finishes & Reveals" labelAr="تشطيبات الجدران والحليات" stepId={4} icon={Layers} />
              <InteractiveHotspot position={[0, -0.4, -1.35]} label="Handrail & Accessories" labelAr="الدرابزين والمرايا" stepId={10} icon={ShieldCheck} />
            </>
          )}

          {viewMode === 'shaft' && (
            <InteractiveHotspot position={[0, 1.8, 1.6]} label="Shaft & Structure" labelAr="هيكل البئر والمحرك" stepId={1} icon={Building2} />
          )}

          {viewMode === 'hall' && (
            <InteractiveHotspot position={[1.2, 0, 1.6]} label="Hall Call Station" labelAr="محطة طلب الدور" stepId={11} icon={CircleDot} />
          )}
        </group>

        <ContactShadows position={[0, -1.46, 0]} opacity={0.6} scale={4} blur={2} />
      </Canvas>

      {/* Floating 3D Navigation Controls Bar */}
      <div className="absolute top-5 right-5 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
        {/* View Mode Switcher: Cab / Shaft / Hall */}
        <div className="flex bg-white/10 p-1 rounded-xl gap-1">
          <button
            onClick={() => { elevatorAudio.playButtonClick(); setViewMode('cab'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'cab' ? 'bg-bayern-red text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
            title="Inside Cab 360"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">داخل الكابينة</span>
          </button>

          <button
            onClick={() => { elevatorAudio.playButtonClick(); setViewMode('shaft'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'shaft' ? 'bg-bayern-red text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
            title="Shaft Structure View"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">هيكل البئر</span>
          </button>

          <button
            onClick={() => { elevatorAudio.playButtonClick(); setViewMode('hall'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'hall' ? 'bg-bayern-red text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
            title="Hall Lobby View"
          >
            <CameraIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">البهو الخارجي</span>
          </button>
        </div>

        {/* Door Toggle Button */}
        <button
          onClick={() => {
            elevatorAudio.playDoorChime();
            toggleDoorState();
          }}
          className={`p-2 rounded-xl transition-all border ${
            doorState === 'open' 
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
              : 'bg-white/10 text-gray-200 border-white/10 hover:bg-white/20'
          }`}
          title={doorState === 'open' ? 'Close Doors' : 'Open Doors'}
        >
          {doorState === 'open' ? <DoorOpen className="w-4 h-4" /> : <DoorClosed className="w-4 h-4" />}
        </button>

        {/* Hotspots Toggle */}
        <button
          onClick={() => {
            elevatorAudio.playButtonClick();
            setShowHotspots(!showHotspots);
          }}
          className={`p-2 rounded-xl transition-all border ${
            showHotspots 
              ? 'bg-bayern-blue/20 text-bayern-blue border-bayern-blue/40' 
              : 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20'
          }`}
          title="Toggle 3D Hotspot Pins"
        >
          {showHotspots ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/10 text-gray-200 border border-white/10 hover:bg-white/20 transition-all"
          title="Fullscreen Mode"
        >
          {isFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
        </button>
      </div>

      {/* Dynamic 360 Orientation Indicator at bottom left */}
      <div className="absolute bottom-5 left-5 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-300">
        <Compass className="w-3.5 h-3.5 text-bayern-blue animate-spin-slow" />
        <span>اسحب للتدوير 360° | حرك العجلة للتكبير</span>
      </div>
    </div>
  );
}
