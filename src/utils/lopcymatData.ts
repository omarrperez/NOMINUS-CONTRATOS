import { JobClassification, LopcymatData } from '../types/contract';

export interface LopcymatProfile {
  clasificacion: JobClassification;
  nombrePerfil: string;
  peligrosFisicos: string[];
  peligrosQuimicos: string[];
  peligrosBiologicos: string[];
  peligrosDisergonomicos: string[];
  peligrosPsicosociales: string[];
  eppRequeridos: string[];
  medidasPreventivas: string[];
  capacitacionesRecomendadas: { tema: string; horas: number }[];
}

export const LOPCYMAT_PROFILES: Record<JobClassification, LopcymatProfile> = {
  direccion: {
    clasificacion: 'direccion',
    nombrePerfil: 'Personal Directivo y de Confianza',
    peligrosFisicos: [
      'Iluminación artificial prolongada en pantallas de visualización de datos (PVD)',
      'Ruido ambiente de oficinas y salas de reuniones',
      'Temperatura por climatización central'
    ],
    peligrosQuimicos: [
      'Polvos y partículas en suspensión por archivo físico y papel'
    ],
    peligrosBiologicos: [
      'Exposición a virus y bacterias en ambientes cerrados con aire acondicionado recirculado'
    ],
    peligrosDisergonomicos: [
      'Postura sedente prolongada por más de 4 horas continuas',
      'Uso repetitivo de teclado y ratón ergonómico'
    ],
    peligrosPsicosociales: [
      'Alta responsabilidad en la toma de decisiones corporativas',
      'Sobrecarga mental cuantitativa y cualitativa',
      'Manejo de situaciones de crisis o negociación laboral'
    ],
    eppRequeridos: [
      'Lentes con filtro de luz azul (opcional según recomendación oftalmológica)',
      'Silla ergonómica de 5 puntos de apoyo con soporte lumbar ajustable'
    ],
    medidasPreventivas: [
      'Pausas activas de 10 minutos cada 2 horas de labor continua',
      'Ajuste ergonómico de la altura de la pantalla a nivel de los ojos',
      'Capacitación en técnicas de manejo de estrés y liderazgo positivo'
    ],
    capacitacionesRecomendadas: [
      { tema: 'Gestión Integral del Estrés Laboral y Factores Psicosociales', horas: 4 },
      { tema: 'Ergonomía en Puestos con Pantallas de Visualización de Datos (PVD)', horas: 4 },
      { tema: 'Planes de Evacuación y Primeros Auxilios Corporativos', horas: 4 },
      { tema: 'Responsabilidad Civil y Penal del Patrono según LOPCYMAT', horas: 4 }
    ]
  },

  ventas: {
    clasificacion: 'ventas',
    nombrePerfil: 'Fuerza Comercial y Asesores de Ventas',
    peligrosFisicos: [
      'Radiación solar no ionizante por traslados a clientes en vía pública',
      'Ruido vehicular y vibraciones por conducción de vehículos',
      'Condiciones climáticas variables en desplazamientos'
    ],
    peligrosQuimicos: [
      'Gases de combustión de vehículos y material particulado urbano'
    ],
    peligrosBiologicos: [
      'Contacto con múltiples personas en espacios públicos y centros comerciales'
    ],
    peligrosDisergonomicos: [
      'Bipedestación o sedestación prolongada en traslados',
      'Carga y transporte manual de muestras comerciales o catálogos'
    ],
    peligrosPsicosociales: [
      'Presión por cumplimiento de metas y cuotas mensuales de venta',
      'Riesgo de inseguridad ciudadana en trayectos comerciales',
      'Atención a clientes conflictivos'
    ],
    eppRequeridos: [
      'Protector solar factor SPF 50+',
      'Calzado cerrado ergonómico con suela antideslizante para caminar',
      'Lentes oscuros con protección UV'
    ],
    medidasPreventivas: [
      'Planificación de rutas seguras y verificación preventiva de vehículos',
      'Capacitación en ergonomía para manejo manual de cargas ligeras (< 15 kg)',
      'Protocolo ante situaciones de riesgo público en la calle'
    ],
    capacitacionesRecomendadas: [
      { tema: 'Seguridad Vial y Manejo Defensivo para Ejecutivos', horas: 6 },
      { tema: 'Manejo Manual de Cargas y Pausas Activas Dinámicas', horas: 4 },
      { tema: 'Prevención de Riesgos Biológicos y Golpe de Calor', horas: 3 },
      { tema: 'Manejo de Clientes Difíciles y Resiliencia en Ventas', horas: 3 }
    ]
  },

  operativo: {
    clasificacion: 'operativo',
    nombrePerfil: 'Personal Operativo, Almacén y Planta',
    peligrosFisicos: [
      'Ruido continuo intermitente por maquinaria industrial (> 80 dB)',
      'Riesgo de atrapamiento, golpes o cortes con herramientas mecánicas',
      'Superficies resbaladizas o desniveles en planta'
    ],
    peligrosQuimicos: [
      'Manipulación de solventes, aceites, desengrasantes o pinturas industriales',
      'Polvos y vapores generados en procesos de manufactura'
    ],
    peligrosBiologicos: [
      'Contacto con agentes biológicos en áreas de saneamiento o residuos'
    ],
    peligrosDisergonomicos: [
      'Levantamiento y traslado manual de cargas pesadas',
      'Movimientos repetitivos de miembros superiores y torsión de tronco'
    ],
    peligrosPsicosociales: [
      'Monotonía en líneas de producción continua',
      'Turnos rotativos y fatiga física'
    ],
    eppRequeridos: [
      'Casco de seguridad dieléctrico Tipo I Clase E',
      'Botas de seguridad con puntera de acero o composite y suela antiperforación',
      'Guantes de nitrilo / cuero contra riesgos mecánicos',
      'Protectores auditivos de inserción o copa según nivel de dB',
      'Lentes de seguridad con protección lateral contra impactos'
    ],
    medidasPreventivas: [
      'Uso obligatorio de EPP certificado en todo momento en áreas operativas',
      'Cumplimiento estricto del procedimiento de Bloqueo y Etiquetado (LOTO)',
      'Límite de carga manual: máx 25 kg para hombres y 15 kg para mujeres',
      'Mantenimiento preventivo regular de resguardos de máquinas'
    ],
    capacitacionesRecomendadas: [
      { tema: 'Identificación de Procesos Peligrosos y Matriz IPER NT-04-2023', horas: 5 },
      { tema: 'Manejo Seguro de Sustancias Químicas y Hojas de Datos (MSDS)', horas: 4 },
      { tema: 'Uso, Cuidado y Mantenimiento de Equipos de Protección Personal', horas: 3 },
      { tema: 'Control de Incendios, Uso de Extintores y Evacuación', horas: 4 }
    ]
  },

  administrativo: {
    clasificacion: 'administrativo',
    nombrePerfil: 'Personal Administrativo y de Apoyo',
    peligrosFisicos: [
      'Iluminación artificial en oficinas y fatiga visual',
      'Ruido moderado de impresoras y llamadas telefónicas'
    ],
    peligrosQuimicos: [
      'Tóner de impresoras y productos de limpieza de superficies'
    ],
    peligrosBiologicos: [
      'Transmisión de afecciones respiratorias en ambientes compartidos'
    ],
    peligrosDisergonomicos: [
      'Postura sedente prolongada con digitación continua',
      'Inadecuada distancia al monitor o altura inadecuada de escritorio'
    ],
    peligrosPsicosociales: [
      'Atención de plazos tributarios y cierres contables exigentes',
      'Relaciones interpersonales y volumen de documentos'
    ],
    eppRequeridos: [
      'Reposapiés ergonómico antideslizante',
      'Apoyamuñecas acolchado para teclado y mouse'
    ],
    medidasPreventivas: [
      'Pausas activas visuales: regla 20-20-20 (mirar a 20 pies por 20 seg cada 20 min)',
      'Ejercicios de estiramiento de columna cervical y miembros superiores',
      'Mantener despejadas las vías de evacuación de archivadores'
    ],
    capacitacionesRecomendadas: [
      { tema: 'Prevención de Trastornos Musculoesqueléticos en Oficinas', horas: 5 },
      { tema: 'Higiene Postural y Pausas Activas en Jornadas de Trabajo', horas: 4 },
      { tema: 'Seguridad en Instalaciones Eléctricas de Oficina', horas: 3 },
      { tema: 'Primeros Auxilios Básicos en Ambientes Administrativos', horas: 4 }
    ]
  },

  profesional_independiente: {
    clasificacion: 'profesional_independiente',
    nombrePerfil: 'Servicios Profesionales Mercantiles Autónomos',
    peligrosFisicos: ['Riesgos propios del entorno autónomo del contratista'],
    peligrosQuimicos: ['No aplica de forma directa'],
    peligrosBiologicos: ['Básicos en instalaciones visitadas'],
    peligrosDisergonomicos: ['Posturas estáticas en desarrollo técnico'],
    peligrosPsicosociales: ['Autonomía de plazos mercantiles'],
    eppRequeridos: ['EPP específico en caso de ingresar a áreas restringidas del cliente'],
    medidasPreventivas: ['Inducción de seguridad para contratistas externos'],
    capacitacionesRecomendadas: [
      { tema: 'Normas de Seguridad para Contratistas e Inducción de Planta', horas: 4 },
      { tema: 'Protocolo de Emergencias y Vías de Evacuación', horas: 4 },
      { tema: 'Responsabilidad Civil en Servicios Profesionales', horas: 4 },
      { tema: 'Higiene Industrial Básica', horas: 4 }
    ]
  },

  socio_trabajador: {
    clasificacion: 'socio_trabajador',
    nombrePerfil: 'Socio o Accionista con Relación Laboral Subordinada',
    peligrosFisicos: ['Exposición en sedes operativas y de gobierno corporativo'],
    peligrosQuimicos: ['Básicos de oficina o planta según funciones'],
    peligrosBiologicos: ['Ambientes compartidos'],
    peligrosDisergonomicos: ['Sedestación en reuniones y toma de decisiones'],
    peligrosPsicosociales: ['Doble rol societario y laboral, presión financiera'],
    eppRequeridos: ['Equipamiento según áreas de inspección o visita'],
    medidasPreventivas: ['Participación activa en el Comité de Seguridad y Salud Laboral (CSSL)'],
    capacitacionesRecomendadas: [
      { tema: 'Gobernanza Corporativa y Cumplimiento LOPCYMAT/NT-04-2023', horas: 5 },
      { tema: 'Responsabilidad Solidaria de Administradores ante Accidentes', horas: 4 },
      { tema: 'Auditorías de Seguridad y Salud en el Trabajo', horas: 4 },
      { tema: 'Gestión Preventiva del Clima Organizacional', horas: 3 }
    ]
  },

  unidad_obra: {
    clasificacion: 'unidad_obra',
    nombrePerfil: 'Técnico Operador / Cauchero y Mecánico Ligero (Taller)',
    peligrosFisicos: [
      'Ruido continuo e intermitente de compresores de aire y pistolas de impacto neumáticas (> 85 dB)',
      'Riesgo de atrapamiento o golpes por herramientas neumáticas, gatos y elevadores hidráulicos',
      'Proyección de partículas, virutas o fragmentos de goma/metal al talonar o desinflar neumáticos',
      'Superficies resbaladizas por derrames de lubricantes, grasas o agua'
    ],
    peligrosQuimicos: [
      'Contacto dérmico e inhalación de vapores de aceites automotrices usados, líquidos de frenos y refrigerantes',
      'Manipulación de solventes desengrasantes, pastas para montaje de cauchos y parches vulcanizadores'
    ],
    peligrosBiologicos: [
      'Exposición a plagas o vectores (zancudos/dengue) en neumáticos almacenados con agua'
    ],
    peligrosDisergonomicos: [
      'Levantamiento y traslado manual de cauchos y rines pesados (sobreesfuerzo de columna)',
      'Posturas forzadas en bipedestación prolongada, cuclillas o flexión continua de tronco al alinear o frenar'
    ],
    peligrosPsicosociales: [
      'Presión por volumen de atención de vehículos en espera',
      'Fatiga física por labores mecánicas pesadas'
    ],
    eppRequeridos: [
      'Botas de seguridad con puntera de acero/composite y suela de goma antideslizante resistente a hidrocarburos',
      'Lentes de seguridad con protección lateral contra impactos (Norma ANSI Z87.1)',
      'Guantes mecánicos de nitrilo / cuero contra riesgos mecánicos y químicos ligeros',
      'Protectores auditivos de copa o inserción de alta atenuación (> 25 dB NRR)'
    ],
    medidasPreventivas: [
      'Uso obligatorio de jaulas de seguridad para inflado de neumáticos de alta presión',
      'Verificación diaria de mangueras, válvulas y manómetros del compresor de aire',
      'Uso de calzos y torres mecánicas de seguridad en vehículos antes de retirar cauchos',
      'Prohibición expresa de fumar o encender llamas abiertas cerca de solventes e hidrocarburos',
      'Técnicas de levantamiento seguro: flexionar rodillas manteniendo la espalda recta'
    ],
    capacitacionesRecomendadas: [
      { tema: 'Seguridad en Manejo de Aire Comprimido y Desmontaje de Neumáticos', horas: 5 },
      { tema: 'Prevención de Riesgos Mecánicos y Operación Segura de Elevadores', horas: 4 },
      { tema: 'Higiene Postural, Levantamiento de Cargas y Pausas Activas', horas: 4 },
      { tema: 'Uso de Extintores para Fuegos Clase B (Líquidos Inflamables)', horas: 3 }
    ]
  }
};

export function getDefaultLopcymatData(clasificacion: JobClassification): LopcymatData {
  const profile = LOPCYMAT_PROFILES[clasificacion] || LOPCYMAT_PROFILES.administrativo;
  
  return {
    requiereNotificacion: true,
    fechaNotificacion: new Date().toISOString().split('T')[0],
    peligrosFisicos: [...profile.peligrosFisicos],
    peligrosQuimicos: [...profile.peligrosQuimicos],
    peligrosBiologicos: [...profile.peligrosBiologicos],
    peligrosDisergonomicos: [...profile.peligrosDisergonomicos],
    peligrosPsicosociales: [...profile.peligrosPsicosociales],
    eppRequeridos: [...profile.eppRequeridos],
    medidasPreventivas: [...profile.medidasPreventivas],
    clausulaArt168AlmuerzoTrayecto: true, // Suspensión de jornada durante almuerzo
    horasCapacitacionTrimestralesCompletadas: 8,
    cronogramaCapacitacionSST: profile.capacitacionesRecomendadas.map((c, idx) => ({
      tema: c.tema,
      horas: c.horas,
      fechaProgramada: new Date(Date.now() + (idx + 1) * 20 * 86400000).toISOString().split('T')[0],
      completado: idx === 0 // 1era completada
    }))
  };
}
