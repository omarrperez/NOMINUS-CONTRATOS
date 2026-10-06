import React, { useState } from 'react';
import { ContractModality, JobClassification, LaborContract } from '../../types/contract';
import { AlertCircle, AlertOctagon, ShieldAlert, Check } from 'lucide-react';

interface Phase1Props {
  contract: Partial<LaborContract>;
  updateContract: (data: Partial<LaborContract>) => void;
  onNext: () => void;
}

export const Phase1Modalidad: React.FC<Phase1Props> = ({
  contract,
  updateContract,
  onNext
}) => {
  const [showBlockingModal, setShowBlockingModal] = useState(false);

  const modalidad = contract.modalidad || 'indeterminado';
  const clasificacion = contract.clasificacion || 'administrativo';
  const numeroProrroga = contract.numeroProrroga || 0;

  const handleProrrogaChange = (val: number) => {
    if (val >= 2) {
      setShowBlockingModal(true);
      return;
    }
    updateContract({ numeroProrroga: val });
  };

  const handleConvertToIndeterminado = () => {
    updateContract({
      modalidad: 'indeterminado',
      numeroProrroga: 0,
      fechaCulminacion: undefined,
      causalArt64: undefined,
      justificacionCausalArt64: undefined
    });
    setShowBlockingModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Modal Bloqueante Art. 62 LOTTT */}
      {showBlockingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-500 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertOctagon className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">BLOQUEO LEGAL: ARTÍCULO 62 DE LA LOTTT</h3>
                <p className="text-xs text-rose-700 font-medium">Conversión Legal Automática Obligatoria</p>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-2 bg-rose-50/70 p-4 rounded-xl border border-rose-200 leading-relaxed">
              <p>
                <strong className="text-rose-900">Artículo 62 LOTTT:</strong> <em>"El contrato de trabajo a tiempo determinado no podrá prorrogarse más de una vez. Si vencido el término de la prórroga las partes continúan la prestación del servicio, la relación se considerará por tiempo indeterminado."</em>
              </p>
              <p>
                El sistema detectó un intento de registrar una <strong>segunda prórroga</strong> para este trabajador. El ordenamiento jurídico venezolano prohíbe de forma imperativa esta práctica y la sanciona considerando la relación como indefinida desde el inicio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockingModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium"
              >
                Cancelar y Mantener en 1ª Prórroga
              </button>
              <button
                type="button"
                onClick={handleConvertToIndeterminado}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs"
              >
                Convertir a Contrato Indeterminado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intro */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-serif">Fase 1: Modalidad Contractual y Clasificación Funcional</h2>
        <p className="text-xs text-slate-600">
          Determine la naturaleza jurídica del vínculo conforme a los Artículos 60 al 64 de la LOTTT.
        </p>
      </div>

      {/* Selector de Modalidad */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
          1. Modalidad Contractual (Artículos 60-64 LOTTT)
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Indeterminado */}
          <div
            onClick={() => updateContract({ modalidad: 'indeterminado', numeroProrroga: 0 })}
            className={`border rounded-xl p-4 cursor-pointer transition-all space-y-2 ${
              modalidad === 'indeterminado'
                ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Tiempo Indeterminado</span>
              {modalidad === 'indeterminado' && <Check className="w-4 h-4 text-amber-800" />}
            </div>
            <div className="text-[11px] font-mono text-emerald-800 font-semibold">Regla General (Art. 61)</div>
            <p className="text-xs leading-relaxed text-slate-600">
              Presunción de estabilidad laboral en Venezuela. Opción recomendada para mitigar contingencias patronales.
            </p>
          </div>

          {/* Determinado */}
          <div
            onClick={() => updateContract({ modalidad: 'determinado' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all space-y-2 ${
              modalidad === 'determinado'
                ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Tiempo Determinado</span>
              {modalidad === 'determinado' && <Check className="w-4 h-4 text-amber-800" />}
            </div>
            <div className="text-[11px] font-mono text-amber-800 font-semibold">Excepcional (Art. 62 & 64)</div>
            <p className="text-xs leading-relaxed text-slate-600">
              Máximo 1 año de duración. Requiere justificación taxativa obligatoria. Máximo 1 sola prórroga.
            </p>
          </div>

          {/* Por Obra */}
          <div
            onClick={() => updateContract({ modalidad: 'obra' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all space-y-2 ${
              modalidad === 'obra'
                ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Para una Obra Determinada</span>
              {modalidad === 'obra' && <Check className="w-4 h-4 text-amber-800" />}
            </div>
            <div className="text-[11px] font-mono text-cyan-800 font-semibold">Proyecto Específico (Art. 63)</div>
            <p className="text-xs leading-relaxed text-slate-600">
              Dura todo el tiempo necesario para culminar la parte del proyecto asignada al trabajador.
            </p>
          </div>
        </div>
      </div>

      {/* Condicionales para Tiempo Determinado */}
      {modalidad === 'determinado' && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>EXIGENCIA TAXATIVA: JUSTIFICACIÓN DE CAUSAL (ARTÍCULO 64 LOTTT)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Causal Legal Permitida *
              </label>
              <select
                value={contract.causalArt64 || 'naturaleza_servicio'}
                onChange={(e) => updateContract({ causalArt64: e.target.value as any })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="naturaleza_servicio">Art. 64 lit. a: Lo exige la naturaleza temporal del servicio</option>
                <option value="sustitucion_provisional">Art. 64 lit. b: Sustitución provisional y legítima de un trabajador</option>
                <option value="servicios_determinados">Art. 64 lit. d: Obras que agotan temporalmente el objeto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Número de Prórroga Actual *
              </label>
              <select
                value={numeroProrroga}
                onChange={(e) => handleProrrogaChange(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value={0}>0 - Contrato Inicial Nuevo (Sin prórroga previa)</option>
                <option value={1}>1 - Primera Prórroga Formal (Última permitida por Art. 62)</option>
                <option value={2}>2 - Segunda Prórroga (BLOQUEANTE - Convierte a Indeterminado)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Descripción Fáctica de la Causal Temporal *
            </label>
            <textarea
              rows={2}
              value={contract.justificacionCausalArt64 || ''}
              onChange={(e) => updateContract({ justificacionCausalArt64: e.target.value })}
              placeholder="Ej: Labores extraordinarias de adecuación de servidores por implementación de software que culminan en 6 meses..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Condicionales para Obra Determinada */}
      {modalidad === 'obra' && (
        <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Delimitación Técnica Exacta de la Obra (Art. 63 LOTTT) *
          </label>
          <textarea
            rows={2}
            value={contract.descripcionObra || ''}
            onChange={(e) => updateContract({ descripcionObra: e.target.value })}
            placeholder="Ej: Construcción e instalación de tableros eléctricos en la nave industrial 4 del complejo manufacturero..."
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      )}

      {/* Selector de Clasificación Funcional */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
          2. Clasificación Funcional del Puesto
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              id: 'direccion',
              title: 'Personal Directivo y Confianza',
              ref: 'Arts. 37 y 178 LOTTT',
              desc: 'Excluido de los límites de jornada máxima de 40h y sin horas extras.'
            },
            {
              id: 'ventas',
              title: 'Fuerza Comercial y Ventas',
              ref: 'Sentencia 341 TSJ',
              desc: 'Remuneración mixta con comisiones sobre cobranza efectiva con naturaleza salarial.'
            },
            {
              id: 'operativo',
              title: 'Operativo, Planta y Almacén',
              ref: 'NT-04-2023 & Art. 173',
              desc: 'Jornada estricta, EPP integral y cláusula Art. 168 almuerzo/trayecto.'
            },
            {
              id: 'administrativo',
              title: 'Administrativo y Nómina',
              ref: 'Régimen General LOTTT',
              desc: 'Horario regular de oficina, descanso de 2 días y ergonomía PVD.'
            },
            {
              id: 'profesional_independiente',
              title: 'Servicios Mercantiles',
              ref: 'Arts. 35 y 535 LOTTT',
              desc: 'Autonomía funcional, sin subordinación jurídica laboral.'
            },
            {
              id: 'socio_trabajador',
              title: 'Socio o Accionista Operativo',
              ref: 'Código Comercio & LOTTT',
              desc: 'Doble condición: accionista societario vs relación laboral subordinada.'
            },
            {
              id: 'unidad_obra',
              title: 'Salario por Unidad de Obra / Comisión',
              ref: 'Arts. 114, 115 y 119 LOTTT',
              desc: 'Comisión por servicios de taller/labor con garantía de salario mínimo y descansos con promedio.'
            }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => updateContract({ clasificacion: item.id as JobClassification })}
              className={`border rounded-xl p-3.5 cursor-pointer transition-all space-y-1.5 ${
                clasificacion === item.id
                  ? 'bg-amber-50/80 border-amber-400 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{item.title}</span>
                {clasificacion === item.id && <span className="w-2 h-2 rounded-full bg-amber-600" />}
              </div>
              <div className="text-[10px] font-mono text-amber-800 font-semibold">{item.ref}</div>
              <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button to Phase 2 */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all active:scale-95"
        >
          Continuar a Fase 2: Identificación de Partes (Art. 59) →
        </button>
      </div>
    </div>
  );
};
