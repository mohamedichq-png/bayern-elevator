"use client";

import { useState } from "react";
import Elevator3DModel from "@/components/Elevator3DModel";
import SidebarControls from "@/components/SidebarControls";
import SummaryModal from "@/components/SummaryModal";
import ProjectHubModal from "@/components/ProjectHubModal";
import Image from "next/image";
import { 
  FolderGit2, 
  FileText, 
  Globe 
} from "lucide-react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { elevatorAudio } from "@/lib/audioChime";

export default function Home() {
  const { 
    language, 
    setLanguage, 
    currentProjectCode 
  } = useConfiguratorStore();

  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const isAr = language === 'ar';

  return (
    <main className="flex h-screen w-full flex-col md:flex-row overflow-hidden bg-gray-950 text-white select-none">
      {/* 3D Interactive Canvas Section */}
      <section className="relative flex-1 h-[55vh] md:h-screen bg-gray-950">
        {/* Brand Header Overlay with Official Logo & Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-120px)]">
          {/* Logo Badge */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl p-2 px-3.5 rounded-2xl border border-white/10 shadow-2xl">
            <div className="h-8 w-28 relative">
              <Image 
                src="/images/bayern-logo-white.svg" 
                alt="Bayern Systems Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block border-l border-white/15 pl-2.5">
              <span className="text-[11px] font-bold text-bayern-blue tracking-wide uppercase block">3D Configurator</span>
              <span className="text-[9px] text-gray-400 font-medium font-mono">{currentProjectCode}</span>
            </div>
          </div>

          {/* Quick Header Action Pills */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => {
                elevatorAudio.playButtonClick();
                setLanguage(language === 'ar' ? 'en' : 'ar');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-xs font-semibold transition-all shadow-lg text-gray-200 hover:text-white"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-bayern-blue" />
              <span>{language === 'ar' ? 'English' : 'العربية 🇸🇦'}</span>
            </button>

            {/* Projects Hub & Share Code */}
            <button
              onClick={() => {
                elevatorAudio.playButtonClick();
                setIsProjectsOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-xs font-semibold transition-all shadow-lg text-gray-200 hover:text-white"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-bayern-red" />
              <span>{isAr ? 'المشاريع والكود' : 'Projects & Code'}</span>
            </button>

            {/* RFQ / Specs Summary */}
            <button
              onClick={() => {
                elevatorAudio.playButtonClick();
                setIsSummaryOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bayern-red/80 hover:bg-bayern-red backdrop-blur-md border border-bayern-red/40 text-xs font-bold transition-all shadow-lg text-white"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? 'المواصفات وعرض السعر' : 'Specs & Quote'}</span>
            </button>
          </div>
        </div>

        {/* 3D Viewport Component */}
        <Elevator3DModel />
      </section>

      {/* 11-Step Wizard Sidebar */}
      <section className="w-full md:w-[420px] lg:w-[480px] h-[45vh] md:h-screen relative z-20 shrink-0 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
        <SidebarControls />
      </section>

      {/* Project Hub Modal (Share, Code, QR, Compare, Save) */}
      <ProjectHubModal 
        isOpen={isProjectsOpen} 
        onClose={() => setIsProjectsOpen(false)} 
      />

      {/* Summary / RFQ Modal */}
      <SummaryModal 
        isOpenExternal={isSummaryOpen} 
        onCloseExternal={() => setIsSummaryOpen(false)} 
      />
    </main>
  );
}
