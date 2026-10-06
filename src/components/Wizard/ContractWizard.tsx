import React, { useState } from 'react';
import { LaborContract, JobClassification, ContractModality, Company } from '../../types/contract';
import { DEFAULT_COMPANY, DEFAULT_COMPANIES } from '../../utils/defaultData';
import { getDefaultLopcymatData } from '../../utils/lopcymatData';
import { CURRENT_DEFAULT_BCV_RATE, LEGAL_CESTATICKET_USD } from '../../utils/lotttCalculations';
import { Phase1Modalidad } from './Phase1Modalidad';
import { Phase2Identificacion } from './Phase2Identificacion';
import { Phase3Remuneracion } from './Phase3Remuneracion';
import { Phase4Lopcymat } from './Phase4Lopcymat';
import { Phase5DualReview } from './Phase5DualReview';
import { Check, ChevronRight, X, Sparkles } from 'lucide-react';

interface ContractWizardProps {
  initialContract?: LaborContract | null;
  initialClassification?: JobClassification;
  initialModality?: ContractModality;
  onSaveContract: (contract: LaborContract) => void;
  onProceedToSign: (contract: LaborContract) => void;
  onCancel: () => void;
  bcvRate: number;
  totalContractsCount: number;
  companies?: Company[];
  selectedCompanyId?: string | 'all';
}

export const ContractWizard: React.FC<ContractWizardProps> = ({
  initialContract,
  initialClassification = 'administrativo',
  initialModality = 'indeterminado',
  onSaveContract,
  onProceedToSign,
  onCancel,
  bcvRate,
  totalContractsCount,
  companies = DEFAULT_COMPANIES,
  selectedCompanyId
}) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Initialize draft contract
  const [contract, setContract] = useState<LaborContract>(() => {
    if (initialContract) {
      return { ...initialContract };
    }
    const nextNum = (totalContractsCount + 1).toString().padStart(4, '0');
    const matchedCompany = selectedCompanyId && selectedCompanyId !== 'all'
      ? companies.find(c => c.id === selectedCompanyId) || companies[0]
      : companies[0] || DEFAULT_COMPANY;

    return {
      id: `contract-${Date.now()}`,
      codigoExpediente: `NOM-2026-${nextNum}`,
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaInicioRelacion: new Date().toISOString().split('T')[0],
      modalidad: initialModality,
      numeroProrroga: 0,
      cargo: initialClassification === 'direccion' ? 'Gerente General' : initialClassification === 'ventas' ? 'Ejecutivo de Ventas' : 'Asistente Administrativo',
      clasificacion: initialClassification,
      descripcionFunciones: 'Ejecución de actividades operativas y profesionales inherentes a su posición según instrucciones patronales.',
      lugarPrestacion: matchedCompany.domicilioFiscal ? `${matchedCompany.domicilioFiscal.split(',')[0]} - Sede Operativa` : 'Sede Principal Corporativa - Caracas, Venezuela',
      domicilioEspecialConvenido: 'Caracas, Distrito Capital',
      tipoJornada: initialClassification === 'direccion' ? 'Exenta_Direccion' : 'Diurna',
      horasSemanales: 40,
      horarioDetallado: 'Lunes a Viernes de 8:00 AM a 5:00 PM con 1 hora de descanso y alimentación',
      diasDescanso: 'Sábados y Domingos continuos',
      empresaId: matchedCompany.id || 'empresa-001',
      empresa: matchedCompany,
      trabajador: {
        nombres: '',
        apellidos: '',
        cedula: 'V-',
        nacionalidad: 'Venezolana',
        edad: 28,
        estadoCivil: 'Soltero(a)',
        profesionOficio: 'Profesional Universitario',
        direccionHabitacion: '',
        telefono: '+58 412-',
        correo: ''
      },
      remuneracion: {
        tipoMoneda: 'USD_INDEXADO',
        salarioBaseMensualUSD: 500,
        salarioBaseMensualVEF: 500 * bcvRate,
        tasaBCV: bcvRate,
        fechaTasaBCV: new Date().toISOString().split('T')[0],
        periodicidadPago: 'Quincenal',
        diaPago: 'los días 15 y último de cada mes',
        lugarPago: 'transferencia bancaria a cuenta nómina del trabajador',
        cestaticketUSD: LEGAL_CESTATICKET_USD,
        cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
        esquemaMixto: initialClassification === 'ventas',
        porcentajeComisionVentas: 3.5,
        diasBonoVacacional: 15,
        diasUtilidades: 30,
        bonosNoSalarialesDeclarados: 0,
        alertaRiesgoSalarizacion: false
      },
      aplicaConvencionColectiva: false,
      incluyePeriodoPrueba: initialModality === 'indeterminado',
      diasPrueba: 90,
      lopcymat: getDefaultLopcymatData(initialClassification),
      dobleEjemplarEmitido: true,
      constanciaEntregaFirmada: false,
      status: 'pendiente_firma'
    };
  });

  const updateContract = (fields: Partial<LaborContract>) => {
    setContract(prev => ({ ...prev, ...fields }));
  };

  const steps = [
    { num: 1, title: 'Modalidad LOTTT' },
    { num: 2, title: '14 Requisitos (Art. 59)' },
    { num: 3, title: 'Remuneración & TSJ 341' },
    { num: 4, title: 'SST LOPCYMAT' },
    { num: 5, title: 'Panel Dual & Emisión' }
  ];

  return (
    <div className="bg-white border border-amber-200/90 rounded-2xl overflow-hidden shadow-xs max-w-5xl mx-auto">
      {/* Wizard Header in Warm Pastel */}
      <div className="p-4 sm:p-5 border-b border-amber-200/70 flex items-center justify-between bg-gradient-to-r from-amber-50/90 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
              EXPEDIENTE {contract.codigoExpediente}
            </span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs text-slate-600 font-medium">LOTTT & LOPCYMAT</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 font-serif mt-0.5">
            Asistente de Contratación Laboral Asistido
          </h1>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Cancelar y volver al Dashboard"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Indicator Tabs in Pastel */}
      <div className="bg-[#FAF8F5] px-4 py-3 border-b border-amber-200/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[580px] gap-2">
          {steps.map((s, idx) => {
            const isCompleted = s.num < phase;
            const isCurrent = s.num === phase;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => s.num < phase && setPhase(s.num as any)}
                  className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${
                    isCurrent
                      ? 'text-amber-950 font-bold'
                      : isCompleted
                      ? 'text-emerald-800 hover:text-emerald-950'
                      : 'text-slate-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span>{s.title}</span>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Body in Light Pastel */}
      <div className="p-4 sm:p-6 bg-white">
        {phase === 1 && (
          <Phase1Modalidad
            contract={contract}
            updateContract={updateContract}
            onNext={() => setPhase(2)}
          />
        )}

        {phase === 2 && (
          <Phase2Identificacion
            contract={contract}
            updateContract={updateContract}
            onNext={() => setPhase(3)}
            onBack={() => setPhase(1)}
            companies={companies}
          />
        )}

        {phase === 3 && (
          <Phase3Remuneracion
            contract={contract}
            updateContract={updateContract}
            onNext={() => setPhase(4)}
            onBack={() => setPhase(2)}
            bcvRate={bcvRate}
          />
        )}

        {phase === 4 && (
          <Phase4Lopcymat
            contract={contract}
            updateContract={updateContract}
            onNext={() => setPhase(5)}
            onBack={() => setPhase(3)}
          />
        )}

        {phase === 5 && (
          <Phase5DualReview
            contract={contract}
            onSaveContract={onSaveContract}
            onProceedToSign={onProceedToSign}
            onBack={() => setPhase(4)}
          />
        )}
      </div>
    </div>
  );
};
