import { jsPDF } from 'jspdf';
import { LaborContract } from '../types/contract';
import { generateContractLegalText, generateLopcymatNotificationText } from './contractTemplates';

/**
 * Utilidades de Exportación Funcional de Contratos a Microsoft Word (.doc) y PDF (.pdf)
 * Para Nominus Contratos | Cumplimiento LOTTT y LOPCYMAT en Venezuela
 */

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Exporta el contrato a Microsoft Word (.doc) con formato tipográfico legal formal,
 * encabezado patronal, márgenes de página y bloques de firma.
 */
export function exportContractToWord(c: LaborContract): void {
  const e = c.empresa;
  const t = c.trabajador;
  const legalText = generateContractLegalText(c);

  // Convert text paragraphs to formatted HTML paragraphs
  const paragraphsHtml = legalText
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      // Headings for clauses
      if (
        trimmed.startsWith('CONTRATO') || 
        trimmed.startsWith('CLÁUSULA') || 
        trimmed.startsWith('PRIMERA') ||
        trimmed.startsWith('SEGUNDA') ||
        trimmed.startsWith('TERCERA') ||
        trimmed.startsWith('CUARTA') ||
        trimmed.startsWith('QUINTA') ||
        trimmed.startsWith('SEXTA') ||
        trimmed.startsWith('SÉPTIMA') ||
        trimmed.startsWith('OCTAVA') ||
        trimmed.startsWith('NOVENA') ||
        trimmed.startsWith('DÉCIMA') ||
        trimmed.startsWith('PARÁGRAFO')
      ) {
        return `<p style="font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; text-align: justify; color: #111827;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      }
      return `<p style="text-indent: 28pt; margin-bottom: 10pt; text-align: justify; line-height: 1.35; color: #1f2937;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Contrato de Trabajo - ${t.nombres} ${t.apellidos}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.3;
      color: #000000;
    }
    .header-table {
      width: 100%;
      border-bottom: 2pt solid #000000;
      padding-bottom: 8pt;
      margin-bottom: 18pt;
    }
    .signatures-table {
      width: 100%;
      margin-top: 40pt;
      border-collapse: collapse;
    }
    .signature-box {
      width: 50%;
      text-align: center;
      vertical-align: top;
      padding: 10pt;
    }
    .signature-line {
      border-top: 1pt solid #000000;
      width: 80%;
      margin: 40pt auto 6pt auto;
    }
    .badge {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      background-color: #f3f4f6;
      border: 1pt solid #9ca3af;
      padding: 3pt 6pt;
    }
  </style>
</head>
<body lang="ES-VE">
  <div class="Section1">
    <!-- Header Empresa -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; text-align: left;">
          <strong style="font-size: 13pt; text-transform: uppercase;">${e.denominacionSocial}</strong><br/>
          <span style="font-size: 9pt; font-family: Arial, sans-serif; color: #4b5563;">
            RIF: ${e.rif} | RNET: ${e.rnetNumero || 'En trámite'}<br/>
            ${e.registroMercantil}<br/>
            ${e.domicilioFiscal}
          </span>
        </td>
        <td style="vertical-align: top; text-align: right; width: 35%;">
          <span class="badge">EJEMPLAR ORIGINAL</span><br/>
          <span style="font-size: 8pt; font-family: Arial, sans-serif; color: #6b7280;">Art. 59 Numeral 14 LOTTT</span><br/>
          <span style="font-size: 9pt; font-family: monospace; font-weight: bold; color: #1e3a8a;">EXP: ${c.codigoExpediente}</span>
        </td>
      </tr>
    </table>

    <!-- Contenido del Contrato -->
    ${paragraphsHtml}

    <!-- Cuadro de Firmas Oficial -->
    <table class="signatures-table">
      <tr>
        <td class="signature-box">
          <div class="signature-line"></div>
          <strong>POR LA ENTIDAD DE TRABAJO</strong><br/>
          <span>${e.representanteNombre}</span><br/>
          <span style="font-size: 9pt;">C.I. N° ${e.representanteCI}</span><br/>
          <span style="font-size: 9pt;">Carácter: ${e.representanteCargo}</span>
        </td>
        <td class="signature-box">
          <div class="signature-line"></div>
          <strong>EL TRABAJADOR / TRABAJADORA</strong><br/>
          <span>${t.nombres} ${t.apellidos}</span><br/>
          <span style="font-size: 9pt;">C.I. N° ${t.cedula}</span><br/>
          <span style="font-size: 9pt;">Cargo: ${c.cargo}</span><br/>
          <span style="font-size: 8pt; color: #6b7280;">Constancia de recepción de 1 ejemplar original</span>
        </td>
      </tr>
    </table>

    <!-- Pie Legal Informativo -->
    <div style="margin-top: 25pt; font-family: Arial, sans-serif; font-size: 8pt; color: #6b7280; text-align: center; border-top: 0.5pt solid #d1d5db; padding-top: 6pt;">
      Documento formalizado conforme a la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT) y la LOPCYMAT.<br/>
      Expediente Digital Nominus Contratos ID: ${c.id} | Código: ${c.codigoExpediente}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const filename = `Contrato_${sanitizeFilename(t.nombres)}_${sanitizeFilename(t.apellidos)}_${c.codigoExpediente}.doc`;
  triggerDownload(blob, filename);
}

/**
 * Exporta el contrato directamente a formato PDF (.pdf) utilizando jsPDF,
 * con paginación automática, márgenes, cabecera corporativa y pie de página legal.
 */
export function exportContractToPdf(c: LaborContract): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const e = c.empresa;
  const t = c.trabajador;
  const legalText = generateContractLegalText(c);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      currentY = margin + 5;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(e.denominacionSocial.toUpperCase(), margin, currentY);
    
    doc.setFont('times', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`RIF: ${e.rif} | EXPEDIENTE: ${c.codigoExpediente} | EJEMPLAR ORIGINAL ART. 59 N° 14 LOTTT`, margin, currentY + 3.5);
    
    doc.setDrawColor(180, 190, 205);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);
    currentY += 10;
  };

  // Draw initial page header
  drawHeader();

  // Split into paragraphs
  const paragraphs = legalText.split('\n\n');

  paragraphs.forEach(p => {
    const trimmed = p.trim();
    if (!trimmed) return;

    const isHeading = 
      trimmed.startsWith('CONTRATO') || 
      trimmed.startsWith('CLÁUSULA') || 
      trimmed.startsWith('PRIMERA') ||
      trimmed.startsWith('SEGUNDA') ||
      trimmed.startsWith('TERCERA') ||
      trimmed.startsWith('CUARTA') ||
      trimmed.startsWith('QUINTA') ||
      trimmed.startsWith('SEXTA') ||
      trimmed.startsWith('SÉPTIMA') ||
      trimmed.startsWith('OCTAVA') ||
      trimmed.startsWith('NOVENA') ||
      trimmed.startsWith('DÉCIMA') ||
      trimmed.startsWith('PARÁGRAFO');

    if (isHeading) {
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const lines = doc.splitTextToSize(trimmed, contentWidth);
      checkPageBreak(lines.length * 4.5 + 4);
      currentY += 2;
      doc.text(lines, margin, currentY);
      currentY += lines.length * 4.5 + 2;
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(trimmed, contentWidth);
      checkPageBreak(lines.length * 4.2 + 3);
      doc.text(lines, margin, currentY);
      currentY += lines.length * 4.2 + 2.5;
    }
  });

  // Signature Block
  checkPageBreak(38);
  currentY += 8;

  const colWidth = (contentWidth - 10) / 2;
  const leftX = margin;
  const rightX = margin + colWidth + 10;

  // Lines
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.4);
  doc.line(leftX + 10, currentY + 14, leftX + colWidth - 10, currentY + 14);
  doc.line(rightX + 10, currentY + 14, rightX + colWidth - 10, currentY + 14);

  // Left (Employer)
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text('POR LA ENTIDAD DE TRABAJO', leftX + colWidth / 2, currentY + 18, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${e.representanteNombre} | C.I. N° ${e.representanteCI}`, leftX + colWidth / 2, currentY + 22, { align: 'center' });
  doc.text(`Carácter: ${e.representanteCargo}`, leftX + colWidth / 2, currentY + 25.5, { align: 'center' });

  // Right (Worker)
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text('EL TRABAJADOR / TRABAJADORA', rightX + colWidth / 2, currentY + 18, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${t.nombres} ${t.apellidos} | C.I. N° ${t.cedula}`, rightX + colWidth / 2, currentY + 22, { align: 'center' });
  doc.text(`Cargo: ${c.cargo} (Recibí 1 ejemplar original)`, rightX + colWidth / 2, currentY + 25.5, { align: 'center' });

  // Page Numbers in Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Página ${i} de ${totalPages} | Expediente Digital LOTTT ${c.codigoExpediente} | Nominus Contratos`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const filename = `Contrato_${sanitizeFilename(t.nombres)}_${sanitizeFilename(t.apellidos)}_${c.codigoExpediente}.pdf`;
  doc.save(filename);
}

/**
 * Exporta la Notificación de Riesgos LOPCYMAT (NT-04-2023) a Microsoft Word (.doc)
 */
export function exportLopcymatToWord(c: LaborContract): void {
  const e = c.empresa;
  const t = c.trabajador;
  const notifText = generateLopcymatNotificationText(c);

  const paragraphsHtml = notifText
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (/^[0-9]\./.test(trimmed) || trimmed.startsWith('NOTIFICACIÓN') || trimmed.startsWith('CUMPLIMIENTO')) {
        return `<p style="font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; color: #1e3a8a;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      }
      return `<p style="margin-bottom: 8pt; text-align: justify; line-height: 1.35; color: #1f2937;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Notificación LOPCYMAT - ${t.nombres} ${t.apellidos}</title>
  <style>
    @page { size: 8.5in 11.0in; margin: 1.0in; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.3; color: #111827; }
    .header-box { border-bottom: 2pt solid #1e3a8a; padding-bottom: 6pt; margin-bottom: 14pt; }
  </style>
</head>
<body lang="ES-VE">
  <div class="header-box">
    <strong style="font-size: 12pt; text-transform: uppercase;">${e.denominacionSocial}</strong><br/>
    <span style="font-size: 8.5pt; color: #4b5563;">RIF: ${e.rif} | Centro de Trabajo: ${c.lugarPrestacion}</span>
  </div>
  ${paragraphsHtml}
</body>
</html>`;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const filename = `Notificacion_LOPCYMAT_${sanitizeFilename(t.nombres)}_${sanitizeFilename(t.apellidos)}_${c.codigoExpediente}.doc`;
  triggerDownload(blob, filename);
}

/**
 * Exporta la Notificación de Riesgos LOPCYMAT (NT-04-2023) directamente a PDF (.pdf)
 */
export function exportLopcymatToPdf(c: LaborContract): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const e = c.empresa;
  const t = c.trabajador;
  const notifText = generateLopcymatNotificationText(c);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      currentY = margin + 5;
    }
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(e.denominacionSocial.toUpperCase(), margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`RIF: ${e.rif} | NOTIFICACIÓN DE RIESGOS LOPCYMAT NT-04-2023 | EXP: ${c.codigoExpediente}`, margin, currentY + 4);

  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6);
  currentY += 12;

  const paragraphs = notifText.split('\n\n');

  paragraphs.forEach(p => {
    const trimmed = p.trim();
    if (!trimmed) return;

    if (/^[0-9]\./.test(trimmed) || trimmed.startsWith('NOTIFICACIÓN') || trimmed.startsWith('CUMPLIMIENTO')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 58, 138);
      const lines = doc.splitTextToSize(trimmed, contentWidth);
      checkPageBreak(lines.length * 4.5 + 4);
      currentY += 2;
      doc.text(lines, margin, currentY);
      currentY += lines.length * 4.5 + 2;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(trimmed, contentWidth);
      checkPageBreak(lines.length * 4 + 2);
      doc.text(lines, margin, currentY);
      currentY += lines.length * 4 + 2;
    }
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Página ${i} de ${totalPages} | Notificación LOPCYMAT NT-04-2023 | Nominus Contratos`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const filename = `Notificacion_LOPCYMAT_${sanitizeFilename(t.nombres)}_${sanitizeFilename(t.apellidos)}_${c.codigoExpediente}.pdf`;
  doc.save(filename);
}
