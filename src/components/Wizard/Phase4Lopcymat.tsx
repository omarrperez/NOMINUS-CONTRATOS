import React from 'react';
import { LaborContract, LopcymatData } from '../../types/contract';
import { getDefaultLopcymatData } from '../../utils/lopcymatData';
import { 
  ShieldCheck, 
  HardHat, 
  Calendar, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';

interface Phase4Props {
  contract: Partial<LaborContract>;
  updateContract: (data: Partial<LaborContract>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Phase4Lopcymat: React.FC<Phase4Props> = ({
  contract,
  updateContract,
  onNext,
  onBack
}) => {
  const clasificacion = contract.clasificacion || 'administrativo';
  const lopcymat: LopcymatData = contract.lopcymat || getDefaultLopcymatData(clasificacion);

  const updateLopcymat = (fields: Partial<LopcymatData>) => {
    updateContract({
      lopcymat: { ...lopcymat, ...fields }
    });
  };

  const handleResetProfile = () => {
    updateContract({
      lopcymat: getDefaultLopcymatData(clasificacion)
    });
  };

  const toggleTrainingCompleted = (index: number) => {
    const updated = [...lopcymat.cronogramaCapacitacionSST];
    updated[index].completado = !updated[index].completado;
    
    const totalHoras = updated.reduce((acc, curr) => curr.completado ? acc + curr.horas : acc, 0);
    
    updateLopcymat({
      cronogramaCapacitacionSST: updated,
      horasCapacitacionTrimestralesCompletadas: totalHoras
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">Fase 4: Seguridad y Salud Laboral (LOPCYMAT & NT-04-2023)</h2>
          <p className="text-xs text-slate-600">
            Sincronización técnica de procesos peligrosos y programa de 16 horas trimestrales de capacitación obligatoria.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetProfile}
          className="text-xs text-sky-800 hover:text-sky-950 flex items-center gap-1.5 font-medium self-start sm:self-auto bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restablecer Matriz por Cargo</span>
        </button>
      </div>

      {/* Banner Sancionatorio LOPCYMAT en Pastel Verde Suave */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700">
          <div className="font-bold text-emerald-950">
            OBLIGATORIEDAD PREVIA AL INICIO DE LABORES (ARTÍCULOS 53 Y 56 LOPCYMAT):
          </div>
          <p className="text-slate-600 leading-relaxed">
            La Notificación de Riesgos debe suscribirse <strong>previamente al inicio de labores</strong> del trabajador. La omisión acarrea multas de <strong>76 a 100 U.T. por cada trabajador expuesto</strong> (Art. 119) y responsabilidad patronal directa ante incidentes.
          </p>
        </div>
      </div>

      {/* Matriz de Procesos Peligrosos y Factores de Riesgo */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            1. Matriz de Identificación de Peligros (NT-04-2023)
          </span>
          <span className="text-xs text-slate-500 font-mono">Perfil: {clasificacion.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Físicos */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs block">Riesgos Físicos</span>
            <ul className="space-y-1 text-slate-600">
              {lopcymat.peligrosFisicos.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Químicos */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs block">Riesgos Químicos</span>
            <ul className="space-y-1 text-slate-600">
              {lopcymat.peligrosQuimicos.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disergonómicos */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs block">Riesgos Disergonómicos</span>
            <ul className="space-y-1 text-slate-600">
              {lopcymat.peligrosDisergonomicos.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Psicosociales */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs block">Riesgos Psicosociales</span>
            <ul className="space-y-1 text-slate-600">
              {lopcymat.peligrosPsicosociales.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* EPP Requeridos */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Equipos de Protección Personal (EPP) de Uso Obligatorio
          </label>
          <div className="flex flex-wrap gap-2">
            {lopcymat.eppRequeridos.map((epp, i) => (
              <span key={i} className="bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-sky-700" />
                <span>{epp}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cláusula Art. 168 LOTTT */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="clausulaArt168"
            checked={lopcymat.clausulaArt168AlmuerzoTrayecto}
            onChange={(e) => updateLopcymat({ clausulaArt168AlmuerzoTrayecto: e.target.checked })}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="clausulaArt168" className="text-xs font-bold text-slate-900 cursor-pointer">
            Incluir Cláusula Especial de Deslinde de Accidente de Trayecto en Hora de Almuerzo (Art. 168 LOTTT)
          </label>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-6">
          Estipula que durante el período de descanso y alimentación la relación laboral se encuentra legalmente suspendida. Las salidas voluntarias del trabajador fuera de la empresa no configurarán accidente de trayecto salvo que utilice transporte suministrado directamente por el patrono.
        </p>
      </div>

      {/* Indicador de 16 Horas Trimestrales de Capacitación SST */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>2. Programa de Capacitación en SST (Meta Legal: 16 Horas / Trimestre)</span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {lopcymat.horasCapacitacionTrimestralesCompletadas} / 16 Horas Completadas
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all ${
              lopcymat.horasCapacitacionTrimestralesCompletadas >= 16
                ? 'bg-emerald-600'
                : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, (lopcymat.horasCapacitacionTrimestralesCompletadas / 16) * 100)}%` }}
          />
        </div>

        {/* Training schedule list */}
        <div className="space-y-2">
          {lopcymat.cronogramaCapacitacionSST.map((c, idx) => (
            <div
              key={idx}
              onClick={() => toggleTrainingCompleted(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between text-xs ${
                c.completado
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${c.completado ? 'text-emerald-700' : 'text-slate-300'}`} />
                <div>
                  <span className="font-semibold text-slate-900">{c.tema}</span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Programado para: {c.fechaProgramada}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-900">
                {c.horas} hrs
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium transition-colors"
        >
          ← Volver a Fase 3
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all active:scale-95"
        >
          Continuar a Fase 5: Revisión en Panel Dual y Emisión →
        </button>
      </div>
    </div>
  );
};
