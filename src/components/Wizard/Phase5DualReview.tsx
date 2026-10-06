import React, { useState } from 'react';
import { LaborContract } from '../../types/contract';
import { generateContractLegalText, generateLopcymatNotificationText } from '../../utils/contractTemplates';
import { exportContractToPdf, exportContractToWord, exportLopcymatToPdf, exportLopcymatToWord } from '../../utils/exportDocuments';
import { 
  FileText, 
  ShieldCheck, 
  Printer, 
  PenTool, 
  Copy, 
  Check, 
  Columns, 
  FileCheck2,
  Lock,
  Download
} from 'lucide-react';

interface Phase5Props {
  contract: LaborContract;
  onSaveContract: (c: LaborContract) => void;
  onProceedToSign: (c: LaborContract) => void;
  onBack: () => void;
}

export const Phase5DualReview: React.FC<Phase5Props> = ({
  contract,
  onSaveContract,
  onProceedToSign,
  onBack
}) => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedLopcymat, setCopiedLopcymat] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'contract' | 'lopcymat'>('contract');

  const contractText = generateContractLegalText(contract);
  const lopcymatText = generateLopcymatNotificationText(contract);

  const handleCopy = (text: string, type: 'contract' | 'lopcymat') => {
    navigator.clipboard.writeText(text);
    if (type === 'contract') {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } else {
      setCopiedLopcymat(true);
      setTimeout(() => setCopiedLopcymat(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls in Pastel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-900 font-mono font-semibold">
            <span>EXPEDIENTE: {contract.codigoExpediente}</span>
            <span aria-hidden="true">·</span>
            <span>Art. 59 N° 14 LOTTT</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            Fase 5: Revisión en Panel Dual y Emisión de Doble Ejemplar
          </h2>
          <p className="text-xs text-slate-600">
            Vista simultánea del Contrato Laboral y de la Notificación de Riesgos LOPCYMAT previa a la suscripción.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Word */}
          <button
            type="button"
            onClick={() => exportContractToWord(contract)}
            className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title="Descargar contrato editable en formato Word (.doc)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Descargar Word</span>
          </button>

          {/* Botón PDF */}
          <button
            type="button"
            onClick={() => exportContractToPdf(contract)}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title="Descargar contrato en formato PDF (.pdf)"
          >
            <Download className="w-3.5 h-3.5 text-rose-700" />
            <span>Descargar PDF</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={() => onSaveContract(contract)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Guardar en Expedientes</span>
          </button>

          <button
            type="button"
            onClick={() => onProceedToSign(contract)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Proceder a Firma OTP</span>
          </button>
        </div>
      </div>

      {/* Mandatory Double Exemplar Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-emerald-950">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>
            <strong>Mandato Legal LOTTT Art. 59 N° 14:</strong> Este expediente genera <strong>dos (2) ejemplares de idéntico tenor</strong>: Ejemplar 1 para el TRABAJADOR y Ejemplar 2 para el ARCHIVO PATRONAL.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-800 font-semibold">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Hash SHA-256 Validado</span>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex sm:hidden items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTabMobile('contract')}
          className={`flex-1 py-1.5 rounded text-center font-medium ${
            activeTabMobile === 'contract' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Contrato LOTTT
        </button>
        <button
          type="button"
          onClick={() => setActiveTabMobile('lopcymat')}
          className={`flex-1 py-1.5 rounded text-center font-medium ${
            activeTabMobile === 'lopcymat' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Notificación LOPCYMAT
        </button>
      </div>

      {/* Panel Dual (Split View) in Ivory / White Paper Sheets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Panel Izquierdo: Contrato LOTTT */}
        <div className={`space-y-2 ${activeTabMobile === 'lopcymat' ? 'hidden sm:block' : 'block'}`}>
          <div className="flex items-center justify-between bg-amber-50/80 px-4 py-2.5 rounded-t-xl border-t border-x border-amber-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                1. Contrato de Trabajo (LOTTT)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(contractText, 'contract')}
              className="text-[11px] text-amber-800 hover:text-amber-950 flex items-center gap-1 font-medium"
            >
              {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedContract ? 'Copiado' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div className="bg-[#FAF8F5] border border-amber-200 rounded-b-xl p-5 h-[560px] overflow-y-auto font-serif text-[12px] leading-relaxed text-slate-800 whitespace-pre-line border-t-0 shadow-inner">
            {contractText}
          </div>
        </div>

        {/* Panel Derecho: Notificación LOPCYMAT */}
        <div className={`space-y-2 ${activeTabMobile === 'contract' ? 'hidden sm:block' : 'block'}`}>
          <div className="flex items-center justify-between bg-sky-50/80 px-4 py-2.5 rounded-t-xl border-t border-x border-sky-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                2. Notificación SST (LOPCYMAT NT-04-2023)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(lopcymatText, 'lopcymat')}
              className="text-[11px] text-sky-800 hover:text-sky-950 flex items-center gap-1 font-medium"
            >
              {copiedLopcymat ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLopcymat ? 'Copiado' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div className="bg-[#FAF8F5] border border-sky-200 rounded-b-xl p-5 h-[560px] overflow-y-auto font-sans text-[11px] leading-relaxed text-slate-800 whitespace-pre-line border-t-0 shadow-inner">
            {lopcymatText}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium transition-colors"
        >
          ← Volver a Fase 4 (LOPCYMAT)
        </button>

        <button
          type="button"
          onClick={() => onProceedToSign(contract)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
        >
          <PenTool className="w-4 h-4" />
          <span>Siguiente: Firmar Digitalmente →</span>
        </button>
      </div>
    </div>
  );
};
