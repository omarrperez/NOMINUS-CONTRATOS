import React from 'react';
import { Company, LaborContract } from '../types/contract';
import { CompanySelector } from './Companies/CompanySelector';
import { 
  FileText, 
  ShieldCheck, 
  Calculator, 
  Users, 
  Smartphone, 
  PlusCircle, 
  TrendingUp, 
  FileSignature,
  Cloud,
  Bot,
  Sparkles,
  Building2,
  Database,
  CheckCircle2
} from 'lucide-react';
import { formatVES } from '../utils/lotttCalculations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  bcvRate: number;
  setBcvRate: (rate: number) => void;
  contractsCount: number;
  cloudDocsCount: number;
  companies?: Company[];
  selectedCompanyId?: string | 'all';
  onSelectCompany?: (id: string | 'all') => void;
  onOpenCompanyManager?: () => void;
  contracts?: LaborContract[];
  isFirebaseConnected?: boolean;
  onOpenFirebasePanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  bcvRate,
  setBcvRate,
  contractsCount,
  cloudDocsCount,
  companies = [],
  selectedCompanyId = 'all',
  onSelectCompany,
  onOpenCompanyManager,
  contracts = [],
  isFirebaseConnected = true,
  onOpenFirebasePanel
}) => {
  const cestaticketVEF = 40 * bcvRate;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Banner: BCV & Regulatory Ticker in Pastel Champagne */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 px-4 py-1.5 border-b border-amber-200/60 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-slate-800">Gaceta Oficial & BCV:</span>
            <span className="text-slate-600">Tasa Oficial:</span>
            <div className="inline-flex items-center gap-1.5 bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-900 shadow-2xs">
              <span className="text-slate-500">Bs.</span>
              <input 
                type="number" 
                step="0.05"
                value={bcvRate} 
                onChange={(e) => setBcvRate(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-14 bg-transparent text-amber-950 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-0.5 text-center"
                title="Haga clic para simular variación de tasa oficial BCV"
              />
              <span className="text-[10px] text-slate-500">/ USD</span>
            </div>
            <span aria-hidden="true" className="text-amber-300">·</span>
            <span className="text-slate-600">Cestaticket Ley ($40 BCV):</span>
            <span className="font-semibold text-emerald-800 font-mono">{formatVES(cestaticketVEF)}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600 text-[11px]">
            {/* Live Firestore DB Badge - Limpio, estático y sobrio */}
            <button
              type="button"
              onClick={onOpenFirebasePanel}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 font-sans shadow-2xs transition-all cursor-pointer active:scale-98"
              title="Haga clic para ver el estado y diagnóstico de la base de datos Firestore"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-semibold text-slate-800 text-[11px]">Firestore Online</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </button>
            <span aria-hidden="true" className="hidden sm:inline text-amber-300">·</span>
            <span className="hidden sm:inline font-medium">LOTTT Art. 59</span>
            <span aria-hidden="true" className="hidden sm:inline text-amber-300">·</span>
            <span className="text-sky-800 flex items-center gap-1 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              SUSCERTE Nivel 3 & 4
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-amber-500 p-0.5 shadow-xs flex items-center justify-center">
              <div className="w-full h-full bg-amber-50 rounded-[9px] flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-amber-800" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-slate-900 font-serif">NOMINUS</span>
                <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold border border-amber-300">
                  CONTRATOS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">LegalTech Laboral & SST Venezuela</p>
            </div>
          </div>

          {/* Navigation Links (Light Pastel Button Tabs) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-amber-100/80 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              Dashboard y Plantillas
            </button>

            <button
              onClick={() => setCurrentTab('expedientes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'expedientes'
                  ? 'bg-amber-100/80 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Expedientes ({contractsCount})
            </button>

            <button
              onClick={() => setCurrentTab('cloud_docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'cloud_docs'
                  ? 'bg-sky-100/80 text-sky-950 font-bold border border-sky-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-sky-700" />
              Bóveda Cloud ({cloudDocsCount})
            </button>

            <button
              onClick={() => setCurrentTab('asesor_ia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'asesor_ia'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-700" />
              Asesor Virtual LOTTT
            </button>

            <button
              onClick={() => setCurrentTab('calculadora')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'calculadora'
                  ? 'bg-amber-100/80 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              Calculadora Art. 142
            </button>

            <button
              onClick={() => setCurrentTab('adendas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'adendas'
                  ? 'bg-amber-100/80 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              Adendas
            </button>
          </nav>

          {/* Primary CTA Button & Company Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Multi-Company Selector in Navbar */}
            {companies && companies.length > 0 && onSelectCompany && onOpenCompanyManager && (
              <CompanySelector
                companies={companies}
                selectedCompanyId={selectedCompanyId}
                onSelectCompany={onSelectCompany}
                onOpenCompanyManager={onOpenCompanyManager}
                contracts={contracts}
                variant="navbar"
              />
            )}

            <button
              onClick={() => setCurrentTab('simulador_movil')}
              className="hidden md:flex px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium items-center gap-1.5 transition-colors"
              title="Simulador de firma electrónica en smartphone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Firma Móvil</span>
            </button>

            <button
              onClick={() => setCurrentTab('wizard')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nuevo Contrato</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-200 text-xs no-scrollbar">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('expedientes')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'expedientes' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'}`}
          >
            Expedientes ({contractsCount})
          </button>
          <button
            onClick={() => setCurrentTab('cloud_docs')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'cloud_docs' ? 'bg-sky-100 text-sky-900 font-bold' : 'text-slate-600'}`}
          >
            Nube ({cloudDocsCount})
          </button>
          <button
            onClick={() => setCurrentTab('asesor_ia')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'asesor_ia' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'}`}
          >
            Asesor LOTTT
          </button>
          <button
            onClick={() => setCurrentTab('calculadora')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'calculadora' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'}`}
          >
            Calculadora
          </button>
          <button
            onClick={() => setCurrentTab('adendas')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'adendas' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'}`}
          >
            Adendas
          </button>
          <button
            onClick={() => setCurrentTab('simulador_movil')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'simulador_movil' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'}`}
          >
            Móvil
          </button>
        </div>
      </div>
    </header>
  );
};
