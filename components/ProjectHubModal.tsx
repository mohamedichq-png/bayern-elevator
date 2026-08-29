"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderGit2, 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Plus, 
  Trash2, 
  CopyPlus, 
  ArrowUpRight, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Layers 
} from "lucide-react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { elevatorAudio } from "@/lib/audioChime";

export default function ProjectHubModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    language,
    pricingMode,
    setPricingMode,
    currentProjectCode,
    savedProjects,
    saveProject,
    loadProject,
    deleteProject,
    cloneProject,
    exportConfig
  } = useConfiguratorStore();

  const [activeTab, setActiveTab] = useState<'saved' | 'share' | 'compare'>('saved');
  const [newProjectName, setNewProjectName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [compareLeftId, setCompareLeftId] = useState<string>(savedProjects[0]?.id || '');
  const [compareRightId, setCompareRightId] = useState<string>(savedProjects[1]?.id || '');

  if (!isOpen) return null;

  const fullShareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?config=${exportConfig()}` 
    : '';

  const handleCopyLink = () => {
    elevatorAudio.playButtonClick();
    navigator.clipboard.writeText(fullShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    elevatorAudio.playButtonClick();
    navigator.clipboard.writeText(currentProjectCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    elevatorAudio.playButtonClick();
    saveProject(newProjectName.trim() || undefined);
    setNewProjectName('');
  };

  const handleLoadByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    elevatorAudio.playButtonClick();
    // Search in saved projects or import directly
    const found = savedProjects.find(p => p.code.toLowerCase() === inputCode.trim().toLowerCase());
    if (found) {
      loadProject(found.id);
      onClose();
    } else {
      alert(language === 'ar' ? 'لم يتم العثور على المشروع بالكود المحدد' : 'Configuration code not found in local projects');
    }
  };

  const isAr = language === 'ar';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gray-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-bayern-red/20 border border-bayern-red/40 flex items-center justify-center text-bayern-red">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {isAr ? 'مركز إدارة ومشاركة المشاريع' : 'Project Management & Sharing Hub'}
                </h2>
                <p className="text-xs text-gray-400">
                  {isAr ? 'حفظ التصاميم، استرجاع الأكواد، ومشاركة العروض' : 'Save designs, retrieve unique codes, and share quotations'}
                </p>
              </div>
            </div>

            {/* Pricing Mode Toggle & Close */}
            <div className="flex items-center gap-3">
              {/* Mode Toggle Button */}
              <button
                onClick={() => {
                  elevatorAudio.playButtonClick();
                  setPricingMode(pricingMode === 'dealer' ? 'client' : 'dealer');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  pricingMode === 'dealer'
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                    : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                }`}
                title="Toggle Mode"
              >
                {pricingMode === 'dealer' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>
                  {pricingMode === 'dealer' 
                    ? (isAr ? 'وضع الموزع (مع السعر)' : 'Dealer Mode (With Price)') 
                    : (isAr ? 'وضع العميل (بدون سعر)' : 'Client Mode (No Price)')}
                </span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-6 border-b border-white/10 bg-gray-900/50 gap-2">
            {[
              { id: 'saved', label: isAr ? 'المشاريع المحفوظة' : 'Saved Projects', icon: Layers },
              { id: 'share', label: isAr ? 'كود المشاركة و QR' : 'Share Code & QR', icon: Share2 },
              { id: 'compare', label: isAr ? 'مقارنة التصاميم' : 'Compare Designs', icon: SlidersHorizontal },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { elevatorAudio.playButtonClick(); setActiveTab(tab.id as 'saved' | 'share' | 'compare'); }}
                  className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs transition-all ${
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: SAVED PROJECTS */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                {/* Save Current Configuration Box */}
                <form onSubmit={handleSaveCurrent} className="bg-gray-800/40 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder={isAr ? 'اسم المشروع الجديد (مثال: فيلا اللؤلؤة)...' : 'New project name (e.g. Pearl Villa)...'}
                    className="flex-1 bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-bayern-red w-full"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-bayern-red hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-bayern-red/30 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'حفظ التكوين الحالي' : 'Save Current Config'}</span>
                  </button>
                </form>

                {/* Projects List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {isAr ? `قائمة المشاريع (${savedProjects.length})` : `Projects List (${savedProjects.length})`}
                  </h3>

                  {savedProjects.length === 0 ? (
                    <div className="text-center py-10 bg-gray-950/40 rounded-2xl border border-white/5 text-gray-400 text-sm">
                      {isAr ? 'لا توجد مشاريع محفوظة حتى الآن.' : 'No saved projects yet.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {savedProjects.map((p) => (
                        <div
                          key={p.id}
                          className="bg-gray-800/60 hover:bg-gray-800/90 border border-white/10 rounded-2xl p-4 transition-all flex flex-col justify-between gap-3 shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-bayern-blue/20 text-bayern-blue text-[10px] font-mono font-bold mb-1 border border-bayern-blue/30">
                                {p.code}
                              </span>
                              <h4 className="text-sm font-bold text-white line-clamp-1">{p.name}</h4>
                              <p className="text-[11px] text-gray-400">{p.date}</p>
                            </div>
                            {pricingMode === 'dealer' && (
                              <div className="text-right">
                                <span className="text-xs text-gray-400 block">{isAr ? 'السعر التقديري' : 'Est. Price'}</span>
                                <span className="text-sm font-bold text-emerald-400 font-mono">${p.price.toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => {
                                elevatorAudio.playButtonClick();
                                loadProject(p.id);
                                onClose();
                              }}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-bayern-red hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>{isAr ? 'فتح وتطبيق' : 'Load Design'}</span>
                            </button>

                            <button
                              onClick={() => {
                                elevatorAudio.playButtonClick();
                                cloneProject(p.id);
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
                              title={isAr ? 'استنساخ' : 'Duplicate'}
                            >
                              <CopyPlus className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                elevatorAudio.playButtonClick();
                                deleteProject(p.id);
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                              title={isAr ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SHARE CODE & QR */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                {/* Current Unique Project Code Card */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-950 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-bayern-blue">
                      {isAr ? 'كود التكوين الفريد (AccessBDD Code)' : 'Unique Configuration Code'}
                    </span>
                    <h3 className="text-3xl font-extrabold font-mono text-white tracking-wider">
                      {currentProjectCode}
                    </h3>
                    <p className="text-xs text-gray-400 max-w-md">
                      {isAr 
                        ? 'يمكنك تزويد العميل أو مهندس المشروع بهذا الكود لاسترجاع نفس مواصفات المصعد وتفاصيله بدقة على أي جهاز.' 
                        : 'Share this unique configuration code with clients or engineers to load the exact 3D specification on any device.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/10"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? (isAr ? 'تم نسخ الكود!' : 'Code Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 rounded-xl bg-bayern-red hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-bayern-red/30 transition-all"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
                      <span>{copiedLink ? (isAr ? 'تم نسخ الرابط!' : 'Link Copied!') : (isAr ? 'نسخ رابط المشاركة' : 'Copy Link')}</span>
                    </button>
                  </div>
                </div>

                {/* QR Code & Direct Load by Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* QR Code Card */}
                  <div className="bg-gray-800/40 p-5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-md">
                      {/* Generates dynamic QR code via reliable fast QR API */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullShareUrl)}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-bayern-red" />
                        <span>{isAr ? 'مسح QR للجوال' : 'Scan Mobile QR'}</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {isAr 
                          ? 'امسح الرمز بكاميرا الهاتف لفتح محاكي المصعد 360° مباشرة على هاتفك الذكي.' 
                          : 'Scan with your smartphone camera to view the 3D lift configurator instantly.'}
                      </p>
                    </div>
                  </div>

                  {/* Load by Code Box */}
                  <div className="bg-gray-800/40 p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? 'استرجاع مشروع بواسطة الكود' : 'Load Project by Code'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {isAr ? 'أدخل كود التكوين المستلم لفتح التصميم فوراً.' : 'Paste a configuration code to open that design.'}
                      </p>
                    </div>
                    <form onSubmit={handleLoadByCode} className="flex gap-2">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="ELEV-XXXX-XX"
                        className="flex-1 bg-gray-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-bayern-red uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                      >
                        {isAr ? 'تحميل' : 'Load'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMPARE DESIGNS */}
            {activeTab === 'compare' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">
                  {isAr 
                    ? 'اختر مشروعين لمقارنة المواصفات المعمارية والميكانيكية والتسعير جنباً إلى جنب:' 
                    : 'Select 2 projects to compare architectural specs and pricing side-by-side:'}
                </p>

                {/* Selection Dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      {isAr ? 'المشروع الأول (A)' : 'Project A'}
                    </label>
                    <select
                      value={compareLeftId}
                      onChange={(e) => setCompareLeftId(e.target.value)}
                      className="w-full bg-gray-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bayern-red"
                    >
                      {savedProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      {isAr ? 'المشروع الثاني (B)' : 'Project B'}
                    </label>
                    <select
                      value={compareRightId}
                      onChange={(e) => setCompareRightId(e.target.value)}
                      className="w-full bg-gray-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bayern-red"
                    >
                      {savedProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comparison Specs Matrix Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gray-950/60">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-gray-400">
                        <th className="p-3 text-start">{isAr ? 'البند / المواصفة' : 'Specification'}</th>
                        <th className="p-3 text-start text-bayern-blue">
                          {savedProjects.find(p => p.id === compareLeftId)?.name || 'Project A'}
                        </th>
                        <th className="p-3 text-start text-emerald-400">
                          {savedProjects.find(p => p.id === compareRightId)?.name || 'Project B'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      <tr>
                        <td className="p-3 font-semibold text-white">{isAr ? 'كود المشروع' : 'Project Code'}</td>
                        <td className="p-3 font-mono">{savedProjects.find(p => p.id === compareLeftId)?.code || '-'}</td>
                        <td className="p-3 font-mono">{savedProjects.find(p => p.id === compareRightId)?.code || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">{isAr ? 'نظام المحرك' : 'Drive System'}</td>
                        <td className="p-3">{savedProjects.find(p => p.id === compareLeftId)?.driveSystem.toUpperCase() || '-'}</td>
                        <td className="p-3">{savedProjects.find(p => p.id === compareRightId)?.driveSystem.toUpperCase() || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">{isAr ? 'هيكل البئر' : 'Shaft Structure'}</td>
                        <td className="p-3">{savedProjects.find(p => p.id === compareLeftId)?.shaftStructure.toUpperCase() || '-'}</td>
                        <td className="p-3">{savedProjects.find(p => p.id === compareRightId)?.shaftStructure.toUpperCase() || '-'}</td>
                      </tr>
                      {pricingMode === 'dealer' && (
                        <tr className="bg-white/5 font-bold">
                          <td className="p-3 text-white">{isAr ? 'السعر التقديري' : 'Estimated Price'}</td>
                          <td className="p-3 text-bayern-blue font-mono">
                            ${savedProjects.find(p => p.id === compareLeftId)?.price.toLocaleString() || '0'}
                          </td>
                          <td className="p-3 text-emerald-400 font-mono">
                            ${savedProjects.find(p => p.id === compareRightId)?.price.toLocaleString() || '0'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
