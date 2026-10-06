import React, { useState } from 'react';
import { 
  LaborContract, 
  JobClassification, 
  ContractModality,
  PredefinedTemplateId,
  Company
} from '../types/contract';
import { 
  calculateDobleCalculoPrestaciones, 
  formatUSD, 
  formatVES 
} from '../utils/lotttCalculations';
import { FIVE_PREDEFINED_TEMPLATES_INFO } from '../utils/fivePredefinedTemplates';
import { exportContractToPdf, exportContractToWord } from '../utils/exportDocuments';
import { CompanySelector } from './Companies/CompanySelector';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  ArrowUpRight, 
  ExternalLink, 
  Search, 
  Filter, 
  Briefcase, 
  UserCheck, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Cloud, 
  Bot, 
  Wrench, 
  Calculator, 
  TrendingUp, 
  FileSpreadsheet,
  Download,
  Building2,
  Layers,
  Settings,
  Database
} from 'lucide-react';

interface DashboardProps {
  contracts: LaborContract[];
  onSelectContract: (contract: LaborContract, viewType: 'contract' | 'lopcymat' | 'audit' | 'sign') => void;
  onNewContractWithTemplate: (templateType: JobClassification, modality: ContractModality) => void;
  onLoadPredefinedTemplate: (templateId: PredefinedTemplateId) => void;
  onGoToWizard: () => void;
  onGoToCloud: () => void;
  onGoToAdvisor: () => void;
  bcvRate: number;
  companies: Company[];
  selectedCompanyId: string | 'all';
  onSelectCompany: (companyId: string | 'all') => void;
  onOpenCompanyManager: () => void;
  onOpenFirebasePanel?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  contracts,
  onSelectContract,
  onNewContractWithTemplate,
  onLoadPredefinedTemplate,
  onGoToWizard,
  onGoToCloud,
  onGoToAdvisor,
  bcvRate,
  companies,
  selectedCompanyId,
  onSelectCompany,
  onOpenCompanyManager,
  onOpenFirebasePanel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'firmados' | 'pendientes' | 'determinados'>('all');

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Filter contracts by selected company
  const companyFilteredContracts = selectedCompanyId === 'all'
    ? contracts
    : contracts.filter(c => c.empresaId === selectedCompanyId || c.empresa.rif === selectedCompany?.rif);

  // Metrics based on companyFilteredContracts
  const total = companyFilteredContracts.length;
  const indeterminados = companyFilteredContracts.filter(c => c.modalidad === 'indeterminado').length;
  const determinados = companyFilteredContracts.filter(c => c.modalidad === 'determinado').length;
  const porObra = companyFilteredContracts.filter(c => c.modalidad === 'obra').length;
  
  const firmados = companyFilteredContracts.filter(c => c.status === 'firmado_ambos').length;
  const pendientes = companyFilteredContracts.filter(c => c.status === 'pendiente_firma').length;
  
  // Alertas Art. 62 LOTTT
  const contratosEnProrroga = companyFilteredContracts.filter(c => c.modalidad === 'determinado' && (c.numeroProrroga || 0) >= 1);
  const contratosConAlertaProrroga = contratosEnProrroga.length;

  // LOPCYMAT y SST
  const conLopcymatFirmada = companyFilteredContracts.filter(c => c.lopcymat?.requiereNotificacion && c.status === 'firmado_ambos').length;
  const porcentajeLopcymat = total > 0 ? Math.round((conLopcymatFirmada / total) * 100) : 100;
  
  // 16 Horas SST
  const trabajadoresHorasCompletas = companyFilteredContracts.filter(c => (c.lopcymat?.horasCapacitacionTrimestralesCompletadas || 0) >= 16).length;
  const porcentajeCapacitacionSST = total > 0 ? Math.round((trabajadoresHorasCompletas / total) * 100) : 0;

  // Pasivo Total
  const pasivoTotalVEF = companyFilteredContracts.reduce((acc, c) => {
    const calc = calculateDobleCalculoPrestaciones(c.remuneracion.salarioBaseMensualVEF, 1, 3);
    return acc + calc.prestacionesSocialesFinal;
  }, 0);

  const filteredContracts = companyFilteredContracts.filter(c => {
    const matchSearch = 
      c.trabajador.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trabajador.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trabajador.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codigoExpediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.empresa.alias && c.empresa.alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.empresa.denominacionSocial.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter === 'firmados') return c.status === 'firmado_ambos';
    if (statusFilter === 'pendientes') return c.status === 'pendiente_firma';
    if (statusFilter === 'determinados') return c.modalidad === 'determinado';
    return true;
  });

  const getCompanyBadgeStyle = (color?: string) => {
    switch (color) {
      case 'amber': return 'bg-amber-100/90 text-amber-950 border-amber-300';
      case 'emerald': return 'bg-emerald-100/90 text-emerald-950 border-emerald-300';
      case 'purple': return 'bg-purple-100/90 text-purple-950 border-purple-300';
      case 'rose': return 'bg-rose-100/90 text-rose-950 border-rose-300';
      case 'indigo': return 'bg-indigo-100/90 text-indigo-950 border-indigo-300';
      default: return 'bg-blue-100/90 text-blue-950 border-blue-300';
    }
  };

  const getTemplateIcon = (id: PredefinedTemplateId) => {
    switch (id) {
      case 'asistente_administrativo': return <FileSpreadsheet className="w-5 h-5 text-amber-700" />;
      case 'tecnico_mantenimiento': return <Wrench className="w-5 h-5 text-sky-700" />;
      case 'gerente_ventas': return <TrendingUp className="w-5 h-5 text-emerald-700" />;
      case 'analista_nomina': return <Calculator className="w-5 h-5 text-purple-700" />;
      case 'personal_limpieza': return <Sparkles className="w-5 h-5 text-teal-700" />;
      case 'unidad_obra_cauchero': return <Wrench className="w-5 h-5 text-amber-700" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Legal Contingency Overview in Warm Pastel */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-900 font-mono">
              <span className="font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                SISTEMA MULTIEMPRESA LOTTT
              </span>
              <span aria-hidden="true" className="text-amber-300">·</span>
              <span>{companies.length} Entidades de Trabajo</span>
              <span aria-hidden="true" className="text-amber-300">·</span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {contracts.length} Contratos Registrados
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
                Control de Contingencias y Contratación Laboral
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Monitoreo activo de los 14 requisitos taxativos del Artículo 59 de la LOTTT, 
              control de prórrogas temporales (Art. 62), prevención de salarización judicial (TSJ Sentencia 341) 
              y gestión documental de múltiples razones sociales de forma simultánea.
            </p>

            {/* Selector de Empresa en el Banner */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filtrando por:</span>
                <CompanySelector
                  companies={companies}
                  selectedCompanyId={selectedCompanyId}
                  onSelectCompany={onSelectCompany}
                  onOpenCompanyManager={onOpenCompanyManager}
                  contracts={contracts}
                  variant="dashboard"
                />
              </div>

              <button
                type="button"
                onClick={onOpenCompanyManager}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                title="Administrar catálogo de empresas"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Gestionar Empresas</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2.5 self-start md:self-center">
            {onOpenFirebasePanel && (
              <button
                type="button"
                onClick={onOpenFirebasePanel}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-950 font-bold text-xs border border-orange-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                title="Comprobar enlace activo con la base de datos Firestore"
              >
                <div className="relative">
                  <Database className="w-4 h-4 text-orange-600" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse" />
                </div>
                <span>Estado Firebase</span>
              </button>
            )}

            <button
              onClick={onGoToAdvisor}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 font-semibold text-xs border border-amber-300 shadow-2xs transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Consultar Asesor LOTTT</span>
            </button>

            <button
              onClick={onGoToWizard}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Elaborar Nuevo Contrato</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Semáforos y Tarjetas de Cumplimiento en Colores Pasteles Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ratio Modalidades */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Estabilidad LOTTT</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600" title="Cumplimiento con primacía de contratos indeterminados" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{indeterminados} / {total}</div>
            <div className="text-xs text-emerald-800 font-medium mt-0.5">
              {total > 0 ? Math.round((indeterminados / total) * 100) : 0}% Tiempo Indeterminado
            </div>
          </div>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Determinados: {determinados}</span>
            <span>Por Obra: {porObra}</span>
          </div>
        </div>

        {/* Alerta Prórrogas Art. 62 */}
        <div className={`border rounded-xl p-5 space-y-3 shadow-xs ${
          contratosConAlertaProrroga > 0
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Prórrogas (Art. 62 LOTTT)</span>
            {contratosConAlertaProrroga > 0 ? (
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-600 animate-ping" />
            ) : (
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{contratosConAlertaProrroga} en alerta</div>
            <div className={`text-xs font-medium mt-0.5 ${contratosConAlertaProrroga > 0 ? 'text-amber-900 font-semibold' : 'text-slate-500'}`}>
              {contratosConAlertaProrroga > 0 ? '1ª Prórroga en curso (Tope Legal)' : 'Sin riesgo de conversión forzosa'}
            </div>
          </div>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Máx 1 prórroga antes de indeterminado</span>
          </div>
        </div>

        {/* Cobertura LOPCYMAT NT-04-2023 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Notificación LOPCYMAT</span>
            <span className={`flex h-2.5 w-2.5 rounded-full ${porcentajeLopcymat >= 80 ? 'bg-emerald-600' : 'bg-rose-500'}`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{porcentajeLopcymat}%</div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              {conLopcymatFirmada} de {total} expedientes suscritos
            </div>
          </div>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Multas LOPCYMAT:</span>
            <span className="text-amber-800 font-mono font-semibold">76-100 U.T./trabajador</span>
          </div>
        </div>

        {/* Indicador SST 16 Horas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Capacitación SST (16h)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{porcentajeCapacitacionSST}%</div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Cumplimiento del trimestre en curso
            </div>
          </div>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Meta legal obligatoria:</span>
            <span className="text-slate-800 font-mono font-medium">16 hrs / trim</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN ESPECIAL: Modelos Oficiales LOTTT y Alerta Contingencia */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                6 MODELOS OFICIALES LOTTT
              </span>
              <span className="text-xs text-slate-400 font-medium">Listos para rellenar con 1 clic</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-serif mt-0.5">
              Plantillas de Contratos de Trabajo Digitales Personalizables
            </h2>
            <p className="text-xs text-slate-600">
              Modelos exhaustivos adaptados a empresas en Venezuela: Asistente Administrativo, Técnico de Mantenimiento, Gerente de Ventas, Analista de Nómina, Personal de Limpieza y Técnico de Cauchos / Mecánico a Comisión (Arts. 114 y 115 LOTTT).
            </p>
          </div>

          <button
            onClick={onGoToWizard}
            className="text-xs text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold self-start sm:self-auto"
          >
            <span>Crear desde cero con Asistente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alerta de Contingencia Patrimonial para Taller de Cauchos / Comisión */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 uppercase tracking-wide">
                Blindaje Legal Nominus Asesor LOTTT: Modelo a Comisión / Unidad de Obra
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Conforme al Art. 53 LOTTT, laborar dentro de un establecimiento hace presumir la relación de trabajo. Nuestro nuevo modelo para <strong>Técnico Cauchero y Mecánico Ligero</strong> blinda la operación formalizando la figura de Salario por Unidad de Obra (Arts. 114 y 115) con <strong>garantía de salario mínimo</strong>, <strong>descansos con promedio (Art. 119)</strong> y <strong>matriz LOPCYMAT de taller</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => onLoadPredefinedTemplate('unidad_obra_cauchero')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shrink-0 shadow-2xs transition-all active:scale-95"
          >
            Rellenar Modelo Taller
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {FIVE_PREDEFINED_TEMPLATES_INFO.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onLoadPredefinedTemplate(tpl.id)}
              className="bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-xl p-3.5 cursor-pointer transition-all space-y-2.5 shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    {getTemplateIcon(tpl.id)}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {tpl.id === 'unidad_obra_cauchero' ? 'Comisión' : formatUSD(tpl.salarioSugeridoUSD)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-amber-950 transition-colors line-clamp-2">
                    {tpl.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {tpl.descripcionBreve}
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-100 text-[10px] text-slate-600">
                  {tpl.caracteristicasClave.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span className="truncate">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-800 font-semibold group-hover:text-amber-900">
                <span>Rellenar y Emitir</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner de Nube y Asesor Virtual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nube Card */}
        <div 
          onClick={onGoToCloud}
          className="bg-gradient-to-r from-sky-50 via-white to-sky-50/50 border border-sky-200/80 rounded-xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:border-sky-400 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-sky-950">
                Gestión de Documentos en la Nube
              </div>
              <p className="text-xs text-slate-600">
                Suba, organice por empleado o fecha, y custodie cédulas, RIF y contratos con cifrado SHA-256.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* Asesor Card */}
        <div 
          onClick={onGoToAdvisor}
          className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">
                Asesor Virtual de Recursos Humanos
              </div>
              <p className="text-xs text-slate-600">
                Consulte dudas sobre artículos de la LOTTT, salarización TSJ 341 y audite contratos al instante.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </div>

      {/* Tabla de Expedientes Digitales en Colores Pasteles */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">Expedientes Contractuales Activos</h2>
            <p className="text-xs text-slate-500">
              Documentos digitales y constancias de entrega conforme al Artículo 59 numeral 14 LOTTT
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, CI, cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#FAF8F5] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white w-48 sm:w-60"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('firmados')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'firmados' ? 'bg-white text-emerald-800 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Firmados
              </button>
              <button
                onClick={() => setStatusFilter('pendientes')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'pendientes' ? 'bg-white text-amber-800 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setStatusFilter('determinados')}
                className={`px-2.5 py-1 rounded transition-colors ${statusFilter === 'determinados' ? 'bg-white text-purple-800 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Temporales
              </button>
            </div>
          </div>
        </div>

        {/* Contract List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF8F5] text-slate-600 border-b border-slate-200 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Expediente / Trabajador</th>
                <th className="py-3 px-4">Empresa (Patrono)</th>
                <th className="py-3 px-4">Cargo / Modalidad</th>
                <th className="py-3 px-4">Salario Base & Si</th>
                <th className="py-3 px-4">SST LOPCYMAT</th>
                <th className="py-3 px-4">Estado / Firma</th>
                <th className="py-3 px-4 text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((c) => {
                const calc = calculateDobleCalculoPrestaciones(c.remuneracion.salarioBaseMensualVEF, 1, 0);
                const matchingCompany = companies.find(comp => comp.id === c.empresaId || comp.rif === c.empresa.rif);
                const badgeColor = getCompanyBadgeStyle(matchingCompany?.colorTheme);

                return (
                  <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {c.trabajador.nombres} {c.trabajador.apellidos}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono text-amber-900 font-semibold">{c.trabajador.cedula}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-mono">{c.codigoExpediente}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[130px]">
                            {matchingCompany?.alias || c.empresa.alias || c.empresa.denominacionSocial.slice(0, 20)}
                          </span>
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {c.empresa.rif}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{c.cargo}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span className="capitalize">{c.modalidad}</span>
                        {c.modalidad === 'determinado' && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className={c.numeroProrroga > 0 ? 'text-amber-800 font-bold' : 'text-slate-500'}>
                              Prórroga #{c.numeroProrroga}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-slate-900 font-semibold">
                        {c.remuneracion.tipoMoneda === 'USD_INDEXADO' ? (
                          <span>{formatUSD(c.remuneracion.salarioBaseMensualUSD)} <span className="text-[10px] text-slate-500 font-normal">({formatVES(c.remuneracion.salarioBaseMensualVEF)})</span></span>
                        ) : (
                          <span>{formatVES(c.remuneracion.salarioBaseMensualVEF)}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-emerald-800 font-semibold mt-0.5" title="Salario Diario Integral">
                        Si: {formatVES(calc.salarioDiarioIntegral)} / día
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`inline-block w-2 h-2 rounded-full ${c.status === 'firmado_ambos' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                        <span className="text-slate-700 font-medium">NT-04-2023</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {c.lopcymat.horasCapacitacionTrimestralesCompletadas} / 16 hrs SST
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.status === 'firmado_ambos' ? (
                        <div className="flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Suscrito (2 Ejemplares)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-800 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pendiente Firma OTP</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Inicio: {c.fechaInicioRelacion}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Descarga Directa Word (.doc) */}
                        <button
                          onClick={() => exportContractToWord(c)}
                          className="px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
                          title="Descargar contrato editable en formato Word (.doc)"
                        >
                          <FileText className="w-3 h-3 text-blue-700" />
                          <span>Word</span>
                        </button>

                        {/* Descarga Directa PDF (.pdf) */}
                        <button
                          onClick={() => exportContractToPdf(c)}
                          className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
                          title="Descargar contrato en archivo PDF (.pdf)"
                        >
                          <Download className="w-3 h-3 text-rose-700" />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => onSelectContract(c, 'contract')}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium transition-colors"
                          title="Ver y revisar contrato oficial LOTTT"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => onSelectContract(c, 'lopcymat')}
                          className="px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-900 text-[11px] font-medium transition-colors"
                          title="Ver Notificación de Riesgos LOPCYMAT"
                        >
                          LOPCYMAT
                        </button>
                        {c.status === 'firmado_ambos' ? (
                          <button
                            onClick={() => onSelectContract(c, 'audit')}
                            className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-[11px] font-medium transition-colors"
                            title="Ver Certificado de Auditoría SUSCERTE Art. 16"
                          >
                            Auditoría
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectContract(c, 'sign')}
                            className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow-2xs transition-colors"
                            title="Completar firma digital OTP"
                          >
                            Firmar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Card in Pastel */}
      <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900">
              Respaldo del Artículo 58 de la LOTTT (Presunción Legal iuris tantum)
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              Contar con el contrato de trabajo escrito y la notificación LOPCYMAT suscrita neutraliza la presunción en favor del trabajador y previene la inversión de la carga probatoria en juicios laborales.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs text-slate-500 uppercase font-mono font-medium">Pasivo Prestacional Estimado (Art. 142)</div>
          <div className="text-lg font-bold text-emerald-900 font-mono">
            {formatVES(pasivoTotalVEF)}
          </div>
          <div className="text-[11px] text-slate-500">
            Equiv. {formatUSD(pasivoTotalVEF / bcvRate)} a tasa BCV
          </div>
        </div>
      </div>
    </div>
  );
};
