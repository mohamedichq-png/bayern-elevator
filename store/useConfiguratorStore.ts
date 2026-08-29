import { create } from 'zustand';

export type Language = 'ar' | 'en';
export type PricingMode = 'dealer' | 'client';

export type DriveSystemType = 'traction_h300' | 'hydraulic_h200' | 'panoramic_scenic';
export type ShaftStructureType = 'glass_panoramic' | 'steel_frame' | 'masonry_enclosed' | 'none';
export type DoorMechanismType = 'telescopic_center' | 'telescopic_side' | 'glass_swing';

export type MaterialOption = {
  id: string;
  name: string;
  nameAr?: string;
  color: string;
  texture?: string;
  metalness?: number;
  roughness?: number;
  transmission?: number;
  thickness?: number;
  basePrice?: number;
};

export type ViewMode = 'cab' | 'cab_front' | 'hall' | 'shaft';
export type DoorState = 'closed' | 'open';
export type DoorOpeningType = 'center' | 'left' | 'right';
export type COPType = 'standard' | 'premium' | 'glass' | 'slimline' | 'full_height';
export type COPPlacement = 'left' | 'right' | 'center';
export type COPInterface = 'mechanical' | 'touchscreen';
export type PositionIndicatorStyle = 'tft_color' | 'segmented_led' | 'dot_matrix';
export type PushbuttonStyle = 'round_braille' | 'square_flush' | 'vandal_resistant';
export type HaloColor = 'blue' | 'red' | 'white' | 'emerald' | 'amber';
export type HandrailType = 'none' | 'round' | 'flat' | 'oval';
export type HandrailLocation = 'rear' | 'all';
export type LightingType = 'day' | 'night' | 'warm' | 'cool' | 'cove' | 'starlight' | 'sunset';
export type MirrorStyle = 'none' | 'half' | 'full';

export interface SavedProject {
  id: string;
  code: string;
  name: string;
  date: string;
  price: number;
  configData: string;
  driveSystem: DriveSystemType;
  shaftStructure: ShaftStructureType;
}

export interface ThemePreset {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  thumbnailColor: string;
  secondaryColor: string;
  config: Partial<ConfiguratorState>;
}

export interface ConfiguratorState {
  // Localization & Viewing Mode
  language: Language;
  pricingMode: PricingMode;
  showHotspots: boolean;
  activeHotspotId: string | null;

  // Mechanical & Structural Architecture
  driveSystem: DriveSystemType;
  shaftStructure: ShaftStructureType;
  doorMechanism: DoorMechanismType;

  // View Modes & Interactions
  viewMode: ViewMode;
  doorState: DoorState;
  activeStep: number; // 1 to 11
  activeCategory: string;
  activeButtons: string[];

  // Finishes
  backWallMaterial: MaterialOption;
  sideWallMaterial: MaterialOption;
  floorMaterial: MaterialOption;
  ceilingMaterial: MaterialOption;
  revealFinish: MaterialOption;
  doorFinish: MaterialOption;

  // Doors & Entry
  doorOpeningType: DoorOpeningType;

  // COP & Fixtures
  copType: COPType;
  copPlacement: COPPlacement;
  copInterface: COPInterface;

  // Position Indicator (PI)
  piStyle: PositionIndicatorStyle;
  currentFloor: number;
  direction: 'up' | 'down' | 'idle';

  // Pushbuttons
  pushbuttonStyle: PushbuttonStyle;
  haloColor: HaloColor;

  // Emergency & Safety
  fireServiceEnabled: boolean;
  emergencyPhoneEnabled: boolean;

  // Handrails & Accessories
  handrailType: HandrailType;
  handrailLocation: HandrailLocation;
  mirrorStyle: MirrorStyle;
  cameraDomeEnabled: boolean;
  lighting: LightingType;
  starlightIntensity: number;

  // Hall Fixtures (Outside view)
  hallWallMaterial: MaterialOption;
  hallStationStyle: 'surface' | 'flush';
  hallLanternStyle: 'arrow' | 'digital';

  // Projects & Storage
  savedProjects: SavedProject[];
  currentProjectCode: string;

  // Actions
  setLanguage: (lang: Language) => void;
  setPricingMode: (mode: PricingMode) => void;
  setShowHotspots: (show: boolean) => void;
  setActiveHotspotId: (id: string | null) => void;

  setDriveSystem: (drive: DriveSystemType) => void;
  setShaftStructure: (shaft: ShaftStructureType) => void;
  setDoorMechanism: (door: DoorMechanismType) => void;

  setViewMode: (mode: ViewMode) => void;
  setDoorState: (state: DoorState) => void;
  toggleDoorState: () => void;
  setActiveStep: (step: number) => void;
  setActiveCategory: (category: string) => void;
  pressFloorButton: (buttonId: string) => void;

  setBackWallMaterial: (material: MaterialOption) => void;
  setSideWallMaterial: (material: MaterialOption) => void;
  setFloorMaterial: (material: MaterialOption) => void;
  setCeilingMaterial: (material: MaterialOption) => void;
  setRevealFinish: (material: MaterialOption) => void;
  setDoorFinish: (material: MaterialOption) => void;
  setDoorOpeningType: (type: DoorOpeningType) => void;

  setCOPType: (type: COPType) => void;
  setCOPPlacement: (placement: COPPlacement) => void;
  setCOPInterface: (iface: COPInterface) => void;

  setPIStyle: (style: PositionIndicatorStyle) => void;
  setPushbuttonStyle: (style: PushbuttonStyle) => void;
  setHaloColor: (color: HaloColor) => void;

  setFireServiceEnabled: (enabled: boolean) => void;
  setEmergencyPhoneEnabled: (enabled: boolean) => void;

  setHandrailType: (type: HandrailType) => void;
  setHandrailLocation: (location: HandrailLocation) => void;
  setMirrorStyle: (style: MirrorStyle) => void;
  setCameraDomeEnabled: (enabled: boolean) => void;
  setLighting: (lighting: LightingType) => void;
  setStarlightIntensity: (intensity: number) => void;

  setHallWallMaterial: (material: MaterialOption) => void;
  setHallStationStyle: (style: 'surface' | 'flush') => void;
  setHallLanternStyle: (style: 'arrow' | 'digital') => void;

  applyPreset: (presetId: string) => void;
  getEstimatedPrice: () => number;
  exportConfig: () => string;
  importConfig: (configStr: string) => void;

  // Project management actions
  saveProject: (projectName?: string) => SavedProject;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  cloneProject: (projectId: string) => void;
}

export const defaultWallMaterials: MaterialOption[] = [
  { id: 'wall-1', name: 'Brushed Steel', nameAr: 'ستانلس ستيل مطفي', color: '#b0b5b9', metalness: 0.85, roughness: 0.25, basePrice: 1200 },
  { id: 'wall-2', name: 'Matte Black Titanium', nameAr: 'تيتانيوم أسود مطفي', color: '#1f2022', metalness: 0.6, roughness: 0.7, basePrice: 1800 },
  { id: 'wall-3', name: 'Bavarian Walnut', nameAr: 'خشب الجوز البافاري', color: '#6d4327', metalness: 0.05, roughness: 0.85, basePrice: 2200 },
  { id: 'wall-4', name: 'Alpine Ashwood', nameAr: 'خشب الدردار الألبي', color: '#c4a482', metalness: 0.05, roughness: 0.9, basePrice: 2000 },
  { id: 'wall-5', name: 'Champagne Gold', nameAr: 'ذهب الشمبانيا الفاخر', color: '#d4af37', metalness: 0.9, roughness: 0.2, basePrice: 2600 },
  { id: 'wall-6', name: 'Bayern Crimson Red', nameAr: 'أحمر قرمزي رياضي', color: '#D32F2F', metalness: 0.3, roughness: 0.5, basePrice: 1500 },
  { id: 'wall-7', name: 'Smoked Mirror Glass', nameAr: 'زجاج مرايا دخاني', color: '#2d3748', metalness: 0.95, roughness: 0.05, transmission: 0.3, thickness: 0.6, basePrice: 2400 },
  { id: 'wall-8', name: 'Crystal Clear Panoramic Glass', nameAr: 'زجاج بانورامي كريستال', color: '#e0f2fe', metalness: 0.1, roughness: 0.02, transmission: 0.95, thickness: 0.8, basePrice: 3200 },
];

export const defaultFloorMaterials: MaterialOption[] = [
  { id: 'floor-1', name: 'Italian Dark Granite', nameAr: 'جرانيت إيطالي داكن', color: '#262626', roughness: 0.85, basePrice: 1400 },
  { id: 'floor-2', name: 'Carrara White Marble', nameAr: 'رخام كارارا أبيض فاخر', color: '#f0f2f5', roughness: 0.15, metalness: 0.1, basePrice: 2100 },
  { id: 'floor-3', name: 'Emperador Bronze Stone', nameAr: 'حجر إمبرادور برونزي', color: '#4a3b32', roughness: 0.3, basePrice: 1900 },
  { id: 'floor-4', name: 'Rubber Diamond Tread', nameAr: 'أرضية مطاطية صناعية', color: '#1a1a1a', roughness: 0.95, basePrice: 800 },
  { id: 'floor-5', name: 'Royal Geometric Parquet', nameAr: 'باركيه رخامي هندسي', color: '#33271e', roughness: 0.35, basePrice: 2400 },
];

export const defaultCeilingMaterials: MaterialOption[] = [
  { id: 'ceil-1', name: 'Architectural White & Spots', nameAr: 'أبيض معماري مع إسبوت لايت', color: '#fcfcfc', roughness: 0.9, basePrice: 900 },
  { id: 'ceil-2', name: 'Polished Mirror Steel', nameAr: 'ستانلس ستيل عاكس للمرآة', color: '#d8dee4', metalness: 1, roughness: 0.08, basePrice: 1400 },
  { id: 'ceil-3', name: 'Perforated LED Grid', nameAr: 'شبكة LED منقوشة', color: '#e2e8f0', metalness: 0.5, roughness: 0.4, basePrice: 1800 },
  { id: 'ceil-4', name: 'Starlight Fiberoptic', nameAr: 'سقف ألياف النجوم الضوئية', color: '#0f172a', metalness: 0.2, roughness: 0.9, basePrice: 2500 },
];

export const defaultRevealMaterials: MaterialOption[] = [
  { id: 'rev-1', name: 'Brushed Silver', nameAr: 'فضي مطفي', color: '#cbd5e1', metalness: 0.9, roughness: 0.2, basePrice: 300 },
  { id: 'rev-2', name: 'Anodized Black', nameAr: 'أسود أنودايزد', color: '#18181b', metalness: 0.7, roughness: 0.5, basePrice: 400 },
  { id: 'rev-3', name: 'Polished Brass Gold', nameAr: 'ذهب نحاسي لامع', color: '#eab308', metalness: 0.95, roughness: 0.15, basePrice: 600 },
];

export const defaultDoorFinishes: MaterialOption[] = [
  { id: 'door-1', name: 'Brushed Stainless Steel', nameAr: 'ستانلس ستيل ناعم', color: '#94a3b8', metalness: 0.85, roughness: 0.25, basePrice: 1600 },
  { id: 'door-2', name: 'Black Titanium Mirror', nameAr: 'تيتانيوم أسود عاكس', color: '#0f172a', metalness: 0.95, roughness: 0.1, basePrice: 2200 },
  { id: 'door-3', name: 'Etched Champagne Gold', nameAr: 'ذهب شمبانيا محفور', color: '#e2be6c', metalness: 0.9, roughness: 0.3, basePrice: 2800 },
  { id: 'door-4', name: 'Frameless Panoramic Glass', nameAr: 'زجاج شفاف بدون إطار', color: '#bae6fd', metalness: 0.1, roughness: 0.05, transmission: 0.9, basePrice: 3100 },
];

export const defaultHallWallMaterials: MaterialOption[] = [
  { id: 'hall-1', name: 'Travertine Limestone', nameAr: 'حجر ترافيرتين كلاسيكي', color: '#e7ded1', roughness: 0.9, basePrice: 1500 },
  { id: 'hall-2', name: 'Nero Marquina Black Marble', nameAr: 'رخام ماركينا الأسود', color: '#18181b', roughness: 0.2, basePrice: 2500 },
  { id: 'hall-3', name: 'Urban Smooth Concrete', nameAr: 'خرسانة معمارية ناعمة', color: '#9ca3af', roughness: 0.8, basePrice: 1100 },
];

export const themePresets: ThemePreset[] = [
  {
    id: 'volks-vks-k20',
    name: 'Volks VKS-K20 Imperial Gold',
    nameAr: 'فولكس VKS-K20 الذهب الإمبراطوري',
    description: 'Etched Champagne Gold panels with Emperador stone, Warm 3000K cove LED, and Premium Glass COP.',
    descriptionAr: 'ألواح ذهب شمبانيا محفورة مع حجر إمبرادور الفاخر وإضاءة مخفية دافئة 3000K.',
    thumbnailColor: '#d4af37',
    secondaryColor: '#4a3b32',
    config: {
      driveSystem: 'traction_h300',
      shaftStructure: 'steel_frame',
      doorMechanism: 'telescopic_center',
      backWallMaterial: defaultWallMaterials[4], // Champagne Gold
      sideWallMaterial: defaultWallMaterials[4],
      revealFinish: defaultRevealMaterials[2], // Brass Gold
      doorFinish: defaultDoorFinishes[2], // Etched Gold
      floorMaterial: defaultFloorMaterials[2], // Emperador Bronze
      ceilingMaterial: defaultCeilingMaterials[1], // Mirror Steel
      copType: 'glass',
      copPlacement: 'right',
      copInterface: 'touchscreen',
      piStyle: 'tft_color',
      pushbuttonStyle: 'round_braille',
      haloColor: 'amber',
      lighting: 'warm',
      handrailType: 'flat',
      handrailLocation: 'all',
      mirrorStyle: 'half',
    }
  },
  {
    id: 'diamond-panoramic',
    name: 'Diamond Panoramic Crystal',
    nameAr: 'دايموند كريستال بانوراميك',
    description: 'Ultra-clear 360 Glass Cab with Full Glass Shaft, Carrara Marble, and Twinkling Starlight ceiling.',
    descriptionAr: 'كابينة زجاجية بانورامية 360 درجة مع بئر زجاجي كامل ورخام كارارا وسقف نجوم متلألئة.',
    thumbnailColor: '#38bdf8',
    secondaryColor: '#f0f2f5',
    config: {
      driveSystem: 'panoramic_scenic',
      shaftStructure: 'glass_panoramic',
      doorMechanism: 'glass_swing',
      backWallMaterial: defaultWallMaterials[7], // Clear Panoramic Glass
      sideWallMaterial: defaultWallMaterials[7],
      revealFinish: defaultRevealMaterials[0], // Brushed Silver
      doorFinish: defaultDoorFinishes[3], // Panoramic Glass
      floorMaterial: defaultFloorMaterials[1], // Carrara White Marble
      ceilingMaterial: defaultCeilingMaterials[3], // Starlight Fiberoptic
      copType: 'slimline',
      copPlacement: 'left',
      copInterface: 'touchscreen',
      piStyle: 'tft_color',
      pushbuttonStyle: 'square_flush',
      haloColor: 'emerald',
      lighting: 'starlight',
      handrailType: 'round',
      handrailLocation: 'rear',
      mirrorStyle: 'none',
    }
  },
  {
    id: 'bavarian-exec',
    name: 'Bavarian Executive Timber',
    nameAr: 'بافاريان إكزكتيف الخشبي',
    description: 'Rich Bavarian Walnut with Champagne Gold trims and Carrara Marble floor.',
    descriptionAr: 'خشب الجوز البافاري الفاخر مع حليات ذهبية ورخام كارارا أبيض.',
    thumbnailColor: '#6d4327',
    secondaryColor: '#d4af37',
    config: {
      driveSystem: 'traction_h300',
      shaftStructure: 'masonry_enclosed',
      doorMechanism: 'telescopic_center',
      backWallMaterial: defaultWallMaterials[2], // Bavarian Walnut
      sideWallMaterial: defaultWallMaterials[2],
      revealFinish: defaultRevealMaterials[2], // Polished Brass
      doorFinish: defaultDoorFinishes[2], // Champagne Gold
      floorMaterial: defaultFloorMaterials[1], // Carrara White Marble
      ceilingMaterial: defaultCeilingMaterials[1], // Mirror Steel
      copType: 'premium',
      copPlacement: 'right',
      copInterface: 'touchscreen',
      piStyle: 'tft_color',
      pushbuttonStyle: 'round_braille',
      haloColor: 'white',
      lighting: 'warm',
      handrailType: 'round',
      handrailLocation: 'all',
      mirrorStyle: 'half',
    }
  },
  {
    id: 'neo-luxury',
    name: 'Neo Luxury Titanium Glass',
    nameAr: 'نيو لوكجري تيتانيوم وزجاج',
    description: 'Sleek Smoked Mirror Glass walls with Matte Black accents and Starlight ceiling.',
    descriptionAr: 'مرايا زجاجية دخانية مع تيتانيوم أسود مطفي وسقف النجوم وسحر الإضاءة الزرقاء.',
    thumbnailColor: '#1f2022',
    secondaryColor: '#38bdf8',
    config: {
      driveSystem: 'hydraulic_h200',
      shaftStructure: 'steel_frame',
      doorMechanism: 'telescopic_side',
      backWallMaterial: defaultWallMaterials[6], // Smoked Mirror
      sideWallMaterial: defaultWallMaterials[1], // Matte Black
      revealFinish: defaultRevealMaterials[1], // Black
      doorFinish: defaultDoorFinishes[1], // Black Titanium
      floorMaterial: defaultFloorMaterials[0], // Dark Granite
      ceilingMaterial: defaultCeilingMaterials[3], // Starlight
      copType: 'glass',
      copPlacement: 'left',
      copInterface: 'touchscreen',
      piStyle: 'tft_color',
      pushbuttonStyle: 'square_flush',
      haloColor: 'blue',
      lighting: 'cool',
      handrailType: 'flat',
      handrailLocation: 'rear',
      mirrorStyle: 'full',
    }
  },
  {
    id: 'alpine-modern',
    name: 'Scandinavian Alpine Timber',
    nameAr: 'سكندنافي ألبين الطبيعي',
    description: 'Light Alpine Ashwood panels with Brushed Steel reveals and Cove LED lighting.',
    descriptionAr: 'خشب الدردار الألبي الفاتح مع ستانلس ستيل مطفي وإضاءة نهارية نقية 5000K.',
    thumbnailColor: '#c4a482',
    secondaryColor: '#b0b5b9',
    config: {
      driveSystem: 'hydraulic_h200',
      shaftStructure: 'masonry_enclosed',
      doorMechanism: 'telescopic_center',
      backWallMaterial: defaultWallMaterials[3], // Alpine Ashwood
      sideWallMaterial: defaultWallMaterials[3],
      revealFinish: defaultRevealMaterials[0], // Brushed Silver
      doorFinish: defaultDoorFinishes[0], // Stainless Steel
      floorMaterial: defaultFloorMaterials[2], // Emperador Bronze
      ceilingMaterial: defaultCeilingMaterials[2], // LED Grid
      copType: 'standard',
      copPlacement: 'right',
      copInterface: 'mechanical',
      piStyle: 'segmented_led',
      pushbuttonStyle: 'round_braille',
      haloColor: 'emerald',
      lighting: 'day',
      handrailType: 'oval',
      handrailLocation: 'rear',
      mirrorStyle: 'none',
    }
  },
  {
    id: 'cyber-minimalist',
    name: 'Cyber Dark Titanium',
    nameAr: 'سايبر دارك تيتانيوم',
    description: 'Industrial Brushed Steel with Crimson Red brand accents and Vandal-resistant COP.',
    descriptionAr: 'ستانلس صناعي مع تيتانيوم أسود وتطعيمات حمراء وحماية كاملة ضد الصدمات.',
    thumbnailColor: '#b0b5b9',
    secondaryColor: '#D32F2F',
    config: {
      driveSystem: 'traction_h300',
      shaftStructure: 'steel_frame',
      doorMechanism: 'telescopic_center',
      backWallMaterial: defaultWallMaterials[0], // Brushed Steel
      sideWallMaterial: defaultWallMaterials[5], // Crimson Red
      revealFinish: defaultRevealMaterials[1], // Black
      doorFinish: defaultDoorFinishes[0], // Stainless
      floorMaterial: defaultFloorMaterials[3], // Rubber Diamond
      ceilingMaterial: defaultCeilingMaterials[0], // Architectural White
      copType: 'full_height',
      copPlacement: 'center',
      copInterface: 'mechanical',
      piStyle: 'dot_matrix',
      pushbuttonStyle: 'vandal_resistant',
      haloColor: 'red',
      lighting: 'sunset',
      handrailType: 'round',
      handrailLocation: 'all',
      mirrorStyle: 'none',
      cameraDomeEnabled: true,
    }
  }
];

const generateUniqueCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'ELEV-';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  code += '-';
  for (let i = 0; i < 2; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  language: 'ar',
  pricingMode: 'dealer',
  showHotspots: true,
  activeHotspotId: null,

  driveSystem: 'traction_h300',
  shaftStructure: 'glass_panoramic',
  doorMechanism: 'telescopic_center',

  viewMode: 'cab',
  doorState: 'closed',
  activeStep: 1,
  activeCategory: 'architecture',
  activeButtons: ['3'],

  backWallMaterial: defaultWallMaterials[0],
  sideWallMaterial: defaultWallMaterials[0],
  floorMaterial: defaultFloorMaterials[0],
  ceilingMaterial: defaultCeilingMaterials[0],
  revealFinish: defaultRevealMaterials[0],
  doorFinish: defaultDoorFinishes[0],

  doorOpeningType: 'center',

  copType: 'standard',
  copPlacement: 'right',
  copInterface: 'mechanical',

  piStyle: 'tft_color',
  currentFloor: 3,
  direction: 'idle',

  pushbuttonStyle: 'round_braille',
  haloColor: 'blue',

  fireServiceEnabled: true,
  emergencyPhoneEnabled: true,

  handrailType: 'round',
  handrailLocation: 'rear',
  mirrorStyle: 'none',
  cameraDomeEnabled: false,
  lighting: 'day',
  starlightIntensity: 0.85,

  hallWallMaterial: defaultHallWallMaterials[0],
  hallStationStyle: 'flush',
  hallLanternStyle: 'arrow',

  savedProjects: [
    {
      id: 'proj-demo-1',
      code: 'ELEV-9284-DX',
      name: 'مشروع فيلا الريان - الدوحة (بانورامي)',
      date: '2026-08-28',
      price: 24650,
      configData: '',
      driveSystem: 'panoramic_scenic',
      shaftStructure: 'glass_panoramic'
    },
    {
      id: 'proj-demo-2',
      code: 'ELEV-5813-VK',
      name: 'برج لوسيل التجاري - طراز VKS الذهبي',
      date: '2026-08-25',
      price: 19800,
      configData: '',
      driveSystem: 'traction_h300',
      shaftStructure: 'steel_frame'
    }
  ],
  currentProjectCode: 'ELEV-8942-DX',

  setLanguage: (lang) => set({ language: lang }),
  setPricingMode: (mode) => set({ pricingMode: mode }),
  setShowHotspots: (show) => set({ showHotspots: show }),
  setActiveHotspotId: (id) => set({ activeHotspotId: id }),

  setDriveSystem: (drive) => set({ driveSystem: drive }),
  setShaftStructure: (shaft) => set({ shaftStructure: shaft }),
  setDoorMechanism: (door) => set({ doorMechanism: door }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setDoorState: (state) => set({ doorState: state }),
  toggleDoorState: () => set((state) => ({ doorState: state.doorState === 'open' ? 'closed' : 'open' })),
  setActiveStep: (step) => set({ activeStep: step }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  pressFloorButton: (buttonId) => set((state) => {
    const exists = state.activeButtons.includes(buttonId);
    const updated = exists 
      ? state.activeButtons.filter(b => b !== buttonId)
      : [...state.activeButtons, buttonId];
    return { activeButtons: updated };
  }),

  setBackWallMaterial: (material) => set({ backWallMaterial: material }),
  setSideWallMaterial: (material) => set({ sideWallMaterial: material }),
  setFloorMaterial: (material) => set({ floorMaterial: material }),
  setCeilingMaterial: (material) => set({ ceilingMaterial: material }),
  setRevealFinish: (material) => set({ revealFinish: material }),
  setDoorFinish: (material) => set({ doorFinish: material }),
  setDoorOpeningType: (type) => set({ doorOpeningType: type }),

  setCOPType: (type) => set({ copType: type }),
  setCOPPlacement: (placement) => set({ copPlacement: placement }),
  setCOPInterface: (iface) => set({ copInterface: iface }),

  setPIStyle: (style) => set({ piStyle: style }),
  setPushbuttonStyle: (style) => set({ pushbuttonStyle: style }),
  setHaloColor: (color) => set({ haloColor: color }),

  setFireServiceEnabled: (enabled) => set({ fireServiceEnabled: enabled }),
  setEmergencyPhoneEnabled: (enabled) => set({ emergencyPhoneEnabled: enabled }),

  setHandrailType: (type) => set({ handrailType: type }),
  setHandrailLocation: (location) => set({ handrailLocation: location }),
  setMirrorStyle: (style) => set({ mirrorStyle: style }),
  setCameraDomeEnabled: (enabled) => set({ cameraDomeEnabled: enabled }),
  setLighting: (lighting) => set({ lighting }),
  setStarlightIntensity: (intensity) => set({ starlightIntensity: intensity }),

  setHallWallMaterial: (material) => set({ hallWallMaterial: material }),
  setHallStationStyle: (style) => set({ hallStationStyle: style }),
  setHallLanternStyle: (style) => set({ hallLanternStyle: style }),

  applyPreset: (presetId) => {
    const preset = themePresets.find(p => p.id === presetId);
    if (preset && preset.config) {
      set(preset.config);
    }
  },

  getEstimatedPrice: () => {
    const state = get();
    let total = 8500; // Base package price

    // Drive System pricing
    if (state.driveSystem === 'panoramic_scenic') total += 5500;
    else if (state.driveSystem === 'traction_h300') total += 3200;
    else if (state.driveSystem === 'hydraulic_h200') total += 2400;

    // Shaft Structure pricing
    if (state.shaftStructure === 'glass_panoramic') total += 6800;
    else if (state.shaftStructure === 'steel_frame') total += 3800;
    else if (state.shaftStructure === 'masonry_enclosed') total += 1500;

    // Door Mechanism
    if (state.doorMechanism === 'glass_swing') total += 1800;
    else if (state.doorMechanism === 'telescopic_side') total += 900;

    // Finishes
    total += state.backWallMaterial.basePrice || 0;
    total += (state.sideWallMaterial.basePrice || 0) * 1.5;
    total += state.floorMaterial.basePrice || 0;
    total += state.ceilingMaterial.basePrice || 0;
    total += state.revealFinish.basePrice || 0;
    total += state.doorFinish.basePrice || 0;

    if (state.copType === 'glass') total += 1200;
    if (state.copType === 'premium') total += 800;
    if (state.copInterface === 'touchscreen') total += 1500;
    if (state.piStyle === 'tft_color') total += 750;
    if (state.pushbuttonStyle === 'vandal_resistant') total += 450;
    if (state.mirrorStyle === 'full') total += 600;
    if (state.mirrorStyle === 'half') total += 350;
    if (state.cameraDomeEnabled) total += 500;
    if (state.fireServiceEnabled) total += 650;
    if (state.emergencyPhoneEnabled) total += 400;
    if (state.handrailLocation === 'all') total += 450;
    if (state.lighting === 'starlight') total += 950;
    if (state.hallWallMaterial.basePrice) total += state.hallWallMaterial.basePrice;

    return total;
  },

  exportConfig: () => {
    const state = get();
    const config = {
      ds: state.driveSystem,
      sh: state.shaftStructure,
      dm: state.doorMechanism,
      bw: state.backWallMaterial.id,
      sw: state.sideWallMaterial.id,
      f: state.floorMaterial.id,
      c: state.ceilingMaterial.id,
      rev: state.revealFinish.id,
      df: state.doorFinish.id,
      do: state.doorOpeningType,
      ct: state.copType,
      cp: state.copPlacement,
      ci: state.copInterface,
      pi: state.piStyle,
      pb: state.pushbuttonStyle,
      hc: state.haloColor,
      fs: state.fireServiceEnabled ? 1 : 0,
      ep: state.emergencyPhoneEnabled ? 1 : 0,
      ht: state.handrailType,
      hl: state.handrailLocation,
      ms: state.mirrorStyle,
      cd: state.cameraDomeEnabled ? 1 : 0,
      l: state.lighting,
      hw: state.hallWallMaterial.id,
      hs: state.hallStationStyle,
      hlst: state.hallLanternStyle,
    };
    return btoa(JSON.stringify(config));
  },
  
  importConfig: (configStr: string) => {
    try {
      const config = JSON.parse(atob(configStr));
      const findMat = (arr: MaterialOption[], id: string) => arr.find(m => m.id === id) || arr[0];
      
      set({
        driveSystem: config.ds || 'traction_h300',
        shaftStructure: config.sh || 'glass_panoramic',
        doorMechanism: config.dm || 'telescopic_center',
        backWallMaterial: findMat(defaultWallMaterials, config.bw),
        sideWallMaterial: findMat(defaultWallMaterials, config.sw),
        floorMaterial: findMat(defaultFloorMaterials, config.f),
        ceilingMaterial: findMat(defaultCeilingMaterials, config.c),
        revealFinish: findMat(defaultRevealMaterials, config.rev),
        doorFinish: findMat(defaultDoorFinishes, config.df),
        doorOpeningType: config.do || 'center',
        copType: config.ct || 'standard',
        copPlacement: config.cp || 'right',
        copInterface: config.ci || 'mechanical',
        piStyle: config.pi || 'tft_color',
        pushbuttonStyle: config.pb || 'round_braille',
        haloColor: config.hc || 'blue',
        fireServiceEnabled: config.fs !== 0,
        emergencyPhoneEnabled: config.ep !== 0,
        handrailType: config.ht || 'round',
        handrailLocation: config.hl || 'rear',
        mirrorStyle: config.ms || 'none',
        cameraDomeEnabled: config.cd === 1,
        lighting: config.l || 'day',
        hallWallMaterial: findMat(defaultHallWallMaterials, config.hw),
        hallStationStyle: config.hs || 'flush',
        hallLanternStyle: config.hlst || 'arrow',
      });
    } catch (e) {
      console.error("Failed to parse config string", e);
    }
  },

  saveProject: (projectName) => {
    const state = get();
    const code = generateUniqueCode();
    const newProject: SavedProject = {
      id: `proj-${Date.now()}`,
      code,
      name: projectName || (state.language === 'ar' ? `تصميم مصعد مخصص #${code}` : `Custom Elevator #${code}`),
      date: new Date().toISOString().split('T')[0],
      price: state.getEstimatedPrice(),
      configData: state.exportConfig(),
      driveSystem: state.driveSystem,
      shaftStructure: state.shaftStructure,
    };

    set((s) => ({
      savedProjects: [newProject, ...s.savedProjects],
      currentProjectCode: code,
    }));
    return newProject;
  },

  loadProject: (projectId) => {
    const project = get().savedProjects.find(p => p.id === projectId);
    if (project && project.configData) {
      get().importConfig(project.configData);
      set({ currentProjectCode: project.code });
    }
  },

  deleteProject: (projectId) => {
    set((s) => ({
      savedProjects: s.savedProjects.filter(p => p.id !== projectId)
    }));
  },

  cloneProject: (projectId) => {
    const project = get().savedProjects.find(p => p.id === projectId);
    if (project) {
      const code = generateUniqueCode();
      const cloned: SavedProject = {
        ...project,
        id: `proj-${Date.now()}`,
        code,
        name: `${project.name} (${get().language === 'ar' ? 'نسخة' : 'Copy'})`,
        date: new Date().toISOString().split('T')[0],
      };
      set((s) => ({
        savedProjects: [cloned, ...s.savedProjects]
      }));
    }
  }
}));
