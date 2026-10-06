import React from 'react';
import { LaborContract } from '../types/contract';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  MapPin 
} from 'lucide-react';

interface AuditCertificateModalProps {
  contract: LaborContract;
  onClose: () => void;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  contract,
  onClose
}) => {
  const audit = contract.auditTrail;
  const [copied, setCopied] = React.useState(false);

  if (!audit) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-slate-300 rounded-2xl p-6 max-w-md w-full space-y-4 text-center">
          <p className="text-slate-700 text-sm">Este contrato aún no cuenta con un certificado de auditoría digital formalizado.</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold">Cerrar</button>
        </div>
      </div>
    );
  }

  const jsonEvidence = JSON.stringify(audit, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonEvidence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonEvidence], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVIDENCIA_DIGITAL_${contract.codigoExpediente}_${audit.auditId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-emerald-300 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Certificado de Trazabilidad y Evidencia Digital
              </h2>
              <p className="text-[11px] text-emerald-800 font-mono font-medium">
                Decreto-Ley N° 1.204 • SUSCERTE • Id: {audit.auditId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Overview Badge */}
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Nivel de Fuerza Probatoria:</span>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{audit.signatureLevelName}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Sello de Tiempo (Caracas VE):</span>
              <div className="text-xs font-mono text-amber-900 font-bold">{audit.timestampLocal}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-mono">Firmante / Cédula:</span>
              <div className="font-bold text-slate-900">{audit.signerName}</div>
              <div className="text-[11px] font-mono text-sky-800 font-semibold">{audit.signerCedula}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-mono">Canal y OTP:</span>
              <div className="font-bold text-slate-900">{audit.otpChannelDelivery} ({audit.signerPhone})</div>
              <div className="text-[10px] font-mono text-slate-500">Hash OTP: {audit.otpCodeHash.slice(0, 16)}...</div>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-500 font-mono">Geolocalización & IP:</span>
              <div className="text-slate-800 font-mono text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{audit.geolocationLatLong} · IP: {audit.ipAddress}</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-500 font-mono">Huella Digital del Documento (SHA-256):</span>
              <div className="bg-white p-2 rounded-lg border border-slate-300 font-mono text-[10px] text-emerald-900 break-all select-all">
                {audit.sha256DocumentHash}
              </div>
            </div>
          </div>
        </div>

        {/* JSON Audit Trail Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-bold uppercase font-mono text-[10px]">
              Estructura de Datos JSON Probatoria (Para Tribunales del Trabajo)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="text-[11px] text-amber-800 hover:text-amber-950 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="text-[11px] text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-medium"
              >
                <Download className="w-3 h-3" />
                <span>Descargar Evidencia .json</span>
              </button>
            </div>
          </div>

          <pre className="bg-[#FAF8F5] border border-slate-300 p-3 rounded-xl font-mono text-[10px] text-slate-800 max-h-36 overflow-y-auto">
            {jsonEvidence}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-500 font-mono">
            Plena validez probatoria conforme al Art. 4 y 6 del Decreto-Ley N° 1.204
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold transition-colors"
          >
            Cerrar Certificado
          </button>
        </div>
      </div>
    </div>
  );
};
