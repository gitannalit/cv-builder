import { toast } from "sonner";

export const ATS_GUIDE = {
  title: "Guía Práctica: Cómo Superar los Filtros ATS",
  subtitle: "Checklist completo para optimizar tu CV y conseguir más entrevistas",

  sections: [
    {
      title: "¿Qué es un ATS?",
      content: `Un ATS (Applicant Tracking System) es un software que utilizan las empresas para filtrar currículums automáticamente. Más del 75% de las empresas medianas y grandes usan estos sistemas.

**Dato importante:** El 70% de los CVs son rechazados por el ATS antes de que un humano los vea.`,
      checklist: null
    },
    {
      title: "Formato del CV",
      content: null,
      checklist: [
        { item: "Usa formato PDF o DOCX (evita imágenes escaneadas)", critical: true },
        { item: "Fuente legible: Arial, Calibri, Times New Roman (10-12pt)", critical: true },
        { item: "Márgenes de 2.5cm mínimo", critical: false },
        { item: "Sin tablas complejas ni columnas múltiples", critical: true },
        { item: "Sin encabezados ni pies de página con información importante", critical: true },
        { item: "Sin gráficos, iconos o imágenes decorativas", critical: false },
        { item: "Títulos de sección claros y estándar", critical: true }
      ]
    },
    {
      title: "Palabras Clave",
      content: null,
      checklist: [
        { item: "Incluye palabras clave exactas de la oferta de empleo", critical: true },
        { item: "Usa tanto siglas como términos completos (ej: SEO y Search Engine Optimization)", critical: false },
        { item: "Menciona herramientas y tecnologías específicas", critical: true },
        { item: "Incluye certificaciones relevantes con nombre completo", critical: false },
        { item: "Usa verbos de acción: lideré, implementé, desarrollé, optimicé", critical: false }
      ]
    },
    {
      title: "Secciones Obligatorias",
      content: null,
      checklist: [
        { item: "Datos de contacto: nombre, email, teléfono, LinkedIn", critical: true },
        { item: "Resumen profesional (3-4 líneas con palabras clave)", critical: true },
        { item: "Experiencia laboral con fechas (MM/AAAA)", critical: true },
        { item: "Formación académica con fechas", critical: true },
        { item: "Habilidades técnicas y blandas", critical: true },
        { item: "Idiomas con nivel", critical: false }
      ]
    },
    {
      title: "Experiencia Laboral",
      content: null,
      checklist: [
        { item: "Formato: Puesto | Empresa | Fechas", critical: true },
        { item: "Logros cuantificados (%, €, números)", critical: true },
        { item: "Usa el método STAR: Situación, Tarea, Acción, Resultado", critical: false },
        { item: "Máximo 5-6 bullets por puesto", critical: false },
        { item: "Orden cronológico inverso (más reciente primero)", critical: true }
      ]
    },
    {
      title: "Errores Fatales a Evitar",
      content: null,
      checklist: [
        { item: "NO uses 'Currículum Vitae' como título", critical: true },
        { item: "NO incluyas foto (en España es opcional, en otros países puede ser discriminatorio)", critical: false },
        { item: "NO uses caracteres especiales: ★, ●, →", critical: true },
        { item: "NO escribas en primera persona", critical: false },
        { item: "NO incluyas información personal: edad, estado civil, DNI", critical: true },
        { item: "NO uses abreviaturas no estándar", critical: false }
      ]
    }
  ],

  quickTips: [
    "Personaliza tu CV para cada oferta (mínimo el 60% del contenido)",
    "El nombre del archivo debe ser: Nombre_Apellido_Puesto.pdf",
    "Mantén tu CV en 1-2 páginas máximo",
    "Revisa la ortografía (los ATS detectan errores)",
    "Actualiza tu LinkedIn para que coincida con tu CV"
  ]
};

export const generateATSGuideHTML = (userName: string): string => {
  const { title, subtitle, sections, quickTips } = ATS_GUIDE;

  const sectionsHTML = sections.map(section => {
    let html = `<h2>${section.title}</h2>`;
    if (section.content) {
      // Parse basic markdown-like bold syntax
      const content = section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<div class="content">${content}</div>`;
    }
    if (section.checklist) {
      html += '<ul class="checklist">';
      section.checklist.forEach(item => {
        html += `<li class="${item.critical ? 'critical' : ''}">${item.item}</li>`;
      });
      html += '</ul>';
    }
    return html;
  }).join('');

  const tipsHTML = quickTips.map(tip => `<li>${tip}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 60px; /* More padding for PDF */
      background: white;
    }
    h1 { 
      color: #0d9488; 
      font-size: 32px; 
      margin-bottom: 8px;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 10px;
    }
    h2 { 
      color: #0d9488; 
      font-size: 22px; 
      margin: 30px 0 15px;
      padding-left: 10px;
      border-left: 5px solid #0d9488;
    }
    .subtitle { 
      color: #666; 
      font-size: 18px; 
      margin-bottom: 40px;
      font-style: italic;
    }
    .greeting {
      background: #f0fdfa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #0d9488;
      margin-bottom: 30px;
      font-size: 15px;
    }
    .content { 
      margin-bottom: 20px;
      white-space: pre-line;
      font-size: 15px;
    }
    .checklist { 
      list-style: none; 
      padding: 0;
    }
    .checklist li { 
      padding: 10px 0 10px 35px;
      position: relative;
      border-bottom: 1px solid #f3f4f6;
      font-size: 15px;
    }
    .checklist li::before {
      content: "☐";
      position: absolute;
      left: 5px;
      font-size: 20px;
      color: #0d9488;
      top: 6px;
    }
    .critical::after {
      content: " ⚠️ IMPORTANTE";
      color: #dc2626;
      font-size: 11px;
      font-weight: bold;
      background: #fef2f2;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 8px;
    }
    .quick-tips {
      background: #fffbeb;
      padding: 25px;
      border-radius: 12px;
      margin: 40px 0;
      border: 1px solid #fcd34d;
    }
    .quick-tips h3 {
      color: #92400e;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .quick-tips ul {
      margin-left: 20px;
    }
    .quick-tips li {
      margin-bottom: 8px;
      font-size: 15px;
    }
    .resources {
      background: #f0f9ff;
      padding: 25px;
      border-radius: 12px;
      border: 1px solid #bae6fd;
    }
    .resources h3 {
      color: #0369a1;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .resource-item {
      margin-bottom: 12px;
      font-size: 15px;
    }
    .resource-item a {
      color: #0284c7;
      font-weight: bold;
      text-decoration: none;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #f3f4f6;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="subtitle">${subtitle}</p>
  
  <div class="greeting">
    <strong>¡Hola ${userName}!</strong><br>
    Esta guía te ayudará a optimizar tu CV para superar los filtros ATS y conseguir más entrevistas.
    Imprímela y marca cada punto a medida que revisas tu currículum.
  </div>
  
  ${sectionsHTML}
  
  <div class="quick-tips">
    <h3>💡 Tips Rápidos</h3>
    <ul>
      ${tipsHTML}
    </ul>
  </div>
  
  <div class="footer">
    <p>Generado por <strong>T2W CV Builder</strong> - Training2Work</p>
    <p>© ${new Date().getFullYear()} training2work.com</p>
  </div>
</body>
</html>`;
};

export async function downloadATSGuidePDF(userName: string): Promise<void> {
  const html = generateATSGuideHTML(userName);
  const filename = `Guia_ATS_T2W_${userName.replace(/\s+/g, '_')}.pdf`;

  // Dynamically import libraries (same as template generator)
  try {
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);
    const html2canvas = html2canvasModule.default;
    const { jsPDF } = jsPDFModule;

    // Create a hidden container to render the HTML
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm; 
      background: white;
    `;

    // Create iframe to isolate styles
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px; /* A4 width @ 96 DPI */
      height: 1123px; /* A4 height @ 96 DPI */
      border: none;
    `;
    document.body.appendChild(iframe);

    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = 'about:blank';
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error('Could not access iframe document');

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Wait for content render
    await new Promise(resolve => setTimeout(resolve, 500));

    const contentElement = iframeDoc.body; // Render full body

    const canvas = await html2canvas(contentElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    document.body.removeChild(iframe);

  } catch (error) {
    console.error("Error generating ATS Guide PDF:", error);
    toast.error("Error al generar la guía PDF");
  }
}
