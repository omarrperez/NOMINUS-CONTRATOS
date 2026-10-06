import React, { useState } from 'react';
import { Company, LaborContract } from '../../types/contract';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Users, 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  MapPin, 
  UserCheck, 
  Hash, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CompanyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  selectedCompanyId: string | 'all';
  onSelectCompany: (companyId: string | 'all') => void;
  onSaveCompany: (company: Company) => void;
  onNewContractForCompany?: (company: Company) => void;
  contracts: LaborContract[];
}

export const CompanyManagerModal: React.FC<CompanyManagerModalProps> = ({
  isOpen,
  onClose,
  companies,
  selectedCompanyId,
  onSelectCompany,
  onSaveCompany,
  onNewContractForCompany,
  contracts
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    denominacionSocial: '',
    alias: '',
    rif: 'J-',
    registroMercantil: '',
    domicilioFiscal: '',
    representanteNombre: '',
    representanteCI: 'V-',
    representanteCargo: 'Director General',
    representanteFacultad: 'conforme a facultades estatutarias de representación general',
    rnetNumero: 'RNET-VE-2024-',
    ivssPatronal: '',
    actividadEconomica: '',
    colorTheme: 'blue',
    activo: true
  });

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingCompany(null);
    setFormData({
      id: `empresa-${Date.now()}`,
      denominacionSocial: '',
      alias: '',
      rif: 'J-',
      registroMercantil: '',
      domicilioFiscal: '',
      representanteNombre: '',
      representanteCI: 'V-',
      representanteCargo: 'Presidente / Director General',
      representanteFacultad: 'conforme a facultades estatutarias inscritas en el Registro Mercantil',
      rnetNumero: 'RNET-VE-2026-' + Math.floor(10000 + Math.random() * 90000),
      ivssPatronal: 'D-' + Math.floor(10000000 + Math.random() * 90000000),
      incesNumero: 'INC-' + Math.floor(100000 + Math.random() * 900000),
      banavihNumero: 'BAN-' + Math.floor(100000 + Math.random() * 900000),
      actividadEconomica: 'Comercio, Servicios y Operaciones Generales',
      colorTheme: 'amber',
      fechaRegistro: new Date().toISOString().split('T')[0],
      activo: true
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (comp: Company) => {
    setIsCreatingNew(false);
    setEditingCompany(comp);
    setFormData({ ...comp });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.denominacionSocial || !formData.rif) return;

    const companyToSave: Company = {
      id: editingCompany ? editingCompany.id : formData.id || `empresa-${Date.now()}`,
      denominacionSocial: formData.denominacionSocial.trim(),
      alias: formData.alias?.trim() || formData.denominacionSocial.slice(0, 24),
      rif: formData.rif.trim().toUpperCase(),
      registroMercantil: formData.registroMercantil || 'Registro Mercantil del Dtto. Capital',
      domicilioFiscal: formData.domicilioFiscal || 'Caracas, Venezuela',
      representanteNombre: formData.representanteNombre || 'Representante Legal',
      representanteCI: formData.representanteCI || 'V-00.000.000',
      representanteCargo: formData.representanteCargo || 'Director General',
      representanteFacultad: formData.representanteFacultad || 'con facultades plenas de representación',
      rnetNumero: formData.rnetNumero,
      ivssPatronal: formData.ivssPatronal,
      incesNumero: formData.incesNumero,
      banavihNumero: formData.banavihNumero,
      actividadEconomica: formData.actividadEconomica || 'Actividad Comercial y de Servicios',
      colorTheme: (formData.colorTheme as any) || 'blue',
      fechaRegistro: formData.fechaRegistro || new Date().toISOString().split('T')[0],
      activo: true
    };

    onSaveCompany(companyToSave);
    setIsCreatingNew(false);
    setEditingCompany(null);
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'amber':
        return {
          bg: 'bg-amber-100',
          border: 'border-amber-300',
          text: 'text-amber-900',
          badge: 'bg-amber-50 text-amber-900 border-amber-200'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-100',
          border: 'border-emerald-300',
          text: 'text-emerald-900',
          badge: 'bg-emerald-50 text-emerald-900 border-emerald-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          border: 'border-purple-300',
          text: 'text-purple-900',
          badge: 'bg-purple-50 text-purple-900 border-purple-200'
        };
      case 'rose':
        return {
          bg: 'bg-rose-100',
          border: 'border-rose-300',
          text: 'text-rose-900',
          badge: 'bg-rose-50 text-rose-900 border-rose-200'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-100',
          border: 'border-indigo-300',
          text: 'text-indigo-900',
          badge: 'bg-indigo-50 text-indigo-900 border-indigo-200'
        };
      default:
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-300',
          text: 'text-blue-900',
          badge: 'bg-blue-50 text-blue-900 border-blue-200'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-amber-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100/80 via-amber-50 to-orange-50/50 px-6 py-4 border-b border-amber-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-serif">
                  Gestión Multiempresa de Nominus
                </h2>
                <span className="text-[10px] font-mono bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                  {companies.length} Empresas Registradas
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Administre los expedientes contractuales de múltiples razones sociales de forma simultánea o consolidada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreatingNew && !editingCompany && (
              <button
                type="button"
                onClick={handleStartCreate}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Empresa</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F5]/50">

          {/* Selector de Vista Global / Consolidada */}
          <div className="bg-white border-2 border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Modo Vista Consolidada (Todas las Empresas)
                  </span>
                  {selectedCompanyId === 'all' && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  Visualice todos los {contracts.length} contratos y empleados de las distintas entidades de trabajo en un único panel general.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectCompany('all');
                onClose();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                selectedCompanyId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {selectedCompanyId === 'all' ? 'Vista Consolidada Seleccionada' : 'Ver Todas las Empresas'}
            </button>
          </div>

          {/* Formulario de Creación / Edición */}
          {(isCreatingNew || editingCompany) && (
            <form onSubmit={handleSubmit} className="bg-white border-2 border-amber-400 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900 font-serif">
                    {isCreatingNew ? 'Registrar Nueva Empresa Contratante' : `Editar: ${editingCompany?.denominacionSocial}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingCompany(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Razón Social / Denominación Mercantil (Según Registro) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.denominacionSocial || ''}
                    onChange={(e) => setFormData({ ...formData, denominacionSocial: e.target.value })}
                    placeholder="Ej: Inversiones & Servicios Automotrices Centro, C.A."
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nombre Comercial / Alias Corto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.alias || ''}
                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                    placeholder="Ej: Taller El Cauchero"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    RIF (J- / G- / C-) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rif || ''}
                    onChange={(e) => setFormData({ ...formData, rif: e.target.value.toUpperCase() })}
                    placeholder="J-40981234-8"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Actividad Económica / Ramo
                  </label>
                  <input
                    type="text"
                    value={formData.actividadEconomica || ''}
                    onChange={(e) => setFormData({ ...formData, actividadEconomica: e.target.value })}
                    placeholder="Ej: Taller Mecánico y Mantenimiento Ligero"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Color Distintivo del Badge
                  </label>
                  <select
                    value={formData.colorTheme || 'amber'}
                    onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="amber">Ámbar / Taller & Operativo</option>
                    <option value="blue">Azul / Corporativo & Manufactura</option>
                    <option value="emerald">Esmeralda / Alimentos & Ventas</option>
                    <option value="purple">Púrpura / Salud & SST</option>
                    <option value="rose">Rosa / Servicios Generales</option>
                    <option value="indigo">Índigo / Tecnología & Finanzas</option>
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Inscripción en Registro Mercantil (Tomo, Número, Fecha) *
                  </label>
                  <input
                    type="text"
                    value={formData.registroMercantil || ''}
                    onChange={(e) => setFormData({ ...formData, registroMercantil: e.target.value })}
                    placeholder="Registro Mercantil Primero de la Circunscripción Judicial del Edo. Miranda, Tomo 94-B, N° 12"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Domicilio Fiscal Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.domicilioFiscal || ''}
                    onChange={(e) => setFormData({ ...formData, domicilioFiscal: e.target.value })}
                    placeholder="Zona Industrial Los Ruices, Calle Milán, Galpón 4, Caracas, Venezuela"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Representante Legal (Nombres y Apellidos) *
                  </label>
                  <input
                    type="text"
                    value={formData.representanteNombre || ''}
                    onChange={(e) => setFormData({ ...formData, representanteNombre: e.target.value })}
                    placeholder="Gustavo Adolfo Benítez Silva"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cédula del Representante *
                  </label>
                  <input
                    type="text"
                    value={formData.representanteCI || ''}
                    onChange={(e) => setFormData({ ...formData, representanteCI: e.target.value })}
                    placeholder="V-13.890.124"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cargo del Representante *
                  </label>
                  <input
                    type="text"
                    value={formData.representanteCargo || ''}
                    onChange={(e) => setFormData({ ...formData, representanteCargo: e.target.value })}
                    placeholder="Director Gerente / Apoderado"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    RNET Número
                  </label>
                  <input
                    type="text"
                    value={formData.rnetNumero || ''}
                    onChange={(e) => setFormData({ ...formData, rnetNumero: e.target.value })}
                    placeholder="RNET-VE-2024-51029"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    IVSS Patronal
                  </label>
                  <input
                    type="text"
                    value={formData.ivssPatronal || ''}
                    onChange={(e) => setFormData({ ...formData, ivssPatronal: e.target.value })}
                    placeholder="D-998811223"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    INCES / BANAVIH
                  </label>
                  <input
                    type="text"
                    value={formData.incesNumero || ''}
                    onChange={(e) => setFormData({ ...formData, incesNumero: e.target.value })}
                    placeholder="INC-991122"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingCompany(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Guardar Empresa' : 'Actualizar Datos'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Listado de Empresas */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Empresas y Entidades de Trabajo Activas ({companies.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map((comp) => {
                const compContracts = contracts.filter(c => c.empresaId === comp.id || c.empresa.rif === comp.rif);
                const signedCount = compContracts.filter(c => c.status === 'firmado_ambos').length;
                const pendingCount = compContracts.filter(c => c.status === 'pendiente_firma').length;
                const isSelected = selectedCompanyId === comp.id;
                const colors = getColorClasses(comp.colorTheme);

                return (
                  <div
                    key={comp.id}
                    className={`bg-white rounded-2xl border transition-all p-4.5 space-y-3.5 shadow-xs relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-amber-500 ring-2 ring-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-white'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      {/* Top Bar of card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} shrink-0 font-bold shadow-2xs`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900 leading-tight block">
                              {comp.alias || comp.denominacionSocial}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 inline-block mt-0.5">
                              {comp.rif}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(comp)}
                            title="Editar datos patronales de la empresa"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {comp.denominacionSocial}
                      </p>

                      <div className="text-[10px] text-slate-500 space-y-1 mt-2.5 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Rep. Legal: <strong>{comp.representanteNombre}</strong> ({comp.representanteCargo})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{comp.domicilioFiscal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {compContracts.length} contratos
                        </span>
                        {signedCount > 0 && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                            {signedCount} firmados
                          </span>
                        )}
                        {pendingCount > 0 && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                            {pendingCount} pendientes
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onNewContractForCompany && (
                          <button
                            type="button"
                            onClick={() => {
                              onNewContractForCompany(comp);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                            title="Crear un nuevo contrato bajo esta razón social"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Contrato</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onSelectCompany(comp.id);
                            onClose();
                          }}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {isSelected ? 'Seleccionada' : 'Filtrar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Separación probatoria e identificación tributaria independiente conforme al Art. 59 LOTTT</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors self-end sm:self-auto"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
