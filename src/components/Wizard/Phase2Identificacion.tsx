import React from 'react';
import { Company, LaborContract } from '../../types/contract';
import { Building2, User, Clock, MapPin, Calendar, FileText, Briefcase, CheckCircle2, Sparkles } from 'lucide-react';

interface Phase2Props {
  contract: Partial<LaborContract>;
  updateContract: (data: Partial<LaborContract>) => void;
  onNext: () => void;
  onBack: () => void;
  companies?: Company[];
}

export const Phase2Identificacion: React.FC<Phase2Props> = ({
  contract,
  updateContract,
  onNext,
  onBack,
  companies = []
}) => {
  const empresa = contract.empresa || {} as any;
  const trabajador = contract.trabajador || {} as any;

  const updateEmpresa = (fields: Partial<typeof empresa>) => {
    updateContract({
      empresa: { ...empresa, ...fields }
    });
  };

  const handleSelectPredefinedCompany = (comp: Company) => {
    updateContract({
      empresaId: comp.id,
      empresa: {
        id: comp.id,
        denominacionSocial: comp.denominacionSocial,
        alias: comp.alias,
        rif: comp.rif,
        registroMercantil: comp.registroMercantil,
        domicilioFiscal: comp.domicilioFiscal,
        representanteNombre: comp.representanteNombre,
        representanteCI: comp.representanteCI,
        representanteCargo: comp.representanteCargo,
        representanteFacultad: comp.representanteFacultad,
        rnetNumero: comp.rnetNumero,
        ivssPatronal: comp.ivssPatronal,
        incesNumero: comp.incesNumero,
        banavihNumero: comp.banavihNumero,
        actividadEconomica: comp.actividadEconomica,
        colorTheme: comp.colorTheme
      }
    });
  };

  const updateTrabajador = (fields: Partial<typeof trabajador>) => {
    updateContract({
      trabajador: { ...trabajador, ...fields }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-serif">Fase 2: Identificación y Requisitos Taxativos (Art. 59 LOTTT)</h2>
        <p className="text-xs text-slate-600">
          La LOTTT exige la constancia formal de 14 requisitos indispensables para la validez y eficacia probatoria del contrato.
        </p>
      </div>

      {/* Bloque 1: Identificación del Patrono */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>1. Identificación de la Persona Jurídica (Patrono / Empresa)</span>
          </div>

          <span className="text-[11px] text-slate-500">
            Soporta régimen multiempresa con separación patrimonial
          </span>
        </div>

        {/* Selector Rápido de Empresas Registradas */}
        {companies.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Cargar datos de una Empresa Registrada (1 Clic):
              </span>
              <span className="text-[10px] text-slate-500">Autocompleta RIF, Registro y Representante</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {companies.map((c) => {
                const isCurrent = (contract.empresaId === c.id) || (empresa.rif === c.rif);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectPredefinedCompany(c)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between active:scale-98 ${
                      isCurrent
                        ? 'bg-amber-100/90 border-amber-400 font-bold text-amber-950 shadow-2xs ring-2 ring-amber-300/60'
                        : 'bg-white hover:bg-amber-100/50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold truncate text-[11px]">{c.alias || c.denominacionSocial}</span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">{c.rif}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Razón Social / Denominación Mercantil *
            </label>
            <input
              type="text"
              value={empresa.denominacionSocial || ''}
              onChange={(e) => updateEmpresa({ denominacionSocial: e.target.value })}
              placeholder="Ej: Inversiones & Manufacturas Venezolanas, C.A."
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Registro de Información Fiscal (RIF) *
            </label>
            <input
              type="text"
              value={empresa.rif || ''}
              onChange={(e) => updateEmpresa({ rif: e.target.value.toUpperCase() })}
              placeholder="J-31298450-4"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Datos de Inscripción en Registro Mercantil (Tomo, Número, Fecha) *
            </label>
            <input
              type="text"
              value={empresa.registroMercantil || ''}
              onChange={(e) => updateEmpresa({ registroMercantil: e.target.value })}
              placeholder="Registro Mercantil Segundo del Dtto. Capital y Edo. Miranda, Tomo 182-A, Número 45"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Domicilio Fiscal de la Empresa *
            </label>
            <input
              type="text"
              value={empresa.domicilioFiscal || ''}
              onChange={(e) => updateEmpresa({ domicilioFiscal: e.target.value })}
              placeholder="Avenida Francisco de Miranda, Torre Cavendes, Piso 9, Chacao, Edo. Miranda"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Representante Legal (Nombres y Apellidos) *
            </label>
            <input
              type="text"
              value={empresa.representanteNombre || ''}
              onChange={(e) => updateEmpresa({ representanteNombre: e.target.value })}
              placeholder="Alejandro Morales Mendoza"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              C.I. Representante Legal *
            </label>
            <input
              type="text"
              value={empresa.representanteCI || ''}
              onChange={(e) => updateEmpresa({ representanteCI: e.target.value })}
              placeholder="V-11.234.890"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Cargo y Carácter de la Representación *
            </label>
            <input
              type="text"
              value={empresa.representanteCargo || ''}
              onChange={(e) => updateEmpresa({ representanteCargo: e.target.value })}
              placeholder="Presidente Ejecutivo / Apoderado Especial"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bloque 2: Identificación del Trabajador */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
          <User className="w-4 h-4 text-sky-700" />
          <span>2. Identificación de la Persona Natural (Trabajador)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Nombres *
            </label>
            <input
              type="text"
              value={trabajador.nombres || ''}
              onChange={(e) => updateTrabajador({ nombres: e.target.value })}
              placeholder="Carlos Eduardo"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Apellidos *
            </label>
            <input
              type="text"
              value={trabajador.apellidos || ''}
              onChange={(e) => updateTrabajador({ apellidos: e.target.value })}
              placeholder="Mendoza Guillén"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Cédula de Identidad (V / E) *
            </label>
            <input
              type="text"
              value={trabajador.cedula || ''}
              onChange={(e) => updateTrabajador({ cedula: e.target.value.toUpperCase() })}
              placeholder="V-19.512.634"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Nacionalidad *
            </label>
            <select
              value={trabajador.nacionalidad || 'Venezolana'}
              onChange={(e) => updateTrabajador({ nacionalidad: e.target.value as any })}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="Venezolana">Venezolana</option>
              <option value="Extranjera">Extranjera</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Edad *
            </label>
            <input
              type="number"
              value={trabajador.edad || 30}
              onChange={(e) => updateTrabajador({ edad: parseInt(e.target.value) || 18 })}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Estado Civil *
            </label>
            <select
              value={trabajador.estadoCivil || 'Soltero(a)'}
              onChange={(e) => updateTrabajador({ estadoCivil: e.target.value as any })}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="Soltero(a)">Soltero(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viudo(a)">Viudo(a)</option>
              <option value="Unión Estable de Hecho">Unión Estable de Hecho</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Profesión u Oficio *
            </label>
            <input
              type="text"
              value={trabajador.profesionOficio || ''}
              onChange={(e) => updateTrabajador({ profesionOficio: e.target.value })}
              placeholder="T.S.U. en Mercadotecnia / Administrador"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Teléfono Celular (Para OTP SMS/WhatsApp) *
            </label>
            <input
              type="text"
              value={trabajador.telefono || ''}
              onChange={(e) => updateTrabajador({ telefono: e.target.value })}
              placeholder="+58 412-5551928"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Correo Electrónico (Notificaciones) *
            </label>
            <input
              type="email"
              value={trabajador.correo || ''}
              onChange={(e) => updateTrabajador({ correo: e.target.value })}
              placeholder="carlos.mendoza@empresa.com"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Dirección Exacta de Habitación (Fijación de Domicilio para Notificaciones) *
            </label>
            <input
              type="text"
              value={trabajador.direccionHabitacion || ''}
              onChange={(e) => updateTrabajador({ direccionHabitacion: e.target.value })}
              placeholder="Av. Andrés Bello, Residencias Parque Ávila, Piso 4, La Candelaria, Caracas"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bloque 3: Cargo, Fecha de Ingreso y Condiciones Operativas */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
          <Briefcase className="w-4 h-4 text-emerald-700" />
          <span>3. Cargo, Funciones y Condiciones Operativas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Denominación Formal del Cargo *
            </label>
            <input
              type="text"
              value={contract.cargo || ''}
              onChange={(e) => updateContract({ cargo: e.target.value })}
              placeholder="Ej: Ejecutivo Senior de Ventas y Cuentas Clave"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Fecha de Inicio de la Relación (Cómputo Antigüedad) *
            </label>
            <input
              type="date"
              value={contract.fechaInicioRelacion || ''}
              onChange={(e) => updateContract({ fechaInicioRelacion: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono focus:bg-white"
            />
          </div>

          {contract.modalidad === 'determinado' && (
            <div>
              <label className="block text-[11px] font-medium text-amber-900 mb-1">
                Fecha de Culminación (Máx 1 año Art. 62) *
              </label>
              <input
                type="date"
                value={contract.fechaCulminacion || ''}
                onChange={(e) => updateContract({ fechaCulminacion: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-amber-400 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono focus:bg-white"
              />
            </div>
          )}

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Descripción Analítica de Funciones y Atribuciones (Art. 59 Numeral 3 LOTTT) *
            </label>
            <textarea
              rows={3}
              value={contract.descripcionFunciones || ''}
              onChange={(e) => updateContract({ descripcionFunciones: e.target.value })}
              placeholder="Delimite de forma precisa las responsabilidades para evitar reclamaciones de reclasificación de cargo..."
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Lugar Físico de Prestación del Servicio (Art. 59 Numeral 12 LOTTT) *
            </label>
            <input
              type="text"
              value={contract.lugarPrestacion || ''}
              onChange={(e) => updateContract({ lugarPrestacion: e.target.value })}
              placeholder="Sede Central Chacao, Caracas / Planta Guatire / Modalidad Remota"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Domicilio Especial Convenido / Fuero Judicial (Art. 59 N° 11) *
            </label>
            <input
              type="text"
              value={contract.domicilioEspecialConvenido || ''}
              onChange={(e) => updateContract({ domicilioEspecialConvenido: e.target.value })}
              placeholder="Caracas, Distrito Capital"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Jornada de Trabajo (Art. 173 LOTTT) *
            </label>
            <select
              value={contract.tipoJornada || 'Diurna'}
              onChange={(e) => updateContract({ tipoJornada: e.target.value as any })}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="Diurna">Diurna (Límite 40 horas semanales / 8h diarias)</option>
              <option value="Nocturna">Nocturna (Límite 35 horas semanales / 7h diarias)</option>
              <option value="Mixta">Mixta (Límite 37.5 horas semanales)</option>
              <option value="Exenta_Direccion">Exenta por Dirección (Art. 178 LOTTT)</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Horario Detallado y Días de Descanso Continuos (Art. 173 y 176 LOTTT) *
            </label>
            <input
              type="text"
              value={contract.horarioDetallado || ''}
              onChange={(e) => updateContract({ horarioDetallado: e.target.value })}
              placeholder="Lunes a Viernes de 8:00 AM a 5:00 PM con 1 hora para almuerzo. Descanso: Sábados y Domingos"
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium transition-colors"
        >
          ← Volver a Fase 1
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all active:scale-95"
        >
          Continuar a Fase 3: Remuneración y Cestaticket (LOTTT) →
        </button>
      </div>
    </div>
  );
};
