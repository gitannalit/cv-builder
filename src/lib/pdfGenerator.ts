import { AnalysisResult, CVVersion } from "@/types/cv";

// Simple PDF generation using browser print
export async function generatePDFWithWatermark(
  cvContent: string,
  analysisResult: AnalysisResult,
  hasWatermark: boolean = true
): Promise<Blob> {
  const htmlContent = createHTMLDocument(cvContent, analysisResult, hasWatermark);
  return createPDFFromHTML(htmlContent);
}

export async function generateCVVersionPDF(
  version: CVVersion,
  hasWatermark: boolean = true
): Promise<Blob> {
  const htmlContent = createVersionHTMLDocument(version, hasWatermark);
  return createPDFFromHTML(htmlContent);
}

function createHTMLDocument(
  cvContent: string,
  analysisResult: AnalysisResult,
  hasWatermark: boolean
): string {
  const watermarkStyle = hasWatermark
    ? `
      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 80px;
        color: rgba(0, 204, 169, 0.15);
        font-weight: bold;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
      }
    `
    : "";

  const watermarkHTML = hasWatermark
    ? '<div class="watermark">T2W CV Builder</div>'
    : "";

  // Format recommendations as bullet points
  const recommendationsHTML = analysisResult.recommendations
    .map((rec) => `<li>${rec}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CV Analizado - T2W CV Builder</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        ${watermarkStyle}
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #00cca9;
        }
        .header h1 {
          color: #00cca9;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .score-section {
          background: linear-gradient(135deg, #00cca9 0%, #00b396 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }
        .score-section h2 {
          font-size: 48px;
          margin-bottom: 5px;
        }
        .score-section p {
          opacity: 0.9;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h3 {
          color: #00cca9;
          font-size: 18px;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        .cv-content {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.8;
        }
        .recommendations ul {
          list-style: none;
          padding: 0;
        }
        .recommendations li {
          padding: 10px 15px;
          margin-bottom: 8px;
          background: #f0fdf9;
          border-left: 3px solid #00cca9;
          border-radius: 0 8px 8px 0;
        }
        .keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .keyword {
          background: #fff3e0;
          color: #e65100;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 13px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .watermark {
            position: fixed;
          }
        }
      </style>
    </head>
    <body>
      ${watermarkHTML}
      
      <div class="header">
        <h1>📄 Análisis de CV</h1>
        <p>Generado por T2W CV Builder</p>
      </div>

      <div class="score-section">
        <h2>${analysisResult.atsScore}/100</h2>
        <p>Puntuación ATS</p>
      </div>

      <div class="section">
        <h3>📝 Tu CV Original</h3>
        <div class="cv-content">${cvContent}</div>
      </div>

      <div class="section recommendations">
        <h3>💡 Recomendaciones de Mejora</h3>
        <ul>
          ${recommendationsHTML}
        </ul>
      </div>

      ${
        analysisResult.missingKeywords.length > 0
          ? `
      <div class="section">
        <h3>🔑 Palabras Clave Sugeridas</h3>
        <div class="keywords">
          ${analysisResult.missingKeywords.map((kw) => `<span class="keyword">${kw}</span>`).join("")}
        </div>
      </div>
      `
          : ""
      }

      ${
        analysisResult.salaryRange
          ? `
      <div class="section">
        <h3>💰 Estimación Salarial</h3>
        <p style="font-size: 18px; color: #00cca9; font-weight: bold;">
          ${analysisResult.salaryRange.min.toLocaleString()}€ - ${analysisResult.salaryRange.max.toLocaleString()}€ / año
        </p>
        <p style="color: #666; margin-top: 5px;">${analysisResult.salaryRange.currency}</p>
      </div>
      `
          : ""
      }

      <div class="footer">
        <p>Generado el ${new Date().toLocaleDateString("es-ES")} | T2W CV Builder</p>
        ${hasWatermark ? "<p><strong>Versión gratuita con marca de agua</strong></p>" : ""}
      </div>
    </body>
    </html>
  `;
}

function createVersionHTMLDocument(version: CVVersion, hasWatermark: boolean): string {
  const watermarkStyle = hasWatermark
    ? `
      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 80px;
        color: rgba(0, 204, 169, 0.15);
        font-weight: bold;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
      }
    `
    : "";

  const watermarkHTML = hasWatermark
    ? '<div class="watermark">T2W CV Builder</div>'
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${version.title} - T2W CV Builder</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        ${watermarkStyle}
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #00cca9;
        }
        .header h1 {
          color: #00cca9;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #00cca9;
          font-size: 18px;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        .summary {
          background: linear-gradient(135deg, #f0fdf9 0%, #e0f7f3 100%);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #00cca9;
        }
        .experience-item, .education-item {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .experience-item h3, .education-item h3 {
          color: #333;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .experience-item .company, .education-item .institution {
          color: #00cca9;
          font-weight: 600;
        }
        .experience-item .dates, .education-item .dates {
          color: #888;
          font-size: 13px;
          margin-bottom: 10px;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill {
          background: #00cca9;
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .watermark {
            position: fixed;
          }
        }
      </style>
    </head>
    <body>
      ${watermarkHTML}
      
      <div class="header">
        <h1>${version.title}</h1>
        <p>${version.description}</p>
      </div>

      <div class="section">
        <h2>👤 Resumen Profesional</h2>
        <div class="summary">
          ${version.content.summary}
        </div>
      </div>

      <div class="section">
        <h2>💼 Experiencia Profesional</h2>
        ${version.content.experience
          .map(
            (exp) => `
          <div class="experience-item">
            <h3>${exp.position}</h3>
            <p class="company">${exp.company}</p>
            <p class="dates">${exp.startDate} - ${exp.endDate}</p>
            <p>${exp.description}</p>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="section">
        <h2>🎓 Educación</h2>
        ${version.content.education
          .map(
            (edu) => `
          <div class="education-item">
            <h3>${edu.degree} en ${edu.field}</h3>
            <p class="institution">${edu.institution}</p>
            <p class="dates">${edu.startDate} - ${edu.endDate}</p>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="section">
        <h2>🛠️ Habilidades</h2>
        <div class="skills">
          ${version.content.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
        </div>
      </div>

      <div class="footer">
        <p>Generado el ${new Date().toLocaleDateString("es-ES")} | T2W CV Builder</p>
        ${hasWatermark ? "<p><strong>Versión gratuita con marca de agua</strong></p>" : ""}
      </div>
    </body>
    </html>
  `;
}

async function createPDFFromHTML(htmlContent: string): Promise<Blob> {
  // Create a hidden iframe to render the HTML
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.left = "-9999px";
  iframe.style.width = "800px";
  iframe.style.height = "1200px";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error("Could not access iframe document");
  }

  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // Wait for content to render
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Use print-to-PDF approach via opening in new window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Give time to render then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  document.body.removeChild(iframe);

  // Return a placeholder blob - actual PDF is generated via browser print dialog
  return new Blob([htmlContent], { type: "text/html" });
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Direct HTML download as alternative
export function downloadAsHTML(
  cvContent: string,
  analysisResult: AnalysisResult,
  hasWatermark: boolean,
  filename: string
): void {
  const htmlContent = createHTMLDocument(cvContent, analysisResult, hasWatermark);
  const blob = new Blob([htmlContent], { type: "text/html" });
  downloadPDF(blob, filename.replace(".pdf", ".html"));
}

export function downloadVersionAsHTML(
  version: CVVersion,
  hasWatermark: boolean,
  filename: string
): void {
  const htmlContent = createVersionHTMLDocument(version, hasWatermark);
  const blob = new Blob([htmlContent], { type: "text/html" });
  downloadPDF(blob, filename.replace(".pdf", ".html"));
}

// Print-based PDF generation
export function printCVAsPDF(
  cvContent: string,
  analysisResult: AnalysisResult,
  hasWatermark: boolean
): void {
  const htmlContent = createHTMLDocument(cvContent, analysisResult, hasWatermark);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

export function printVersionAsPDF(version: CVVersion, hasWatermark: boolean): void {
  const htmlContent = createVersionHTMLDocument(version, hasWatermark);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
