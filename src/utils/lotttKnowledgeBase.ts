/**
 * Base de Conocimiento Jurídico-Laboral de Venezuela (LOTTT, LOPCYMAT, TSJ)
 * Utilizada por el Asistente Virtual Consultor de Recursos Humanos de Nominus Contratos.
 */

export interface LotttArticle {
  numero: string;
  titulo: string;
  resumen: string;
  textoClave: string;
  implicacionPatronal: string;
  categoria: 'contratacion' | 'jornada' | 'salario' | 'prestaciones' | 'terminacion' | 'sst';
}

export const LOTTT_ARTICLES_CATALOG: LotttArticle[] = [
  {
    numero: 'Artículo 58',
    titulo: 'Presunción de la existencia de la relación de trabajo y condiciones alegadas',
    categoria: 'contratacion',
    resumen: 'A falta de contrato de trabajo escrito, se presumen ciertas todas las afirmaciones hechas por el trabajador sobre salario, fecha de ingreso y beneficios hasta que el patrono demuestre lo contrario.',
    textoClave: 'La relación de trabajo se presume entre quien preste un servicio personal y quien lo reciba. En caso de no existir contrato escrito, se presumirán ciertas, hasta prueba en contrario, todas las afirmaciones realizadas por el trabajador o trabajadora sobre su relación laboral.',
    implicacionPatronal: 'Invierte la carga de la prueba en juicio. Sin contrato firmado, el patrono pierde la presunción y queda expuesto a condenas de pasivos retroactivos.'
  },
  {
    numero: 'Artículo 59',
    titulo: 'Contenido obligatorio del contrato de trabajo (14 Requisitos Taxativos)',
    categoria: 'contratacion',
    resumen: 'Establece los catorce requisitos formales e indispensables que debe contener todo contrato de trabajo en Venezuela, incluyendo la expedición forzosa de dos (2) ejemplares originales.',
    textoClave: 'El contrato de trabajo se extenderá por escrito, en dos ejemplares de un mismo tenor, uno de los cuales se entregará inmediatamente al trabajador o trabajadora, y el otro quedará en poder del patrono o patrona...',
    implicacionPatronal: 'La omisión de cualquiera de los 14 requisitos o la no entrega del ejemplar firmado genera multas y nulidad de cláusulas restrictivas.'
  },
  {
    numero: 'Artículo 61',
    titulo: 'Contrato a tiempo indeterminado como principio general',
    categoria: 'contratacion',
    resumen: 'El contrato de trabajo se presume celebrado por tiempo indeterminado, consagrando el principio de estabilidad en el trabajo en Venezuela.',
    textoClave: 'El contrato de trabajo se considerará celebrado por tiempo indeterminado, cuando no aparezca expresada la voluntad de las partes de vincularse sólo con ocasión de una obra determinada o por tiempo determinado.',
    implicacionPatronal: 'Cualquier contrato que no fundamente adecuadamente una causal temporal válida será calificado judicialmente como tiempo indeterminado.'
  },
  {
    numero: 'Artículo 62',
    titulo: 'Contrato a tiempo determinado y límite estricto de prórrogas',
    categoria: 'contratacion',
    resumen: 'El contrato a tiempo determinado no puede exceder de un (1) año y no podrá prorrogarse más de una vez sin convertirse en indeterminado.',
    textoClave: 'El contrato celebrado por tiempo determinado no podrá prorrogarse más de una vez. Si vencido el término de la prórroga las partes continúan la prestación del servicio, la relación se considerará por tiempo indeterminado.',
    implicacionPatronal: 'Una segunda prórroga convierte automáticamente al trabajador en permanente con inamovilidad laboral absoluta.'
  },
  {
    numero: 'Artículo 64',
    titulo: 'Causales taxativas para la celebración de contratos a tiempo determinado',
    categoria: 'contratacion',
    resumen: 'Solo se permite contratar a tiempo determinado cuando lo exija la naturaleza temporal del servicio o para sustituir provisional y legítimamente a un trabajador.',
    textoClave: 'El contrato de trabajo, podrá celebrarse por tiempo determinado únicamente en los siguientes casos: a) Cuando lo exija la naturaleza del servicio; b) Cuando tenga por objeto sustituir provisional y legítimamente a un trabajador o trabajadora...',
    implicacionPatronal: 'Celebrar contratos temporales para labores permanentes u ordinarias es fraude de ley sancionable.'
  },
  {
    numero: 'Artículo 104',
    titulo: 'Definición de salario y salario integral',
    categoria: 'salario',
    resumen: 'Salario es toda remuneración, provecho o ventaja que percibe el trabajador por la prestación de sus servicios, incluyendo comisiones, primas y beneficios.',
    textoClave: 'Se entiende por salario la remuneración, provecho o ventaja, cualquiera fuere su denominación o método de cálculo, siempre que pueda evaluarse en moneda de curso legal, que corresponda al trabajador o trabajadora por la prestación de su servicio...',
    implicacionPatronal: 'Todo pago regular por servicios es salario con impacto en prestaciones sociales.'
  },
  {
    numero: 'Artículo 105',
    titulo: 'Beneficios sociales de carácter no remunerativo (Cestaticket)',
    categoria: 'salario',
    resumen: 'Beneficios que no tienen carácter salarial ni generan pasivo prestacional: servicios de comedor, Cestaticket Socialista, uniformes, gastos médicos y becas.',
    textoClave: 'Se entienden como beneficios sociales de carácter no remunerativo: 1. Los servicios de los comedores, provisión de alimentos en especie o mediante el beneficio social de alimentación (Cestaticket)...',
    implicacionPatronal: 'El Cestaticket de $40 USD (Decreto 4805) debe liquidarse en recibo de pago independiente y no impacta prestaciones sociales.'
  },
  {
    numero: 'Artículo 142',
    titulo: 'Algoritmo del doble cálculo de prestaciones sociales (Garantía vs Retroactivo)',
    categoria: 'prestaciones',
    resumen: 'El patrono deposita trimestralmente 15 días de salario integral (más días adicionales). Al finalizar la relación, se compara con 30 días por año al último salario y se paga el mayor.',
    textoClave: 'El patrono o patrona depositará a cada trabajador o trabajadora por concepto de garantía de las prestaciones sociales el equivalente a quince días cada trimestre... Al término de la relación laboral los cálculos se realizarán con base a treinta días por cada año o fracción superior a seis meses calculados al último salario integral devengado. El trabajador recibirá el monto que resulte mayor.',
    implicacionPatronal: 'Obliga a las empresas a provisionar la garantía trimestral y proyectar el impacto del salario final en el cómputo retroactivo.'
  },
  {
    numero: 'Artículo 168',
    titulo: 'Suspensión de la jornada durante el descanso y alimentación (Almuerzo)',
    categoria: 'jornada',
    resumen: 'Durante la hora de descanso y alimentación la relación laboral se encuentra legalmente suspendida.',
    textoClave: 'Durante los períodos de descanso y alimentación los trabajadores y trabajadoras tendrán derecho a suspender sus labores y a salir del lugar donde prestan sus servicios...',
    implicacionPatronal: 'Si el trabajador sale voluntariamente de la empresa a almorzar, los incidentes fuera de las instalaciones no constituyen accidentes de trayecto salvo transporte patronal.'
  },
  {
    numero: 'Artículo 173',
    titulo: 'Límites de la jornada ordinaria de trabajo',
    categoria: 'jornada',
    resumen: 'Tope máximo de 40 horas semanales para jornada diurna (8h diarias), 35 horas para nocturna y 37.5 horas para mixta, con dos (2) días continuos de descanso semanal remunerado.',
    textoClave: 'La jornada de trabajo no excederá de cinco días a la semana y el trabajador o trabajadora tendrá derecho a dos días de descanso, continuos y remunerados durante cada semana de labor.',
    implicacionPatronal: 'Superar 40 horas semanales genera recargo de horas extras (50% de recargo Art. 118) y sanciones de Inspectoría.'
  },
  {
    numero: 'Artículo 178',
    titulo: 'Exención de límites de jornada para trabajadores de dirección',
    categoria: 'jornada',
    resumen: 'Los trabajadores de dirección calificados según el Art. 37 están excluidos de las limitaciones de jornada máxima y del cobro de horas extras.',
    textoClave: 'No estarán sometidos a los límites establecidos para la jornada ordinaria de trabajo: 1. Los trabajadores o trabajadoras de dirección...',
    implicacionPatronal: 'Debe constar de forma expresa en el contrato escrito para ser oponible ante tribunales laborales.'
  },
  {
    numero: 'Artículo 114',
    titulo: 'Salario por unidad de obra, por pieza o a destajo (Comisión)',
    categoria: 'salario',
    resumen: 'Permite estipular el salario calculándolo en función del rendimiento, obra ejecutada o servicios prestados, siempre determinando el baremo aplicable.',
    textoClave: 'Se entenderá que el salario ha sido estipulado por unidad de obra, por pieza o a destajo, cuando se toma en cuenta la obra realizada por el trabajador, sin usar como medida el tiempo empleado para ejecutarla...',
    implicacionPatronal: 'Exige baremos claros y transparentes de tarifas y servicios para evitar litigios sobre liquidación de comisiones.'
  },
  {
    numero: 'Artículo 115',
    titulo: 'Garantía obligatoria de Salario Mínimo en salario por unidad de obra o comisión',
    categoria: 'salario',
    resumen: 'Cuando el salario se estipula a comisión o por obra, el patrono debe garantizar que lo devengado nunca sea inferior al salario mínimo nacional vigente.',
    textoClave: 'Cuando el salario se hubiere estipulado por unidad de obra, por pieza, a destajo, por tarea o a comisión, el patrono o patrona deberá garantizar al trabajador o trabajadora un ingreso que en ningún caso sea inferior al salario mínimo fijado por el Ejecutivo Nacional...',
    implicacionPatronal: 'Si en un período el trabajador no alcanza el salario mínimo por comisiones, el patrono debe completar la diferencia obligatoriamente.'
  },
  {
    numero: 'Artículo 119',
    titulo: 'Pago de días de descanso semanal y feriados con promedio en salario variable',
    categoria: 'salario',
    resumen: 'Los días de descanso semanal y días feriados deben pagarse obligatoriamente con el salario promedio devengado por el trabajador en los días laborados de la semana.',
    textoClave: 'El salario de los días de descanso y de los días feriados se pagará con el salario promedio devengado por el trabajador o trabajadora en los días laborados durante la semana respectiva...',
    implicacionPatronal: 'Prohibido omitir el pago de sábados/domingos a comisionistas; debe calcularse con el promedio semanal devengado.'
  }
];

export interface FaqItem {
  id: string;
  pregunta: string;
  respuestaCorta: string;
  respuestaDetallada: string;
  articulosRelacionados: string[];
  categoria: 'contratacion' | 'salarios' | 'despido' | 'lopcymat';
}

export const FAQS_RRHH_VENEZUELA: FaqItem[] = [
  {
    id: 'faq-1',
    pregunta: '¿Es legal fijar el salario en dólares (USD) en un contrato en Venezuela?',
    respuestaCorta: 'Sí, siempre que se pacte como moneda de cuenta indexada y se pague en Bolívares a la tasa oficial del BCV del día de pago.',
    respuestaDetallada: 'De conformidad con el Artículo 98 y 104 de la LOTTT en concordancia con el Convenio Cambiario N° 1 del BCV, es plenamente lícito referenciar el salario en divisas (USD o EUR) como unidad de cuenta. Sin embargo, para cumplir con el curso legal forzoso, el pago debe liquidarse en Bolívares a la tasa oficial publicada por el Banco Central de Venezuela correspondiente a la fecha efectiva de pago, reflejándose así en los recibos de nómina para evitar contingencias por fluctuación cambiaria.',
    articulosRelacionados: ['Artículo 98 LOTTT', 'Artículo 104 LOTTT', 'Convenio Cambiario N° 1 BCV'],
    categoria: 'salarios'
  },
  {
    id: 'faq-2',
    pregunta: '¿El Cestaticket Socialista forma parte del salario para el cálculo de prestaciones?',
    respuestaCorta: 'No. El Cestaticket tiene carácter estrictamente no remunerativo por mandato del Art. 105 LOTTT y Decreto 4805.',
    respuestaDetallada: 'El beneficio social de alimentación (Cestaticket Socialista) está tipificado en el Artículo 105 numeral 1 de la LOTTT y en el Decreto Presidencial N° 4.805 como un beneficio social no salarial. En consecuencia, su monto (fijado en el equivalente a $40 USD indexados al BCV) NO debe incluirse en la base de cálculo de prestaciones sociales, bono vacacional, utilidades, recargos nocturnos ni indemnizaciones por despido. Debe emitirse siempre en un comprobante o recibo separado de la nómina ordinaria.',
    articulosRelacionados: ['Artículo 105 LOTTT', 'Decreto Presidencial 4805'],
    categoria: 'salarios'
  },
  {
    id: 'faq-3',
    pregunta: '¿Qué sucede si renuevo un contrato a tiempo determinado por segunda vez?',
    respuestaCorta: 'Opera una conversión automática obligatoria a contrato por tiempo indeterminado (Art. 62 LOTTT).',
    respuestaDetallada: 'El Artículo 62 de la LOTTT es tajante: el contrato por tiempo determinado no puede prorrogarse más de una sola vez. Si las partes convienen una segunda prórroga o si vencida la primera el trabajador continúa prestando servicios, la ley presume de pleno derecho que la relación es por tiempo indeterminado desde la fecha originaria de inicio, gozando el trabajador de inamovilidad y estabilidad laboral plena.',
    articulosRelacionados: ['Artículo 61 LOTTT', 'Artículo 62 LOTTT', 'Artículo 64 LOTTT'],
    categoria: 'contratacion'
  },
  {
    id: 'faq-4',
    pregunta: '¿Qué consecuencias tiene no hacer la Notificación de Riesgos LOPCYMAT (NT-04-2023)?',
    respuestaCorta: 'Multas de 76 a 100 U.T. por trabajador expuesto y responsabilidad penal para la directiva en caso de accidentes mortales o graves.',
    respuestaDetallada: 'Los Artículos 53, 56 y 119 de la LOPCYMAT y la Norma Técnica NT-04-2023 obligan a notificar por escrito los procesos peligrosos al trabajador antes de iniciar labores. Omitir esta formalidad acarrea sanciones pecuniarias de hasta 100 Unidades Tributarias por cada trabajador sin notificación, además de habilitar la presunción de culpa patronal y responsabilidad penal de 8 a 10 años para directores o representantes en caso de accidentes de trabajo con consecuencias fatales o discapacidad permanente.',
    articulosRelacionados: ['Artículo 53 LOPCYMAT', 'Artículo 56 LOPCYMAT', 'Artículo 119 LOPCYMAT', 'Norma Técnica NT-04-2023'],
    categoria: 'lopcymat'
  },
  {
    id: 'faq-5',
    pregunta: '¿Cómo se aplica la doctrina de la Sentencia 341 del TSJ sobre comisiones y bonos de productividad?',
    respuestaCorta: 'Las comisiones y bonos regulares son salario normal obligatorio; intentar disfrazarlos de no salariales genera recálculo retroactivo.',
    respuestaDetallada: 'La Sala de Casación Social del TSJ (Sentencia N° 341) ratificó que todo incentivo, prima o comisión periódica pagada al trabajador por cumplimiento de metas o cobranza tiene carácter estrictamente salarial. Si una empresa clasifica estas sumas como "bonos no salariales" para evadir la carga prestacional, los tribunales laborales ordenan la salarización del concepto, con recálculo retroactivo de todas las incidencias de prestaciones, utilidades y vacaciones, más intereses moratorios e indexación judicial.',
    articulosRelacionados: ['Artículo 104 LOTTT', 'Sentencia TSJ Sala Social N° 341', 'Artículo 122 LOTTT'],
    categoria: 'salarios'
  },
  {
    id: 'faq-6',
    pregunta: '¿Es obligatorio entregar dos ejemplares originales del contrato de trabajo?',
    respuestaCorta: 'Sí, es un mandato legal estricto del Artículo 59 numeral 14 de la LOTTT.',
    respuestaDetallada: 'El patrono tiene la obligación legal ineludible de redactar el contrato en dos ejemplares de idéntico tenor, haciendo entrega inmediata y formal de un original firmado al trabajador y conservando el segundo ejemplar en el expediente patronal. La falta de entrega del ejemplar al trabajador faculta a este a invocar la presunción del Artículo 58 a su favor.',
    articulosRelacionados: ['Artículo 58 LOTTT', 'Artículo 59 Numeral 14 LOTTT'],
    categoria: 'contratacion'
  },
  {
    id: 'faq-7',
    pregunta: '¿Cómo contratar un técnico de cauchos o mecánico a comisión sin contingencia patrimonial?',
    respuestaCorta: 'Formalizarlo a Tiempo Indeterminado (Art. 61) bajo Salario por Unidad de Obra (Arts. 114 y 115) con garantía de salario mínimo y descansos pagados con promedio (Art. 119).',
    respuestaDetallada: 'Bajo el Art. 53 de la LOTTT, la prestación personal de servicios dentro de un taller hace presumir la relación de trabajo. Pretender pagar únicamente comisión sin contrato formal expone al patrono a demandas por prestaciones sociales retroactivas y multas. Para blindar la operación, se debe: 1) Celebrar contrato a Tiempo Indeterminado (Art. 61) a Salario por Unidad de Obra (Arts. 114-115); 2) Garantizar obligatoriamente que lo devengado nunca sea inferior al salario mínimo nacional (Art. 115); 3) Pagar los descansos semanales y feriados calculados con el promedio devengado en la semana (Art. 119); 4) Pagar Cestaticket de Ley íntegro ($40 tasa BCV); y 5) Notificar los riesgos de taller (mecánicos, ruido, hidrocarburos) y dotar EPP completo según la LOPCYMAT (NT-04-2023).',
    articulosRelacionados: ['Artículo 53 LOTTT', 'Artículo 61 LOTTT', 'Artículo 114 LOTTT', 'Artículo 115 LOTTT', 'Artículo 119 LOTTT', 'NT-04-2023'],
    categoria: 'salarios'
  }
];
