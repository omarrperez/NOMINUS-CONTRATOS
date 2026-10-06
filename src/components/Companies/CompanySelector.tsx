import React, { useState, useRef, useEffect } from 'react';
import { Company, LaborContract } from '../../types/contract';
import { Building2, ChevronDown, Check, Layers, Plus, Settings } from 'lucide-react';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId: string | 'all';
  onSelectCompany: (companyId: string | 'all') => void;
  onOpenCompanyManager: () => void;
  contracts: LaborContract[];
  variant?: 'navbar' | 'dashboard';
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onOpenCompanyManager,
  contracts,
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  const getCompanyCount = (companyId: string) => {
    return contracts.filter(c => c.empresaId === companyId || c.empresa.rif === companies.find(x => x.id === companyId)?.rif).length;
  };

  const getThemeBadge = (color?: string) => {
    switch (color) {
      case 'amber': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'emerald': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'purple': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'rose': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'indigo': return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      default: return 'bg-orange-100 text-orange-900 border-orange-300';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2.5 rounded-xl transition-all border text-left active:scale-98 cursor-pointer ${
          variant === 'dashboard'
            ? 'px-3.5 py-2 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/60 border-orange-300/80 hover:border-orange-400 hover:shadow-xs shadow-2xs'
            : 'px-2.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50/70 hover:from-amber-100/70 hover:to-orange-100/70 border-amber-300 hover:border-amber-400 text-xs shadow-2xs'
        }`}
        title="Cambiar entre empresas o vista consolidada"
      >
        <div className="flex items-center gap-2">
          {selectedCompanyId === 'all' ? (
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold shrink-0 border ${getThemeBadge(selectedCompany?.colorTheme)} shadow-2xs`}>
              <Building2 className="w-3.5 h-3.5" />
            </div>
          )}

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold tracking-wider uppercase leading-none text-orange-700/90 group-hover:text-orange-800">
              Empresa Activa
            </span>
            <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[150px] sm:max-w-[185px]">
              {selectedCompanyId === 'all'
                ? 'Todas las Empresas'
                : selectedCompany?.alias || selectedCompany?.denominacionSocial}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-orange-200/80">
          <span className="font-mono text-[10px] font-bold text-orange-950 bg-gradient-to-r from-orange-100 to-amber-100 px-1.5 py-0.5 rounded-md border border-orange-300/60">
            {selectedCompanyId === 'all' ? contracts.length : getCompanyCount(selectedCompanyId)}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-orange-600/80 group-hover:text-orange-700 transition-transform" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-orange-200/90 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 border-b border-orange-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Entidad de Trabajo</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCompanyManager();
              }}
              className="text-[11px] font-bold text-orange-800 hover:text-orange-950 flex items-center gap-1 hover:underline"
            >
              <Settings className="w-3 h-3" />
              <span>Gestionar</span>
            </button>
          </div>

          <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
            {/* Opción Todas las Empresas */}
            <button
              type="button"
              onClick={() => {
                onSelectCompany('all');
                setIsOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                selectedCompanyId === 'all'
                  ? 'bg-gradient-to-r from-orange-100/80 to-amber-100/80 border border-orange-300 font-bold text-slate-900 shadow-2xs'
                  : 'hover:bg-orange-50/50 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Todas las Empresas (Consolidado)</div>
                  <div className="text-[10px] text-slate-500">Vista global multiempresa</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-orange-200 text-orange-950">
                  {contracts.length}
                </span>
                {selectedCompanyId === 'all' && <Check className="w-4 h-4 text-orange-700" />}
              </div>
            </button>

            <div className="border-t border-slate-100 my-1" />

            {/* Listado individual de empresas */}
            {companies.map((comp) => {
              const isSelected = selectedCompanyId === comp.id;
              const count = getCompanyCount(comp.id);
              const badgeClass = getThemeBadge(comp.colorTheme);

              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => {
                    onSelectCompany(comp.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-100/80 to-amber-100/80 border border-orange-300 font-bold text-slate-900 shadow-2xs'
                      : 'hover:bg-orange-50/40 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${badgeClass} shadow-2xs`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate leading-tight">
                        {comp.alias || comp.denominacionSocial}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {comp.rif} · {comp.actividadEconomica?.split(',')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-orange-200 text-orange-950">
                      {count}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-orange-700" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer botón nuevo */}
          <div className="p-2 border-t border-orange-100 bg-[#FFFDF9]">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCompanyManager();
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Nueva Empresa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
