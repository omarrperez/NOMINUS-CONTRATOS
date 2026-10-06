/**
 * Motor Financiero-Laboral NOMINUS CONTRATOS
 * Implementa las fórmulas matemáticas de la LOTTT y doctrina de la Sala de Casación Social del TSJ.
 */
import { LotttCalculationResult, RemunerationData } from '../types/contract';

export const CURRENT_DEFAULT_BCV_RATE = 48.75; // Tasa de cambio oficial referencial USD/VES
export const LEGAL_CESTATICKET_USD = 40.0;     // Decreto 4805 / Art. 105 LOTTT
export const LEGAL_SALARIO_MINIMO_BS = 130.06; // Salario mínimo nacional de referencia base

/**
 * Calcula el Salario Diario Integral (S_i) conforme a los Artículos 104 y 122 de la LOTTT
 */
export function calculateSalarioDiarioIntegral(
  salarioBaseMensual: number,
  diasBonoVacacional: number = 15,
  diasUtilidades: number = 15
): {
  salarioBaseDiario: number;
  alicuotaBonoVacacional: number;
  alicuotaUtilidades: number;
  salarioDiarioIntegral: number;
} {
  // Salario Base Diario (mes de 30 días laborales para cómputo de nómina)
  const salarioBaseDiario = salarioBaseMensual > 0 ? salarioBaseMensual / 30 : 0;
  
  // A_vac = (S_b * D_vac) / 360  (año comercial de 360 días)
  const alicuotaBonoVacacional = (salarioBaseDiario * diasBonoVacacional) / 360;
  
  // A_util = (S_b * D_util) / 360
  const alicuotaUtilidades = (salarioBaseDiario * diasUtilidades) / 360;
  
  // S_i = S_b + A_vac + A_util
  const salarioDiarioIntegral = salarioBaseDiario + alicuotaBonoVacacional + alicuotaUtilidades;
  
  return {
    salarioBaseDiario,
    alicuotaBonoVacacional,
    alicuotaUtilidades,
    salarioDiarioIntegral
  };
}

/**
 * Algoritmo del Doble Cálculo de Prestaciones Sociales (Artículo 142 LOTTT)
 * Compara Garantía Trimestral vs Cómputo Retroactivo (30 días/año a último salario)
 * y selecciona el mayor valor.
 */
export function calculateDobleCalculoPrestaciones(
  salarioBaseMensual: number,
  antiguedadAnios: number,
  antiguedadMesesFraccion: number,
  diasBonoVacacional: number = 15,
  diasUtilidades: number = 15,
  incluyeDobleteArt92: boolean = false
): LotttCalculationResult {
  const { salarioBaseDiario, alicuotaBonoVacacional, alicuotaUtilidades, salarioDiarioIntegral } =
    calculateSalarioDiarioIntegral(salarioBaseMensual, diasBonoVacacional, diasUtilidades);

  // Tiempo total en trimestres y años
  const trimestresCompletos = Math.floor(antiguedadAnios * 4 + antiguedadMesesFraccion / 3);
  
  // Metodología 1: Garantía Trimestral (Art. 142 lit. a y b)
  // 15 días por trimestre
  const diasGarantiaBase = trimestresCompletos * 15;
  // Días adicionales a partir del segundo año (2 días por año acumulable hasta 30)
  const aniosParaAdicionales = Math.max(0, antiguedadAnios - 1);
  const diasAdicionales = Math.min(30, aniosParaAdicionales * 2);
  const garantiaTrimestralDias = diasGarantiaBase + diasAdicionales;
  const garantiaTrimestralMonto = garantiaTrimestralDias * salarioDiarioIntegral;

  // Metodología 2: Cómputo Retroactivo (Art. 142 lit. c)
  // 30 días de salario integral por cada año de servicio o fracción superior a seis meses
  let aniosComputables = antiguedadAnios;
  if (antiguedadMesesFraccion > 6) {
    aniosComputables += 1;
  }
  // Si tiene menos de 3 meses, la LOTTT establece 15 días tras el primer mes
  const computoRetroactivoDias = Math.max(15, aniosComputables * 30);
  const computoRetroactivoMonto = computoRetroactivoDias * salarioDiarioIntegral;

  // Adjudicación del mayor conforme a Art. 142 lit. d
  const prestacionesSocialesFinal = Math.max(garantiaTrimestralMonto, computoRetroactivoMonto);
  const metodoMayor =
    garantiaTrimestralMonto >= computoRetroactivoMonto
      ? 'Garantía Trimestral (Art. 142 a,b)'
      : 'Cómputo Retroactivo (Art. 142 c)';

  // Indemnización Art. 92 (Doblete por despido injustificado o retiro justificado)
  const indemnizacionDespidoInjustificadoArt92 = incluyeDobleteArt92 ? prestacionesSocialesFinal : 0;
  const totalConDoblete = prestacionesSocialesFinal + indemnizacionDespidoInjustificadoArt92;

  // Cestaticket
  const cestaticketMensualUSD = LEGAL_CESTATICKET_USD;
  const cestaticketMensualVEF = LEGAL_CESTATICKET_USD * CURRENT_DEFAULT_BCV_RATE;
  
  const ingresoTotalMensualVEF = salarioBaseMensual + cestaticketMensualVEF;
  const ingresoTotalMensualUSD = (salarioBaseMensual / CURRENT_DEFAULT_BCV_RATE) + cestaticketMensualUSD;

  return {
    salarioBaseMensual,
    salarioBaseDiario,
    alicuotaDiariaBonoVacacional: alicuotaBonoVacacional,
    alicuotaDiariaUtilidades: alicuotaUtilidades,
    salarioDiarioIntegral,
    cestaticketMensualVEF,
    cestaticketMensualUSD,
    ingresoTotalMensualVEF,
    ingresoTotalMensualUSD,
    garantiaTrimestralDias,
    garantiaTrimestralMonto,
    computoRetroactivoDias,
    computoRetroactivoMonto,
    prestacionesSocialesFinal,
    metodoMayor,
    indemnizacionDespidoInjustificadoArt92,
    totalConDoblete
  };
}

/**
 * Validador Anti-Fraude de Salarización (Sentencia 341 Sala de Casación Social TSJ)
 * Detecta si asignaciones no salariales exceden umbrales legales o enmascaran remuneración ordinaria.
 */
export function validateSalarizacionRisk(remuneracion: Partial<RemunerationData>): {
  alertaRiesgo: boolean;
  nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO_BLOQUEANTE';
  mensaje: string;
  detalles: string[];
} {
  const detalles: string[] = [];
  let nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO_BLOQUEANTE' = 'BAJO';

  const baseMensual = remuneracion.salarioBaseMensualVEF || 0;
  const noSalarial = remuneracion.bonosNoSalarialesDeclarados || 0;

  if (remuneracion.esquemaMixto && (remuneracion.porcentajeComisionVentas || 0) > 0) {
    detalles.push(
      'Sentencia TSJ 341: Las comisiones sobre cobranza constituyen salario normal y deben integrar el cálculo del salario integral.'
    );
  }

  if (noSalarial > 0 && baseMensual > 0) {
    const proporcion = noSalarial / baseMensual;
    if (proporcion > 0.4) {
      nivelRiesgo = 'ALTO_BLOQUEANTE';
      detalles.push(
        `Las asignaciones "no salariales" representan el ${(proporcion * 100).toFixed(0)}% del salario base. Conforme a la Sentencia 341 del TSJ, los tribunales reclasificarán estos pagos como salariales con recargos indexados retroactivos.`
      );
    } else if (proporcion > 0.2) {
      nivelRiesgo = 'MEDIO';
      detalles.push(
        `Alerta preventiva: Se aconseja documentar exhaustivamente el soporte legal no remunerativo según el Art. 105 LOTTT para evitar presunción de fraude.`
      );
    }
  }

  return {
    alertaRiesgo: nivelRiesgo !== 'BAJO',
    nivelRiesgo,
    mensaje:
      nivelRiesgo === 'ALTO_BLOQUEANTE'
        ? 'Riesgo Crítico de Contingencia por Salarización Judicial (TSJ 341)'
        : nivelRiesgo === 'MEDIO'
        ? 'Alerta de Revisión de Asignaciones Complementarias'
        : 'Estructura salarial en cumplimiento normativo',
    detalles
  };
}

/**
 * Formateador de moneda en Bolívares (VES) y Dólares (USD)
 */
export function formatVES(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('VES', 'Bs.');
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
