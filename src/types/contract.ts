export type ContractModality = 'indeterminado' | 'determinado' | 'obra';

export type JobClassification = 
  | 'direccion'       // Art. 37 & 178 LOTTT (Excluido de límites de jornada)
  | 'ventas'          // Fuerza comercial con remuneración mixta y comisiones (Sentencia 341 TSJ)
  | 'operativo'       // Planta, taller, logística (Jornada estricta 40h)
  | 'administrativo'  // Administración, RRHH, finanzas
  | 'profesional_independiente' // Servicios mercantiles / no subordinado (Art. 35/535)
  | 'socio_trabajador'// Accionista con relación laboral subordinada
  | 'unidad_obra';    // Salario por Unidad de Obra o Comisión (Arts. 114 y 115 LOTTT)

export type SignatureLevel = 
  | 'nivel_1' // Simple / Internacional (DocuSign/PandaDoc sin acreditación SUSCERTE)
  | 'nivel_2' // Concordada o pactada expresamente
  | 'nivel_3' // Calificada / Avanzada (OTP + Hash SHA-256 + Geolocation + Device Fingerprint)
  | 'nivel_4';// Certificada SUSCERTE (PROCERT / APACUANA / AUTHENOLOGY)

export type ContractStatus = 
  | 'borrador'
  | 'pendiente_firma'
  | 'firmado_trabajador'
  | 'firmado_ambos'
  | 'vencido'
  | 'convertido_indeterminado';

export interface CompanyData {
  id?: string;
  denominacionSocial: string;  // e.g. "Corporación Industrial del Centro, C.A."
  alias?: string;               // e.g. "Manufacturas VE", "Taller El Cauchero"
  rif: string;                  // e.g. "J-40192837-1"
  registroMercantil: string;    // e.g. "Registro Mercantil Segundo del Dtto. Capital, Tomo 145-A, N° 23"
  domicilioFiscal: string;      // Dirección completa de sede principal
  representanteNombre: string;  // Nombre del representante legal
  representanteCI: string;      // C.I. del representante legal
  representanteCargo: string;   // e.g. "Director General" o "Apoderado"
  representanteFacultad: string;// e.g. "conforme a poder debidamente autenticado..."
  rnetNumero?: string;          // Registro Nacional de Entidades de Trabajo
  ivssPatronal?: string;        // N° patronal IVSS
  incesNumero?: string;
  banavihNumero?: string;
  actividadEconomica?: string;  // e.g. "Manufactura y Comercio", "Taller Automotriz", etc.
  colorTheme?: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'indigo';
  fechaRegistro?: string;
  activo?: boolean;
}

export type Company = CompanyData & { id: string };

export interface WorkerData {
  nombres: string;
  apellidos: string;
  cedula: string;               // e.g. "V-18.452.980" o "E-82.110.450"
  nacionalidad: 'Venezolana' | 'Extranjera';
  edad: number;
  estadoCivil: 'Soltero(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)' | 'Unión Estable de Hecho';
  profesionOficio: string;
  direccionHabitacion: string;  // Dirección exacta
  telefono: string;             // Para OTP SMS/WhatsApp
  correo: string;
}

export interface RemunerationData {
  tipoMoneda: 'VEF' | 'USD_INDEXADO';
  salarioBaseMensualVEF: number;
  salarioBaseMensualUSD: number;
  tasaBCV: number;              // Tasa oficial Banco Central de Venezuela
  fechaTasaBCV: string;
  periodicidadPago: 'Quincenal' | 'Semanal' | 'Mensual';
  diaPago: string;              // e.g. "los días 15 y último de cada mes"
  lugarPago: string;            // e.g. "mediante transferencia bancaria a la cuenta nómina del TRABAJADOR"
  
  // Cestaticket Socialista (Decreto 4805 / Art. 105 LOTTT - $40 USD tasa BCV, no salarial)
  cestaticketUSD: number;       // default 40
  cestaticketVEF: number;       // 40 * tasaBCV
  
  // Beneficios complementarios y comisiones
  esquemaMixto: boolean;
  porcentajeComisionVentas?: number; // Para fuerza comercial
  baseComisionDescripcion?: string;  // "sobre el monto neto efectivamente cobrado"
  
  // Salario por Unidad de Obra o Comisión (Arts. 114 y 115 LOTTT)
  esUnidadDeObra?: boolean;
  garantiaSalarioMinimoArt115?: boolean; // Garantía de que devengado no será inferior al mínimo nacional
  tarifasComisionUnidadObra?: {
    servicio: string;
    porcentajeOMonto: string;
  }[];
  
  // Alícuotas legales para Salario Diario Integral (Art. 104 y 122 LOTTT)
  diasBonoVacacional: number;   // Mínimo 15 días (+1 por año hasta 30)
  diasUtilidades: number;       // Mínimo 15 días (hasta 120 días)
  
  // Prevención de Fraude TSJ Sentencia 341
  bonosNoSalarialesDeclarados: number; // Para análisis de contingencia
  alertaRiesgoSalarizacion: boolean;
  motivoAlertaSalarizacion?: string;
}

export interface LopcymatData {
  requiereNotificacion: boolean;
  fechaNotificacion: string;
  peligrosFisicos: string[];
  peligrosQuimicos: string[];
  peligrosBiologicos: string[];
  peligrosDisergonomicos: string[];
  peligrosPsicosociales: string[];
  eppRequeridos: string[];
  medidasPreventivas: string[];
  clausulaArt168AlmuerzoTrayecto: boolean; // Suspensión de jornada durante almuerzo
  horasCapacitacionTrimestralesCompletadas: number; // Meta legal 16 horas
  cronogramaCapacitacionSST: {
    tema: string;
    horas: number;
    fechaProgramada: string;
    completado: boolean;
  }[];
}

export interface AuditTrailRecord {
  auditId: string;
  timestampUtc: string;
  timestampLocal: string;
  signerIdentityHash: string;
  signerName: string;
  signerCedula: string;
  signerEmail: string;
  signerPhone: string;
  signatureLevel: SignatureLevel;
  signatureLevelName: string;
  sha256DocumentHash: string;
  deviceFingerprint: string;
  ipAddress: string;
  geolocationLatLong: string;
  otpChannelDelivery: 'SMS' | 'WHATSAPP' | 'CORREO';
  otpCodeHash: string;
  suscerteProvider?: 'PROCERT' | 'APACUANA' | 'AUTHENOLOGY';
  suscerteCertificateSerial?: string;
  signatureImageBase64?: string;
}

export interface LaborContract {
  id: string;
  codigoExpediente: string;      // e.g. "NOM-2026-0042"
  fechaCreacion: string;
  fechaInicioRelacion: string;   // Art. 59 N° 4 LOTTT
  modalidad: ContractModality;   // Indeterminado, Determinado, Obra
  
  // Para contratos a tiempo determinado (Art. 62 y 64 LOTTT)
  fechaCulminacion?: string;
  duracionMeses?: number;
  causalArt64?: 
    | 'naturaleza_servicio'       // Cuando lo exija la naturaleza del servicio
    | 'sustitucion_provisional'   // Para sustituir provisional y legítimamente a un trabajador
    | 'nacionales_en_exterior'    // Trabajadores de nacionalidad venezolana para prestar servicios fuera
    | 'servicios_determinados';   // Obras o servicios que agotan el objeto
  justificacionCausalArt64?: string;
  numeroProrroga: number;         // 0 = inicial, 1 = primera prórroga, 2 = BLOQUEO (Art. 62 LOTTT)
  
  // Para contrato por obra (Art. 63 LOTTT)
  descripcionObra?: string;
  
  // Cargo y funciones
  cargo: string;
  clasificacion: JobClassification;
  descripcionFunciones: string;
  lugarPrestacion: string;        // Sede física, planta, o remoto
  domicilioEspecialConvenido: string; // Jurisdicción laboral pactada (e.g. "Caracas, Distrito Capital")
  
  // Jornada de trabajo (Art. 59 N° 8, Art. 173 y 178 LOTTT)
  tipoJornada: 'Diurna' | 'Nocturna' | 'Mixta' | 'Exenta_Direccion';
  horasSemanales: number;         // Máx 40h para ordinarias
  horarioDetallado: string;       // e.g. "Lunes a Viernes de 8:00 AM a 5:00 PM con 1 hora de descanso y alimentación"
  diasDescanso: string;           // e.g. "Sábados y Domingos continuos"
  
  // Partes y remuneración
  empresaId?: string;
  empresa: CompanyData;
  trabajador: WorkerData;
  remuneracion: RemunerationData;
  
  // Convención Colectiva aplicable (Art. 59 N° 10 LOTTT)
  aplicaConvencionColectiva: boolean;
  nombreConvencionColectiva?: string;
  
  // Período de prueba condicional (Art. 61 LOTTT jurisprudencial)
  incluyePeriodoPrueba: boolean;
  diasPrueba?: number;            // Habitualmente 90 días
  
  // SST LOPCYMAT
  lopcymat: LopcymatData;
  
  // Doble ejemplar legal (Art. 59 N° 14 LOTTT)
  dobleEjemplarEmitido: boolean;
  constanciaEntregaFirmada: boolean;
  
  // Estado y firmas
  status: ContractStatus;
  auditTrail?: AuditTrailRecord;
  historialAdendas?: AddendumRecord[];
}

export interface AddendumRecord {
  id: string;
  numeroAdenda: number;
  fechaEmision: string;
  fechaVigencia: string;
  motivo: 'Ajuste Salarial' | 'Cambio de Cargo' | 'Cambio de Sede' | 'Modificación de Jornada';
  salarioAnteriorVEF: number;
  salarioNuevoVEF: number;
  salarioNuevoUSD: number;
  clausulasModificadas: string;
  auditTrail?: AuditTrailRecord;
}

export interface LotttCalculationResult {
  salarioBaseMensual: number;
  salarioBaseDiario: number;
  alicuotaDiariaBonoVacacional: number;
  alicuotaDiariaUtilidades: number;
  salarioDiarioIntegral: number;
  cestaticketMensualVEF: number;
  cestaticketMensualUSD: number;
  ingresoTotalMensualVEF: number;
  ingresoTotalMensualUSD: number;
  
  // Garantía Trimestral vs Retroactivo (Art. 142 LOTTT)
  garantiaTrimestralDias: number;
  garantiaTrimestralMonto: number;
  computoRetroactivoDias: number;
  computoRetroactivoMonto: number;
  prestacionesSocialesFinal: number; // max(P_trim, P_retro)
  metodoMayor: 'Garantía Trimestral (Art. 142 a,b)' | 'Cómputo Retroactivo (Art. 142 c)';
  
  // Doblete Art. 92
  indemnizacionDespidoInjustificadoArt92: number;
  totalConDoblete: number;
}

export type CloudDocumentType = 
  | 'contrato_firmado'
  | 'cedula_identidad'
  | 'rif_trabajador'
  | 'notificacion_lopcymat'
  | 'certificado_medico_sst'
  | 'constancia_epp'
  | 'constancia_capacitacion_16h'
  | 'addendum_salarial'
  | 'recibo_doble_ejemplar';

export interface CloudDocument {
  id: string;
  nombre: string;
  tipo: CloudDocumentType;
  tipoDescripcion: string;
  contractId?: string;
  codigoExpediente?: string;
  empresaId?: string;
  empresaNombre?: string;
  empleadoNombre: string;
  empleadoCedula: string;
  fechaSubida: string;
  tamanioKb: number;
  formato: 'PDF' | 'JSON' | 'IMG' | 'DOC';
  sha256Hash: string;
  estadoSeguridad: 'Cifrado SHA-256' | 'En Bóveda Segura' | 'Certificado SUSCERTE';
  nubeProvider: 'Google Drive' | 'Dropbox Business' | 'Nominus Vault';
  etiquetas: string[];
  notas?: string;
  previewUrl?: string;
  contenidoTexto?: string;
}

export type PredefinedTemplateId = 
  | 'asistente_administrativo'
  | 'tecnico_mantenimiento'
  | 'gerente_ventas'
  | 'analista_nomina'
  | 'personal_limpieza'
  | 'unidad_obra_cauchero';

export interface PredefinedTemplateInfo {
  id: PredefinedTemplateId;
  titulo: string;
  clasificacion: JobClassification;
  modalidad: ContractModality;
  icono: string;
  salarioSugeridoUSD: number;
  descripcionBreve: string;
  caracteristicasClave: string[];
  clausulaEspecialLOTTT: string;
}

