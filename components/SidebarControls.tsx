"use client";

import { useEffect, useState } from "react";
import { 
  useConfiguratorStore, 
  defaultWallMaterials, 
  defaultFloorMaterials, 
  defaultCeilingMaterials, 
  defaultRevealMaterials, 
  defaultDoorFinishes, 
  defaultHallWallMaterials, 
  themePresets, 
  COPType, 
  COPPlacement, 
  COPInterface, 
  PositionIndicatorStyle, 
  PushbuttonStyle, 
  HaloColor, 
  HandrailType, 
  LightingType, 
  MirrorStyle, 
  DriveSystemType, 
  ShaftStructureType, 
  DoorMechanismType 
} from "@/store/useConfiguratorStore";
import { elevatorAudio } from "@/lib/audioChime";
import { 
  Building2, 
  Sparkles, 
  DoorOpen, 
  Layers, 
  Square, 
  KeySquare, 
  Tv, 
  CircleDot, 
  Flame, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Check 
} from "lucide-react";

export default function SidebarControls() {
  const { 
    language,
    pricingMode,
    activeStep, setActiveStep,
    viewMode, setViewMode,
    driveSystem, setDriveSystem,
    shaftStructure, setShaftStructure,
    doorMechanism, setDoorMechanism,
    backWallMaterial, setBackWallMaterial,
    sideWallMaterial, setSideWallMaterial,
    revealFinish, setRevealFinish,
    doorFinish, setDoorFinish,
    floorMaterial, setFloorMaterial,
    ceilingMaterial, setCeilingMaterial,
    lighting, setLighting,
    copType, setCOPType,
    copPlacement, setCOPPlacement,
    copInterface, setCOPInterface,
    piStyle, setPIStyle,
    pushbuttonStyle, setPushbuttonStyle,
    haloColor, setHaloColor,
    fireServiceEnabled, setFireServiceEnabled,
    emergencyPhoneEnabled, setEmergencyPhoneEnabled,
    handrailType, setHandrailType,
    mirrorStyle, setMirrorStyle,
    cameraDomeEnabled, setCameraDomeEnabled,
    hallWallMaterial, setHallWallMaterial,
    hallLanternStyle, setHallLanternStyle,
    applyPreset,
    getEstimatedPrice,
    importConfig
  } = useConfiguratorStore();

  const isAr = language === 'ar';

  const WIZARD_STEPS = [
    { id: 1, key: "architecture", title: isAr ? "الهيكل والمحرك" : "Drive & Shaft", subtitle: isAr ? "النظام الميكانيكي والبئر" : "Shaft & Mechanism", icon: Building2 },
    { id: 2, key: "quickstart", title: isAr ? "المجموعات الجاهزة" : "Signature Presets", subtitle: isAr ? "طرازات فولكس ودايموند" : "Curated Luxury Styles", icon: Sparkles },
    { id: 3, key: "doors", title: isAr ? "الأبواب والمدخل" : "Doors & Reveals", subtitle: isAr ? "آلية الفتح والتشطيب" : "Opening & Door Finish", icon: DoorOpen },
    { id: 4, key: "walls", title: isAr ? "جدران الكابينة" : "Cab Walls", subtitle: isAr ? "الألواح الجدارية والحليات" : "Panels & Decorative Trims", icon: Layers },
    { id: 5, key: "floors_ceilings", title: isAr ? "الأرضيات والسقف" : "Floor & Ceiling", subtitle: isAr ? "الرخام وسقف النجوم" : "Stone & Starlight Grid", icon: Square },
    { id: 6, key: "cop", title: isAr ? "لوحة التحكم COP" : "COP Panel", subtitle: isAr ? "التشغيل واللمس الذكي" : "Operating Interface", icon: KeySquare },
    { id: 7, key: "pi", title: isAr ? "شاشة عرض الأدوار" : "Position Indicator", subtitle: isAr ? "الشاشات الرقمية TFT" : "TFT & Digital Displays", icon: Tv },
    { id: 8, key: "pushbuttons", title: isAr ? "أزرار الطلب و LED" : "Pushbuttons & Halo", subtitle: isAr ? "حلقات الإضاءة وبرايل" : "Braille & Halo Lighting", icon: CircleDot },
    { id: 9, key: "emergency", title: isAr ? "أنظمة السلامة" : "Safety & Intercom", subtitle: isAr ? "مفتاح الطوارئ والإنتركوم" : "Fire Service & Phone", icon: Flame },
    { id: 10, key: "accessories", title: isAr ? "الإكسسوارات والدرابزين" : "Accessories", subtitle: isAr ? "المرايا وكاميرا المراقبة" : "Mirrors & Dome CCTV", icon: ShieldCheck },
    { id: 11, key: "hall", title: isAr ? "البهو الخارجي" : "Hall Station", subtitle: isAr ? "محطة الدور ومؤشر الوصول" : "Landing Station & Lantern", icon: Building2 },
  ];

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Hydrate config from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const configStr = params.get("config");
      if (configStr) {
        importConfig(configStr);
      }
    }
  }, [importConfig]);

  const handleStepClick = (stepNum: number) => {
    elevatorAudio.playButtonClick();
    setActiveStep(stepNum);
    if (stepNum === 11 && viewMode !== "hall") {
      setViewMode("hall");
    } else if (stepNum === 1 && viewMode !== "shaft") {
      setViewMode("shaft");
    } else if (stepNum !== 11 && stepNum !== 1 && viewMode !== "cab") {
      setViewMode("cab");
    }
  };

  const handleNextStep = () => {
    if (activeStep < 11) handleStepClick(activeStep + 1);
  };

  const handlePrevStep = () => {
    if (activeStep > 1) handleStepClick(activeStep - 1);
  };

  const currentPrice = getEstimatedPrice();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Main Sidebar Wizard */}
      <aside 
        dir={isAr ? 'rtl' : 'ltr'} 
        className={`
          fixed md:relative bottom-0 left-0 w-full md:w-full h-[85vh] md:h-full bg-gray-900 border-t md:border-r md:border-l border-white/10 shadow-2xl z-40 flex flex-col transition-transform duration-300 text-white
          ${isMobileOpen ? 'translate-y-0' : 'translate-y-[calc(100%-68px)] md:translate-y-0'}
        `}
      >
        {/* Mobile Header Pull Tab */}
        <div 
          className="md:hidden flex items-center justify-between px-5 py-3.5 bg-gray-950 border-b border-white/10 cursor-pointer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bayern-red animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {WIZARD_STEPS[activeStep - 1]?.title}
            </span>
          </div>
          {pricingMode === 'dealer' && (
            <span className="text-sm font-bold text-emerald-400 font-mono">
              ${currentPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Wizard Steps Timeline Slider / Horizontal Scroll */}
        <div className="bg-gray-950/80 border-b border-white/10 p-3 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {WIZARD_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isPassed = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-bayern-red text-white border-bayern-red shadow-lg shadow-bayern-red/30'
                      : isPassed
                      ? 'bg-white/10 text-gray-200 border-white/10 hover:bg-white/15'
                      : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
                    {step.id}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-gray-900/60 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-bayern-red">
                {isAr ? `الخطوة ${activeStep} من 11` : `Step ${activeStep} of 11`}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">
              {WIZARD_STEPS[activeStep - 1]?.title}
            </h2>
            <p className="text-xs text-gray-400">
              {WIZARD_STEPS[activeStep - 1]?.subtitle}
            </p>
          </div>

          {/* Pricing Display */}
          {pricingMode === 'dealer' ? (
            <div className="text-right">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                {isAr ? 'السعر التقديري' : 'Estimated Total'}
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                ${currentPrice.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-[10px] font-bold text-bayern-blue bg-bayern-blue/10 px-2.5 py-1 rounded-full border border-bayern-blue/20">
                {isAr ? 'عرض العميل' : 'Client Mode'}
              </span>
            </div>
          )}
        </div>

        {/* Wizard Step Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: ARCHITECTURE & DRIVE SYSTEM */}
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* Drive System Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'نظام المحرك والحركة (Drive System)' : 'Drive & Traction System'}
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'traction_h300', name: isAr ? 'مصعد سحب كهربائي MRL (H300)' : 'Traction MRL (H300)', desc: isAr ? 'محرك جيرلس بدون غرفة ماكينة، سرعة وكفاءة عالية' : 'Gearless Machine Room-less, High speed & smooth ride' },
                    { id: 'hydraulic_h200', name: isAr ? 'مصعد هيدروليكي منزلي (H200)' : 'Hydraulic Homelift (H200)', desc: isAr ? 'مثالي للفلل والقصور السكنية مع عمق حفرة أدنى' : 'Perfect for luxury villas with minimal pit depth' },
                    { id: 'panoramic_scenic', name: isAr ? 'مصعد بانورامي كريستال زجاجي' : 'Panoramic Scenic 360', desc: isAr ? 'إطلالة زجاجية كاملة 360 درجة مع كابينة دائرية أو مربعة' : 'Full 360 glass sightseeing cab with architectural prestige' },
                  ].map((sys) => (
                    <button
                      key={sys.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setDriveSystem(sys.id as DriveSystemType); }}
                      className={`p-3.5 rounded-2xl border text-start transition-all flex flex-col gap-1 ${
                        driveSystem === sys.id
                          ? 'bg-bayern-red/15 border-bayern-red text-white shadow-lg'
                          : 'bg-gray-800/40 border-white/10 text-gray-300 hover:bg-gray-800/80'
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center justify-between">
                        <span>{sys.name}</span>
                        {driveSystem === sys.id && <Check className="w-4 h-4 text-bayern-red" />}
                      </span>
                      <span className="text-[11px] text-gray-400">{sys.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shaft Structure */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'هيكل البئر (Shaft Enclosure)' : 'Shaft Enclosure Structure'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'glass_panoramic', name: isAr ? 'شافت زجاجي بانورامي' : 'Panoramic Glass' },
                    { id: 'steel_frame', name: isAr ? 'هيكل فولاذي شبكي' : 'Steel Lattice Frame' },
                    { id: 'masonry_enclosed', name: isAr ? 'بئر خرساني مغلق' : 'Enclosed Masonry' },
                    { id: 'none', name: isAr ? 'بدون هيكل خارجي' : 'Minimal Floating' },
                  ].map((sh) => (
                    <button
                      key={sh.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setShaftStructure(sh.id as ShaftStructureType); }}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        shaftStructure === sh.id
                          ? 'bg-bayern-blue/20 border-bayern-blue text-white'
                          : 'bg-gray-800/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {sh.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SIGNATURE PRESETS */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                {isAr 
                  ? 'اختر من بين مجموعات التصميم المعمارية الجاهزة المستوحاة من كبرى دور التصميم:' 
                  : 'Select from pre-configured signature luxury styles inspired by Volks & AccessBDD:'}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {themePresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      elevatorAudio.playPresetChime();
                      applyPreset(preset.id);
                    }}
                    className="group bg-gray-800/50 hover:bg-gray-800 border border-white/10 hover:border-bayern-red/50 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0 flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: preset.thumbnailColor, color: preset.secondaryColor }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-bayern-red transition-colors">
                          {isAr ? preset.nameAr : preset.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 line-clamp-2">
                          {isAr ? preset.descriptionAr : preset.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-500 group-hover:text-white transition-transform ${isAr ? 'rotate-180' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DOORS & REVEALS */}
          {activeStep === 3 && (
            <div className="space-y-6">
              {/* Door Mechanism */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'نوع وآلية الباب' : 'Door Type & Mechanism'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'telescopic_center', name: isAr ? 'انزلاقي مركزي' : 'Center Slide' },
                    { id: 'telescopic_side', name: isAr ? 'انزلاقي جانبي' : 'Side Slide' },
                    { id: 'glass_swing', name: isAr ? 'زجاجي مفصلي' : 'Glass Swing' },
                  ].map((dm) => (
                    <button
                      key={dm.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setDoorMechanism(dm.id as DoorMechanismType); }}
                      className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        doorMechanism === dm.id
                          ? 'bg-bayern-red text-white border-bayern-red'
                          : 'bg-gray-800/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {dm.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Door Finishes */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'تشطيب أوراق الأبواب' : 'Door Leaf Finish'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {defaultDoorFinishes.map((df) => (
                    <button
                      key={df.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setDoorFinish(df); }}
                      className={`p-3 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                        doorFinish.id === df.id
                          ? 'bg-gray-800 border-bayern-red text-white'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: df.color }} />
                      <span className="text-xs font-semibold">{isAr ? df.nameAr : df.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural Vertical Reveals */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'حليات الزوايا الرأسية (Reveals)' : 'Vertical Reveal Trims'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {defaultRevealMaterials.map((rev) => (
                    <button
                      key={rev.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setRevealFinish(rev); }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        revealFinish.id === rev.id
                          ? 'bg-gray-800 border-bayern-blue text-white'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {isAr ? rev.nameAr : rev.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CAB WALLS */}
          {activeStep === 4 && (
            <div className="space-y-6">
              {/* Back Wall Finish */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'الجدار الخلفي (Back Wall)' : 'Rear Wall Finish'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {defaultWallMaterials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setBackWallMaterial(mat); }}
                      className={`p-3 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                        backWallMaterial.id === mat.id
                          ? 'bg-gray-800 border-bayern-red text-white shadow-md'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-inner" style={{ backgroundColor: mat.color }} />
                      <span className="text-xs font-semibold line-clamp-1">{isAr ? mat.nameAr : mat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Side Walls Finish */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'الجدران الجانبية (Side Walls)' : 'Side Walls Finish'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {defaultWallMaterials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setSideWallMaterial(mat); }}
                      className={`p-3 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                        sideWallMaterial.id === mat.id
                          ? 'bg-gray-800 border-bayern-red text-white shadow-md'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-inner" style={{ backgroundColor: mat.color }} />
                      <span className="text-xs font-semibold line-clamp-1">{isAr ? mat.nameAr : mat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FLOORS & CEILINGS & LIGHTING */}
          {activeStep === 5 && (
            <div className="space-y-6">
              {/* Floor Materials */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'أرضية الكابينة (الرخام والجرانيت)' : 'Floor Finishes (Marble & Granite)'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {defaultFloorMaterials.map((floor) => (
                    <button
                      key={floor.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setFloorMaterial(floor); }}
                      className={`p-3 rounded-2xl border text-start flex items-center justify-between transition-all ${
                        floorMaterial.id === floor.id
                          ? 'bg-gray-800 border-bayern-red text-white shadow-md'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md border border-white/20 shadow-inner" style={{ backgroundColor: floor.color }} />
                        <span className="text-xs font-semibold">{isAr ? floor.nameAr : floor.name}</span>
                      </div>
                      {floorMaterial.id === floor.id && <Check className="w-4 h-4 text-bayern-red" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ceiling Finishes */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'طراز السقف ووحدات الإضاءة' : 'Ceiling Design & Fixture'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {defaultCeilingMaterials.map((ceil) => (
                    <button
                      key={ceil.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setCeilingMaterial(ceil); }}
                      className={`p-3 rounded-2xl border text-start flex items-center gap-2.5 transition-all ${
                        ceilingMaterial.id === ceil.id
                          ? 'bg-gray-800 border-bayern-red text-white'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: ceil.color }} />
                      <span className="text-xs font-semibold line-clamp-1">{isAr ? ceil.nameAr : ceil.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Lighting Atmosphere */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'بيئة الإضاءة وأجواء الكابينة' : 'Lighting Ambiance Preset'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'warm', name: isAr ? 'دافئ 3000K' : 'Warm 3000K' },
                    { id: 'day', name: isAr ? 'نهاري 5000K' : 'Daylight' },
                    { id: 'starlight', name: isAr ? 'سقف النجوم' : 'Starlight' },
                    { id: 'cool', name: isAr ? 'أزرق نيون' : 'Cyber Cool' },
                    { id: 'cove', name: isAr ? 'إضاءة مخفية' : 'Cove LED' },
                    { id: 'sunset', name: isAr ? 'غروب ذهبي' : 'Sunset' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setLighting(l.id as LightingType); }}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        lighting === l.id
                          ? 'bg-bayern-blue text-white border-bayern-blue shadow-md'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: COP OPERATING PANEL */}
          {activeStep === 6 && (
            <div className="space-y-6">
              {/* Interface Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'واجهة لوحة التحكم' : 'Interface Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'touchscreen', name: isAr ? 'شاشة لمسية ذكية (Smart Touch)' : 'Smart Touchscreen', desc: isAr ? 'شاشة رقمية تفاعلية كاملة' : 'Interactive glass screen' },
                    { id: 'mechanical', name: isAr ? 'أزرار ميكانيكية فاخرة' : 'Mechanical Pushbuttons', desc: isAr ? 'أزرار بروز مع لغة برايل' : 'Tactile Braille buttons' },
                  ].map((iface) => (
                    <button
                      key={iface.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setCOPInterface(iface.id as COPInterface); }}
                      className={`p-3.5 rounded-2xl border text-start transition-all ${
                        copInterface === iface.id
                          ? 'bg-bayern-red/15 border-bayern-red text-white'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <h4 className="text-xs font-bold">{iface.name}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{iface.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* COP Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'طراز وتشطيب اللوحة' : 'Faceplate Finish & Style'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'glass', name: isAr ? 'زجاجي أسود' : 'Glass' },
                    { id: 'premium', name: isAr ? 'ذهب مذهب' : 'Gold Premium' },
                    { id: 'standard', name: isAr ? 'ستانلس قياسي' : 'Standard' },
                    { id: 'full_height', name: isAr ? 'كامل الارتفاع' : 'Full Height' },
                    { id: 'slimline', name: isAr ? 'سليم لاين' : 'Slimline' },
                  ].map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setCOPType(ct.id as COPType); }}
                      className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all ${
                        copType === ct.id
                          ? 'bg-bayern-red text-white border-bayern-red'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {ct.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* COP Placement */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'موقع اللوحة داخل الكابينة' : 'Panel Placement'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'left', name: isAr ? 'يسار' : 'Left' },
                    { id: 'right', name: isAr ? 'يمين' : 'Right' },
                    { id: 'center', name: isAr ? 'خلفي وسط' : 'Center' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setCOPPlacement(pos.id as COPPlacement); }}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        copPlacement === pos.id
                          ? 'bg-bayern-blue text-white border-bayern-blue'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {pos.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: POSITION INDICATOR */}
          {activeStep === 7 && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {isAr ? 'طراز شاشة عرض الأدوار (PI Screen)' : 'Display Screen Technology'}
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'tft_color', name: isAr ? 'شاشة ملونة TFT عالية الدقة' : 'TFT Ultra-HD Color Display', desc: isAr ? 'عرض الطابق والاتجاه وشعار الشركة برسومات حية' : 'Dynamic animated floors, arrows & custom brand graphics' },
                  { id: 'segmented_led', name: isAr ? 'أرقام ليد برتقالية Segmented LED' : 'Segmented Amber LED', desc: isAr ? 'طراز رقمي تقليدي عالي الوضوح' : 'Classic bright high-contrast amber segments' },
                  { id: 'dot_matrix', name: isAr ? 'شاشة مصفوفة نقطية Dot Matrix' : 'Dot Matrix Matrix Screen', desc: isAr ? 'شاشة نقطية نيون زرقاء' : 'Crisp pixelated dot matrix' },
                ].map((pi) => (
                  <button
                    key={pi.id}
                    onClick={() => { elevatorAudio.playButtonClick(); setPIStyle(pi.id as PositionIndicatorStyle); }}
                    className={`p-3.5 rounded-2xl border text-start transition-all ${
                      piStyle === pi.id
                        ? 'bg-bayern-red/15 border-bayern-red text-white'
                        : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <h4 className="text-xs font-bold">{pi.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{pi.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: PUSHBUTTONS & HALO */}
          {activeStep === 8 && (
            <div className="space-y-6">
              {/* Pushbutton Style */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'شكل الأزرار' : 'Pushbutton Shape & Standard'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'round_braille', name: isAr ? 'دائري برايل' : 'Round Braille' },
                    { id: 'square_flush', name: isAr ? 'مربع فلاش' : 'Square Flush' },
                    { id: 'vandal_resistant', name: isAr ? 'مقاوم للصدمات' : 'Vandal Proof' },
                  ].map((pb) => (
                    <button
                      key={pb.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setPushbuttonStyle(pb.id as PushbuttonStyle); }}
                      className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        pushbuttonStyle === pb.id
                          ? 'bg-bayern-red text-white border-bayern-red'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {pb.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Halo LED Colors */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'لون حلقة الإضاءة Halo LED' : 'Halo LED Illumination Color'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'blue', name: isAr ? 'أزرق' : 'Blue', color: '#3b82f6' },
                    { id: 'emerald', name: isAr ? 'أخضر' : 'Emerald', color: '#10b981' },
                    { id: 'red', name: isAr ? 'أحمر' : 'Red', color: '#ef4444' },
                    { id: 'amber', name: isAr ? 'كهرماني' : 'Amber', color: '#f59e0b' },
                    { id: 'white', name: isAr ? 'أبيض' : 'White', color: '#f8fafc' },
                  ].map((halo) => (
                    <button
                      key={halo.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setHaloColor(halo.id as HaloColor); }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        haloColor === halo.id
                          ? 'bg-gray-800 border-white text-white'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: halo.color }} />
                      <span className="text-[10px] font-semibold">{halo.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: SAFETY & PHONE */}
          {activeStep === 9 && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {isAr ? 'تجهيزات السلامة والطوارئ' : 'Emergency & Firefighter Systems'}
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-800/40 border border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isAr ? 'مفتاح خدمة الإطفاء (Phase II Fire Service)' : 'Phase II Fire Service Key'}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {isAr ? 'مفتاح ميكانيكي معتمد لرجال الإطفاء في حالات الطوارئ' : 'Certified fireman key switch compliance'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={fireServiceEnabled}
                    onChange={(e) => { elevatorAudio.playButtonClick(); setFireServiceEnabled(e.target.checked); }}
                    className="w-5 h-5 accent-bayern-red rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-800/40 border border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isAr ? 'هاتف الطوارئ والإنتركوم الداخلي' : 'Emergency Intercom & Phone'}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {isAr ? 'نظام اتصال مباشر بغرفة التحكم والصيانة' : 'Hands-free direct communication system'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emergencyPhoneEnabled}
                    onChange={(e) => { elevatorAudio.playButtonClick(); setEmergencyPhoneEnabled(e.target.checked); }}
                    className="w-5 h-5 accent-bayern-red rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: ACCESSORIES & HANDRAILS */}
          {activeStep === 10 && (
            <div className="space-y-6">
              {/* Handrail Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'نوع الدرابزين' : 'Handrail Profile'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'round', name: isAr ? 'دائري' : 'Round' },
                    { id: 'flat', name: isAr ? 'مسطح' : 'Flat' },
                    { id: 'oval', name: isAr ? 'بيضاوي' : 'Oval' },
                    { id: 'none', name: isAr ? 'بدون' : 'None' },
                  ].map((hr) => (
                    <button
                      key={hr.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setHandrailType(hr.id as HandrailType); }}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        handrailType === hr.id
                          ? 'bg-bayern-red text-white border-bayern-red'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {hr.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mirror Style */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'المرايا الجدارية' : 'Mirror Configuration'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'full', name: isAr ? 'مرآة كاملة' : 'Full Height' },
                    { id: 'half', name: isAr ? 'نصف جدار' : 'Half Height' },
                    { id: 'none', name: isAr ? 'بدون مرآة' : 'No Mirror' },
                  ].map((ms) => (
                    <button
                      key={ms.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setMirrorStyle(ms.id as MirrorStyle); }}
                      className={`py-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        mirrorStyle === ms.id
                          ? 'bg-bayern-blue text-white border-bayern-blue'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {ms.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dome Camera */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-800/40 border border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'كاميرا مراقبة مدمجة (CCTV Dome)' : 'Integrated CCTV Dome Camera'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {isAr ? 'كاميرا مراقبة زجاجية مدمجة في زاوية السقف' : 'Ceiling corner panoramic security camera'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cameraDomeEnabled}
                  onChange={(e) => { elevatorAudio.playButtonClick(); setCameraDomeEnabled(e.target.checked); }}
                  className="w-5 h-5 accent-bayern-red rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 11: HALL FIXTURES */}
          {activeStep === 11 && (
            <div className="space-y-6">
              {/* Hall Wall Finish */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'جدار البهو الخارجي' : 'Lobby Wall Cladding'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {defaultHallWallMaterials.map((hmat) => (
                    <button
                      key={hmat.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setHallWallMaterial(hmat); }}
                      className={`p-3 rounded-2xl border text-start flex items-center justify-between transition-all ${
                        hallWallMaterial.id === hmat.id
                          ? 'bg-gray-800 border-bayern-red text-white'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: hmat.color }} />
                        <span className="text-xs font-semibold">{isAr ? hmat.nameAr : hmat.name}</span>
                      </div>
                      {hallWallMaterial.id === hmat.id && <Check className="w-4 h-4 text-bayern-red" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hall Lantern Style */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isAr ? 'مؤشر الوصول الخارجي' : 'Arrival Lantern Indicator'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'arrow', name: isAr ? 'أسهم اتجاه كلاسيكية' : 'Classic Arrows' },
                    { id: 'digital', name: isAr ? 'شاشة رقمية رقم الدور' : 'Digital Floor Number' },
                  ].map((hl) => (
                    <button
                      key={hl.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setHallLanternStyle(hl.id as 'arrow' | 'digital'); }}
                      className={`py-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        hallLanternStyle === hl.id
                          ? 'bg-bayern-red text-white border-bayern-red'
                          : 'bg-gray-800/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {hl.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Bar */}
        <div className="p-4 border-t border-white/10 bg-gray-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              activeStep === 1
                ? 'opacity-40 cursor-not-allowed border-white/5 text-gray-500'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            <span>{isAr ? 'السابق' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={activeStep === 11}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg ${
              activeStep === 11
                ? 'opacity-40 cursor-not-allowed bg-gray-800 text-gray-500'
                : 'bg-bayern-red hover:bg-red-700 text-white shadow-bayern-red/30'
            }`}
          >
            <span>{isAr ? 'الخطوة التالية' : 'Next Step'}</span>
            <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
}
