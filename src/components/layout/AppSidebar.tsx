import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Home,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isSidebarOpen,
    toggleSidebar,
  } = useLMS();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Unified Smoothly Morphing Portal Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none transition-[width] duration-300 ease-in-out overflow-hidden shadow-lg lg:shadow-none ${
          isSidebarOpen ? 'w-72' : 'w-16'
        }`}
      >
        <div className="w-full flex flex-col">
          
          {/* Top Header / Banner (Smooth Morph between 288px and 64px) */}
          <div className="relative border-b border-slate-200/80 shrink-0 overflow-hidden bg-slate-50/50">
            {isSidebarOpen ? (
              <div className="h-24 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-4 flex flex-col justify-between overflow-hidden transition-all duration-300">
                {/* Subtle background decoration */}
                <div className="absolute right-3 -bottom-2 w-16 h-16 rounded-full bg-white/10 blur-xs pointer-events-none" />
                <div className="absolute right-10 top-2 w-2 h-2 rounded-full bg-amber-300/60 pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-blue-200/80 font-bold whitespace-nowrap">
                    PORTAL PEMBINAAN
                  </span>
                  
                  {/* Minimize Button (←) */}
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors active:scale-95"
                    title="Perkecil Menu Sidebar (Rail Mode)"
                    aria-label="Minimize Sidebar"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="z-10 whitespace-nowrap">
                  <p className="text-xs font-bold leading-tight text-white">
                    Statistik Sektoral SDI
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Penyelenggaraan Daerah 2026
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-14 flex items-center justify-center transition-all duration-300">
                {/* Expand Button (→) */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-9 h-9 rounded-full bg-slate-900 hover:bg-blue-950 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
                  title="Perluas Menu Sidebar"
                  aria-label="Expand Sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Group 1: Navigasi Utama */}
          <div className="p-3 border-b border-slate-100 space-y-1">
            {isSidebarOpen && (
              <div className="px-3 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap transition-opacity duration-200">
                Menu Utama
              </div>
            )}

            {/* 1. Beranda */}
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center rounded-xl transition-all relative group active:scale-[0.98] ${
                isSidebarOpen
                  ? 'px-3 py-2.5 gap-3 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              } ${
                activeView === 'dashboard'
                  ? 'bg-blue-50 text-blue-950 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={!isSidebarOpen ? 'Beranda (Dashboard)' : undefined}
            >
              <Home className={`w-4 h-4 shrink-0 ${activeView === 'dashboard' ? 'text-blue-900' : 'text-slate-400'}`} />
              
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-200 text-left ${
                  isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 w-0 pointer-events-none'
                }`}
              >
                Beranda
              </span>

              {/* Tooltip on Rail Mode */}
              {!isSidebarOpen && (
                <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Beranda
                </span>
              )}
            </button>

            {/* 2. Progres Belajar (Pusat Kurikulum & Modul) */}
            <button
              type="button"
              onClick={() => setActiveView('progress')}
              className={`w-full flex items-center rounded-xl transition-all relative group active:scale-[0.98] ${
                isSidebarOpen
                  ? 'px-3 py-2.5 gap-3 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              } ${
                activeView === 'progress'
                  ? 'bg-blue-50 text-blue-950 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={!isSidebarOpen ? 'Progres Belajar' : undefined}
            >
              <BookOpen className={`w-4 h-4 shrink-0 ${activeView === 'progress' ? 'text-blue-900' : 'text-slate-400'}`} />
              
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-200 text-left ${
                  isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 w-0 pointer-events-none'
                }`}
              >
                Progres Belajar
              </span>

              {/* Tooltip on Rail Mode */}
              {!isSidebarOpen && (
                <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Progres Belajar
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Bottom Sidebar Footer: Theme Pills & Helpdesk */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          {isSidebarOpen ? (
            <div className="transition-opacity duration-200">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="text-[11px] font-medium whitespace-nowrap">Tema Tampilan</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Sistem"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded bg-slate-100 text-slate-800 shadow-2xs"
                    title="Terang"
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Gelap"
                  >
                    <Moon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>BPS · SDI © 2026</span>
                <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                  <HelpCircle className="w-3 h-3" />
                  <span>Bantuan</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                title="Tema Tampilan Terang"
              >
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
