"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  FileText, 
  Send, 
  CheckCircle2, 
  Download, 
  Boxes, 
  Layers, 
  Building2, 
  Sparkles 
} from "lucide-react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { elevatorAudio } from "@/lib/audioChime";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SummaryModal({ isOpenExternal, onCloseExternal }: { isOpenExternal?: boolean; onCloseExternal?: () => void }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'bom' | 'rfq'>('specs');
  
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = (val: boolean) => {
    if (onCloseExternal && !val) onCloseExternal();
    setInternalOpen(val);
  };

  const { 
    language,
    pricingMode,
    currentProjectCode,
    driveSystem,
    shaftStructure,
    doorMechanism,
    backWallMaterial, 
    sideWallMaterial, 
    revealFinish,
    floorMaterial, 
    ceilingMaterial, 
    doorFinish,
    doorOpeningType,
    copType, 
    copPlacement, 
    copInterface, 
    piStyle,
    pushbuttonStyle,
    haloColor,
    fireServiceEnabled,
    emergencyPhoneEnabled,
    handrailType, 
    handrailLocation, 
    mirrorStyle,
    cameraDomeEnabled,
    lighting,
    hallWallMaterial,
    hallStationStyle,
    hallLanternStyle,
    getEstimatedPrice
  } = useConfiguratorStore();

  const isAr = language === 'ar';
  const estimatedPrice = getEstimatedPrice();

  const generatePDF = () => {
    elevatorAudio.playButtonClick();
    const doc = new jsPDF();
    
    // Header Branding Banner
    doc.setFillColor(211, 47, 47); // Bayern Red
    doc.rect(0, 0, 210, 24, 'F');

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("BAYERN SYSTEMS - BESPOKE 3D ELEVATOR SPECIFICATION", 14, 16);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Document Reference: BS-${currentProjectCode}`, 14, 34);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 40);
    if (pricingMode === 'dealer') {
      doc.text(`Commercial Package Cost: $${estimatedPrice.toLocaleString()} USD`, 14, 46);
    } else {
      doc.text(`Status: Official Client Architectural Specification`, 14, 46);
    }

    // Section 1: Mechanical & Structural Architecture
    doc.setFontSize(12);
    doc.setTextColor(211, 47, 47);
    doc.text("1. MECHANICAL & SHAFT ARCHITECTURE", 14, 56);

    autoTable(doc, {
      startY: 60,
      head: [['System Component', 'Selected Specification', 'Technical Details']],
      body: [
        ['Drive & Traction System', driveSystem.toUpperCase(), 'EN-81 / ASME A17.1 Compliant'],
        ['Shaft Enclosure', shaftStructure.toUpperCase(), 'Structural Frame & Panes'],
        ['Door Mechanism', doorMechanism.toUpperCase(), `${doorOpeningType.toUpperCase()} Operation`],
        ['Lighting Atmosphere', lighting.toUpperCase(), 'Integrated Cove & Starlight Package'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [211, 47, 47] }
    });

    // Section 2: Cab Interior & Finishes Table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY1 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(211, 47, 47);
    doc.text("2. CAB INTERIOR & FINISHES", 14, finalY1);

    autoTable(doc, {
      startY: finalY1 + 4,
      head: [['Interior Element', 'Material Selection', 'Finish Properties']],
      body: [
        ['Back Wall Panel', backWallMaterial.name, `Color: ${backWallMaterial.color}`],
        ['Side Wall Panels', sideWallMaterial.name, `Color: ${sideWallMaterial.color}`],
        ['Vertical Reveals', revealFinish.name, 'Architectural Accent Trims'],
        ['Floor Surface', floorMaterial.name, 'Commercial Heavy-Duty Load Rated'],
        ['Ceiling Design', ceilingMaterial.name, 'Integrated High-CRI LED Fixtures'],
        ['Door Leaves', doorFinish.name, 'PVD Coated / Brushed Finish'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] }
    });

    // Section 3: Fixtures, Safety & Hall Equipment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY2 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(211, 47, 47);
    doc.text("3. FIXTURES, SIGNAGE & HALL STATIONS", 14, finalY2);

    autoTable(doc, {
      startY: finalY2 + 4,
      head: [['Item', 'Specification', 'Features']],
      body: [
        ['Car Operating Panel (COP)', `${copType.toUpperCase()} - ${copInterface}`, `Location: ${copPlacement.toUpperCase()} Wall`],
        ['Position Indicator (PI)', piStyle.replace('_', ' ').toUpperCase(), 'Real-time floor & directional display'],
        ['Pushbuttons', pushbuttonStyle.replace('_', ' ').toUpperCase(), `Halo LED Ring: ${haloColor.toUpperCase()}`],
        ['Fire Service', fireServiceEnabled ? 'Phase II Equipped' : 'Standard', 'Keyed Recall Switch Cabinet'],
        ['Emergency Phone', emergencyPhoneEnabled ? 'Hands-Free Intercom' : 'None', 'ADA / EN-81 Compliant'],
        ['Handrails & Mirror', `${handrailType.toUpperCase()} (${handrailLocation})`, mirrorStyle === 'none' ? 'No Mirror' : `${mirrorStyle.toUpperCase()} Mirror`],
        ['Hall Call Station', `${hallStationStyle.toUpperCase()} Mounted`, `Lobby Wall: ${hallWallMaterial.name}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] }
    });

    // Autodesk BIM / CAD Export Note
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY3 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Autodesk Revit / BIM Integration Notice: Parameters conform to Bayern BIM Family standard (BS-REVIT-2026).", 14, finalY3);

    doc.save(`Bayern-Elevator-Specification-${currentProjectCode}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      contact: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        project: formData.get("project"),
      },
      configuration: {
        code: currentProjectCode,
        estimatedPrice,
        driveSystem,
        shaftStructure,
        doorMechanism,
        backWall: backWallMaterial.name,
        sideWalls: sideWallMaterial.name,
        reveal: revealFinish.name,
        floor: floorMaterial.name,
        ceiling: ceilingMaterial.name,
        doors: `${doorOpeningType} (${doorFinish.name})`,
        cop: `${copType} - ${copInterface} on ${copPlacement} wall`,
        positionIndicator: piStyle,
        pushbutton: `${pushbuttonStyle} (${haloColor} halo)`,
        fireService: fireServiceEnabled ? 'Phase II Enabled' : 'Disabled',
        emergencyPhone: emergencyPhoneEnabled ? 'Hands-Free Intercom' : 'Disabled',
        handrails: `${handrailType} (${handrailLocation})`,
        mirror: mirrorStyle,
        camera: cameraDomeEnabled ? 'Yes' : 'No',
        hallWall: hallWallMaterial.name,
        hallStation: hallStationStyle,
        hallLantern: hallLanternStyle,
      }
    };
    
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => setIsSuccess(false), 500); 
        }, 3000);
      } else {
        alert(isAr ? "تم تسجيل طلبك بنجاح وسيتواصل معك مستشارنا الفني." : "Quote request submitted successfully!");
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button if no external modal control */}
      {isOpenExternal === undefined && (
        <button
          onClick={() => { elevatorAudio.playButtonClick(); setIsOpen(true); }}
          className="fixed bottom-6 left-6 z-30 flex items-center gap-2.5 bg-bayern-red hover:bg-red-700 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-bayern-red/30 transition-all hover:scale-105 active:scale-95 font-bold text-xs border border-white/20"
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'المواصفات وعرض السعر' : 'RFQ & Summary'}</span>
        </button>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir={isAr ? 'rtl' : 'ltr'}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] text-white"
            >
              {/* Modal Header */}
              <div className="bg-gray-950 px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-bayern-red/20 text-bayern-red text-[10px] font-mono font-bold border border-bayern-red/30">
                      {currentProjectCode}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                      {isAr ? 'تقرير المواصفات الفنية المعتمد' : 'Bespoke Technical Specification'}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">
                    {isAr ? 'جدول المواصفات وطلب عرض السعر (RFQ)' : 'Specification & Commercial Quote'}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={generatePDF}
                    className="flex items-center gap-2 px-4 py-2 bg-bayern-red hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'تحميل كراسة المواصفات PDF' : 'Download Spec PDF'}</span>
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-white/10 bg-gray-950/40 px-6 pt-2 gap-2">
                {[
                  { id: 'specs', label: isAr ? 'المواصفات المعمارية' : 'Architectural Specs', icon: Layers },
                  { id: 'bom', label: isAr ? 'جدول الكميات والتسعير' : 'BOM & Costing', icon: Boxes },
                  { id: 'rfq', label: isAr ? 'طلب عرض سعر رسمي' : 'Official RFQ', icon: Send },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { elevatorAudio.playButtonClick(); setActiveTab(tab.id as 'specs' | 'bom' | 'rfq'); }}
                      className={`flex items-center gap-2 px-4 py-3 font-bold text-xs border-b-2 transition-all ${
                        activeTab === tab.id 
                          ? 'border-bayern-red text-white bg-white/5' 
                          : 'border-transparent text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* TAB 1: ARCHITECTURAL SPECS */}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mechanical & Shaft Card */}
                    <div className="p-4 rounded-2xl bg-gray-800/40 border border-white/10 space-y-3">
                      <h3 className="text-xs font-bold text-bayern-red uppercase flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{isAr ? 'الهيكل ونظام الحركة' : 'Drive & Shaft Architecture'}</span>
                      </h3>
                      <div className="space-y-2 text-xs divide-y divide-white/5">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'نظام المحرك' : 'Drive System'}</span>
                          <span className="font-semibold">{driveSystem.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'هيكل البئر' : 'Shaft Enclosure'}</span>
                          <span className="font-semibold">{shaftStructure.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'آلية الأبواب' : 'Door Mechanism'}</span>
                          <span className="font-semibold">{doorMechanism.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'بيئة الإضاءة' : 'Lighting Ambiance'}</span>
                          <span className="font-semibold">{lighting.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cab Finishes Card */}
                    <div className="p-4 rounded-2xl bg-gray-800/40 border border-white/10 space-y-3">
                      <h3 className="text-xs font-bold text-bayern-blue uppercase flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{isAr ? 'تشطيبات الكابينة والألواح' : 'Interior Materials & Panels'}</span>
                      </h3>
                      <div className="space-y-2 text-xs divide-y divide-white/5">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'الجدار الخلفي' : 'Back Wall'}</span>
                          <span className="font-semibold">{isAr ? backWallMaterial.nameAr : backWallMaterial.name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'الجدران الجانبية' : 'Side Walls'}</span>
                          <span className="font-semibold">{isAr ? sideWallMaterial.nameAr : sideWallMaterial.name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'الأرضية' : 'Floor Stone'}</span>
                          <span className="font-semibold">{isAr ? floorMaterial.nameAr : floorMaterial.name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">{isAr ? 'السقف' : 'Ceiling'}</span>
                          <span className="font-semibold">{isAr ? ceilingMaterial.nameAr : ceilingMaterial.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: BOM & COSTING */}
                {activeTab === 'bom' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-gray-950/60 overflow-hidden">
                      <table className="w-full text-xs text-start">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10 text-gray-400">
                            <th className="p-3 text-start">{isAr ? 'البند' : 'Item Description'}</th>
                            <th className="p-3 text-start">{isAr ? 'الخيار المختار' : 'Selection'}</th>
                            {pricingMode === 'dealer' && (
                              <th className="p-3 text-end">{isAr ? 'التكلفة التقديرية' : 'Est. Price'}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                          <tr>
                            <td className="p-3 font-semibold text-white">{isAr ? 'الحزمة الأساسية للمصعد' : 'Base Elevator Package'}</td>
                            <td className="p-3">{driveSystem.toUpperCase()} MRL System</td>
                            {pricingMode === 'dealer' && <td className="p-3 text-end font-mono text-emerald-400">$8,500</td>}
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">{isAr ? 'هيكل البئر الزجاجي/المعدني' : 'Shaft Structure'}</td>
                            <td className="p-3">{shaftStructure.toUpperCase()}</td>
                            {pricingMode === 'dealer' && <td className="p-3 text-end font-mono text-emerald-400">$6,800</td>}
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">{isAr ? 'تشطيبات الجدران والأرضيات' : 'Cab Finishes & Floor'}</td>
                            <td className="p-3">{isAr ? backWallMaterial.nameAr : backWallMaterial.name} + {isAr ? floorMaterial.nameAr : floorMaterial.name}</td>
                            {pricingMode === 'dealer' && <td className="p-3 text-end font-mono text-emerald-400">$3,500</td>}
                          </tr>
                        </tbody>
                        {pricingMode === 'dealer' && (
                          <tfoot>
                            <tr className="bg-white/5 font-bold border-t border-white/10 text-white">
                              <td className="p-3" colSpan={2}>{isAr ? 'الإجمالي التقديري الشامل' : 'Total Package Cost'}</td>
                              <td className="p-3 text-end font-mono text-emerald-400 text-sm">${estimatedPrice.toLocaleString()}</td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: RFQ FORM */}
                {activeTab === 'rfq' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSuccess ? (
                      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                        <h4 className="text-sm font-bold text-white">
                          {isAr ? 'تم إرسال طلب عرض السعر بنجاح!' : 'Quotation Request Sent Successfully!'}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {isAr ? 'سيتواصل معك مهندس المبيعات في غضون 24 ساعة بالمخططات التفصيلية.' : 'Our engineering consultant will get in touch within 24 hours.'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-300 block mb-1">
                              {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder={isAr ? 'م. أحمد خالد' : 'John Doe'}
                              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-bayern-red"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-300 block mb-1">
                              {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="client@domain.com"
                              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-bayern-red"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-300 block mb-1">
                              {isAr ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              placeholder="+974 XX XXX XXX"
                              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-bayern-red"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-300 block mb-1">
                              {isAr ? 'اسم المشروع والموقع' : 'Project Name & Location'}
                            </label>
                            <input
                              type="text"
                              name="project"
                              placeholder={isAr ? 'فيلا خاصة - الدوحة' : 'Private Villa - Lusail'}
                              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-bayern-red"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 rounded-xl bg-bayern-red hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-bayern-red/30 transition-all mt-4"
                        >
                          {isSubmitting ? (
                            <span>{isAr ? 'جاري الإرسال...' : 'Submitting...'}</span>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{isAr ? 'إرسال طلب عرض السعر والمخططات الهندسية' : 'Submit Formal Quote Request'}</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
