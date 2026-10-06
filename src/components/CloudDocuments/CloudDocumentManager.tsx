import React, { useState } from 'react';
import { CloudDocument, CloudDocumentType, Company } from '../../types/contract';
import { computeSHA256 } from '../../utils/cryptoSim';
import { 
  Cloud, 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Download, 
  Trash2, 
  Check, 
  ExternalLink,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  RefreshCw,
  HardDrive,
  Building2,
  Layers
} from 'lucide-react';

interface CloudDocumentManagerProps {
  documents: CloudDocument[];
  onAddDocument: (doc: CloudDocument) => void;
  onDeleteDocument: (docId: string) => void;
  employees: { nombre: string; cedula: string }[];
  companies?: Company[];
  selectedCompanyId?: string | 'all';
}

export const CloudDocumentManager: React.FC<CloudDocumentManagerProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  employees,
  companies = [],
  selectedCompanyId = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>(selectedCompanyId);
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<CloudDocument | null>(null);

  // Upload modal state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCompanyId, setUploadCompanyId] = useState<string>(companies[0]?.id || 'empresa-001');
  const [uploadEmployeeName, setUploadEmployeeName] = useState(employees[0]?.nombre || 'Valeria Sofía Rivas Salazar');
  const [uploadEmployeeCedula, setUploadEmployeeCedula] = useState(employees[0]?.cedula || 'V-16.789.412');
  const [uploadDocType, setUploadDocType] = useState<CloudDocumentType>('contrato_firmado');
  const [uploadProvider, setUploadProvider] = useState<'Google Drive' | 'Dropbox Business' | 'Nominus Vault'>('Google Drive');
  const [uploadTagInput, setUploadTagInput] = useState('');

  const docTypeLabels: Record<CloudDocumentType, string> = {
    contrato_firmado: 'Contrato de Trabajo Firmado (LOTTT)',
    cedula_identidad: 'Cédula de Identidad (SAIME)',
    rif_trabajador: 'Registro de Información Fiscal (SENIAT)',
    notificacion_lopcymat: 'Notificación de Riesgos LOPCYMAT (NT-04-2023)',
    certificado_medico_sst: 'Certificado Médico Ocupacional',
    constancia_epp: 'Acta de Dotación y Entrega de EPP',
    constancia_capacitacion_16h: 'Certificado de Capacitación 16h SST',
    addendum_salarial: 'Addendum de Actualización Salarial',
    recibo_doble_ejemplar: 'Constancia de Doble Ejemplar y Auditoría'
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const fakeHash = await computeSHA256(`${uploadFileName}:${Date.now()}:${uploadEmployeeCedula}`);
    const tags = uploadTagInput.split(',').map(t => t.trim()).filter(Boolean);
    const chosenCompany = companies.find(c => c.id === uploadCompanyId) || companies[0];

    const newDoc: CloudDocument = {
      id: `doc-${Date.now()}`,
      nombre: uploadFileName.endsWith('.pdf') ? uploadFileName : `${uploadFileName}.pdf`,
      tipo: uploadDocType,
      tipoDescripcion: docTypeLabels[uploadDocType],
      empresaId: chosenCompany?.id,
      empresaNombre: chosenCompany?.denominacionSocial,
      empleadoNombre: uploadEmployeeName,
      empleadoCedula: uploadEmployeeCedula,
      fechaSubida: new Date().toISOString().split('T')[0],
      tamanioKb: Math.floor(Math.random() * 300 + 80),
      formato: 'PDF',
      sha256Hash: fakeHash,
      estadoSeguridad: 'Cifrado SHA-256',
      nubeProvider: uploadProvider,
      etiquetas: tags.length > 0 ? tags : ['Documento', chosenCompany?.alias || 'Empresa', 'RRHH'],
      notas: `Subido y respaldado bajo razón social ${chosenCompany?.alias || chosenCompany?.denominacionSocial} en ${uploadProvider}.`
    };

    onAddDocument(newDoc);
    setIsUploading(false);
    setUploadFileName('');
    setUploadTagInput('');
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.empleadoCedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipoDescripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.empresaNombre && doc.empresaNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.etiquetas.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterCompany !== 'all' && doc.empresaId && doc.empresaId !== filterCompany) {
      // Check if doc matches company
      const comp = companies.find(c => c.id === filterCompany);
      if (comp && doc.empresaNombre !== comp.denominacionSocial) return false;
    }
    if (filterEmployee !== 'all' && doc.empleadoNombre !== filterEmployee) return false;
    if (filterType !== 'all' && doc.tipo !== filterType) return false;
    if (filterProvider !== 'all' && doc.nubeProvider !== filterProvider) return false;
    return true;
  });

  const totalSizeKb = documents.reduce((acc, d) => acc + d.tamanioKb, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Cloud Header Banner */}
      <div className="bg-white border border-sky-200/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-800">
              <Cloud className="w-4 h-4 text-sky-600" />
              <span>GESTIÓN DOCUMENTAL Y EXPEDIENTES EN LA NUBE</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cifrado SHA-256 Activo
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 font-serif">
              Bóveda Cloud de Contratos y Documentos Laborales
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Almacene, organice por colaborador o fecha, y consulte de forma segura los contratos de trabajo (Art. 59 LOTTT), 
              notificaciones de riesgo LOPCYMAT (NT-04-2023), cédulas de identidad, RIF y certificados de auditoría digital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsUploading(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Documento a la Nube</span>
            </button>
          </div>
        </div>

        {/* Storage Health Strip */}
        <div className="mt-5 pt-4 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <HardDrive className="w-3.5 h-3.5 text-sky-600" />
              <span>Almacenamiento Usado:</span>
              <strong className="font-mono text-slate-900">{(totalSizeKb / 1024).toFixed(2)} MB</strong>
              <span className="text-slate-400">/ 50 GB</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="text-slate-600 hidden sm:block">
              Total Documentos Custodiados: <strong className="font-mono text-slate-900">{documents.length}</strong>
            </div>
          </div>

          {/* Cloud Providers Status */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Google Drive
            </span>
            <span className="flex items-center gap-1 text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Dropbox Business
            </span>
            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Nominus Vault
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar documento, empleado, CI o etiqueta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          {/* Filter by Company */}
          <div>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="all">🏢 Todas las Empresas</option>
              {companies.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.alias || comp.denominacionSocial}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Employee */}
          <div>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="all">Todos los Empleados</option>
              {Array.from(new Set(documents.map(d => d.empleadoNombre))).map((name, i) => (
                <option key={i} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Document Type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="all">Todos los Tipos de Documento</option>
              <option value="contrato_firmado">Contrato de Trabajo Firmado</option>
              <option value="cedula_identidad">Cédula de Identidad</option>
              <option value="rif_trabajador">RIF del Trabajador</option>
              <option value="notificacion_lopcymat">Notificación LOPCYMAT</option>
              <option value="constancia_epp">Entrega de EPP</option>
              <option value="addendum_salarial">Addendum Salarial</option>
            </select>
          </div>

          {/* Filter by Cloud Provider */}
          <div>
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="all">Todas las Nubes</option>
              <option value="Google Drive">Google Drive</option>
              <option value="Dropbox Business">Dropbox Business</option>
              <option value="Nominus Vault">Nominus Vault (Cifrado local)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-sky-300 rounded-xl p-4 cursor-pointer transition-all space-y-3 shadow-xs group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-sky-700">
                <FileText className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-slate-800 truncate group-hover:text-sky-900">
                  {doc.nombre}
                </h3>
                <span className="text-[11px] text-slate-500 block truncate">
                  {doc.tipoDescripcion}
                </span>
              </div>

              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                {doc.formato}
              </span>
            </div>

            {/* Worker & Date */}
            <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-slate-200/80 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1 font-medium text-slate-800 truncate">
                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.empleadoNombre}</span>
                </span>
                <span className="font-mono text-slate-500 text-[10px] shrink-0">{doc.empleadoCedula}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono">
                <span>{doc.fechaSubida}</span>
                <span>{doc.tamanioKb} KB</span>
              </div>
            </div>

            {/* Tags and Cloud Provider */}
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="font-medium text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {doc.nubeProvider}
              </span>

              <span className="flex items-center gap-1 text-emerald-800 font-mono">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>SHA-256</span>
              </span>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
            <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600">No se encontraron documentos con los filtros especificados.</p>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900 font-serif">Subir Documento Laboral a la Nube</h3>
              </div>
              <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Empresa Contratante (Razón Social) *</label>
                <select
                  value={uploadCompanyId}
                  onChange={(e) => setUploadCompanyId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-sky-500"
                >
                  {companies.map(comp => (
                    <option key={comp.id} value={comp.id}>
                      {comp.alias || comp.denominacionSocial} ({comp.rif})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nombre del Archivo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Contrato_Trabajo_Maria_Herrera.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Colaborador / Empleado *</label>
                  <input
                    type="text"
                    required
                    value={uploadEmployeeName}
                    onChange={(e) => setUploadEmployeeName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cédula de Identidad (V/E) *</label>
                  <input
                    type="text"
                    required
                    value={uploadEmployeeCedula}
                    onChange={(e) => setUploadEmployeeCedula(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tipo de Documento Legal *</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as CloudDocumentType)}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  {Object.entries(docTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Servicio de Almacenamiento Nube *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Google Drive', 'Dropbox Business', 'Nominus Vault'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setUploadProvider(p)}
                      className={`py-2 px-2 rounded-lg border text-center transition-all ${
                        uploadProvider === p
                          ? 'bg-sky-50 border-sky-500 text-sky-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Contrato, LOTTT, 2026, RRHH"
                  value={uploadTagInput}
                  onChange={(e) => setUploadTagInput(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirmar y Cifrar en Nube
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Document Details Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-serif">{selectedDoc.nombre}</h3>
                  <span className="text-[11px] text-slate-500">{selectedDoc.tipoDescripcion}</span>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Colaborador:</span>
                  <span className="font-bold text-slate-900">{selectedDoc.empleadoNombre}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-500 font-sans">Cédula:</span>
                  <span className="text-slate-800">{selectedDoc.empleadoCedula}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fecha de Custodia:</span>
                  <span className="font-mono text-slate-800">{selectedDoc.fechaSubida}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Proveedor Nube:</span>
                  <span className="font-semibold text-sky-800">{selectedDoc.nubeProvider}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Huella Digital Criptográfica (SHA-256 para juicio laboral):
                </span>
                <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all">
                  {selectedDoc.sha256Hash}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedDoc.etiquetas.map((t, idx) => (
                  <span key={idx} className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onDeleteDocument(selectedDoc.id);
                  setSelectedDoc(null);
                }}
                className="text-rose-600 hover:text-rose-700 text-xs flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Respaldo</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
