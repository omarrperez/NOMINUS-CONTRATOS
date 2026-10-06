import React, { useState } from 'react';
import { 
  calculateDobleCalculoPrestaciones, 
  calculateSalarioDiarioIntegral, 
  formatUSD, 
  formatVES 
} from '../utils/lotttCalculations';
import { 
  Calculator, 
  Scale, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface CalculatorModalProps {
  bcvRate: number;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ bcvRate }) => {
  const [salarioUSD, setSalarioUSD] = useState<number>(600);
  const [antiguedadAnios, setAntiguedadAnios] = useState<number>(3);
  const [antiguedadMeses, setAntiguedadMeses] = useState<number>(4);
  const [diasVacacionales, setDiasVacacionales] = useState<number>(18);
  const [diasUtilidades, setDiasUtilidades] = useState<number>(45);
  const [incluyeDoblete, setIncluyeDoblete] = useState<boolean>(true);

  const salarioVEF = salarioUSD * bcvRate;

  const result = calculateDobleCalculoPrestaciones(
    salarioVEF,
    antiguedadAnios,
    antiguedadMeses,
    diasVacacionales,
    diasUtilidades,
    incluyeDoblete
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header in Warm Pastel */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-mono font-bold">
            <Calculator className="w-4 h-4 text-amber-700" />
            <span>MOTOR FINANCIERO-LABORAL • LOTTT ARTÍCULO 142</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Calculadora de Salario Integral y Doble Cálculo de Prestaciones
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            Ejecuta de forma automatizada las fórmulas legales del Salario Diario Integral (Art. 104 y 122) y el procedimiento mandatario del 
            <strong> doble cómputo de prestaciones sociales</strong> (Garantía Trimestral vs Cómputo Retroactivo) con selección obligatoria del monto mayor (Art. 142 lit. d).
          </p>
        </div>
      </div>

      {/* Simulator Inputs & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 col: Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-700" />
            <span>Variables de Entrada</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Salario Base Mensual (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                <input
                  type="number"
                  step="25"
                  value={salarioUSD}
                  onChange={(e) => setSalarioUSD(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                Equivalente: {formatVES(salarioVEF)} a tasa BCV
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Años Servicio
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={antiguedadAnios}
                  onChange={(e) => setAntiguedadAnios(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 text-center focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Meses Fracción
                </label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={antiguedadMeses}
                  onChange={(e) => setAntiguedadMeses(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 text-center focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-medium">Días Bono Vacacional</label>
                <span className="text-[11px] text-amber-900 font-mono font-bold">{diasVacacionales} días</span>
              </div>
              <input
                type="range"
                min="15"
                max="30"
                value={diasVacacionales}
                onChange={(e) => setDiasVacacionales(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-500">Mínimo 15 días (+1 por año hasta 30)</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-medium">Días Utilidades (Beneficios)</label>
                <span className="text-[11px] text-amber-900 font-mono font-bold">{diasUtilidades} días</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                value={diasUtilidades}
                onChange={(e) => setDiasUtilidades(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-500">Art. 131 LOTTT: mín 15, máx 120 días</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="calcDoblete"
                  checked={incluyeDoblete}
                  onChange={(e) => setIncluyeDoblete(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="calcDoblete" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Indemnización Despido Injustificado (Art. 92 - "Doblete")
                </label>
              </div>
              <p className="text-[11px] text-slate-600 pl-6 mt-1">
                Suma una indemnización equivalente al 100% de las prestaciones sociales calculadas.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Mathematical Output */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Salario Diario Integral */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                1. Salario Diario Integral (Si = Sb + Avac + Autil)
              </span>
              <span className="font-mono text-base font-bold text-slate-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {formatVES(result.salarioDiarioIntegral)} / día
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-sans">Salario Base Diario (Sb):</span>
                <span className="text-slate-900 font-bold">{formatVES(result.salarioBaseDiario)}</span>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-sans">Alícuota Vacacional:</span>
                <span className="text-slate-900 font-bold">{formatVES(result.alicuotaDiariaBonoVacacional)}</span>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-sans">Alícuota Utilidades:</span>
                <span className="text-slate-900 font-bold">{formatVES(result.alicuotaDiariaUtilidades)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex items-center justify-between">
              <span>Cestaticket Ley ($40 BCV no salarial):</span>
              <span className="font-mono text-emerald-800 font-bold">{formatVES(result.cestaticketMensualVEF)} / mes</span>
            </div>
          </div>

          {/* Card 2: Comparativa Doble Cálculo Art. 142 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-700" />
                <span>2. Comparativa del Doble Cálculo (Artículo 142 LOTTT)</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                Aplica: {result.metodoMayor}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metodología 1 */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                result.metodoMayor.startsWith('Garantía')
                  ? 'bg-amber-50/80 border-amber-400 shadow-2xs'
                  : 'bg-[#FAF8F5] border-slate-200 opacity-80'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Garantía Trimestral</span>
                  <span className="text-[11px] font-mono text-amber-900 font-bold">{result.garantiaTrimestralDias} días</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  15 días/trimestre + 2 días adicionales/año a partir del 2° año (Art. 142 lit. a y b).
                </p>
                <div className="text-lg font-bold font-mono text-slate-900 pt-1">
                  {formatVES(result.garantiaTrimestralMonto)}
                </div>
              </div>

              {/* Metodología 2 */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                result.metodoMayor.startsWith('Cómputo')
                  ? 'bg-amber-50/80 border-amber-400 shadow-2xs'
                  : 'bg-[#FAF8F5] border-slate-200 opacity-80'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Cómputo Retroactivo</span>
                  <span className="text-[11px] font-mono text-amber-900 font-bold">{result.computoRetroactivoDias} días</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  30 días por año o fracción &gt; 6 meses al último salario integral devengado (Art. 142 lit. c).
                </p>
                <div className="text-lg font-bold font-mono text-slate-900 pt-1">
                  {formatVES(result.computoRetroactivoMonto)}
                </div>
              </div>
            </div>

            {/* Liquidación Final Consolidada */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Prestaciones Sociales (Mayor de ambos métodos):</span>
                <span className="font-mono text-slate-900 font-bold">{formatVES(result.prestacionesSocialesFinal)}</span>
              </div>

              {incluyeDoblete && (
                <div className="flex items-center justify-between text-rose-800 font-medium">
                  <span>Indemnización por Despido Injustificado (Art. 92 LOTTT):</span>
                  <span className="font-mono font-bold">+{formatVES(result.indemnizacionDespidoInjustificadoArt92)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900 uppercase tracking-wider">Total Liquidación Estimada:</span>
                <div className="text-right">
                  <div className="font-mono text-emerald-900 font-bold text-base">
                    {formatVES(result.totalConDoblete)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    ≈ {formatUSD(result.totalConDoblete / bcvRate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
