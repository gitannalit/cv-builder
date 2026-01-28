import { CVVersion } from "@/types/cv";
import { TemplateType } from "@/components/analyzer/templates";

// Generate HTML for each template type
export function generateTemplateHTML(
  version: CVVersion,
  template: TemplateType,
  hasWatermark: boolean
): string {
  const watermarkHTML = hasWatermark
    ? `<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(0, 204, 169, 0.08); font-weight: bold; pointer-events: none; z-index: 1000; white-space: nowrap; font-family: 'Inter', sans-serif;">T2W CV Builder</div>`
    : "";

  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');
    
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
      -webkit-print-color-adjust: exact !important; 
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.5; 
      background: white;
    }
    
    @media print { 
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      @page { margin: 0; size: A4; }
      .container { box-shadow: none !important; }
    }
    
    .container { 
      width: 210mm; 
      min-height: 297mm; 
      margin: 0 auto; 
      background: white; 
      position: relative; 
      overflow: hidden;
    }
  `;

  switch (template) {
    case 'modern':
      return generateModernHTML(version, hasWatermark, watermarkHTML, baseStyles);
    case 'classic':
      return generateClassicHTML(version, hasWatermark, watermarkHTML, baseStyles);
    case 'minimal':
      return generateMinimalHTML(version, hasWatermark, watermarkHTML, baseStyles);
    case 'creative':
      return generateCreativeHTML(version, hasWatermark, watermarkHTML, baseStyles);
    default:
      return generateModernHTML(version, hasWatermark, watermarkHTML, baseStyles);
  }
}

function generateModernHTML(version: CVVersion, hasWatermark: boolean, watermarkHTML: string, baseStyles: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${version.title} - CV</title>
  <style>
    ${baseStyles}
    .container { padding: 0; display: flex; flex-direction: column; }
    .top-bar { h-2; height: 8px; background: linear-gradient(90deg, #00cca9, #00cca988) !important; width: 100%; }
    .content { padding: 48px; flex-grow: 1; }
    .header { margin-bottom: 40px; }
    .header h1 { font-family: 'Playfair Display', serif; font-size: 36px; color: #1a1a1a; margin-bottom: 8px; font-weight: 600; }
    .header-subtitle { display: flex; align-items: center; gap: 16px; margin-top: 16px; }
    .line { height: 1px; flex-grow: 1; background: linear-gradient(90deg, rgba(0, 204, 169, 0.6), transparent) !important; }
    .line-rev { height: 1px; flex-grow: 1; background: linear-gradient(270deg, rgba(0, 204, 169, 0.6), transparent) !important; }
    .version-title { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #00cca9 !important; }
    
    .section { margin-bottom: 32px; }
    .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
    .icon-box { width: 40px; height: 40px; border-radius: 50%; background: rgba(0, 204, 169, 0.1) !important; display: flex; align-items: center; justify-content: center; }
    .icon-box svg { width: 20px; height: 20px; color: #00cca9 !important; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; }
    
    .summary { color: #4b5563; line-height: 1.8; font-size: 15px; padding-left: 56px; }
    
    .experience-list { padding-left: 56px; position: relative; }
    .experience-item { position: relative; margin-bottom: 24px; }
    .timeline-dot { position: absolute; left: -28px; top: 8px; width: 8px; height: 8px; border-radius: 50%; background: #00cca9 !important; box-shadow: 0 0 0 4px rgba(0, 204, 169, 0.1) !important; }
    .timeline-line { position: absolute; left: -25px; top: 24px; bottom: -16px; width: 1px; background: linear-gradient(180deg, rgba(0, 204, 169, 0.3), transparent) !important; }
    
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .exp-role { font-size: 18px; font-weight: 600; color: #111827; }
    .exp-dates { font-size: 12px; font-weight: 500; color: #9ca3af; }
    .exp-company { font-size: 14px; font-weight: 500; color: #00cca9 !important; margin-bottom: 8px; }
    .exp-desc { color: #4b5563; font-size: 14px; line-height: 1.7; }
    
    .grid-cols { display: grid; grid-template-columns: 3fr 2fr; gap: 40px; padding-left: 56px; }
    
    .edu-item { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
    .edu-item:last-child { border-bottom: none; }
    .edu-degree { font-weight: 600; color: #111827; font-size: 15px; }
    .edu-field { color: #00cca9 !important; font-size: 14px; font-weight: 500; }
    .edu-meta { display: flex; justify-content: space-between; margin-top: 4px; font-size: 13px; color: #6b7280; }
    
    .skills-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { padding: 6px 14px; background: linear-gradient(90deg, rgba(0, 204, 169, 0.05), rgba(0, 204, 169, 0.1)) !important; border: 1px solid rgba(0, 204, 169, 0.2) !important; border-radius: 8px; font-size: 13px; font-weight: 500; color: #374151; }
    
    .footer-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, rgba(0, 204, 169, 0.6), #00cca9, rgba(0, 204, 169, 0.6)) !important; }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="container">
    <div class="top-bar"></div>
    <div class="content">
      <header class="header">
        <h1>${version.content.experience[0]?.position || "Profesional"}</h1>
        <div class="header-subtitle">
          <div class="line"></div>
          <span class="version-title">${version.title}</span>
          <div class="line-rev"></div>
        </div>
      </header>
      
      <section class="section">
        <div class="section-header">
          <div class="icon-box">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 class="section-title">Perfil Profesional</h2>
        </div>
        <p class="summary">${version.content.summary}</p>
      </section>
      
      <section class="section">
        <div class="section-header">
          <div class="icon-box">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 class="section-title">Experiencia Profesional</h2>
        </div>
        <div class="experience-list">
          ${version.content.experience.map((exp, idx) => `
            <div class="experience-item">
              ${idx < version.content.experience.length - 1 ? '<div class="timeline-line"></div>' : ''}
              <div class="timeline-dot"></div>
              <div class="exp-header">
                <h3 class="exp-role">${exp.position}</h3>
                <span class="exp-dates">${exp.startDate} — ${exp.endDate}</span>
              </div>
              <div class="exp-company">${exp.company}</div>
              <p class="exp-desc">${exp.description}</p>
            </div>
          `).join('')}
        </div>
      </section>
      
      <div class="grid-cols">
        <section class="section">
          <div class="section-header" style="margin-left: -56px;">
            <div class="icon-box">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
            </div>
            <h2 class="section-title">Educación</h2>
          </div>
          <div class="edu-list">
            ${version.content.education.map(edu => `
              <div class="edu-item">
                <h3 class="edu-degree">${edu.degree}</h3>
                <div class="edu-field">${edu.field}</div>
                <div class="edu-meta">
                  <span>${edu.institution}</span>
                  <span>${edu.startDate} - ${edu.endDate}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        
        <section class="section">
          <div class="section-header" style="margin-left: -56px;">
            <div class="icon-box">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h2 class="section-title">Habilidades</h2>
          </div>
          <div class="skills-container">
            ${version.content.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </section>
      </div>
    </div>
    <div class="footer-accent"></div>
  </div>
</body>
</html>`;
}

function generateClassicHTML(version: CVVersion, hasWatermark: boolean, watermarkHTML: string, baseStyles: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${version.title} - CV</title>
  <style>
    ${baseStyles}
    body { font-family: 'Playfair Display', Georgia, serif; }
    .container { padding: 60px; }
    .header { text-align: center; border-bottom: 2px solid #111827 !important; padding-bottom: 32px; margin-bottom: 40px; }
    .header h1 { font-size: 32px; color: #111827; letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase; }
    .header p { color: #4b5563; font-style: italic; font-size: 16px; }
    
    .section { margin-bottom: 32px; }
    .section-title { font-size: 14px; font-weight: 700; color: #111827; border-bottom: 1px solid #e5e7eb !important; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; }
    
    .summary { color: #374151; line-height: 1.8; text-align: justify; font-size: 15px; font-family: 'Inter', sans-serif; }
    
    .experience-item { margin-bottom: 24px; font-family: 'Inter', sans-serif; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
    .exp-role { font-size: 16px; font-weight: 700; color: #111827; }
    .exp-dates { color: #6b7280; font-style: italic; font-size: 13px; }
    .exp-company { font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; }
    .exp-desc { color: #4b5563; font-size: 14px; line-height: 1.7; text-align: justify; }
    
    .edu-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-family: 'Inter', sans-serif; }
    .edu-degree { font-size: 15px; font-weight: 700; color: #111827; }
    .edu-inst { color: #4b5563; font-size: 14px; }
    .edu-dates { color: #6b7280; font-style: italic; font-size: 13px; }
    
    .skills-list { display: flex; flex-wrap: wrap; gap: 12px; font-family: 'Inter', sans-serif; }
    .skill-item { color: #374151; font-size: 14px; display: flex; align-items: center; }
    .skill-item::before { content: '•'; color: #00cca9 !important; margin-right: 8px; font-weight: bold; }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="container">
    <header class="header">
      <h1>${version.content.experience[0]?.position || "CURRÍCULUM VITAE"}</h1>
      <p>${version.description}</p>
    </header>
    
    <section class="section">
      <h2 class="section-title">Resumen Profesional</h2>
      <p class="summary">${version.content.summary}</p>
    </section>
    
    <section class="section">
      <h2 class="section-title">Experiencia Laboral</h2>
      ${version.content.experience.map(exp => `
        <div class="experience-item">
          <div class="exp-header">
            <h3 class="exp-role">${exp.position}</h3>
            <span class="exp-dates">${exp.startDate} — ${exp.endDate}</span>
          </div>
          <div class="exp-company">${exp.company}</div>
          <p class="exp-desc">${exp.description}</p>
        </div>
      `).join('')}
    </section>
    
    <section class="section">
      <h2 class="section-title">Formación Académica</h2>
      ${version.content.education.map(edu => `
        <div class="edu-row">
          <div>
            <h3 class="edu-degree">${edu.degree} en ${edu.field}</h3>
            <div class="edu-inst">${edu.institution}</div>
          </div>
          <span class="edu-dates">${edu.startDate} — ${edu.endDate}</span>
        </div>
      `).join('')}
    </section>
    
    <section class="section">
      <h2 class="section-title">Competencias</h2>
      <div class="skills-list">
        ${version.content.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
      </div>
    </section>
  </div>
</body>
</html>`;
}

function generateMinimalHTML(version: CVVersion, hasWatermark: boolean, watermarkHTML: string, baseStyles: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${version.title} - CV</title>
  <style>
    ${baseStyles}
    .container { padding: 80px; }
    .header { margin-bottom: 60px; }
    .header h1 { font-size: 40px; font-weight: 300; color: #111827; margin-bottom: 16px; letter-spacing: -1px; }
    .header .accent-line { width: 40px; height: 4px; background: #00cca9 !important; }
    
    .summary { color: #4b5563; font-size: 18px; line-height: 1.8; font-weight: 300; margin-bottom: 60px; }
    
    .section { margin-bottom: 48px; }
    .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 32px; }
    
    .grid-item { display: grid; grid-template-columns: 140px 1fr; gap: 40px; margin-bottom: 32px; }
    .item-dates { font-size: 14px; color: #9ca3af; line-height: 1.6; font-weight: 500; }
    .item-content h3 { font-size: 18px; color: #111827; font-weight: 600; margin-bottom: 4px; }
    .item-subtitle { color: #00cca9 !important; font-size: 14px; font-weight: 500; margin-bottom: 12px; }
    .item-desc { color: #4b5563; font-size: 14px; line-height: 1.7; }
    
    .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .skill-minimal { font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6 !important; padding-bottom: 4px; }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="container">
    <header class="header">
      <h1>${version.content.experience[0]?.position || "Profesional"}</h1>
      <div class="accent-line"></div>
    </header>
    
    <p class="summary">${version.content.summary}</p>
    
    <div class="section">
      <h2 class="section-title">Experiencia</h2>
      ${version.content.experience.map(exp => `
        <div class="grid-item">
          <div class="item-dates">${exp.startDate}<br>— ${exp.endDate}</div>
          <div class="item-content">
            <h3>${exp.position}</h3>
            <div class="item-subtitle">${exp.company}</div>
            <p class="item-desc">${exp.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2 class="section-title">Educación</h2>
      ${version.content.education.map(edu => `
        <div class="grid-item">
          <div class="item-dates">${edu.startDate}<br>— ${edu.endDate}</div>
          <div class="item-content">
            <h3>${edu.degree}</h3>
            <div class="item-subtitle">${edu.institution} • ${edu.field}</div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2 class="section-title">Habilidades</h2>
      <div class="skills-grid">
        ${version.content.skills.map(skill => `<div class="skill-minimal">${skill}</div>`).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateCreativeHTML(version: CVVersion, hasWatermark: boolean, watermarkHTML: string, baseStyles: string): string {
  const primaryColor = "#00cca9";
  const darkColor = "#0d1117";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${version.title} - CV</title>
  <style>
    ${baseStyles}
    .container { display: flex; min-height: 297mm; background: white !important; }
    
    /* Sidebar */
    .sidebar { 
      width: 35%; 
      background-color: ${darkColor} !important; 
      color: white !important; 
      padding: 40px 30px; 
      display: flex; 
      flex-direction: column;
      -webkit-print-color-adjust: exact !important;
    }
    
    .profile-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: ${primaryColor} !important;
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      color: white !important;
    }
    
    .sidebar h1 { 
      font-size: 24px; 
      font-weight: bold; 
      text-align: center; 
      margin-bottom: 4px; 
      color: white !important;
    }
    
    .sidebar-job { 
      text-align: center; 
      color: ${primaryColor} !important; 
      font-size: 14px; 
      margin-bottom: 40px; 
    }
    
    .sidebar-section { margin-bottom: 32px; }
    .sidebar-title { 
      font-size: 11px; 
      font-weight: bold; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      color: ${primaryColor} !important; 
      border-bottom: 1px solid ${primaryColor}44 !important; 
      padding-bottom: 8px; 
      margin-bottom: 16px; 
    }
    
    .contact-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 13px; color: #d1d5db !important; }
    .contact-icon { width: 24px; height: 24px; border-radius: 50%; background: rgba(0, 204, 169, 0.1) !important; display: flex; align-items: center; justify-content: center; color: ${primaryColor} !important; }
    
    .skill-tag { 
      display: inline-block;
      padding: 4px 12px;
      background: rgba(0, 204, 169, 0.15) !important;
      color: ${primaryColor} !important;
      border-radius: 20px;
      font-size: 12px;
      margin: 0 4px 8px 0;
    }
    
    .edu-item { margin-bottom: 16px; }
    .edu-degree { font-size: 14px; font-weight: 600; color: white !important; }
    .edu-field { font-size: 13px; color: #9ca3af !important; }
    .edu-inst { font-size: 12px; color: #6b7280 !important; margin-top: 2px; }
    .edu-dates { font-size: 11px; color: ${primaryColor} !important; margin-top: 4px; }
    
    /* Main Content */
    .main-content { flex: 1; padding: 48px; background: white !important; }
    .main-section { margin-bottom: 40px; }
    .main-title { 
      font-size: 20px; 
      font-weight: bold; 
      color: ${darkColor} !important; 
      margin-bottom: 20px; 
      display: flex; 
      align-items: center; 
      gap: 12px;
      border-bottom: 2px solid ${primaryColor} !important;
      padding-bottom: 8px;
    }
    
    .summary { color: #4b5563 !important; line-height: 1.8; font-size: 15px; }
    
    .exp-item { position: relative; padding-left: 24px; margin-bottom: 32px; }
    .exp-item::before { 
      content: ''; 
      position: absolute; 
      left: -4px; 
      top: 6px; 
      width: 10px; 
      height: 10px; 
      border-radius: 50%; 
      border: 2px solid ${primaryColor} !important; 
      background: white !important; 
      z-index: 2; 
    }
    .exp-item::after { 
      content: ''; 
      position: absolute; 
      left: 0px; 
      top: 16px; 
      bottom: -32px; 
      width: 2px; 
      background: rgba(0, 204, 169, 0.2) !important; 
    }
    .exp-item:last-child::after { display: none; }
    
    .exp-role { font-size: 17px; font-weight: 700; color: #111827 !important; margin-bottom: 4px; }
    .exp-company { color: ${primaryColor} !important; font-weight: 600; font-size: 14px; margin-bottom: 8px; }
    .exp-dates { 
      font-size: 11px; 
      color: ${primaryColor} !important; 
      background: rgba(0, 204, 169, 0.1) !important; 
      padding: 2px 10px; 
      border-radius: 12px; 
      display: inline-block;
      margin-bottom: 8px;
    }
    .exp-desc { color: #4b5563 !important; font-size: 14px; line-height: 1.7; }
    
    .footer { 
      margin-top: auto; 
      text-align: center; 
      font-size: 11px; 
      color: #6b7280 !important; 
      background-color: ${darkColor} !important;
      padding: 16px;
      margin: 0 -30px -40px;
    }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="container">
    <aside class="sidebar">
      <div class="profile-circle">${version.content.experience[0]?.position?.charAt(0) || "CV"}</div>
      <h1>${version.content.experience[0]?.position || "Profesional"}</h1>
      <div class="sidebar-job">${version.title}</div>
      
      <div class="sidebar-section">
        <h2 class="sidebar-title">Contacto</h2>
        <div class="contact-item">
          <span>${version.content.summary.substring(0, 20)}...</span>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h2 class="sidebar-title">Habilidades</h2>
        <div style="display: flex; flex-wrap: wrap;">
          ${version.content.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      
      <div class="sidebar-section">
        <h2 class="sidebar-title">Educación</h2>
        ${version.content.education.map(edu => `
          <div class="edu-item">
            <div class="edu-degree">${edu.degree}</div>
            <div class="edu-field">${edu.field}</div>
            <div class="edu-inst">${edu.institution}</div>
            <div class="edu-dates">${edu.startDate} - ${edu.endDate}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="footer">
        CV generado con <span style="color: ${primaryColor}">T2W CV Builder</span>
      </div>
    </aside>
    
    <main class="main-content">
      <section class="main-section">
        <h2 class="main-title">Sobre mí</h2>
        <p class="summary">${version.content.summary}</p>
      </section>
      
      <section class="main-section">
        <h2 class="main-title">Experiencia</h2>
        ${version.content.experience.map(exp => `
          <div class="exp-item">
            <h3 class="exp-role">${exp.position}</h3>
            <div class="exp-company">${exp.company}</div>
            <div class="exp-dates">${exp.startDate} - ${exp.endDate}</div>
            <p class="exp-desc">${exp.description}</p>
          </div>
        `).join('')}
      </section>
    </main>
  </div>
</body>
</html>`;
}

// Print template as PDF
export function printTemplatePDF(
  version: CVVersion,
  template: TemplateType,
  hasWatermark: boolean
): void {
  const html = generateTemplateHTML(version, template, hasWatermark);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for fonts and images to load
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close window after printing (optional, but cleaner)
        // printWindow.close();
      }, 500);
    };

    // Fallback if onload doesn't fire
    setTimeout(() => {
      if (printWindow.document.readyState === 'complete') {
        printWindow.focus();
        printWindow.print();
      }
    }, 2000);
  }
}
