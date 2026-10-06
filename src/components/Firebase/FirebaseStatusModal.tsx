import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Server, 
  Clock, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Building2, 
  Copy, 
  Check, 
  HardDrive, 
  Zap,
  Activity,
  X
} from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';
import { testFirestoreConnection, db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractsCount: number;
  companiesCount: number;
  cloudDocsCount: number;
  bcvRate: number;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({
  isOpen,
  onClose,
  contractsCount,
  companiesCount,
  cloudDocsCount,
  bcvRate
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'checking' | 'error'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [remoteCounts, setRemoteCounts] = useState<{
    companies: number;
    contracts: number;
    cloudDocs: number;
  } | null>(null);

  const runConnectionDiagnostic = async () => {
    setIsChecking(true);
    setConnectionStatus('checking');
    const start = performance.now();

    try {
      const isOnline = await testFirestoreConnection();
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      if (isOnline) {
        setConnectionStatus('connected');
        // Fetch actual live collections count directly from Firestore cloud
        try {
          const [compSnap, contrSnap, docsSnap] = await Promise.all([
            getDocs(collection(db, 'companies')),
            getDocs(collection(db, 'contracts')),
            getDocs(collection(db, 'cloudDocuments'))
          ]);
          setRemoteCounts({
            companies: compSnap.size,
            contracts: contrSnap.size,
            cloudDocs: docsSnap.size
          });
        } catch (e) {
          console.warn('Could not query counts directly:', e);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (err) {
      setConnectionStatus('error');
    } finally {
      setIsChecking(false);
      setLastCheckTime(new Date().toLocaleTimeString('es-VE'));
    }
  };

  useEffect(() => {
    if (isOpen) {
      runConnectionDiagnostic();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const firestoreConsoleUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-orange-200 overflow-hidden">
        {/* Header con gradiente cálido análogo */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 p-5 sm:p-6 text-slate-950 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/95 p-2 shadow-xs flex items-center justify-center text-orange-600">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-950">
                  Panel de Conexión Firebase Firestore
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-orange-950 border border-orange-200">
                  Tier Gratuito / Developer
                </span>
              </div>
              <p className="text-xs text-orange-950/80 font-medium">
                Diagnóstico de persistencia y sincronización en la nube en tiempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/40 text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Card Principal de Estado de Conexión */}
          <div className={`p-4 rounded-2xl border transition-all ${
            connectionStatus === 'connected'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : connectionStatus === 'checking'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : connectionStatus === 'checking'
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-rose-500 text-white'
                }`}>
                  {connectionStatus === 'connected' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : connectionStatus === 'checking' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      {connectionStatus === 'connected'
                        ? 'Base de Datos Conectada y Operativa'
                        : connectionStatus === 'checking'
                        ? 'Verificando enlace con el servidor de Google Cloud...'
                        : 'Desconectado o en Modo Local'}
                    </span>
                    {connectionStatus === 'connected' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3 mt-0.5">
                    {latencyMs !== null && (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        Latencia: <strong className="text-emerald-900">{latencyMs} ms</strong>
                      </span>
                    )}
                    {lastCheckTime && (
                      <span className="text-[11px] text-slate-500">
                        Última comprobación: {lastCheckTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={runConnectionDiagnostic}
                disabled={isChecking}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-orange-400 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-orange-600 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Comprobando...' : 'Revisar Enlace'}</span>
              </button>
            </div>
          </div>

          {/* Colecciones Sincronizadas en la Nube */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-orange-600" />
                <span>Colecciones Activas en Cloud Firestore</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Sincronización Bidireccional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Empresas */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-orange-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    /companies
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {remoteCounts ? remoteCounts.companies : companiesCount}
                </div>
                <p className="text-[10px] text-slate-500">
                  Razón Social, RIF, registros mercantiles
                </p>
              </div>

              {/* Contratos */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-orange-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-4 h-4 text-orange-600" />
                    /contracts
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {remoteCounts ? remoteCounts.contracts : contractsCount}
                </div>
                <p className="text-[10px] text-slate-500">
                  Expedientes LOTTT, salarios, firmas OTP
                </p>
              </div>

              {/* Bóveda Cloud */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-orange-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    /cloudDocuments
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {remoteCounts ? remoteCounts.cloudDocs : cloudDocsCount}
                </div>
                <p className="text-[10px] text-slate-500">
                  Certificados SUSCERTE SHA-256
                </p>
              </div>
            </div>
          </div>

          {/* Parámetros de Configuración del Proyecto */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Server className="w-4 h-4 text-orange-600" />
              <span>Credenciales y Proyecto Aprovisionado</span>
            </h3>

            <div className="bg-[#FAF8F5] rounded-2xl border border-slate-200 divide-y divide-slate-200/80 text-xs">
              <div className="p-2.5 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Project ID:</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                  <span>{firebaseConfig.projectId}</span>
                  <button
                    onClick={() => handleCopy(firebaseConfig.projectId, 'project')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500"
                    title="Copiar Project ID"
                  >
                    {copiedKey === 'project' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Database ID:</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold truncate max-w-[280px]">
                  <span className="truncate">{firebaseConfig.firestoreDatabaseId}</span>
                  <button
                    onClick={() => handleCopy(firebaseConfig.firestoreDatabaseId, 'db')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 shrink-0"
                    title="Copiar Database ID"
                  >
                    {copiedKey === 'db' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Auth Domain:</span>
                <span className="font-mono text-slate-700">{firebaseConfig.authDomain}</span>
              </div>

              <div className="p-2.5 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">Reglas de Seguridad:</span>
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ABAC Desplegadas (firestore.rules)
                </span>
              </div>
            </div>
          </div>

          {/* Enlace Directo a la Consola de Firebase */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block">
                ¿Deseas verificar los datos en la consola oficial de Google?
              </span>
              <p className="text-slate-600 text-[11px]">
                Puedes ver directamente cada documento JSON, tablas y reglas de seguridad en Firebase Console.
              </p>
            </div>

            <a
              href={firestoreConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-2xs transition-all active:scale-95"
            >
              <span>Abrir Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Los cambios en empresas o contratos se guardan instantáneamente en la nube</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
