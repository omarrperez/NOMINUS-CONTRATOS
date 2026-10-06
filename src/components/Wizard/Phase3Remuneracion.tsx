import React from 'react';
import { LaborContract, RemunerationData } from '../../types/contract';
import { 
  calculateSalarioDiarioIntegral, 
  formatUSD, 
  formatVES, 
  validateSalarizacionRisk 
} from '../../utils/lotttCalculations';
import { 
  DollarSign, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  Calculator,
  Percent
} from 'lucide-react';

interface Phase3Props {
  contract: Partial<LaborContract>;
  updateContract: (data: Partial<LaborContract>) => void;
  onNext: () => void;
  onBack: () => void;
  bcvRate: number;
}

export const Phase3Remuneracion: React.FC<Phase3Props> = ({
  contract,
  updateContract,
  onNext,
  onBack,
  bcvRate
}) => {
  const remuneracion = contract.remuneracion || {
    tipoMoneda: 'USD_INDEXADO',
    salarioBaseMensualUSD: 600,
    salarioBaseMensualVEF: 600 * bcvRate,
    tasaBCV: bcvRate,
    fechaTasaBCV: new Date().toISOString().split('T')[0],
    periodicidadPago: 'Quincenal',
    diaPago: 'los días 15 y último de cada mes',
    lugarPago: 'transferencia bancaria a cuenta nómina del trabajador',
    cestaticketUSD: 40,
    cestaticketVEF: 40 * bcvRate,
    esquemaMixto: contract.clasificacion === 'ventas',
    porcentajeComisionVentas: 3,
    diasBonoVacacional: 15,
    diasUtilidades: 30,
    bonosNoSalarialesDeclarados: 0,
    alertaRiesgoSalarizacion: false
  };

  const updateRemuneracion = (fields: Partial<RemunerationData>) => {
    const updated = { ...remuneracion, ...fields };
    
    // Sincronizar montos según tipo de moneda
    if ('salarioBaseMensualUSD' in fields && fields.salarioBaseMensualUSD !== undefined) {
      updated.salarioBaseMensualVEF = fields.salarioBaseMensualUSD * bcvRate;
    } else if ('salarioBaseMensualVEF' in fields && fields.salarioBaseMensualVEF !== undefined) {
      updated.salarioBaseMensualUSD = fields.salarioBaseMensualVEF / bcvRate;
    }

    updated.cestaticketVEF = updated.cestaticketUSD * bcvRate;
    updated.tasaBCV = bcvRate;

    // Validación Anti-Fraude TSJ 341
    const val = validateSalarizacionRisk(updated);
    updated.alertaRiesgoSalarizacion = val.alertaRiesgo;
    updated.motivoAlertaSalarizacion = val.mensaje;

    updateContract({ remuneracion: updated });
  };

  const salarioBaseMensualVEF = remuneracion.salarioBaseMensualVEF || 0;
  const diasVac = remuneracion.diasBonoVacacional || 15;
  const diasUtil = remuneracion.diasUtilidades || 15;

  const {
    salarioBaseDiario,
    alicuotaBonoVacacional,
    alicuotaUtilidades,
    salarioDiarioIntegral
  } = calculateSalarioDiarioIntegral(salarioBaseMensualVEF, diasVac, diasUtil);

  const riskAssessment = validateSalarizacionRisk(remuneracion);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-serif">Fase 3: Estructura Remunerativa, Cestaticket y Control TSJ 341</h2>
        <p className="text-xs text-slate-600">
          Diseño del paquete compensatorio en estricto cumplimiento de los Artículos 104, 105 y 122 de la LOTTT.
        </p>
      </div>

      {/* Selector Multimoneda */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-amber-700" />
            <span>1. Salario Base y Arquitectura Multimoneda</span>
          </div>
          <div className="text-xs text-slate-500">
            Tasa BCV Referencial: <span className="font-mono text-amber-900 font-bold">{formatVES(bcvRate)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opción USD Indexado */}
          <div
            onClick={() => updateRemuneracion({ tipoMoneda: 'USD_INDEXADO' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all space-y-2 ${
              remuneracion.tipoMoneda === 'USD_INDEXADO'
                ? 'bg-amber-50/80 border-amber-400 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Dólares Indexados a Tasa BCV</span>
              {remuneracion.tipoMoneda === 'USD_INDEXADO' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              El salario se fija contractualmente en divisas pero se paga en Bolívares calculados a la tasa oficial del BCV del día de pago.
            </p>
            <div className="pt-2">
              <label className="block text-[10px] text-slate-500 uppercase font-mono font-medium mb-1">Monto en USD / Mes</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                <input
                  type="number"
                  step="10"
                  value={remuneracion.salarioBaseMensualUSD || 600}
                  onChange={(e) => updateRemuneracion({ salarioBaseMensualUSD: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Opción VEF Nominal */}
          <div
            onClick={() => updateRemuneracion({ tipoMoneda: 'VEF' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all space-y-2 ${
              remuneracion.tipoMoneda === 'VEF'
                ? 'bg-amber-50/80 border-amber-400 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Bolívares Nominales (VEF)</span>
              {remuneracion.tipoMoneda === 'VEF' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Monto fijado directamente en moneda de curso legal (Bolívares) para nóminas estáticas.
            </p>
            <div className="pt-2">
              <label className="block text-[10px] text-slate-500 uppercase font-mono font-medium mb-1">Monto en Bs. / Mes</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">Bs.</span>
                <input
                  type="number"
                  step="100"
                  value={remuneracion.salarioBaseMensualVEF || 29250}
                  onChange={(e) => updateRemuneracion({ salarioBaseMensualVEF: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cestaticket Socialista de Alimentación */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-emerald-950">Cestaticket Socialista (Decreto 4805 / Art. 105 LOTTT)</span>
              <span className="text-[10px] text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                Estrictamente NO Remunerativo
              </span>
            </div>
            <span className="font-mono text-xs text-slate-900 font-bold">{formatVES(remuneracion.cestaticketVEF)}</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Fijado legalmente en $40,00 USD indexados a la tasa BCV. Se emite imperativamente en recibo de pago independiente sin generar pasivo prestacional ni recargos vacacionales.
          </p>
        </div>
      </div>

      {/* Cálculo Automático de Salario Diario Integral (Si) */}
      <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/40 border border-amber-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-amber-700" />
            <span>2. Desglose del Salario Diario Integral (Si - Art. 104 y 122 LOTTT)</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-amber-200">
            {formatVES(salarioDiarioIntegral)} / día
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[10px] text-slate-500 uppercase font-mono font-medium">Salario Base Diario (Sb)</div>
            <div className="text-sm font-bold text-slate-900 font-mono">{formatVES(salarioBaseDiario)}</div>
            <div className="text-[10px] text-slate-400">Monto mensual ÷ 30 días</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Alícuota Vacacional</span>
              <span className="text-[10px] text-amber-800 font-medium">{diasVac} días/año</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">{formatVES(alicuotaBonoVacacional)}</div>
            <div className="text-[10px] text-slate-400 font-mono">(Sb × {diasVac}) ÷ 360</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Alícuota Utilidades</span>
              <span className="text-[10px] text-amber-800 font-medium">{diasUtil} días/año</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">{formatVES(alicuotaUtilidades)}</div>
            <div className="text-[10px] text-slate-400 font-mono">(Sb × {diasUtil}) ÷ 360</div>
          </div>
        </div>
      </div>

      {/* Sección Especial: Salario por Unidad de Obra / Comisión (Arts. 114, 115 y 119 LOTTT) */}
      {(contract.clasificacion === 'unidad_obra' || remuneracion.esUnidadDeObra) && (
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <span>Régimen Especial: Salario por Unidad de Obra o Comisión (Arts. 114 y 115 LOTTT)</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">
              Blindaje LOTTT Activo
            </span>
          </div>

          <div className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-amber-200 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-amber-900 font-semibold">Alerta de Contingencia Patrimonial:</strong> Según el Artículo 53 de la LOTTT, prestar servicios dentro del taller hace presumir la relación de trabajo. Para evitar contingencias por prestaciones sociales retroactivas, se aplican los <strong>baremos de comisiones</strong> con las siguientes garantías imperativas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="flex items-start gap-1.5 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Art. 115 LOTTT:</strong> Garantía obligatoria de Salario Mínimo Nacional si las comisiones del lapso son inferiores.</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Art. 119 LOTTT:</strong> Días de descanso y feriados se liquidan calculando el salario promedio diario de la semana.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Baremo de Comisiones por Servicios de Taller:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(remuneracion.tarifasComisionUnidadObra || [
                { servicio: 'Montaje, desmontaje y balanceo de neumático', porcentajeOMonto: '25% mano de obra facturada' },
                { servicio: 'Reparación de pinchazos y colocación de parches', porcentajeOMonto: '30% mano de obra facturada' },
                { servicio: 'Alineación de dirección y balanceo computarizado', porcentajeOMonto: '25% mano de obra facturada' },
                { servicio: 'Mecánica ligera preventiva (aceite, frenos, bujías)', porcentajeOMonto: '25% mano de obra facturada' }
              ]).map((tarifa, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-800 text-[11px] font-medium truncate">{tarifa.servicio}</span>
                  <span className="font-mono text-amber-900 font-bold text-[11px] shrink-0 ml-2">{tarifa.porcentajeOMonto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="garantiaArt115"
              checked={true}
              readOnly
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="garantiaArt115" className="text-xs text-amber-950 font-semibold">
              Garantía legal de Salario Mínimo (Art. 115) y Descansos con Promedio (Art. 119) incorporadas de pleno derecho en el contrato digital.
            </label>
          </div>
        </div>
      )}

      {/* Control Jurisprudencial TSJ Sentencia 341 */}
      <div className={`border rounded-xl p-5 space-y-4 shadow-xs ${
        riskAssessment.nivelRiesgo === 'ALTO_BLOQUEANTE'
          ? 'bg-rose-50/70 border-rose-300'
          : riskAssessment.nivelRiesgo === 'MEDIO'
          ? 'bg-amber-50/70 border-amber-300'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>3. Monitor Jurisprudencial Anti-Fraude (TSJ Sala Social N° 341)</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
            riskAssessment.nivelRiesgo === 'ALTO_BLOQUEANTE'
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : riskAssessment.nivelRiesgo === 'MEDIO'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}>
            Nivel: {riskAssessment.nivelRiesgo}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          La <strong>Sentencia N° 341 del TSJ</strong> ratifica que toda comisión o incentivo periódico pagado al trabajador por su gestión tiene <strong>naturaleza salarial irrenunciable</strong>. Ocultarlos bajo figuras no remunerativas autoriza su reclasificación judicial con intereses e indexación.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Esquema de Comisiones sobre Ventas
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="esquemaMixto"
                checked={remuneracion.esquemaMixto || false}
                onChange={(e) => updateRemuneracion({ esquemaMixto: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="esquemaMixto" className="text-xs text-slate-700">
                Habilitar remuneración mixta (Salario base + % cobranza)
              </label>
            </div>
            {remuneracion.esquemaMixto && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={remuneracion.porcentajeComisionVentas || 3}
                  onChange={(e) => updateRemuneracion({ porcentajeComisionVentas: parseFloat(e.target.value) || 0 })}
                  className="w-20 bg-[#FAF8F5] border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono text-center focus:bg-white"
                />
                <span className="text-xs text-slate-500">% sobre cobranza neta de ventas</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Asignaciones Complementarias Declaradas No Salariales (Bs./mes)
            </label>
            <input
              type="number"
              step="500"
              value={remuneracion.bonosNoSalarialesDeclarados || 0}
              onChange={(e) => updateRemuneracion({ bonosNoSalarialesDeclarados: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Para simular y validar que no supere el umbral de contingencia probatoria.
            </p>
          </div>
        </div>

        {riskAssessment.detalles.length > 0 && (
          <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1.5 text-xs">
            {riskAssessment.detalles.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium transition-colors"
        >
          ← Volver a Fase 2
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all active:scale-95"
        >
          Continuar a Fase 4: Sincronización SST LOPCYMAT →
        </button>
      </div>
    </div>
  );
};
