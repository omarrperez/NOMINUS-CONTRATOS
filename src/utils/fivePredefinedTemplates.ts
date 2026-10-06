import { Company, CompanyData, LaborContract, PredefinedTemplateId, PredefinedTemplateInfo } from '../types/contract';
import { DEFAULT_COMPANIES, DEFAULT_COMPANY } from './defaultData';
import { getDefaultLopcymatData } from './lopcymatData';
import { CURRENT_DEFAULT_BCV_RATE, LEGAL_CESTATICKET_USD } from './lotttCalculations';

export const FIVE_PREDEFINED_TEMPLATES_INFO: PredefinedTemplateInfo[] = [
  {
    id: 'asistente_administrativo',
    titulo: 'Asistente Administrativo',
    clasificacion: 'administrativo',
    modalidad: 'indeterminado',
    icono: 'FileSpreadsheet',
    salarioSugeridoUSD: 400,
    descripcionBreve: 'Gestión documental, archivo, atención a proveedores, compras menores y soporte a gerencias.',
    caracteristicasClave: [
      'Jornada Diurna 40h (L-V 8:00 AM - 5:00 PM)',
      'Ergonomía de puestos con Pantallas PVD',
      'Cestaticket $40 BCV no remunerativo',
      'Período de prueba de 90 días'
    ],
    clausulaEspecialLOTTT: 'Cláusula de Confidencialidad y Manejo de Información Operativa Interna.'
  },
  {
    id: 'tecnico_mantenimiento',
    titulo: 'Técnico de Mantenimiento',
    clasificacion: 'operativo',
    modalidad: 'indeterminado',
    icono: 'Wrench',
    salarioSugeridoUSD: 500,
    descripcionBreve: 'Mantenimiento preventivo/correctivo de maquinaria, sistemas eléctricos y climatización.',
    caracteristicasClave: [
      'Jornada 40h semanales con 2 días continuos',
      'Procedimiento LOTO y seguridad eléctrica',
      'Dotación patronal de herramientas y EPP',
      'Deslinde de accidente en almuerzo (Art. 168)'
    ],
    clausulaEspecialLOTTT: 'Cláusula de Uso Obligatorio de EPP, Matriz NT-04-2023 y Suspensión de Jornada en Almuerzo (Art. 168 LOTTT).'
  },
  {
    id: 'gerente_ventas',
    titulo: 'Gerente de Ventas',
    clasificacion: 'direccion',
    modalidad: 'indeterminado',
    icono: 'TrendingUp',
    salarioSugeridoUSD: 1400,
    descripcionBreve: 'Liderazgo de fuerza comercial, fijación de cuotas, cobranza efectiva y metas regionales.',
    caracteristicasClave: [
      'Calificación como Personal de Dirección (Art. 37)',
      'Exención de límites de jornada (Art. 178)',
      'Remuneración mixta con comisiones (TSJ 341)',
      'Vehículo y gastos operativos comerciales'
    ],
    clausulaEspecialLOTTT: 'Parágrafo Especial de Calificación de Cargo de Dirección (Art. 37/178 LOTTT) y Comisiones Salariales (TSJ Sentencia 341).'
  },
  {
    id: 'analista_nomina',
    titulo: 'Analista de Nómina',
    clasificacion: 'administrativo',
    modalidad: 'indeterminado',
    icono: 'Calculator',
    salarioSugeridoUSD: 650,
    descripcionBreve: 'Procesamiento de nómina, Cestaticket, retenciones IVSS/INCES/BANAVIH y pasivos LOTTT Art. 142.',
    caracteristicasClave: [
      'Jornada Diurna 40h con descanso legal',
      'Responsabilidad en declaraciones RNET y Tiuna',
      'Cálculo de alícuotas vacacionales y utilidades',
      'Confidencialidad rigurosa de salarios'
    ],
    clausulaEspecialLOTTT: 'Cláusula Reforzada de Secreto Profesional, Confidencialidad Salarial y Fidelidad de Datos (Art. 84 LOTTT).'
  },
  {
    id: 'personal_limpieza',
    titulo: 'Personal de Limpieza y Mantenimiento',
    clasificacion: 'operativo',
    modalidad: 'indeterminado',
    icono: 'Sparkles',
    salarioSugeridoUSD: 300,
    descripcionBreve: 'Limpieza, desinfección, orden de oficinas, manejo de químicos de aseo y residuos.',
    caracteristicasClave: [
      'Jornada Diurna 40h semanales',
      'EPP obligatorio contra químicos y resbalones',
      'Hojas de Seguridad de Químicos (MSDS)',
      'Cestaticket de Ley $40 tasa BCV'
    ],
    clausulaEspecialLOTTT: 'Protocolo de Seguridad LOPCYMAT para Manipulación de Sustancias Químicas de Aseo y Dotación de Calzado Antideslizante.'
  },
  {
    id: 'unidad_obra_cauchero',
    titulo: 'Técnico Operador / Cauchero y Mecánico Ligero',
    clasificacion: 'unidad_obra',
    modalidad: 'indeterminado',
    icono: 'Wrench',
    salarioSugeridoUSD: 450,
    descripcionBreve: 'Montaje, desmontaje, balanceo, parches y mecánica ligera con salario a comisión/unidad de obra y garantía de salario mínimo legal.',
    caracteristicasClave: [
      'Salario por Unidad de Obra / Comisión (Arts. 114-115)',
      'Garantía obligatoria de Salario Mínimo Nacional (Art. 115)',
      'Descanso semanal y feriados con promedio (Art. 119)',
      'Riesgos Mecánicos, Ruido, Hidrocarburos y EPP (NT-04-2023)'
    ],
    clausulaEspecialLOTTT: 'Contrato a Tiempo Indeterminado a Comisión (Arts. 114 y 115 LOTTT), Garantía de Salario Mínimo, Descansos con Promedio Semanal (Art. 119) y Prevención LOPCYMAT.'
  }
];

export const PREDEFINED_TEMPLATES_INFO = FIVE_PREDEFINED_TEMPLATES_INFO;

export function createContractFromPredefinedTemplate(
  templateId: PredefinedTemplateId,
  bcvRate: number = CURRENT_DEFAULT_BCV_RATE,
  existingContractsCount: number = 0,
  company?: Company | CompanyData
): LaborContract {
  const codeNum = (existingContractsCount + 1).toString().padStart(4, '0');
  const today = new Date().toISOString().split('T')[0];

  // Determinar empresa por defecto según especialidad si no se suministra una
  const getCompanyForTemplate = (defaultIndex: number): CompanyData => {
    if (company) return { ...company };
    return { ...DEFAULT_COMPANIES[defaultIndex] };
  };

  switch (templateId) {
    case 'asistente_administrativo': {
      const baseUSD = 400;
      const targetCompany = getCompanyForTemplate(0);
      return {
        id: `contract-tpl-${Date.now()}`,
        codigoExpediente: `NOM-ADM-${codeNum}`,
        fechaCreacion: today,
        fechaInicioRelacion: today,
        modalidad: 'indeterminado',
        numeroProrroga: 0,
        cargo: 'Asistente Administrativo',
        clasificacion: 'administrativo',
        descripcionFunciones: 'Atención a usuarios y proveedores; redacción, archivo y control de correspondencia física y digital; apoyo en facturación y órdenes de compra; control de inventario de suministros de oficina; gestión de pagos a proveedores y soporte general a la Gerencia Administrativa.',
        lugarPrestacion: 'Sede Principal Corporativa - Oficinas Administrativas',
        domicilioEspecialConvenido: 'Caracas, Distrito Capital',
        tipoJornada: 'Diurna',
        horasSemanales: 40,
        horarioDetallado: 'Lunes a Viernes de 8:00 AM a 5:00 PM con 1 hora diaria para descanso y comida (almuerzo)',
        diasDescanso: 'Sábados y Domingos continuos',
        empresaId: targetCompany.id || 'empresa-001',
        empresa: targetCompany,
        trabajador: {
          nombres: 'María Gabriela',
          apellidos: 'Herrera Blanco',
          cedula: 'V-24.321.890',
          nacionalidad: 'Venezolana',
          edad: 26,
          estadoCivil: 'Soltero(a)',
          profesionOficio: 'T.S.U. en Administración de Empresas',
          direccionHabitacion: 'Av. Rómulo Gallegos, Res. El Parque, Piso 7, Dos Caminos, Caracas',
          telefono: '+58 412-3344556',
          correo: 'maria.herrera@email.com'
        },
        remuneracion: {
          tipoMoneda: 'USD_INDEXADO',
          salarioBaseMensualUSD: baseUSD,
          salarioBaseMensualVEF: baseUSD * bcvRate,
          tasaBCV: bcvRate,
          fechaTasaBCV: today,
          periodicidadPago: 'Quincenal',
          diaPago: 'los días 15 y último de cada mes',
          lugarPago: 'transferencia bancaria electrónica a cuenta nómina',
          cestaticketUSD: LEGAL_CESTATICKET_USD,
          cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
          esquemaMixto: false,
          diasBonoVacacional: 15,
          diasUtilidades: 30,
          bonosNoSalarialesDeclarados: 0,
          alertaRiesgoSalarizacion: false
        },
        aplicaConvencionColectiva: false,
        incluyePeriodoPrueba: true,
        diasPrueba: 90,
        lopcymat: {
          ...getDefaultLopcymatData('administrativo'),
          horasCapacitacionTrimestralesCompletadas: 8
        },
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: false,
        status: 'pendiente_firma'
      };
    }

    case 'tecnico_mantenimiento': {
      const baseUSD = 500;
      const targetCompany = getCompanyForTemplate(0);
      return {
        id: `contract-tpl-${Date.now()}`,
        codigoExpediente: `NOM-TEC-${codeNum}`,
        fechaCreacion: today,
        fechaInicioRelacion: today,
        modalidad: 'indeterminado',
        numeroProrroga: 0,
        cargo: 'Técnico de Mantenimiento Integral y Electromecánico',
        clasificacion: 'operativo',
        descripcionFunciones: 'Ejecución de planes de mantenimiento preventivo y correctivo de instalaciones; reparación y chequeo de sistemas de climatización (A/A), grupos electrógenos, tableros de distribución eléctrica y bombas hidroneumáticas; aplicación rigurosa de protocolos de Bloqueo y Etiquetado (LOTO); reporte técnico de incidencias.',
        lugarPrestacion: 'Sede Operativa y Talleres de Mantenimiento',
        domicilioEspecialConvenido: 'Caracas, Distrito Capital',
        tipoJornada: 'Diurna',
        horasSemanales: 40,
        horarioDetallado: 'Lunes a Viernes de 7:30 AM a 4:30 PM con 1 hora para descanso y alimentación',
        diasDescanso: 'Sábados y Domingos continuos',
        empresaId: targetCompany.id || 'empresa-001',
        empresa: targetCompany,
        trabajador: {
          nombres: 'Héctor Ramón',
          apellidos: 'Camacho Briceño',
          cedula: 'V-18.765.432',
          nacionalidad: 'Venezolana',
          edad: 34,
          estadoCivil: 'Casado(a)',
          profesionOficio: 'Técnico Medio Industrial Electromecánico',
          direccionHabitacion: 'Sector La California Norte, Calle Madrid, Edif. Orinoco, Apto 2-A, Caracas',
          telefono: '+58 414-9988771',
          correo: 'hector.camacho@email.com'
        },
        remuneracion: {
          tipoMoneda: 'USD_INDEXADO',
          salarioBaseMensualUSD: baseUSD,
          salarioBaseMensualVEF: baseUSD * bcvRate,
          tasaBCV: bcvRate,
          fechaTasaBCV: today,
          periodicidadPago: 'Quincenal',
          diaPago: 'los días 15 y último de cada mes',
          lugarPago: 'depósito en cuenta bancaria nómina',
          cestaticketUSD: LEGAL_CESTATICKET_USD,
          cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
          esquemaMixto: false,
          diasBonoVacacional: 15,
          diasUtilidades: 30,
          bonosNoSalarialesDeclarados: 0,
          alertaRiesgoSalarizacion: false
        },
        aplicaConvencionColectiva: false,
        incluyePeriodoPrueba: true,
        diasPrueba: 90,
        lopcymat: {
          ...getDefaultLopcymatData('operativo'),
          horasCapacitacionTrimestralesCompletadas: 12
        },
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: false,
        status: 'pendiente_firma'
      };
    }

    case 'gerente_ventas': {
      const baseUSD = 1400;
      const targetCompany = getCompanyForTemplate(2); // Distribuidora Caracas
      return {
        id: `contract-tpl-${Date.now()}`,
        codigoExpediente: `NOM-DIR-${codeNum}`,
        fechaCreacion: today,
        fechaInicioRelacion: today,
        modalidad: 'indeterminado',
        numeroProrroga: 0,
        cargo: 'Gerente de Ventas y Desarrollo Comercial',
        clasificacion: 'direccion',
        descripcionFunciones: 'Dirección, supervisión y coordinación de la fuerza comercial y representantes de ventas; diseño y ejecución de estrategias de posicionamiento; prospección y cierre de acuerdos corporativos de alto valor; fijación y evaluación de metas comerciales; control de cobranza efectiva e informes directos a la Junta Directiva.',
        lugarPrestacion: 'Sede Principal Corporativa con desplazamientos en territorio nacional',
        domicilioEspecialConvenido: 'Caracas, Distrito Capital',
        tipoJornada: 'Exenta_Direccion',
        horasSemanales: 40,
        horarioDetallado: 'Sin sujeción a horario ordinario de conformidad con el Artículo 178 de la LOTTT',
        diasDescanso: 'Sábados y Domingos continuos',
        empresaId: targetCompany.id || 'empresa-003',
        empresa: targetCompany,
        trabajador: {
          nombres: 'Eduardo Andrés',
          apellidos: 'Ponte Villegas',
          cedula: 'V-15.890.123',
          nacionalidad: 'Venezolana',
          edad: 41,
          estadoCivil: 'Casado(a)',
          profesionOficio: 'Licenciado en Administración y Especialista en Gerencia de Mercadeo',
          direccionHabitacion: 'Urb. Prados del Este, Calle El Morro, Qta. Los Laureles, Baruta, Edo. Miranda',
          telefono: '+58 412-9900112',
          correo: 'eduardo.ponte@email.com'
        },
        remuneracion: {
          tipoMoneda: 'USD_INDEXADO',
          salarioBaseMensualUSD: baseUSD,
          salarioBaseMensualVEF: baseUSD * bcvRate,
          tasaBCV: bcvRate,
          fechaTasaBCV: today,
          periodicidadPago: 'Quincenal',
          diaPago: 'los días 15 y último de cada mes',
          lugarPago: 'transferencia bancaria a cuenta autorizada',
          cestaticketUSD: LEGAL_CESTATICKET_USD,
          cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
          esquemaMixto: true,
          porcentajeComisionVentas: 2.5,
          baseComisionDescripcion: 'sobre el monto neto de cobranza efectiva (Sentencia TSJ 341)',
          diasBonoVacacional: 20,
          diasUtilidades: 60,
          bonosNoSalarialesDeclarados: 0,
          alertaRiesgoSalarizacion: false
        },
        aplicaConvencionColectiva: false,
        incluyePeriodoPrueba: false,
        lopcymat: {
          ...getDefaultLopcymatData('direccion'),
          horasCapacitacionTrimestralesCompletadas: 16
        },
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: false,
        status: 'pendiente_firma'
      };
    }

    case 'analista_nomina': {
      const baseUSD = 600;
      const targetCompany = getCompanyForTemplate(3); // Salud Ocupacional & Nómina
      return {
        id: `contract-tpl-${Date.now()}`,
        codigoExpediente: `NOM-NOM-${codeNum}`,
        fechaCreacion: today,
        fechaInicioRelacion: today,
        modalidad: 'indeterminado',
        numeroProrroga: 0,
        cargo: 'Analista de Nómina y Compensación Laboral',
        clasificacion: 'administrativo',
        descripcionFunciones: 'Cálculo, procesamiento y validación de las nóminas quincenales; cómputo de recargos por horas extraordinarias, días feriados y turnos nocturnos; liquidación del Cestaticket Socialista; gestión de retenciones y aportes patronales ante el IVSS (Sistema Tiuna), INCES y BANAVIH (FAOV); liquidación de prestaciones sociales (Art. 142 LOTTT), vacaciones y utilidades; estricta custodia de la confidencialidad de la información salarial.',
        lugarPrestacion: 'Sede Principal - Departamento de Gestión Humana',
        domicilioEspecialConvenido: 'Caracas, Distrito Capital',
        tipoJornada: 'Diurna',
        horasSemanales: 40,
        horarioDetallado: 'Lunes a Viernes de 8:00 AM a 5:00 PM con 1 hora de descanso y comida',
        diasDescanso: 'Sábados y Domingos continuos',
        empresaId: targetCompany.id || 'empresa-004',
        empresa: targetCompany,
        trabajador: {
          nombres: 'Mariangel',
          apellidos: 'Castillo Quintero',
          cedula: 'V-21.456.789',
          nacionalidad: 'Venezolana',
          edad: 29,
          estadoCivil: 'Soltero(a)',
          profesionOficio: 'Licenciada en Relaciones Industriales / RRHH',
          direccionHabitacion: 'Av. Casanova, Res. Las Américas, Torre B, Sabana Grande, Caracas',
          telefono: '+58 416-7788990',
          correo: 'mariangel.castillo@email.com'
        },
        remuneracion: {
          tipoMoneda: 'USD_INDEXADO',
          salarioBaseMensualUSD: baseUSD,
          salarioBaseMensualVEF: baseUSD * bcvRate,
          tasaBCV: bcvRate,
          fechaTasaBCV: today,
          periodicidadPago: 'Quincenal',
          diaPago: 'los días 15 y último de cada mes',
          lugarPago: 'transferencia en cuenta nómina',
          cestaticketUSD: LEGAL_CESTATICKET_USD,
          cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
          esquemaMixto: false,
          diasBonoVacacional: 15,
          diasUtilidades: 45,
          bonosNoSalarialesDeclarados: 0,
          alertaRiesgoSalarizacion: false
        },
        aplicaConvencionColectiva: false,
        incluyePeriodoPrueba: true,
        diasPrueba: 90,
        lopcymat: {
          ...getDefaultLopcymatData('administrativo'),
          horasCapacitacionTrimestralesCompletadas: 16
        },
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: false,
        status: 'pendiente_firma'
      };
    }

    case 'personal_limpieza': {
      const baseUSD = 350;
      const targetCompany = getCompanyForTemplate(2); // Distribuidora Alimentos Caracas
      return {
        id: `contract-tpl-${Date.now()}`,
        codigoExpediente: `NOM-SER-${codeNum}`,
        fechaCreacion: today,
        fechaInicioRelacion: today,
        modalidad: 'indeterminado',
        numeroProrroga: 0,
        cargo: 'Auxiliar de Limpieza, Servicios Generales y Mantenimiento de Instalaciones',
        clasificacion: 'operativo',
        descripcionFunciones: 'Ejecución de labores diarias de aseo, higienización y desinfección de oficinas, áreas de atención al público, salas de conferencias, comedores y servicios sanitarios; manipulación segura de insumos químicos de limpieza siguiendo las Hojas de Seguridad (MSDS); recolección y clasificación de desechos sólidos; custodia y uso responsable de los materiales y equipos de limpieza.',
        lugarPrestacion: 'Sede Operativa y Edificio de Oficinas',
        domicilioEspecialConvenido: 'Caracas, Distrito Capital',
        tipoJornada: 'Diurna',
        horasSemanales: 40,
        horarioDetallado: 'Lunes a Viernes de 7:00 AM a 4:00 PM con 1 hora para descanso y almuerzo',
        diasDescanso: 'Sábados y Domingos continuos',
        empresaId: targetCompany.id || 'empresa-003',
        empresa: targetCompany,
        trabajador: {
          nombres: 'Rosa Elena',
          apellidos: 'Gutiérrez Rondón',
          cedula: 'V-17.654.321',
          nacionalidad: 'Venezolana',
          edad: 37,
          estadoCivil: 'Unión Estable de Hecho',
          profesionOficio: 'Auxiliar de Servicios Generales y Mantenimiento',
          direccionHabitacion: 'Barrio Unión, Sector El Carmen, Casa N° 12, Petare, Estado Miranda',
          telefono: '+58 424-5566778',
          correo: 'rosa.gutierrez@email.com'
        },
        remuneracion: {
          tipoMoneda: 'USD_INDEXADO',
          salarioBaseMensualUSD: baseUSD,
          salarioBaseMensualVEF: baseUSD * bcvRate,
          tasaBCV: bcvRate,
          fechaTasaBCV: today,
          periodicidadPago: 'Quincenal',
          diaPago: 'los días 15 y último de cada mes',
          lugarPago: 'depósito nómina en cuenta bancaria',
          cestaticketUSD: LEGAL_CESTATICKET_USD,
          cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
          esquemaMixto: false,
          diasBonoVacacional: 15,
          diasUtilidades: 30,
          bonosNoSalarialesDeclarados: 0,
          alertaRiesgoSalarizacion: false
        },
        aplicaConvencionColectiva: false,
        incluyePeriodoPrueba: true,
        diasPrueba: 90,
        lopcymat: {
          requiereNotificacion: true,
          fechaNotificacion: today,
          peligrosFisicos: [
            'Superficies lisas, húmedas o resbaladizas con riesgo de caídas al mismo nivel',
            'Iluminación variable en depósitos y áreas de aseo'
          ],
          peligrosQuimicos: [
            'Contacto dérmico e inhalación de vapores por cloro, desinfectantes, amoníaco y desengrasantes',
            'Polvos y partículas generados durante el barrido'
          ],
          peligrosBiologicos: [
            'Contacto potencial con microorganismos patógenos en sanitarios y desecho de basuras'
          ],
          peligrosDisergonomicos: [
            'Bipedestación prolongada, posturas forzadas y flexión de columna al trapear o limpiar',
            'Carga manual de bolsas de desechos y cubos de agua'
          ],
          peligrosPsicosociales: [
            'Monotonía en tareas repetitivas de limpieza'
          ],
          eppRequeridos: [
            'Guantes de nitrilo o jebe de caña alta',
            'Calzado de seguridad con suela de goma antideslizante impermeable',
            'Delantal impermeable de PVC',
            'Mascarilla / tapabocas contra vapores químicos y polvos'
          ],
          medidasPreventivas: [
            'Uso estricto de señalización de advertencia (cono/piso mojado) al higienizar',
            'Prohibición expresa de mezclar cloro con amoníaco o detergentes ácidos',
            'Pausas activas de descanso postural',
            'Uso obligatorio de EPP durante la dilución de químicos'
          ],
          clausulaArt168AlmuerzoTrayecto: true,
          horasCapacitacionTrimestralesCompletadas: 16,
          cronogramaCapacitacionSST: [
            { tema: 'Manejo Seguro de Productos Químicos de Limpieza y Hojas MSDS', horas: 5, fechaProgramada: today, completado: true },
            { tema: 'Prevención de Caídas, Resbalones y Uso de EPP', horas: 4, fechaProgramada: today, completado: true },
            { tema: 'Higiene Postural y Levantamiento Manual de Cargas', horas: 4, fechaProgramada: today, completado: true },
            { tema: 'Bioseguridad y Manejo Adecuado de Desechos Sólidos', horas: 3, fechaProgramada: today, completado: true }
          ]
        },
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: false,
        status: 'pendiente_firma'
      };
    }

    case 'unidad_obra_cauchero': {
      const baseReferencialUSD = 450;
      const targetCompany = getCompanyForTemplate(1); // Taller El Cauchero
      return {
        id: `contract-tpl-${Date.now()}`,
        codigoExpediente: `NOM-CAU-${codeNum}`,
        fechaCreacion: today,
        fechaInicioRelacion: today,
        modalidad: 'indeterminado',
        numeroProrroga: 0,
        cargo: 'Técnico Operador / Cauchero y Mecánico Ligero',
        clasificacion: 'unidad_obra',
        descripcionFunciones: 'Montaje, desmontaje, reparación y balanceo de neumáticos, rotación, alineación y servicios de mantenimiento automotriz ligero (cambio de aceite, frenos, bujías y fluidos), operando las herramientas y maquinarias asignadas de conformidad con las instrucciones técnicas de LA ENTIDAD DE TRABAJO.',
        lugarPrestacion: 'Taller Central de Neumáticos y Servicios Automotrices',
        domicilioEspecialConvenido: 'Caracas, Circunscripción Judicial del Distrito Capital y Estado Miranda',
        tipoJornada: 'Diurna',
        horasSemanales: 40,
        horarioDetallado: 'Lunes a Viernes de 8:00 AM a 5:00 PM (o Martes a Sábado según rotación) con 1 hora de descanso y almuerzo',
        diasDescanso: 'Sábados y Domingos continuos',
        empresaId: targetCompany.id || 'empresa-002',
        empresa: targetCompany,
        trabajador: {
          nombres: 'Yorman José',
          apellidos: 'Rondón Parra',
          cedula: 'V-21.849.501',
          nacionalidad: 'Venezolana',
          edad: 31,
          estadoCivil: 'Soltero(a)',
          profesionOficio: 'Técnico Cauchero y Mecánico Automotriz Ligero',
          direccionHabitacion: 'Sector Carapita, Calle San José, Casa 18, Antímano, Municipio Libertador, Caracas',
          telefono: '+58 412-8822991',
          correo: 'yorman.rondon@email.com'
        },
        remuneracion: {
          tipoMoneda: 'USD_INDEXADO',
          salarioBaseMensualUSD: baseReferencialUSD,
          salarioBaseMensualVEF: baseReferencialUSD * bcvRate,
          tasaBCV: bcvRate,
          fechaTasaBCV: today,
          periodicidadPago: 'Quincenal',
          diaPago: 'los días 15 y último de cada mes',
          lugarPago: 'transferencia bancaria a cuenta nómina del TRABAJADOR con relación pormenorizada de servicios',
          cestaticketUSD: LEGAL_CESTATICKET_USD,
          cestaticketVEF: LEGAL_CESTATICKET_USD * bcvRate,
          esquemaMixto: false,
          esUnidadDeObra: true,
          garantiaSalarioMinimoArt115: true,
          tarifasComisionUnidadObra: [
            { servicio: 'Montaje, desmontaje y balanceo de neumático', porcentajeOMonto: '25% mano de obra facturada' },
            { servicio: 'Reparación de pinchazos y colocación de parches en frío/caliente', porcentajeOMonto: '30% mano de obra facturada' },
            { servicio: 'Alineación de dirección y balanceo computarizado', porcentajeOMonto: '25% mano de obra facturada' },
            { servicio: 'Mecánica ligera preventiva (cambio de aceite, filtros, frenos, bujías)', porcentajeOMonto: '25% mano de obra facturada' }
          ],
          diasBonoVacacional: 15,
          diasUtilidades: 30,
          bonosNoSalarialesDeclarados: 0,
          alertaRiesgoSalarizacion: false
        },
        aplicaConvencionColectiva: false,
        incluyePeriodoPrueba: true,
        diasPrueba: 90,
        lopcymat: {
          ...getDefaultLopcymatData('unidad_obra'),
          horasCapacitacionTrimestralesCompletadas: 16
        },
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: false,
        status: 'pendiente_firma'
      };
    }
  }
}
