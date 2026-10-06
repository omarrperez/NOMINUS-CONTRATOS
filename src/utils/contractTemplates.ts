/**
 * Modelos Tipificados y Redacción Jurídica de Contratos Laborales en Venezuela
 * Conforme a la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT),
 * Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo (LOPCYMAT),
 * y Doctrina Vinculante de la Sala de Casación Social del Tribunal Supremo de Justicia (TSJ).
 */
import { LaborContract } from '../types/contract';
import { formatUSD, formatVES } from './lotttCalculations';

export function generateContractLegalText(c: LaborContract): string {
  const e = c.empresa;
  const t = c.trabajador;
  const r = c.remuneracion;

  const montoSalarioStr = r.tipoMoneda === 'USD_INDEXADO'
    ? `${formatUSD(r.salarioBaseMensualUSD)} pagaderos en Bolívares a la tasa oficial del Banco Central de Venezuela (BCV) del día de pago (referencial actual: ${formatVES(r.salarioBaseMensualVEF)})`
    : `${formatVES(r.salarioBaseMensualVEF)} mensuales`;

  // Si es modalidad de salario por unidad de obra o comisión (Arts. 114 y 115 LOTTT)
  if (c.clasificacion === 'unidad_obra' || r.esUnidadDeObra) {
    let text = `CONTRATO INDIVIDUAL DE TRABAJO A TIEMPO INDETERMINADO BAJO LA MODALIDAD DE SALARIO POR UNIDAD DE OBRA (COMISIÓN)\n`;
    text += `EXPEDIENTE DIGITAL N°: ${c.codigoExpediente}\n\n`;

    text += `Entre la sociedad mercantil ${e.denominacionSocial.toUpperCase()}, inscrita en el Registro de Información Fiscal (RIF) bajo el N° ${e.rif}, debidamente inscrita por ante el ${e.registroMercantil}, con domicilio fiscal en ${e.domicilioFiscal}, representada en este acto por su ${e.representanteCargo}, ciudadano(a) ${e.representanteNombre}, titular de la Cédula de Identidad N° ${e.representanteCI}, en adelante denominada «LA ENTIDAD DE TRABAJO», por una parte;\n\n`;

    text += `Y por la otra, el ciudadano(a) ${t.nombres.toUpperCase()} ${t.apellidos.toUpperCase()}, de nacionalidad ${t.nacionalidad}, mayor de edad (${t.edad} años), titular de la Cédula de Identidad N° ${t.cedula}, de profesión u oficio ${t.profesionOficio}, domiciliado(a) en ${t.direccionHabitacion}, en adelante denominado «EL TRABAJADOR», se ha convenido en celebrar el presente Contrato de Trabajo, contenido en las siguientes cláusulas:\n\n`;

    text += `PRIMERA (NATURALEZA Y DURACIÓN):\n`;
    text += `El presente contrato es a tiempo indeterminado, conforme a las previsiones del Artículo 61 de la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT), rigiéndose por el principio constitucional de estabilidad en el trabajo.\n\n`;

    text += `SEGUNDA (OBJETO Y CARGO):\n`;
    text += `EL TRABAJADOR desempeñará el cargo de ${c.cargo.toUpperCase()}, comprometiéndose a realizar las siguientes labores inherentes a la actividad:\n`;
    text += `${c.descripcionFunciones}\n\n`;

    text += `TERCERA (LUGAR DE PRESTACIÓN DEL SERVICIO):\n`;
    text += `EL TRABAJADOR prestará sus servicios en el establecimiento comercial de LA ENTIDAD DE TRABAJO, ubicado en: ${c.lugarPrestacion}. A todos los efectos de este contrato, las partes eligen como domicilio especial convenido la jurisdicción de los Tribunales del Trabajo de la Circunscripción Judicial de: ${c.domicilioEspecialConvenido} (Artículo 59 numeral 11 LOTTT).\n\n`;

    text += `CUARTA (JORNADA DE TRABAJO):\n`;
    text += `La jornada de trabajo será de conformidad con los Artículos 173 y 178 de la LOTTT: diurna, no excediendo de ocho (8) horas diarias ni de cuarenta (40) horas semanales, distribuida en el siguiente horario: ${c.horarioDetallado}, con una hora de descanso para el almuerzo no imputable a la jornada. EL TRABAJADOR disfrutará de dos (2) días continuos y remunerados de descanso semanal los días ${c.diasDescanso}.\n\n`;

    text += `QUINTA (REMUNERACIÓN POR UNIDAD DE OBRA / COMISIÓN):\n`;
    text += `De conformidad con los Artículos 114 y 115 de la LOTTT, la remuneración se estipula bajo la modalidad de salario por unidad de obra o comisión por servicio efectivamente prestado y cobrado, según el siguiente baremo y tarifas acordadas:\n`;
    if (r.tarifasComisionUnidadObra && r.tarifasComisionUnidadObra.length > 0) {
      r.tarifasComisionUnidadObra.forEach((t, i) => {
        text += `  ${String.fromCharCode(97 + i)}) ${t.servicio}: ${t.porcentajeOMonto}.\n`;
      });
    } else {
      text += `  a) Montaje, desmontaje y balanceo de neumático: 25% del valor facturado del servicio de mano de obra.\n`;
      text += `  b) Reparación de pinchazos y colocación de parches en caliente/frío: 30% del valor facturado del servicio.\n`;
      text += `  c) Alineación de dirección y balanceo computarizado: 25% del valor facturado del servicio.\n`;
      text += `  d) Mecánica ligera preventiva (cambio de aceite, filtros, frenos, bujías): 25% sobre la mano de obra neta facturada.\n`;
    }
    text += `La liquidación y pago de las comisiones devengadas se realizará de forma ${r.periodicidadPago.toUpperCase()}, ${r.diaPago}, ${r.lugarPago}, entregando al trabajador un estado de cuenta detallado de los servicios facturados y liquidados.\n\n`;

    text += `SEXTA (GARANTÍA LEGAL DE SALARIO MÍNIMO - ART. 115 LOTTT):\n`;
    text += `De estricta conformidad con el Artículo 115 de la LOTTT, LA ENTIDAD DE TRABAJO garantiza que el monto total de las comisiones devengadas por EL TRABAJADOR en una jornada normal de trabajo nunca será inferior al salario mínimo nacional vigente decretado por el Ejecutivo Nacional (calculado en proporción al período de pago). En caso de que por causas ajenas a la voluntad del trabajador el monto de las comisiones fuese inferior al salario mínimo legal, LA ENTIDAD DE TRABAJO liquidará obligatoriamente la diferencia hasta alcanzar el salario mínimo garantizado.\n\n`;

    text += `SÉPTIMA (PAGO DE DÍAS DE DESCANSO SEMANAL Y DÍAS FERIADOS - ART. 119 LOTTT):\n`;
    text += `Conforme al Artículo 119 de la LOTTT, el salario correspondiente a los dos (2) días de descanso semanal y a los días feriados o de fiesta nacional se liquidará y pagará calculando el promedio diario del salario devengado por concepto de comisiones durante los días laborados de la semana respectiva.\n\n`;

    text += `OCTAVA (BENEFICIO DE ALIMENTACIÓN - CESTATICKET SOCIALISTA):\n`;
    text += `EL TRABAJADOR percibirá mensualmente el beneficio social de alimentación Cestaticket Socialista por el monto fijado en la legislación vigente ($40,00 USD referenciales pagaderos en Bolívares a la tasa oficial del Banco Central de Venezuela, conforme al Decreto N° 4.805 y Artículo 105 de la LOTTT, actualmente equivalente a ${formatVES(r.cestaticketVEF)}), de carácter estricto no salarial y pagadero íntegramente con independencia del volumen de servicios o comisiones liquidadas durante el mes calendario.\n\n`;

    text += `NOVENA (SEGURIDAD Y SALUD LABORAL, EPP Y NOTIFICACIÓN DE RIESGOS - LOPCYMAT):\n`;
    text += `En cumplimiento de la LOPCYMAT y la Norma Técnica NT-04-2023, LA ENTIDAD DE TRABAJO notifica al TRABAJADOR los riesgos inherentes a las labores mecánicas y de taller: riesgos mecánicos (atrapamiento en desmontadora de cauchos, proyección de esquirlas y partículas durante esmerilado e inflado), riesgos físicos (ruido de compresores y pistolas neumáticas de impacto > 85 dBA), riesgos químicos (contacto dérmico con aceites de motor usados, lubricantes, solventes e hidrocarburos) y riesgos disergonómicos (manipulación de pesos y neumáticos pesados > 25 kg). LA ENTIDAD DE TRABAJO suministra sin costo alguno los Equipos de Protección Personal (EPP) obligatorios: botas de seguridad con puntera de acero/composite y suela antideslizante, lentes de seguridad con protección lateral anti-impacto (ANSI Z87.1), guantes de protección mecánica/nitrilo y protectores auditivos de alta atenuación (NRR ≥ 25 dB). EL TRABAJADOR se compromete a utilizarlos de forma obligatoria y a participar en las dieciséis (16) horas trimestrales de capacitación preventiva en SST.\n\n`;

    text += `DÉCIMA (IRRENUNCIABILIDAD, REGISTRO Y DOBLE EJEMPLAR):\n`;
    text += `Las partes reconocen el carácter de orden público e irrenunciable de los derechos consagrados en la LOTTT (Artículo 18). En cumplimiento taxativo del Artículo 59 numeral 14 de la LOTTT, el presente contrato se expide en dos (2) ejemplares de un mismo tenor y efecto legal probatorio, haciéndose entrega de un ejemplar original al TRABAJADOR y conservando LA ENTIDAD DE TRABAJO el segundo ejemplar para su expediente patronal.\n\n`;

    text += `Hecho y firmado en ${c.domicilioEspecialConvenido}, a los ${new Date(c.fechaInicioRelacion).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}.\n`;

    return text;
  }

  // Encabezado formal de contrato estándar
  let text = `CONTRATO DE TRABAJO A TIEMPO ${c.modalidad.toUpperCase()}\n`;
  text += `EXPEDIENTE DIGITAL N°: ${c.codigoExpediente}\n\n`;

  text += `Entre la sociedad mercantil ${e.denominacionSocial.toUpperCase()}, inscrita en el Registro de Información Fiscal (RIF) bajo el N° ${e.rif}, con domicilio fiscal en ${e.domicilioFiscal}, inscrita por ante el ${e.registroMercantil}, representada en este acto por su representante legal, ciudadano(a) ${e.representanteNombre}, venezolano(a), titular de la Cédula de Identidad N° ${e.representanteCI}, actuando en su carácter de ${e.representanteCargo}, quien en lo sucesivo y a los efectos del presente contrato se denominará "LA EMPRESA", por una parte;\n\n`;

  text += `Y por la otra, el ciudadano(a) ${t.nombres.toUpperCase()} ${t.apellidos.toUpperCase()}, de nacionalidad ${t.nacionalidad}, de ${t.edad} años de edad, de estado civil ${t.estadoCivil}, titular de la Cédula de Identidad N° ${t.cedula}, de profesión u oficio ${t.profesionOficio}, con domicilio y residencia habitual en ${t.direccionHabitacion}, quien en lo sucesivo se denominará "EL TRABAJADOR";\n\n`;

  text += `Se ha convenido en celebrar, como en efecto se celebra, el presente CONTRATO DE TRABAJO de conformidad con lo preceptuado en los Artículos 55, 58 y 59 de la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT), el cual se regirá por las siguientes cláusulas:\n\n`;

  // Cláusula Primera: Objeto y Cargo
  text += `CLÁUSULA PRIMERA (OBJETO Y DESIGNACIÓN DEL CARGO):\n`;
  text += `EL TRABAJADOR se compromete a prestar sus servicios personales y subordinados para LA EMPRESA, desempeñando el cargo de ${c.cargo.toUpperCase()}, ejerciendo las siguientes funciones y atribuciones inherentes a su posición:\n`;
  text += `${c.descripcionFunciones}\n\n`;

  // Cláusulas específicas según clasificación funcional
  if (c.clasificacion === 'direccion') {
    text += `PARÁGRAFO ESPECIAL (CALIFICACIÓN DE CARGO DE DIRECCIÓN Y EXENCIÓN DE JORNADA):\n`;
    text += `De conformidad con el Artículo 37 de la LOTTT, las partes declaran y reconocen expresamente que el cargo desempeñado por EL TRABAJADOR es considerado como TRABAJADOR DE DIRECCIÓN, en virtud de intervenir en las decisiones estratégicas de LA EMPRESA, representar a la misma ante terceros y detentar facultades jerárquicas de supervisión. En consecuencia, de conformidad con lo dispuesto en el Artículo 178 de la LOTTT, EL TRABAJADOR se encuentra legalmente EXCLUIDO de los límites de la jornada ordinaria de trabajo y de la remuneración por concepto de horas extraordinarias o días feriados no compensatorios.\n\n`;
  } else if (c.clasificacion === 'ventas' && r.esquemaMixto) {
    text += `PARÁGRAFO ESPECIAL (REMUNERACIÓN MIXTA Y COMISIONES SOBRE VENTAS - TSJ SENTENCIA 341):\n`;
    text += `Se establece que EL TRABAJADOR devengará una remuneración mixta compuesta por: a) Salario Base estipulado en este contrato; y b) Remuneración variable equivalente al ${r.porcentajeComisionVentas || 3}% sobre el monto neto efectivamente cobrado de las ventas facturadas y liquidadas directamente por el trabajador. Las partes convienen en acatamiento de la doctrina vinculante de la Sala de Casación Social del Tribunal Supremo de Justicia (Sentencia N° 341) que dicha comisión tiene carácter estrictamente salarial e integrará el Salario Normal y Salario Integral a todos los efectos legales de la LOTTT.\n\n`;
  } else if (c.clasificacion === 'profesional_independiente') {
    text += `PARÁGRAFO ESPECIAL (AUTONOMÍA FUNCIONAL Y NATURALEZA MERCANTIL - ART. 35/535 LOTTT):\n`;
    text += `Queda convenido que el prestador ejecutará sus labores técnicas con plena autonomía funcional, sin sujeción a subordinación jurídica laboral ni poder disciplinario, manteniendo la titularidad de sus propios medios e instrumentos de trabajo conforme a la legislación civil y mercantil.\n\n`;
  } else if (c.clasificacion === 'socio_trabajador') {
    text += `PARÁGRAFO ESPECIAL (DOBLE CONDICIÓN JURÍDICA DE SOCIO ACCIONISTA Y TRABAJADOR):\n`;
    text += `Las partes reconocen que la condición de accionista de EL TRABAJADOR no diluye ni extingue la relación de trabajo subordinada que nace del ejercicio efectivo de sus funciones operativas cotidianas. La remuneración aquí asignada posee carácter exclusivamente salarial y es jurídicamente independiente de los dividendos que le correspondan por concepto de su participación en el capital social mercantil.\n\n`;
  }

  // Cláusula Segunda: Duración y Modalidad
  text += `CLÁUSULA SEGUNDA (MODALIDAD CONTRACTUAL Y VIGENCIA):\n`;
  text += `La relación de trabajo regulada en el presente contrato se inicia el día ${c.fechaInicioRelacion}. `;
  if (c.modalidad === 'indeterminado') {
    text += `El presente contrato se celebra por TIEMPO INDETERMINADO conforme a la regla general establecida en el Artículo 61 de la LOTTT. `;
    if (c.incluyePeriodoPrueba) {
      text += `Se estipula un período inicial de prueba de ${c.diasPrueba || 90} días, lapso durante el cual las partes evaluarán la mutua conveniencia del vínculo sin perjuicio de los derechos salariales y de seguridad social devengados.\n\n`;
    } else {
      text += `\n\n`;
    }
  } else if (c.modalidad === 'determinado') {
    text += `El presente contrato se celebra por TIEMPO DETERMINADO de conformidad con los Artículos 62 y 64 de la LOTTT, fijándose su culminación el día ${c.fechaCulminacion || 'fecha fijada'}. `;
    text += `Las partes dejan expresa constancia de que la celebración a tiempo determinado se fundamenta en la causal taxativa del Artículo 64 literal ${c.causalArt64 === 'sustitucion_provisional' ? 'b) para sustituir provisional y legítimamente a un trabajador' : 'a) cuando lo exija la naturaleza del servicio'}: "${c.justificacionCausalArt64 || 'Actividades de naturaleza temporal expresamente justificadas'}". Las partes declaran conocer que, según el Artículo 62 de la LOTTT, este contrato no podrá prorrogarse en más de una ocasión sin que opere su conversión automática a contrato por tiempo indeterminado.\n\n`;
  } else {
    text += `El presente contrato se celebra PARA UNA OBRA DETERMINADA conforme al Artículo 63 de la LOTTT, finalizando de pleno derecho una vez concluida la totalidad de la parte que le corresponde al TRABAJADOR dentro del siguiente proyecto: "${c.descripcionObra || 'Obra técnica especificada'}".\n\n`;
  }

  // Cláusula Tercera: Lugar de Prestación y Fuero Territorial
  text += `CLÁUSULA TERCERA (LUGAR DE PRESTACIÓN DEL SERVICIO Y DOMICILIO ESPECIAL CONVENIDO):\n`;
  text += `EL TRABAJADOR prestará sus servicios principalmente en las instalaciones ubicadas en: ${c.lugarPrestacion}. `;
  text += `A todos los efectos derivados de este contrato, las partes eligen como domicilio especial convenido la jurisdicción de los Tribunales del Trabajo de la Circunscripción Judicial de: ${c.domicilioEspecialConvenido}, a cuya competencia territorial se someten expresamente con renuncia de cualquier otro fuero que pudiere corresponderles (Artículo 59, numeral 11 LOTTT).\n\n`;

  // Cláusula Cuarta: Jornada de Trabajo y Régimen de Descansos
  text += `CLÁUSULA CUARTA (JORNADA ORDINARIA DE TRABAJO Y DESCANSOS LEGALES):\n`;
  if (c.tipoJornada === 'Exenta_Direccion') {
    text += `En razón de su cargo de dirección calificado, EL TRABAJADOR no está sometido a las limitaciones de jornada máxima fijadas en la LOTTT (Artículo 178), programando sus actividades según las exigencias operativas y estratégicas de LA EMPRESA.\n\n`;
  } else {
    text += `La jornada de trabajo convenida es de carácter ${c.tipoJornada.toUpperCase()}, con un total de ${c.horasSemanales} horas semanales, distribuidas en el siguiente horario: ${c.horarioDetallado}. `;
    text += `EL TRABAJADOR disfrutará de dos (2) días continuos y remunerados de descanso semanal los días ${c.diasDescanso}, en estricto cumplimiento de los Artículos 173 y 176 de la LOTTT. Durante el tiempo intermedio destinado al descanso y alimentación (almuerzo), la prestación del servicio se considerará suspendida de conformidad con el Artículo 168 de la LOTTT.\n\n`;
  }

  // Cláusula Quinta: Estructura Remunerativa y Cestaticket
  text += `CLÁUSULA QUINTA (REMUNERACIÓN, PERIODICIDAD Y LUGAR DE PAGO):\n`;
  text += `Como contraprestación directa por la ejecución de sus servicios subordinados, LA EMPRESA pagará al TRABAJADOR un Salario Base Mensual de: ${montoSalarioStr}. `;
  text += `El pago se efectuará con periodicidad ${r.periodicidadPago.toUpperCase()}, ${r.diaPago}, ${r.lugarPago}.\n`;
  text += `PARÁGRAFO PRIMERO (CESTATICKET SOCIALISTA NO REMUNERATIVO): LA EMPRESA otorgará a favor del TRABAJADOR el beneficio de Cestaticket Socialista de alimentación por el monto fijado en la legislación nacional ($40,00 USD indexados a tasa BCV, equivalente a ${formatVES(r.cestaticketVEF)} a la presente fecha), de conformidad con el Decreto Presidencial N° 4.805 y el Artículo 105 de la LOTTT. Queda expresamente estipulado que dicho beneficio social NO posee carácter remunerativo ni salarial, liquidándose en recibo de pago independiente y no surtiendo incidencia sobre prestaciones sociales, vacaciones, utilidades ni indemnizaciones.\n`;
  text += `PARÁGRAFO SEGUNDO (SALARIO INTEGRAL Y ALÍCUOTAS LEGALES): A los efectos del cálculo de prestaciones sociales y demás indemnizaciones consagradas en los Artículos 104 y 122 de la LOTTT, se computarán anualmente un mínimo de ${r.diasBonoVacacional} días por concepto de bono vacacional y ${r.diasUtilidades} días por concepto de participación en los beneficios o utilidades líquidas.\n\n`;

  // Cláusula Sexta: Seguridad y Salud en el Trabajo (LOPCYMAT y NT-04-2023)
  text += `CLÁUSULA SEXTA (SEGURIDAD Y SALUD LABORAL - LOPCYMAT):\n`;
  text += `LA EMPRESA y EL TRABAJADOR declaran el estricto sometimiento a las disposiciones de la Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo (LOPCYMAT), su Reglamento y la Norma Técnica NT-04-2023. EL TRABAJADOR suscribe conjuntamente con este contrato la "Notificación de Riesgos Ocupacionales e Identificación de Procesos Peligrosos", obligándose al uso de los Equipos de Protección Personal (EPP) y a participar en las dieciséis (16) horas trimestrales de capacitación preventiva obligatoria en SST programadas por el Comité de Seguridad y Salud Laboral.\n`;
  if (c.lopcymat.clausulaArt168AlmuerzoTrayecto) {
    text += `PARÁGRAFO ESPECIAL (SUSPENSIÓN DE JORNADA EN ALMUERZO Y ACCIDENTE DE TRAYECTO): En aplicación del Artículo 168 de la LOTTT, se deja constancia de que durante la hora de almuerzo la relación se encuentra suspendida. Si EL TRABAJADOR decide salir de las instalaciones por decisión voluntaria, cualquier contingencia ocurrida durante dicho lapso queda desestimada como accidente de trayecto, salvo que el traslado sea suministrado directamente por transporte patronal.\n\n`;
  }

  // Cláusula Séptima: Irrenunciabilidad e Intangibilidad
  text += `CLÁUSULA SÉPTIMA (ORDEN PÚBLICO E IRRENUNCIABILIDAD DE DERECHOS):\n`;
  text += `El presente contrato se rige por las leyes vigentes de la República Bolivariana de Venezuela. Las partes reconocen la irrenunciabilidad e intangibilidad de los derechos laborales conforme al Artículo 89 de la Constitución y el Artículo 18 de la LOTTT. ${c.aplicaConvencionColectiva ? `Asimismo, se deja constancia de la aplicación de la Convención Colectiva de Trabajo: "${c.nombreConvencionColectiva}".` : 'No existe a la presente fecha convención colectiva aplicable a la entidad de trabajo.'}\n\n`;

  // Cláusula Octava: Doble Ejemplar y Firma
  text += `CLÁUSULA OCTAVA (DOBLE EJEMPLAR ORIGINAL Y CONSTANCIA DE ENTREGA):\n`;
  text += `En riguroso cumplimiento de lo dispuesto en el Artículo 59 numeral 14 de la LOTTT, el presente contrato se expide y formaliza en dos (2) ejemplares de un mismo tenor y a un solo efecto legal probatorio, haciéndose entrega material y digital en este acto de un (1) ejemplar debidamente suscrito al TRABAJADOR, conservando LA EMPRESA el segundo ejemplar para su archivo patronal.\n\n`;

  text += `Hecho y firmado en ${c.domicilioEspecialConvenido}, a los ${new Date(c.fechaInicioRelacion).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}.\n`;

  return text;
}

export function generateLopcymatNotificationText(c: LaborContract): string {
  const e = c.empresa;
  const t = c.trabajador;
  const lop = c.lopcymat;

  let text = `NOTIFICACIÓN ESCRITA DE RIESGOS OCUPACIONALES E IDENTIFICACIÓN DE PROCESOS PELIGROSOS\n`;
  text += `CUMPLIMIENTO DE LOS ARTÍCULOS 53, 56 Y 59 DE LA LOPCYMAT Y NORMA TÉCNICA NT-04-2023\n\n`;

  text += `ENTIDAD DE TRABAJO: ${e.denominacionSocial} | RIF: ${e.rif}\n`;
  text += `CENTRO DE TRABAJO / SEDE: ${c.lugarPrestacion}\n`;
  text += `TRABAJADOR: ${t.nombres} ${t.apellidos} | C.I.: ${t.cedula}\n`;
  text += `CARGO / PUESTO: ${c.cargo} (Clasificación: ${c.clasificacion.toUpperCase()})\n`;
  text += `FECHA DE NOTIFICACIÓN: ${lop.fechaNotificacion}\n\n`;

  text += `1. DECLARACIÓN FORMAL PREVIA AL INICIO DE LABORES:\n`;
  text += `En cumplimiento de los Artículos 53 numeral 1, 56 numerales 3 y 4 de la Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo (LOPCYMAT), LA EMPRESA notifica por escrito al TRABAJADOR, previo al inicio efectivo de la prestación de sus servicios, las condiciones inseguras, procesos peligrosos y riesgos inherentes a su puesto de trabajo, así como las medidas preventivas obligatorias y los Equipos de Protección Personal (EPP) que debe utilizar.\n\n`;

  text += `2. MATRIZ DE PROCESOS PELIGROSOS Y FACTORES DE RIESGO IDENTIFICADOS:\n`;
  text += `A) RIESGOS FÍSICOS:\n${lop.peligrosFisicos.map(p => `  • ${p}`).join('\n')}\n\n`;
  text += `B) RIESGOS QUÍMICOS:\n${lop.peligrosQuimicos.map(p => `  • ${p}`).join('\n')}\n\n`;
  text += `C) RIESGOS BIOLÓGICOS:\n${lop.peligrosBiologicos.map(p => `  • ${p}`).join('\n')}\n\n`;
  text += `D) RIESGOS DISERGONÓMICOS:\n${lop.peligrosDisergonomicos.map(p => `  • ${p}`).join('\n')}\n\n`;
  text += `E) RIESGOS PSICOSOCIALES:\n${lop.peligrosPsicosociales.map(p => `  • ${p}`).join('\n')}\n\n`;

  text += `3. MEDIDAS PREVENTIVAS Y PROTOCOLOS DE CONTROL:\n`;
  text += `${lop.medidasPreventivas.map(m => `  ✓ ${m}`).join('\n')}\n\n`;

  text += `4. EQUIPOS DE PROTECCIÓN PERSONAL (EPP) DE USO OBLIGATORIO:\n`;
  text += `${lop.eppRequeridos.map(e => `  [X] ${e}`).join('\n')}\n\n`;

  text += `5. PROGRAMA OBLIGATORIO DE CAPACITACIÓN EN SST (16 HORAS TRIMESTRALES):\n`;
  text += `Conforme a la NT-04-2023, EL TRABAJADOR se compromete a asistir con puntualidad a las dieciséis (16) horas trimestrales de capacitación obligatoria en Seguridad y Salud en el Trabajo impartidas por los Servicios de Seguridad y Salud en el Trabajo (SSST):\n`;
  text += `${lop.cronogramaCapacitacionSST.map(k => `  • ${k.tema} (${k.horas} hrs) - Estado: ${k.completado ? 'COMPLETADO' : 'PROGRAMADO'}`).join('\n')}\n\n`;

  text += `6. DECLARACIÓN DEL TRABAJADOR:\n`;
  text += `Yo, ${t.nombres} ${t.apellidos}, titular de la C.I. N° ${t.cedula}, declaro haber recibido de forma íntegra, antes de comenzar mis labores, la presente Notificación de Riesgos y los EPP descritos, comprendiendo las instrucciones de seguridad para el resguardo de mi salud e integridad física en el puesto de trabajo.\n`;

  return text;
}
