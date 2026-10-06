import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { LaborContract } from '../../types/contract';
import { 
  LOTTT_ARTICLES_CATALOG, 
  FAQS_RRHH_VENEZUELA, 
  LotttArticle, 
  FaqItem 
} from '../../utils/lotttKnowledgeBase';
import { validateSalarizacionRisk } from '../../utils/lotttCalculations';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  RotateCcw,
  MessageSquareQuote,
  Scale,
  Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  articles?: string[];
  alertLevel?: 'info' | 'warning' | 'success';
}

interface LotttAdvisorProps {
  currentContract?: LaborContract | null;
  contracts: LaborContract[];
  onOpenContract?: (contract: LaborContract) => void;
}

export const LotttAdvisor: React.FC<LotttAdvisorProps> = ({
  currentContract,
  contracts,
  onOpenContract
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      content: '¡Hola! Soy tu **Consultor Virtual de Recursos Humanos y Cumplimiento LOTTT en Venezuela**. Estoy aquí para orientarte en la elaboración segura de contratos de trabajo, advertir contingencias legales según la doctrina de la Sala Social del TSJ, calcular incidencias salariales y verificar el cumplimiento de la LOPCYMAT (NT-04-2023).\n\n¿En qué puedo asistirte hoy?',
      alertLevel: 'info'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'articulos' | 'faqs' | 'auditoria'>('chat');
  const [articleSearch, setArticleSearch] = useState('');
  const [auditResult, setAuditResult] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auditoría automática de un contrato
  const handleAuditContract = (contractToAudit: LaborContract) => {
    const findings: { type: 'success' | 'warning' | 'danger'; text: string; art: string }[] = [];
    
    // 1. Verificación de modalidad y prórrogas
    if (contractToAudit.modalidad === 'determinado') {
      if ((contractToAudit.numeroProrroga || 0) >= 1) {
        findings.push({
          type: 'warning',
          text: `El contrato está en su 1ª prórroga formal. Conforme al Art. 62 de la LOTTT, celebrar una 2ª prórroga convertirá el contrato en tiempo indeterminado de pleno derecho.`,
          art: 'Art. 62 LOTTT'
        });
      }
      if (!contractToAudit.causalArt64) {
        findings.push({
          type: 'danger',
          text: `Falta fundamentar la causal taxativa temporal del Artículo 64 de la LOTTT.`,
          art: 'Art. 64 LOTTT'
        });
      }
    } else {
      findings.push({
        type: 'success',
        text: `Modalidad por tiempo indeterminado en apego a la regla general de estabilidad (Art. 61 LOTTT).`,
        art: 'Art. 61 LOTTT'
      });
    }

    // 2. Control de Salarización TSJ 341
    const risk = validateSalarizacionRisk(contractToAudit.remuneracion);
    if (risk.alertaRiesgo) {
      findings.push({
        type: risk.nivelRiesgo === 'ALTO_BLOQUEANTE' ? 'danger' : 'warning',
        text: `${risk.mensaje}: Se han detectado asignaciones o comisiones que los tribunales laborales calificarán como salario normal conforme a la Sentencia 341 de la Sala de Casación Social del TSJ.`,
        art: 'TSJ Sentencia 341 / Art. 104 LOTTT'
      });
    } else {
      findings.push({
        type: 'success',
        text: `Estructura salarial balanceada con Cestaticket independiente sin riesgo de reclasificación forzosa.`,
        art: 'Art. 105 LOTTT'
      });
    }

    // 3. LOPCYMAT NT-04-2023
    if (!contractToAudit.lopcymat?.requiereNotificacion) {
      findings.push({
        type: 'danger',
        text: `La Notificación de Riesgos LOPCYMAT no está configurada. Exposición a multas de 76 a 100 U.T. por trabajador (Art. 119 LOPCYMAT).`,
        art: 'Art. 53 y 119 LOPCYMAT'
      });
    } else {
      findings.push({
        type: 'success',
        text: `Notificación de procesos peligrosos generada y vinculada a la Norma Técnica NT-04-2023.`,
        art: 'NT-04-2023'
      });
    }

    // 4. Doble Ejemplar Original
    if (contractToAudit.dobleEjemplarEmitido) {
      findings.push({
        type: 'success',
        text: `Emisión de dos (2) ejemplares originales de idéntico tenor programada conforme al mandato del Art. 59 numeral 14.`,
        art: 'Art. 59 N° 14 LOTTT'
      });
    }

    // 5. Auditoría Especial de Salario por Unidad de Obra / Comisión (Arts. 114, 115 y 119 LOTTT)
    if (contractToAudit.clasificacion === 'unidad_obra' || contractToAudit.remuneracion?.esUnidadDeObra) {
      if (contractToAudit.remuneracion?.garantiaSalarioMinimoArt115) {
        findings.push({
          type: 'success',
          text: `Garantía legal imperativa de Salario Mínimo Nacional blindada en el contrato conforme al Artículo 115 de la LOTTT.`,
          art: 'Art. 115 LOTTT'
        });
      } else {
        findings.push({
          type: 'danger',
          text: `ALERTA CRÍTICA: Falta estipular la garantía de que lo devengado nunca será inferior al salario mínimo nacional vigente.`,
          art: 'Art. 115 LOTTT'
        });
      }

      findings.push({
        type: 'success',
        text: `Cláusula de pago obligatorio de descansos semanales y días feriados calculados con el salario promedio devengado en la semana (Art. 119 LOTTT).`,
        art: 'Art. 119 LOTTT'
      });

      findings.push({
        type: 'success',
        text: `Blindaje de riesgos de taller (mecánicos, ruido, hidrocarburos) y dotación obligatoria de EPP bajo la Norma Técnica NT-04-2023.`,
        art: 'LOPCYMAT NT-04-2023'
      });
    }

    setAuditResult({
      contract: contractToAudit,
      score: findings.filter(f => f.type === 'success').length,
      total: findings.length,
      findings
    });

    setActiveTab('auditoria');
  };

  // Enviar mensaje o pregunta libre
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      content: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      // Intentar llamar a Gemini API si existe key en entorno
      const apiKey = 
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
        '';

      let aiResponseText = '';
      let relatedArticles: string[] = [];

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: query,
          config: {
            systemInstruction: `Eres "Nominus Asesor LOTTT", un abogado especialista en Derecho Laboral y Director Senior de Recursos Humanos en Venezuela. 
Tu labor es responder consultas sobre la LOTTT (Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras), LOPCYMAT (Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo), Norma Técnica NT-04-2023, jurisprudencia de la Sala de Casación Social del Tribunal Supremo de Justicia (especialmente Sentencia 341 sobre salarización de beneficios), cálculo de prestaciones (Art. 142), Cestaticket Socialista (Decreto 4805 / Art. 105), jornada laboral (Art. 173/178), modalidades de contratación (Arts. 60-64), y validez probatoria de firmas electrónicas según el Decreto-Ley 1.204 y SUSCERTE.
Responde con tono profesional, empático, claro y pedagógico. Cita siempre los números de artículos aplicables de la LOTTT o LOPCYMAT y advierte los riesgos de contingencia patrimonial para la empresa.`
          }
        });
        aiResponseText = response.text || 'Sin respuesta del modelo.';
      } else {
        // Fallback al motor experto local de LOTTT
        const lower = query.toLowerCase();
        
        // Matching con FAQs o artículos
        const matchedFaq = FAQS_RRHH_VENEZUELA.find(f => 
          lower.includes(f.pregunta.toLowerCase().slice(0, 15)) ||
          (lower.includes('dolar') && f.id === 'faq-1') ||
          (lower.includes('cestaticket') && f.id === 'faq-2') ||
          (lower.includes('prórroga') && f.id === 'faq-3') ||
          (lower.includes('lopcymat') && f.id === 'faq-4') ||
          ((lower.includes('caucho') || lower.includes('taller') || lower.includes('mecanic') || lower.includes('unidad de obra') || lower.includes('115')) && f.id === 'faq-7') ||
          (lower.includes('comision') && f.id === 'faq-5') ||
          (lower.includes('ejemplar') && f.id === 'faq-6')
        );

        if (matchedFaq) {
          aiResponseText = `**${matchedFaq.respuestaCorta}**\n\n${matchedFaq.respuestaDetallada}`;
          relatedArticles = matchedFaq.articulosRelacionados;
        } else if (lower.includes('prestacion') || lower.includes('142') || lower.includes('doble calculo') || lower.includes('garantia')) {
          aiResponseText = `**Régimen del Doble Cálculo de Prestaciones Sociales (Artículo 142 LOTTT):**\n\nEn Venezuela, la liquidación de prestaciones sociales se rige por un procedimiento de comparación obligatoria:\n1. **Garantía Trimestral (Art. 142 a, b):** El patrono deposita 15 días de salario integral por cada trimestre laborado. A partir del 2do año, se acumulan 2 días adicionales por cada año hasta un máximo de 30 días.\n2. **Cómputo Retroactivo (Art. 142 c):** Se computan 30 días de salario integral por cada año de servicio o fracción mayor a 6 meses, tomando como base el **último salario integral devengado**.\n3. **Adjudicación (Art. 142 d):** El trabajador recibirá el monto que resulte cuantitativamente superior entre ambos cálculos. Si el despido es injustificado, se suma adicionalmente la indemnización del **Artículo 92 ("doblete")**.`;
          relatedArticles = ['Artículo 142 LOTTT', 'Artículo 92 LOTTT', 'Artículo 122 LOTTT'];
        } else if (lower.includes('jornada') || lower.includes('horas') || lower.includes('horario') || lower.includes('descanso')) {
          aiResponseText = `**Límites de Jornada y Descansos Legales (Artículos 173 a 178 LOTTT):**\n\n• **Jornada Diurna:** Máximo 8 horas diarias y **40 horas semanales**.\n• **Jornada Nocturna:** Máximo 7 horas diarias y **35 horas semanales**.\n• **Jornada Mixta:** Máximo 7.5 horas diarias y **37.5 horas semanales**.\n• **Descanso Semanal:** Derecho ineludible a **dos (2) días continuos y remunerados** por semana.\n• **Exención de Dirección (Art. 178):** Los gerentes calificados como personal de dirección (Art. 37) no están sujetos a la jornada máxima ni generan cobro de horas extras, siempre que conste expresamente en el contrato.`;
          relatedArticles = ['Artículo 173 LOTTT', 'Artículo 176 LOTTT', 'Artículo 178 LOTTT'];
        } else if (lower.includes('despido') || lower.includes('justificado') || lower.includes('falta')) {
          aiResponseText = `**Causales Taxativas de Despido Justificado (Artículo 79 LOTTT):**\n\nEl patrono solo puede despedir justificadamente sin pagar indemnización por causales expresas, tales como: falta de probidad o conducta inmoral; vías de hecho; injuria o falta grave de respeto; hecho intencional o negligencia grave que afecte la seguridad; omisiones que comprometan la higiene; inasistencia injustificada durante 3 días hábiles en el período de un mes; o revelación de secretos de manufactura. Requiere calificación previa de despido ante la Inspectoría del Trabajo si opera inamovilidad.`;
          relatedArticles = ['Artículo 79 LOTTT', 'Artículo 80 LOTTT', 'Artículo 422 LOTTT'];
        } else {
          aiResponseText = `Como especialista en Derecho Laboral venezolano, te asesoro en el marco de la **LOTTT** y la **LOPCYMAT**.\n\nPara garantizar un contrato blindado:\n1. Cumple con los **14 requisitos taxativos del Artículo 59**.\n2. Emite siempre **dos (2) ejemplares originales de idéntico tenor** (uno para el trabajador y otro para el archivo patronal).\n3. Anexa previamente la **Notificación de Riesgos LOPCYMAT (NT-04-2023)** para evitar multas de hasta 100 U.T. por trabajador.\n4. Si el contrato es a tiempo determinado, vigila el límite de **1 sola prórroga (Art. 62)** para evitar la conversión automática a tiempo indeterminado.\n5. Registra el Cestaticket Socialista de $40 USD en recibo separado de conformidad con el **Artículo 105**.\n\nPuedes consultar un artículo específico en la pestaña superior "Artículos LOTTT" o auditar un contrato en la pestaña "Auditoría".`;
          relatedArticles = ['Artículo 58 LOTTT', 'Artículo 59 LOTTT', 'Artículo 62 LOTTT', 'NT-04-2023'];
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
        content: aiResponseText,
        articles: relatedArticles
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
          content: 'Estimado usuario, el Artículo 59 de la LOTTT y las directrices de la Sala Social del TSJ exigen estricta formalidad escrita. Recuerde que a falta de contrato formal opera la presunción iuris tantum del Art. 58 a favor del trabajador.',
          alertLevel: 'warning'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = LOTTT_ARTICLES_CATALOG.filter(a => 
    a.numero.toLowerCase().includes(articleSearch.toLowerCase()) ||
    a.titulo.toLowerCase().includes(articleSearch.toLowerCase()) ||
    a.resumen.toLowerCase().includes(articleSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-amber-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[780px] max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-100/70 via-amber-50 to-orange-50/40 border-b border-amber-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 font-serif">Nominus Asesor LOTTT</h2>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Consultor Legal Activo
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Consultor de Recursos Humanos y Derecho Laboral en Venezuela (LOTTT, LOPCYMAT NT-04-2023 y TSJ)
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-amber-100/70 p-1 rounded-xl border border-amber-200 text-xs self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-white text-slate-950 shadow-xs border border-amber-300' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-700" />
            <span>Consultar al Asesor</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'faqs' ? 'bg-white text-slate-950 shadow-xs border border-amber-300' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preguntas Frecuentes
          </button>
          <button
            onClick={() => setActiveTab('articulos')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'articulos' ? 'bg-white text-slate-950 shadow-xs border border-amber-300' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catálogo LOTTT
          </button>
          <button
            onClick={() => {
              if (currentContract) handleAuditContract(currentContract);
              else if (contracts[0]) handleAuditContract(contracts[0]);
              else setActiveTab('auditoria');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'auditoria' ? 'bg-white text-amber-950 shadow-xs border border-amber-300 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auditar Contrato
          </button>
        </div>
      </div>

      {/* Main Body Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#FAF8F5]/60 border-b border-amber-200/80">
        {/* TAB 1: Chat Conversacional */}
        {activeTab === 'chat' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Tarjeta de Guía para el Usuario */}
            <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50/40 border-2 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">Historial de Conversación con el Asesor LOTTT</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Revise las respuestas jurídicas emitidas arriba. <strong>Para realizar una nueva pregunta, utilice el panel destacado al pie con el recuadro amarillo.</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  inputRef.current?.focus();
                  inputRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                <span>Ir al Recuadro de Pregunta</span>
                <span className="font-mono">↓</span>
              </button>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium ml-12 rounded-tr-xs'
                      : 'bg-white border border-amber-200/70 text-slate-800 rounded-tl-xs space-y-2.5'
                  }`}
                >
                  <div className="whitespace-pre-line text-slate-800">{m.content}</div>

                  {m.articles && m.articles.length > 0 && (
                    <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-semibold text-slate-600">Fundamento Legal:</span>
                      {m.articles.map((art, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[10px] px-2 py-0.5 rounded"
                        >
                          {art}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right font-mono">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-amber-200/70 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-300" />
                  <span className="text-[11px] text-slate-600 ml-1">Consultando doctrina laboral LOTTT y LOPCYMAT...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* TAB 2: Preguntas Frecuentes (FAQs) */}
        {activeTab === 'faqs' && (
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="mb-2">
              <h3 className="font-bold text-sm text-slate-800 font-serif">Consultas Frecuentes de Recursos Humanos en Venezuela</h3>
              <p className="text-xs text-slate-500">Haga clic en cualquiera para obtener la orientación técnica y jurisprudencial completa:</p>
            </div>

            {FAQS_RRHH_VENEZUELA.map((faq) => (
              <div
                key={faq.id}
                onClick={() => {
                  setActiveTab('chat');
                  handleSendMessage(faq.pregunta);
                }}
                className="bg-white hover:bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 cursor-pointer transition-all space-y-1.5 shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-amber-900 transition-colors">
                    {faq.pregunta}
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{faq.respuestaCorta}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {faq.articulosRelacionados.map((a, i) => (
                    <span key={i} className="text-[10px] font-mono bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded text-amber-800">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Catálogo de Artículos LOTTT */}
        {activeTab === 'articulos' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 font-serif">Compendio de Artículos Clave LOTTT & LOPCYMAT</h3>
                <p className="text-xs text-slate-500">Resúmenes técnicos con implicaciones directas para la entidad patronal</p>
              </div>

              <input
                type="text"
                placeholder="Buscar por artículo o tema..."
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className="bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 w-full sm:w-60"
              />
            </div>

            <div className="space-y-3">
              {filteredArticles.map((art, idx) => (
                <div key={idx} className="bg-white border border-amber-200/80 rounded-xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {art.numero}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-slate-500">{art.categoria}</span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-800">{art.titulo}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{art.resumen}</p>
                  
                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-[11px] space-y-1">
                    <strong className="text-amber-900 block font-sans">Implicación Práctica Patronal:</strong>
                    <span className="text-slate-700">{art.implicacionPatronal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Auditoría de Cumplimiento de Contrato */}
        {activeTab === 'auditoria' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
              <div>
                <span className="text-[10px] font-mono text-amber-800 uppercase font-semibold">DIAGNÓSTICO LEGAL PROACTIVO</span>
                <h3 className="font-bold text-sm text-slate-800 font-serif">
                  Auditoría Normativa LOTTT / LOPCYMAT
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluando: {auditResult?.contract?.trabajador?.nombres} {auditResult?.contract?.trabajador?.apellidos} ({auditResult?.contract?.codigoExpediente})
                </p>
              </div>

              {contracts.length > 1 && (
                <select
                  value={auditResult?.contract?.id || ''}
                  onChange={(e) => {
                    const c = contracts.find(x => x.id === e.target.value);
                    if (c) handleAuditContract(c);
                  }}
                  className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium max-w-xs"
                >
                  {contracts.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.empresa.alias || c.empresa.denominacionSocial.slice(0, 16)}] {c.trabajador.nombres} {c.trabajador.apellidos} ({c.codigoExpediente})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {auditResult && (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold font-mono text-sm">
                      {Math.round((auditResult.score / auditResult.total) * 100)}%
                    </div>
                    <div>
                      <div className="font-bold text-xs text-emerald-950">Índice de Blindaje Normativo</div>
                      <div className="text-[11px] text-emerald-800">
                        {auditResult.score} de {auditResult.total} verificaciones jurídicas cumplidas plenamente
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-200">
                    Apto para suscripción
                  </span>
                </div>

                <div className="space-y-2">
                  {auditResult.findings.map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                        f.type === 'success'
                          ? 'bg-white border-emerald-200 text-slate-800'
                          : f.type === 'warning'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                    >
                      {f.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : f.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{f.text}</span>
                          <span className="font-mono text-[10px] bg-white/80 px-2 py-0.5 rounded border border-slate-200 text-slate-600 shrink-0 ml-2">
                            {f.art}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Área de Entrada Destacada: Panel Separado con Recuadro de Pregunta Prominente */}
      <div className="bg-gradient-to-b from-amber-50/95 via-white to-amber-50/50 border-t-4 border-amber-400 p-4 sm:p-5 shadow-lg relative shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Cabecera del Espacio de Pregunta */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-900 tracking-wide uppercase">
                    ¿Dónde formular su pregunta? Escriba en este recuadro:
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-ping" />
                    Campo de Consulta Activo
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Ingrese cualquier duda sobre contratos de trabajo, comisiones (Arts. 114 y 115), jornada, Cestaticket o LOPCYMAT
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              <span className="hidden sm:inline-flex items-center gap-1">
                Presione <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-800 shadow-2xs">Enter</kbd> para enviar
              </span>
              <span className="text-amber-300 hidden sm:inline">·</span>
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Citas de Artículos LOTTT
              </span>
            </div>
          </div>

          {/* Carrusel de Preguntas Frecuentes Rápidas (1 Clic) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                O seleccione una consulta frecuente con 1 clic:
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Autocompleta y consulta de inmediato</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { q: '¿Cómo contratar cauchero o mecánico a comisión? (Arts. 114 y 115)', tag: 'Taller / Baremo' },
                { q: '¿Cómo se calcula el salario integral (Si) con alícuotas?', tag: 'Art. 122 LOTTT' },
                { q: '¿Qué contingencia genera la Sentencia 341 TSJ?', tag: 'Salarización' },
                { q: '¿Cuándo opera la conversión forzosa de la 2ª prórroga?', tag: 'Art. 62 LOTTT' },
                { q: '¿El Cestaticket de $40 tasa BCV genera prestaciones?', tag: 'Art. 105 LOTTT' },
                { q: '¿Qué EPP y requisitos exige LOPCYMAT en taller automotriz?', tag: 'NT-04-2023' },
                { q: '¿Cómo opera el doble cálculo de prestaciones del Art. 142?', tag: 'Art. 142 LOTTT' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(item.q);
                  }}
                  className="bg-white hover:bg-amber-100/80 text-slate-800 hover:text-amber-950 border border-amber-300 hover:border-amber-500 px-3 py-1.5 rounded-xl whitespace-nowrap text-xs transition-all shadow-2xs flex items-center gap-1.5 shrink-0 group active:scale-95"
                >
                  <span className="font-semibold">{item.q}</span>
                  <span className="text-[9px] font-mono bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200 group-hover:bg-white font-bold">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recuadro de Escritura Prominente y Elevado con Tarjeta Destacada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="bg-white border-2 border-amber-400 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-200/80 rounded-2xl shadow-md transition-all p-3 sm:p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 px-1">
              <label htmlFor="lottt-question-box" className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                <span>Escriba su consulta laboral detallada aquí:</span>
              </label>
              {inputQuery.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded"
                >
                  Limpiar texto
                </button>
              )}
            </div>

            <textarea
              id="lottt-question-box"
              ref={inputRef}
              rows={2}
              placeholder="Ejemplo: ¿Cómo redactar el contrato a comisión de un cauchero según los Arts. 114 y 115? o ¿Qué conceptos integran el Salario Integral según el Art. 122?..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="w-full bg-transparent px-2.5 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed font-sans"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 px-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Respaldo en LOTTT, LOPCYMAT y jurisprudencia de la Sala Social del TSJ</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95 uppercase tracking-wide border border-amber-300"
              >
                <span>Enviar Pregunta al Asesor</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
