import React from 'react';
import { LaborContract } from '../types/contract';
import { generateContractLegalText } from '../utils/contractTemplates';
import { exportContractToPdf, exportContractToWord } from '../utils/exportDocuments';
import { Printer, ArrowLeft, PenTool, ShieldCheck, Check, FileDown, FileText, Download } from 'lucide-react';

interface ContractViewerProps {
  contract: LaborContract;
  onBack: () => void;
  onProceedToSign: (contract: LaborContract) => void;
}

export const ContractViewer: React.FC<ContractViewerProps> = ({
  contract,
  onBack,
  onProceedToSign
}) => {
  const legalText = generateContractLegalText(contract);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    exportContractToWord(contract);
  };

  const handleDownloadPdf = () => {
    exportContractToPdf(contract);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar Controls in Light Pastel */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-amber-200/80 p-4 rounded-xl shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Expedientes</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-900 font-semibold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
          <span>{contract.codigoExpediente}</span>
          <span className="text-amber-300">·</span>
          <span className="capitalize">{contract.modalidad}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Funcional Exportar a Word (.doc) */}
          <button
            onClick={handleDownloadWord}
            title="Descargar contrato editable en formato Microsoft Word (.doc)"
            className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Descargar Word (.doc)</span>
          </button>

          {/* Botón Funcional Exportar a PDF (.pdf) */}
          <button
            onClick={handleDownloadPdf}
            title="Descargar contrato digital en archivo PDF (.pdf)"
            className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-rose-700" />
            <span>Descargar PDF</span>
          </button>

          {/* Botón Imprimir */}
          <button
            onClick={handlePrint}
            title="Abrir diálogo de impresión o guardar como PDF del sistema"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir</span>
          </button>

          {contract.status !== 'firmado_ambos' && (
            <button
              onClick={() => onProceedToSign(contract)}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <PenTool className="w-4 h-4" />
              <span>Firmar Digitalmente (OTP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Venezuelan Legal Document Paper Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-14 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 font-serif relative">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
          <span className="text-7xl font-bold uppercase tracking-widest rotate-[-35deg] text-slate-900">
            NOMINUS LOTTT
          </span>
        </div>

        {/* Corporate Legal Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase text-slate-900">
              {contract.empresa.denominacionSocial}
            </h2>
            <div className="text-xs font-sans text-slate-600 space-y-0.5 mt-1">
              <p><strong>RIF:</strong> {contract.empresa.rif} | <strong>RNET:</strong> {contract.empresa.rnetNumero || 'En trámite'}</p>
              <p><strong>Inscripción:</strong> {contract.empresa.registroMercantil}</p>
              <p><strong>Domicilio Fiscal:</strong> {contract.empresa.domicilioFiscal}</p>
            </div>
          </div>

          <div className="text-right font-sans text-xs shrink-0">
            <span className="inline-block bg-amber-50 border border-amber-300 px-2 py-1 font-mono font-bold text-amber-900 rounded">
              EJEMPLAR ORIGINAL
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Art. 59 N° 14 LOTTT</p>
          </div>
        </div>

        {/* Main Contract Body */}
        <div className="text-[13px] leading-relaxed text-slate-800 whitespace-pre-line text-justify space-y-4">
          {legalText}
        </div>

        {/* Formal Signature Blocks */}
        <div className="mt-14 pt-8 border-t border-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center font-sans text-xs">
          {/* Patrono Block */}
          <div className="flex flex-col items-center justify-end space-y-2">
            <div className="w-48 border-b-2 border-slate-900 pb-1 font-medium text-slate-800">
              {contract.empresa.representanteNombre}
            </div>
            <div className="text-slate-600 leading-snug">
              <p className="font-bold text-slate-900">POR "LA EMPRESA"</p>
              <p>{contract.empresa.representanteCargo}</p>
              <p className="font-mono">C.I. {contract.empresa.representanteCI}</p>
              <p className="text-[10px] text-slate-500">{contract.empresa.rif}</p>
            </div>
          </div>

          {/* Trabajador Block */}
          <div className="flex flex-col items-center justify-end space-y-2">
            {contract.auditTrail?.signatureImageBase64 ? (
              <div className="w-44 h-16 flex items-center justify-center border-b-2 border-slate-900 pb-1">
                <img
                  src={contract.auditTrail.signatureImageBase64}
                  alt="Firma del Trabajador"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-48 border-b-2 border-slate-900 pb-1 font-medium text-slate-800">
                {contract.trabajador.nombres} {contract.trabajador.apellidos}
              </div>
            )}

            <div className="text-slate-600 leading-snug">
              <p className="font-bold text-slate-900">"EL TRABAJADOR"</p>
              <p>{contract.cargo}</p>
              <p className="font-mono">C.I. {contract.trabajador.cedula}</p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <div className="w-14 h-16 border border-slate-400 rounded flex flex-col items-center justify-center text-[9px] text-slate-400 font-mono">
                  <span>HUELLA</span>
                  <span>PULGAR</span>
                  <span>DERECHO</span>
                </div>
                {contract.status === 'firmado_ambos' && (
                  <div className="text-left text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 p-1.5 rounded space-y-0.5">
                    <p className="font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Firma OTP Validada
                    </p>
                    <p className="font-mono text-[9px]">{contract.auditTrail?.auditId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-4 border-t border-slate-300 text-[10px] font-sans text-slate-500 flex flex-wrap items-center justify-between">
          <span>Nominus Contratos • Plataforma LegalTech Certificada Venezuela</span>
          <span className="font-mono">CÓDIGO HASH: {contract.auditTrail?.sha256DocumentHash?.slice(0, 24) || 'PENDIENTE DE SELLO DIGITAL'}...</span>
        </div>
      </div>
    </div>
  );
};
