import React, { useState, useRef, useEffect } from 'react';
import { LaborContract } from '../types/contract';
import { generateContractLegalText } from '../utils/contractTemplates';
import { createAuditTrail, generateSimulatedOTP } from '../utils/cryptoSim';
import { 
  Smartphone, 
  Check, 
  RotateCcw, 
  Download 
} from 'lucide-react';

interface WorkerMobileViewProps {
  contracts: LaborContract[];
  onContractSigned: (signed: LaborContract) => void;
}

export const WorkerMobileView: React.FC<WorkerMobileViewProps> = ({
  contracts,
  onContractSigned
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    contracts.find(c => c.status === 'pendiente_firma')?.id || contracts[0]?.id || ''
  );

  const contract = contracts.find(c => c.id === selectedId) || contracts[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [signingSuccess, setSigningSuccess] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [contract]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleRequestOtp = () => {
    const code = generateSimulatedOTP();
    setOtpCode(code);
    setOtpSent(true);
    setEnteredOtp(code);
  };

  const handleSubmitMobileSign = async () => {
    if (!contract || !hasDrawn || enteredOtp !== otpCode) return;

    const canvas = canvasRef.current;
    const signatureImageBase64 = canvas ? canvas.toDataURL('image/png') : undefined;
    const contractFullContent = generateContractLegalText(contract);

    const auditTrail = await createAuditTrail({
      contractId: contract.id,
      contractFullContent,
      workerName: `${contract.trabajador.nombres} ${contract.trabajador.apellidos}`,
      workerCedula: contract.trabajador.cedula,
      workerEmail: contract.trabajador.correo,
      workerPhone: contract.trabajador.telefono,
      signatureLevel: 'nivel_3',
      signatureImageBase64,
      otpCode: enteredOtp,
      otpChannel: 'WHATSAPP'
    });

    const updated: LaborContract = {
      ...contract,
      status: 'firmado_ambos',
      dobleEjemplarEmitido: true,
      constanciaEntregaFirmada: true,
      auditTrail
    };

    onContractSigned(updated);
    setSigningSuccess(true);
  };

  if (!contract) {
    return <div className="p-8 text-center text-slate-500">No hay contratos disponibles.</div>;
  }

  const contractText = generateContractLegalText(contract);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-16">
      {/* Device Frame Header in Warm Pastel */}
      <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center space-y-2 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-xs text-amber-900 font-mono font-bold">
          <Smartphone className="w-4 h-4 text-amber-700" />
          <span>PORTAL DEL TRABAJADOR • FIRMA MÓVIL OTP</span>
        </div>
        <p className="text-xs text-slate-600">
          Simulación de la experiencia en smartphone para el colaborador en Venezuela.
        </p>

        {/* Contract Picker */}
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setSigningSuccess(false);
            setHasDrawn(false);
            setOtpSent(false);
          }}
          className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 mt-2 focus:bg-white"
        >
          {contracts.map(c => (
            <option key={c.id} value={c.id}>
              {c.trabajador.nombres} {c.trabajador.apellidos} ({c.cargo} - {c.status === 'firmado_ambos' ? 'Suscrito' : 'Pendiente'})
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Screen Shell in Soft Warm Titanium Frame */}
      <div className="bg-[#FAF8F5] border-4 border-slate-300 rounded-[2.5rem] overflow-hidden shadow-xl relative p-4 space-y-4">
        {/* Top Speaker Notch */}
        <div className="w-24 h-3.5 bg-slate-300 rounded-full mx-auto" />

        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <div className="font-bold text-sm text-slate-900 font-serif">Nominus Contratos</div>
            <div className="text-[10px] text-amber-900 font-mono font-bold">{contract.codigoExpediente}</div>
          </div>
          <span className="text-[10px] bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold">
            {contract.status === 'firmado_ambos' ? 'FIRMADO' : 'PENDIENTE'}
          </span>
        </div>

        {/* Worker Greeting */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
          <div className="text-slate-500 font-medium">Trabajador:</div>
          <div className="font-bold text-slate-900">{contract.trabajador.nombres} {contract.trabajador.apellidos}</div>
          <div className="text-[11px] text-slate-500 font-mono">C.I. {contract.trabajador.cedula}</div>
        </div>

        {/* Contract Text Scrollbox */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-700 uppercase font-mono block">
            Lectura del Contrato (LOTTT):
          </span>
          <div className="bg-white text-slate-800 rounded-xl p-4 h-48 overflow-y-auto text-[11px] font-serif leading-relaxed whitespace-pre-line border border-slate-300 shadow-inner">
            {contractText}
          </div>
        </div>

        {/* Signing Area */}
        {contract.status !== 'firmado_ambos' && !signingSuccess ? (
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                  Firma con el dedo en pantalla:
                </span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[10px] text-amber-800 hover:text-amber-950 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Limpiar</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-300 overflow-hidden relative shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={110}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-24 bg-white cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-[10px] font-medium">
                    <span>Firme aquí con el dedo</span>
                  </div>
                )}
              </div>
            </div>

            {/* OTP Trigger */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900">Código de Confirmación OTP:</span>
                <span className="font-mono text-[10px] text-slate-500">{contract.trabajador.telefono}</span>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold"
                >
                  Solicitar Código por WhatsApp
                </button>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Código 6 dígitos"
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-lg px-3 py-2 text-center text-sm font-mono tracking-widest text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                  <div className="text-[10px] text-emerald-800 font-semibold flex items-center justify-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Código OTP recibido automáticamente</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!hasDrawn || !otpSent}
              onClick={handleSubmitMobileSign}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all active:scale-95"
            >
              Confirmar y Suscribir Contrato
            </button>
          </div>
        ) : (
          /* Signed Success State */
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900">¡Contrato Suscrito Exitosamente!</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Se ha generado tu <strong>Ejemplar Original</strong> de acuerdo con el Artículo 59 numeral 14 de la LOTTT.
              </p>
            </div>

            {contract.auditTrail && (
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-[10px] font-mono text-slate-600 text-left space-y-1">
                <div>Audit ID: {contract.auditTrail.auditId}</div>
                <div>Hash: {contract.auditTrail.sha256DocumentHash.slice(0, 20)}...</div>
                <div>Fecha: {contract.auditTrail.timestampLocal}</div>
              </div>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Mi Ejemplar PDF</span>
            </button>
          </div>
        )}

        {/* Bottom Phone Bar */}
        <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-4" />
      </div>
    </div>
  );
};
