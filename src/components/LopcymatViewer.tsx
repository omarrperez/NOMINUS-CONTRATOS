import React from 'react';
import { LaborContract } from '../types/contract';
import { exportLopcymatToPdf, exportLopcymatToWord } from '../utils/exportDocuments';
import { Printer, ArrowLeft, ShieldCheck, FileText, Download } from 'lucide-react';

interface LopcymatViewerProps {
  contract: LaborContract;
  onBack: () => void;
}

export const LopcymatViewer: React.FC<LopcymatViewerProps> = ({
  contract,
  onBack
}) => {
  const lop = contract.lopcymat;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar Controls in Pastel */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-sky-200/80 p-4 rounded-xl shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Expedientes</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-sky-900 font-semibold bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
          <ShieldCheck className="w-4 h-4 text-sky-700" />
          <span>LOPCYMAT NT-04-2023</span>
          <span className="text-sky-300">·</span>
          <span>{contract.codigoExpediente}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Word */}
          <button
            onClick={() => exportLopcymatToWord(contract)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title="Descargar notificación en formato Word (.doc)"
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Descargar Word</span>
          </button>

          {/* Botón PDF */}
          <button
            onClick={() => exportLopcymatToPdf(contract)}
            className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            title="Descargar notificación en formato PDF (.pdf)"
          >
            <Download className="w-4 h-4 text-rose-700" />
            <span>Descargar PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 font-sans text-xs">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
              NOTIFICACIÓN ESCRITA DE RIESGOS OCUPACIONALES E IDENTIFICACIÓN DE PROCESOS PELIGROSOS
            </h1>
            <span className="bg-sky-50 border border-sky-300 text-sky-950 px-2.5 py-0.5 font-mono text-[10px] font-bold rounded">
              NT-04-2023
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            En acatamiento de los Artículos 53 numeral 1, 56 numerales 3 y 4 de la Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo (LOPCYMAT).
          </p>
        </div>

        {/* Data Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-xl border border-slate-200 mb-6 text-[11px]">
          <div>
            <span className="text-slate-500 block">Patrono / RIF:</span>
            <span className="font-semibold text-slate-900">{contract.empresa.denominacionSocial}</span>
            <span className="block font-mono text-slate-600">{contract.empresa.rif}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Trabajador:</span>
            <span className="font-semibold text-slate-900">{contract.trabajador.nombres} {contract.trabajador.apellidos}</span>
            <span className="block font-mono text-slate-600">C.I. {contract.trabajador.cedula}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Cargo Asignado:</span>
            <span className="font-semibold text-slate-900">{contract.cargo}</span>
            <span className="block capitalize text-slate-600">{contract.clasificacion}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Fecha de Notificación:</span>
            <span className="font-semibold text-slate-900 font-mono">{lop.fechaNotificacion}</span>
            <span className="block text-emerald-800 font-semibold">Previa a Labores</span>
          </div>
        </div>

        {/* Matriz de Riesgos Table */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
            Matriz de Procesos Peligrosos y Factores de Riesgo del Puesto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">Riesgos Físicos:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {lop.peligrosFisicos.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">Riesgos Químicos:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {lop.peligrosQuimicos.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">Riesgos Disergonómicos:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {lop.peligrosDisergonomicos.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">Riesgos Psicosociales:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {lop.peligrosPsicosociales.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* EPP & Medidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-slate-200 rounded-xl p-3 bg-[#FAF8F5]">
            <span className="font-bold text-slate-900 block mb-1">Equipos de Protección Personal (EPP):</span>
            <div className="space-y-1 text-[11px]">
              {lop.eppRequeridos.map((epp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-slate-400 rounded flex items-center justify-center text-[10px] bg-white text-emerald-800 font-bold">✓</span>
                  <span>{epp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-3 bg-[#FAF8F5]">
            <span className="font-bold text-slate-900 block mb-1">Medidas de Prevención y Control:</span>
            <div className="space-y-1 text-[11px] text-slate-700">
              {lop.medidasPreventivas.map((m, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Programa 16 Horas */}
        <div className="border border-slate-300 rounded-xl p-3 bg-emerald-50/50 mb-8">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-emerald-950">Programa de Capacitación Obligatoria en SST (16 Horas Trimestrales)</span>
            <span className="font-mono font-bold text-emerald-800">{lop.horasCapacitacionTrimestralesCompletadas} / 16 hrs</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mt-2">
            {lop.cronogramaCapacitacionSST.map((c, i) => (
              <div key={i} className="flex items-center justify-between border-b border-emerald-200/60 pb-1">
                <span>{c.tema} ({c.horas}h)</span>
                <span className={c.completado ? 'text-emerald-800 font-bold' : 'text-slate-500'}>
                  {c.completado ? 'COMPLETADO' : 'PROGRAMADO'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Declaración y Firmas */}
        <div className="border-t-2 border-slate-900 pt-6 grid grid-cols-2 gap-8 text-center text-[11px]">
          <div>
            <div className="w-44 mx-auto border-b border-slate-800 pb-1 font-semibold">
              {contract.empresa.representanteNombre}
            </div>
            <p className="font-bold mt-1">Servicio de Seguridad y Salud en el Trabajo (SSST)</p>
            <p className="text-slate-500">Por el Patrono</p>
          </div>

          <div>
            <div className="w-44 mx-auto border-b border-slate-800 pb-1 font-semibold">
              {contract.trabajador.nombres} {contract.trabajador.apellidos}
            </div>
            <p className="font-bold mt-1">EL TRABAJADOR (Constancia de Recepción)</p>
            <p className="text-slate-500 font-mono">C.I. {contract.trabajador.cedula}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
