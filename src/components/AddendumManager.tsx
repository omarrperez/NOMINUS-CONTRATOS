import React, { useState } from 'react';
import { LaborContract, AddendumRecord, Company } from '../types/contract';
import { formatUSD, formatVES } from '../utils/lotttCalculations';
import { 
  Users, 
  CheckSquare, 
  Square, 
  FileSignature, 
  Printer, 
  CheckCircle2,
  Building2,
  Filter
} from 'lucide-react';

interface AddendumManagerProps {
  contracts: LaborContract[];
  onUpdateContracts: (updated: LaborContract[]) => void;
  bcvRate: number;
  companies?: Company[];
  selectedCompanyId?: string | 'all';
}

export const AddendumManager: React.FC<AddendumManagerProps> = ({
  contracts,
  onUpdateContracts,
  bcvRate,
  companies = [],
  selectedCompanyId = 'all'
}) => {
  const [filterCompany, setFilterCompany] = useState<string>(selectedCompanyId);

  const displayedContracts = filterCompany === 'all'
    ? contracts
    : contracts.filter(c => c.empresaId === filterCompany || c.empresa.rif === companies.find(x => x.id === filterCompany)?.rif);

  const [selectedContractIds, setSelectedContractIds] = useState<string[]>(
    displayedContracts.map(c => c.id)
  );
  const [percentageIncrease, setPercentageIncrease] = useState<number>(15);
  const [motivo, setMotivo] = useState<'Ajuste Salarial' | 'Cambio de Cargo' | 'Modificación de Jornada'>('Ajuste Salarial');
  const [fechaVigencia, setFechaVigencia] = useState<string>(new Date().toISOString().split('T')[0]);
  const [generatedAddendumsCount, setGeneratedAddendumsCount] = useState<number | null>(null);
  const [previewAddendumText, setPreviewAddendumText] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedContractIds.length === displayedContracts.length) {
      setSelectedContractIds([]);
    } else {
      setSelectedContractIds(displayedContracts.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedContractIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleApplyMassIncrease = () => {
    if (selectedContractIds.length === 0) return;

    const updatedContracts = contracts.map(c => {
      if (!selectedContractIds.includes(c.id)) return c;

      const salarioAnteriorVEF = c.remuneracion.salarioBaseMensualVEF;
      const salarioAnteriorUSD = c.remuneracion.salarioBaseMensualUSD;
      
      const multiplier = 1 + (percentageIncrease / 100);
      const salarioNuevoUSD = Math.round(salarioAnteriorUSD * multiplier);
      const salarioNuevoVEF = Math.round(salarioAnteriorVEF * multiplier);

      const nuevaAdenda: AddendumRecord = {
        id: `ADD-${Date.now()}-${c.id.slice(-4)}`,
        numeroAdenda: (c.historialAdendas?.length || 0) + 1,
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaVigencia,
        motivo,
        salarioAnteriorVEF,
        salarioNuevoVEF,
        salarioNuevoUSD,
        clausulasModificadas: `Cláusula Quinta (Remuneración): Incremento del ${percentageIncrease}% sobre salario base. Salario anterior: ${formatVES(salarioAnteriorVEF)} (${formatUSD(salarioAnteriorUSD)}). Nuevo salario: ${formatVES(salarioNuevoVEF)} (${formatUSD(salarioNuevoUSD)}). Se ratifica la fecha de ingreso originaria del ${c.fechaInicioRelacion} a los efectos del cálculo de la antigüedad.`
      };

      return {
        ...c,
        remuneracion: {
          ...c.remuneracion,
          salarioBaseMensualUSD: salarioNuevoUSD,
          salarioBaseMensualVEF: salarioNuevoVEF
        },
        historialAdendas: [...(c.historialAdendas || []), nuevaAdenda]
      };
    });

    onUpdateContracts(updatedContracts);
    setGeneratedAddendumsCount(selectedContractIds.length);

    const firstC = updatedContracts.find(c => selectedContractIds.includes(c.id));
    if (firstC && firstC.historialAdendas) {
      const ad = firstC.historialAdendas[firstC.historialAdendas.length - 1];
      setPreviewAddendumText(
        `ADDENDUM N° ${ad.numeroAdenda} AL CONTRATO DE TRABAJO\n` +
        `EXPEDIENTE DIGITAL: ${firstC.codigoExpediente}\n\n` +
        `Entre la empresa ${firstC.empresa.denominacionSocial} (RIF: ${firstC.empresa.rif}), y el trabajador ${firstC.trabajador.nombres} ${firstC.trabajador.apellidos} (C.I.: ${firstC.trabajador.cedula});\n\n` +
        `LAS PARTES ACUERDAN:\n` +
        `CLÁUSULA ÚNICA (ACTUALIZACIÓN SALARIAL CONSERVANDO ANTIGÜEDAD):\n` +
        `Con fecha de vigencia a partir del ${ad.fechaVigencia}, se incrementa el Salario Base Mensual del TRABAJADOR a la cantidad de ${formatUSD(ad.salarioNuevoUSD)} (equivalente a ${formatVES(ad.salarioNuevoVEF)} a la tasa BCV).\n` +
        `Las partes dejan expresa constancia de que el presente Addendum NO genera novación de la relación laboral, manteniéndose inalterable la fecha de inicio del vínculo fijada el ${firstC.fechaInicioRelacion}, computándose la antigüedad de forma continua conforme al Artículo 59 de la LOTTT.`
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header in Pastel */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-mono font-bold">
            <Users className="w-4 h-4 text-amber-700" />
            <span>MÓDULO DE GESTIÓN MASIVA DE ADENDAS SALARIALES (LOTTT ART. 59)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Actualización y Emisión Masiva de Addendums Laborales
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            Permite ajustar la remuneración de la plantilla ante variaciones de inflación o convenios colectivos, 
            <strong> preservando estrictamente la fecha de ingreso originaria</strong> y blindando la antigüedad prestacional acumulada conforme al mandato de la LOTTT.
          </p>
        </div>
      </div>

      {/* Control Panel in Pastel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          1. Parámetros del Ajuste Salarial
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Porcentaje de Incremento (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="1"
                max="300"
                value={percentageIncrease}
                onChange={(e) => setPercentageIncrease(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Motivo Legal de la Adenda *
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as any)}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="Ajuste Salarial">Ajuste Salarial por Inflación / Mérito</option>
              <option value="Cambio de Cargo">Ascenso o Reclasificación de Cargo</option>
              <option value="Modificación de Jornada">Modificación Acordada de Jornada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Fecha de Entrada en Vigencia *
            </label>
            <input
              type="date"
              value={fechaVigencia}
              onChange={(e) => setFechaVigencia(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Trabajadores seleccionados: <strong className="text-amber-900 font-mono">{selectedContractIds.length}</strong> de {contracts.length}
          </div>

          <button
            type="button"
            disabled={selectedContractIds.length === 0}
            onClick={handleApplyMassIncrease}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center gap-2 active:scale-95"
          >
            <FileSignature className="w-4 h-4" />
            <span>Generar y Aplicar Addendums ({percentageIncrease}%)</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {generatedAddendumsCount !== null && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-emerald-950">
              ¡Se generaron exitosamente {generatedAddendumsCount} Addendums de actualización salarial!
            </div>
            <p className="text-slate-600">
              Las fechas de ingreso originales y la antigüedad de todos los trabajadores permanecieron inalteradas.
            </p>
          </div>
        </div>
      )}

      {/* Preview Sheet */}
      {previewAddendumText && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 font-serif">
              Vista Previa del Addendum Generado (Ejemplo de Emisión)
            </span>
            <button
              onClick={() => window.print()}
              className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Modelo</span>
            </button>
          </div>
          <pre className="bg-[#FAF8F5] p-4 rounded-xl border border-slate-200 font-serif text-[12px] text-slate-800 whitespace-pre-line leading-relaxed">
            {previewAddendumText}
          </pre>
        </div>
      )}

      {/* Selection Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-amber-900"
            >
              {selectedContractIds.length === displayedContracts.length && displayedContracts.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-amber-700" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Seleccionar Todos ({displayedContracts.length})</span>
            </button>

            {companies.length > 0 && (
              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={filterCompany}
                  onChange={(e) => {
                    const newComp = e.target.value;
                    setFilterCompany(newComp);
                    const matching = newComp === 'all'
                      ? contracts
                      : contracts.filter(c => c.empresaId === newComp || c.empresa.rif === companies.find(x => x.id === newComp)?.rif);
                    setSelectedContractIds(matching.map(c => c.id));
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Todas las Empresas ({contracts.length})</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.alias || c.denominacionSocial} ({contracts.filter(x => x.empresaId === c.id || x.empresa.rif === c.rif).length})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <span className="text-xs text-slate-600 font-mono">Tasa BCV: Bs. {bcvRate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF8F5] text-slate-600 border-b border-slate-200 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-4 w-10"></th>
                <th className="py-2.5 px-4">Empresa / RIF</th>
                <th className="py-2.5 px-4">Trabajador / C.I.</th>
                <th className="py-2.5 px-4">Cargo Actual</th>
                <th className="py-2.5 px-4">Fecha Ingreso (Intacta)</th>
                <th className="py-2.5 px-4 font-mono">Salario Actual</th>
                <th className="py-2.5 px-4 font-mono text-emerald-800 font-bold">Nuevo Salario (+{percentageIncrease}%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedContracts.map(c => {
                const isSelected = selectedContractIds.includes(c.id);
                const currentUSD = c.remuneracion.salarioBaseMensualUSD;
                const newUSD = Math.round(currentUSD * (1 + percentageIncrease / 100));

                return (
                  <tr
                    key={c.id}
                    onClick={() => toggleSelectOne(c.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 truncate max-w-[140px]">
                        {c.empresa.alias || c.empresa.denominacionSocial}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{c.empresa.rif}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {c.trabajador.nombres} {c.trabajador.apellidos}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{c.trabajador.cedula}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      {c.cargo}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-900 font-semibold">
                      {c.fechaInicioRelacion}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium">
                      {formatUSD(currentUSD)}
                      <span className="text-[10px] text-slate-500 block">({formatVES(c.remuneracion.salarioBaseMensualVEF)})</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-900 font-bold">
                      {formatUSD(newUSD)}
                      <span className="text-[10px] text-emerald-700 block font-normal">({formatVES(newUSD * bcvRate)})</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
