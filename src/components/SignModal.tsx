import React, { useState, useRef, useEffect } from 'react';
import { LaborContract, SignatureLevel } from '../types/contract';
import { generateContractLegalText } from '../utils/contractTemplates';
import { computeSHA256, createAuditTrail, generateSimulatedOTP } from '../utils/cryptoSim';
import { 
  X, 
  ShieldCheck, 
  PenTool, 
  Smartphone, 
  Check, 
  AlertTriangle, 
  Fingerprint, 
  Lock,
  RotateCcw
} from 'lucide-react';

interface SignModalProps {
  contract: LaborContract;
  onClose: () => void;
  onContractSigned: (signedContract: LaborContract) => void;
}

export const SignModal: React.FC<SignModalProps> = ({
  contract,
  onClose,
  onContractSigned
}) => {
  const [signatureLevel, setSignatureLevel] = useState<SignatureLevel>('nivel_3');
  const [suscerteProvider, setSuscerteProvider] = useState<'PROCERT' | 'APACUANA' | 'AUTHENOLOGY'>('PROCERT');
  
  // OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpChannel, setOtpChannel] = useState<'SMS' | 'WHATSAPP' | 'CORREO'>('WHATSAPP');
  const [otpError, setOtpError] = useState(false);
  
  // Canvas signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Signing state
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

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

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSendOtp = () => {
    const code = generateSimulatedOTP();
    setGeneratedOtp(code);
    setOtpSent(true);
    setEnteredOtp(code);
  };

  const handleCompleteSign = async () => {
    if (enteredOtp !== generatedOtp) {
      setOtpError(true);
      return;
    }

    setIsSealing(true);
    setOtpError(false);

    try {
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
        signatureLevel,
        signatureImageBase64,
        otpCode: enteredOtp,
        otpChannel,
        suscerteProvider: signatureLevel === 'nivel_4' ? suscerteProvider : undefined
      });

      const updatedContract: LaborContract = {
        ...contract,
        status: 'firmado_ambos',
        dobleEjemplarEmitido: true,
        constanciaEntregaFirmada: true,
        auditTrail
      };

      setTimeout(() => {
        setIsSealing(false);
        onContractSigned(updatedContract);
      }, 1000);
    } catch {
      setIsSealing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 my-8 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Motor de Firma Digital y Trazabilidad Probatoria
              </h2>
              <p className="text-[11px] text-slate-500">
                Decreto-Ley N° 1.204 • SUSCERTE • Expediente {contract.codigoExpediente}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nivel de Firma Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            1. Jerarquía Probatoria de Firma Electrónica
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Nivel 3 */}
            <div
              onClick={() => setSignatureLevel('nivel_3')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                signatureLevel === 'nivel_3'
                  ? 'bg-amber-50/80 border-amber-400 text-slate-900 shadow-2xs'
                  : 'bg-[#FAF8F5] border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Nivel 3: Calificada Avanzada</span>
                {signatureLevel === 'nivel_3' && <Check className="w-4 h-4 text-amber-700" />}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Código OTP + Hash SHA-256 + Geotrazabilidad. Ideal para contratos operativos y comerciales ordinarios.
              </p>
            </div>

            {/* Nivel 4 */}
            <div
              onClick={() => setSignatureLevel('nivel_4')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                signatureLevel === 'nivel_4'
                  ? 'bg-sky-50/80 border-sky-400 text-slate-900 shadow-2xs'
                  : 'bg-[#FAF8F5] border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Nivel 4: Certificada SUSCERTE</span>
                {signatureLevel === 'nivel_4' && <Check className="w-4 h-4 text-sky-700" />}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Pleno valor legal automático (Art. 16 Ley Mensajes). Equipara legalmente a firma manuscrita sin peritaje.
              </p>
            </div>
          </div>

          {signatureLevel === 'nivel_4' && (
            <div className="bg-sky-50/60 p-2.5 rounded-lg border border-sky-200 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">Proveedor Acreditado SUSCERTE:</span>
              <div className="flex items-center gap-2">
                {(['PROCERT', 'APACUANA', 'AUTHENOLOGY'] as const).map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setSuscerteProvider(prov)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      suscerteProvider === prov
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Canvas de Firma Táctil */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              2. Captura de Firma Manuscrita / Biométrica
            </label>
            <button
              type="button"
              onClick={clearSignature}
              className="text-[11px] text-slate-500 hover:text-amber-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar Trazo</span>
            </button>
          </div>

          <div className="bg-[#FAF8F5] rounded-xl border-2 border-dashed border-slate-300 p-1 relative">
            <canvas
              ref={canvasRef}
              width={560}
              height={130}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-28 sm:h-32 bg-white rounded-lg cursor-crosshair touch-none"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                <span>Dibuje la firma aquí con el mouse o dedo</span>
              </div>
            )}
          </div>
        </div>

        {/* Código OTP */}
        <div className="space-y-2 bg-[#FAF8F5] p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-700" />
              <span>3. Autenticación OTP (WhatsApp / SMS)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {contract.trabajador.telefono}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300"
              >
                <span>Generar y Enviar Código OTP</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Código 6 dígitos"
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-center text-sm font-mono tracking-widest text-slate-900 font-bold w-36 focus:outline-none focus:border-amber-500"
                />
                <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Código OTP validado para simulación</span>
                </div>
              </div>
            )}
          </div>

          {otpError && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" />
              Código OTP incorrecto. Por favor verifique el código recibido.
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isSealing || (!otpSent && !enteredOtp)}
            onClick={handleCompleteSign}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wide shadow-xs transition-all flex items-center gap-2 active:scale-95"
          >
            {isSealing ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Sellando Criptográficamente SHA-256...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Formalizar Firma y Emitir Doble Ejemplar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
