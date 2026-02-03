import { CVVersion } from "@/types/cv";
import { TemplateType } from "@/components/analyzer/templates";

// Generate HTML for each template type
export function generateTemplateHTML(
  version: CVVersion,
  template: TemplateType,
  hasWatermark: boolean,
  userData?: { name: string; email: string; phone?: string; targetJob?: string }
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
      return generateModernHTML(version, hasWatermark, watermarkHTML, baseStyles, userData);
    case 'classic':
      return generateClassicHTML(version, hasWatermark, watermarkHTML, baseStyles);
    case 'minimal':
      return generateMinimalHTML(version, hasWatermark, watermarkHTML, baseStyles);
    case 'creative':
      return generateModernHTML(version, hasWatermark, watermarkHTML, baseStyles, userData);
    case 'executive':
      return generateExecutiveHTML(version, hasWatermark, watermarkHTML, baseStyles, userData);
    default:
      return generateModernHTML(version, hasWatermark, watermarkHTML, baseStyles, userData);
  }
}

function generateModernHTML(version: CVVersion, hasWatermark: boolean, watermarkHTML: string, baseStyles: string, userData?: any): string {
  const primaryColor = "#00BFA6"; // T2W Turquoise
  const darkColor = "#0d1117";

  const name = userData?.name || "Tu Nombre";
  const email = userData?.email || "tu@email.com";
  const phone = userData?.phone || "";
  const targetJob = userData?.targetJob || version.title || "Profesional";

  const languages = version.content.languages || [];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${version.title} - CV</title>
  <style>
    ${baseStyles}
    .container { display: flex; min-height: 297mm; background: white !important; }
    
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
    .contact-icon { 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      background: rgba(0, 191, 166, 0.1) !important; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: ${primaryColor} !important; 
      flex-shrink: 0;
    }
    .contact-icon svg { width: 16px; height: 16px; }
    
    .skill-tag { 
      display: inline-block;
      padding: 4px 12px;
      background: rgba(0, 204, 169, 0.15) !important;
      color: ${primaryColor} !important;
      border-radius: 20px;
      font-size: 12px;
      margin: 0 4px 8px 0;
    }
    
    .lang-item { margin-bottom: 12px; }
    .lang-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
    .lang-bar { height: 6px; background: #374151 !important; border-radius: 3px; overflow: hidden; }
    .lang-progress { height: 100%; background: ${primaryColor} !important; border-radius: 3px; }
    
    .edu-item { margin-bottom: 16px; }
    .edu-degree { font-size: 14px; font-weight: 600; color: white !important; }
    .edu-field { font-size: 13px; color: #9ca3af !important; }
    .edu-inst { font-size: 12px; color: #6b7280 !important; margin-top: 2px; }
    .edu-dates { font-size: 11px; color: ${primaryColor} !important; margin-top: 4px; }
    
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
    .main-title-icon { 
      width: 32px; 
      height: 32px; 
      background: ${primaryColor} !important; 
      border-radius: 8px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: white !important; 
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
    .exp-desc { color: #4b5563 !important; font-size: 14px; line-height: 1.7; margin-bottom: 8px; }
    .achievement-list { padding-left: 16px; margin-top: 8px; }
    .achievement-item { font-size: 13px; color: #374151 !important; margin-bottom: 4px; list-style-type: disc; }
    
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
      <div class="profile-circle">${name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
      <h1>${name}</h1>
      <div class="sidebar-job">${targetJob}</div>
      
      <div class="sidebar-section">
        <h2 class="sidebar-title">Contacto</h2>
        <div class="contact-item">
          <div class="contact-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <span style="word-break: break-all;">${email}</span>
        </div>
        ${phone ? `
        <div class="contact-item">
          <div class="contact-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <span>${phone}</span>
        </div>` : ""}
      </div>
      
      <div class="sidebar-section">
        <h2 class="sidebar-title">Habilidades</h2>
        <div style="display: flex; flex-wrap: wrap;">
          ${version.content.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      
      ${languages.length > 0 ? `
      <div class="sidebar-section">
        <h2 class="sidebar-title">Idiomas</h2>
        ${languages.map((lang: any) => {
    const level = lang.level.toLowerCase();
    const percentage = level.includes("nativo") || level.includes("c2") ? "100%" :
      level.includes("avanzado") || level.includes("c1") ? "85%" :
        level.includes("intermedio") || level.includes("b") ? "60%" : "40%";
    return `
          <div class="lang-item">
            <div class="lang-header">
              <span>${lang.language}</span>
              <span style="color: #9ca3af;">${lang.level}</span>
            </div>
            <div class="lang-bar">
              <div class="lang-progress" style="width: ${percentage};"></div>
            </div>
          </div>`;
  }).join('')}
      </div>` : ""}
      
      <div class="sidebar-section">
        <h2 class="sidebar-title">Formación</h2>
        ${(version.content.education || []).map(edu => {
    const institution = (edu as any).institution || (edu as any).institucion || (edu as any).school || (edu as any).university || "";
    const degree = (edu as any).degree || (edu as any).titulo || (edu as any).degree_name || "";
    const field = (edu as any).field || (edu as any).campo || (edu as any).area || "";
    const endDate = (edu as any).endDate || (edu as any).end_date || (edu as any).fecha_fin || "";

    return `
          <div class="edu-item">
            <div class="edu-degree">${degree}</div>
            <div class="edu-field">${field}</div>
            <div class="edu-inst">${institution}</div>
            <div class="edu-dates">${endDate}</div>
          </div>`;
  }).join('')}
      </div>
      
      <!-- Footer removed as per user request -->
    </aside>
    
    <main class="main-content">
      <section class="main-section">
        <h2 class="main-title">
          <span class="main-title-icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </span>
          Sobre Mí
        </h2>
        <p class="summary">${version.content.summary}</p>
      </section>
      
      <section class="main-section">
        <h2 class="main-title">
          <span class="main-title-icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </span>
          Experiencia Laboral
        </h2>
        <div class="experience-list">
          ${(version.content.experience || []).map(exp => {
    const company = (exp as any).company || (exp as any).empresa || (exp as any).organization || "";
    const position = (exp as any).position || (exp as any).puesto || (exp as any).cargo || (exp as any).role || "";
    const startDate = (exp as any).startDate || (exp as any).start_date || (exp as any).fecha_inicio || "";
    const endDate = (exp as any).endDate || (exp as any).end_date || (exp as any).fecha_fin || "";
    const description = (exp as any).description || (exp as any).descripcion || (exp as any).desc || "";
    const achievements = (exp as any).achievements || (exp as any).logros || [];

    return `
            <div class="exp-item">
              <h3 class="exp-role">${position}</h3>
              <div class="exp-company">${company}</div>
              <div class="exp-dates">${startDate} - ${endDate}</div>
              <p class="exp-desc">${description}</p>
              ${achievements.length > 0 ? `
              <ul class="achievement-list">
                ${achievements.map((ach: string) => `<li class="achievement-item">${ach}</li>`).join('')}
              </ul>` : ""}
            </div>`;
  }).join('')}
        </div>
      </section>
    </main>
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


function generateExecutiveHTML(version: CVVersion, hasWatermark: boolean, watermarkHTML: string, baseStyles: string, userData?: any): string {
  const primaryColor = "#1a1a2e"; // Dark Navy

  const name = userData?.name || "Tu Nombre";
  const email = userData?.email || "tu@email.com";
  const phone = userData?.phone || "";
  const targetJob = userData?.targetJob || version.title || "Profesional";

  const languages = version.content.languages || [];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${version.title} - CV</title>
  <style>
    ${baseStyles}
    .container { padding: 0; display: flex; flex-direction: column; background: white !important; }
    
    .header { 
      background-color: ${primaryColor} !important; 
      color: white !important; 
      padding: 32px 40px;
      -webkit-print-color-adjust: exact !important;
    }
    .header h1 { font-size: 36px; font-weight: 700; margin-bottom: 4px; color: white !important; }
    .header p { font-size: 20px; color: #d1d5db !important; margin-bottom: 16px; }
    .header-info { display: flex; flex-wrap: wrap; gap: 24px; font-size: 14px; color: #9ca3af !important; }
    .info-item { display: flex; align-items: center; gap: 8px; }
    .info-item svg { width: 16px; height: 16px; color: #9ca3af !important; }
    
    .content { padding: 32px 40px; flex-grow: 1; }
    
    .section { margin-bottom: 32px; }
    .section-title { 
      font-size: 14px; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      color: ${primaryColor} !important; 
      border-bottom: 2px solid ${primaryColor} !important; 
      padding-bottom: 8px; 
      margin-bottom: 16px; 
    }
    
    .summary { color: #374151 !important; line-height: 1.6; font-size: 15px; }
    
    .exp-item { position: relative; padding-left: 16px; border-left: 2px solid #e5e7eb !important; margin-bottom: 24px; }
    .exp-dot { position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #9ca3af !important; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .exp-role { font-size: 16px; font-weight: 700; color: #111827 !important; }
    .exp-company { font-size: 14px; font-weight: 600; color: #4b5563 !important; margin-bottom: 8px; }
    .exp-dates { font-size: 13px; color: #6b7280 !important; white-space: nowrap; }
    .exp-desc { color: #4b5563 !important; font-size: 14px; line-height: 1.6; margin-bottom: 8px; }
    .achievement-list { padding-left: 16px; margin-top: 8px; }
    .achievement-item { font-size: 13px; color: #374151 !important; margin-bottom: 4px; list-style-type: disc; }
    
    .grid-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    
    .edu-item { margin-bottom: 12px; }
    .edu-degree { font-size: 14px; font-weight: 700; color: #111827 !important; }
    .edu-field { font-size: 13px; color: #4b5563 !important; }
    .edu-meta { font-size: 12px; color: #6b7280 !important; margin-top: 2px; }
    
    .skills-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { 
      padding: 4px 12px; 
      background-color: #f3f4f6 !important; 
      color: #374151 !important; 
      border-radius: 4px; 
      font-size: 12px; 
      font-weight: 500; 
      -webkit-print-color-adjust: exact !important;
    }
    
    .lang-item { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
    
    .footer { 
      background-color: #f9fafb !important; 
      color: #9ca3af !important; 
      padding: 16px 40px; 
      text-align: center; 
      font-size: 11px; 
      margin-top: auto;
      -webkit-print-color-adjust: exact !important;
    }
  </style>
</head>
<body>
  ${watermarkHTML}
  <div class="container">
    <header class="header">
      <h1>${name}</h1>
      <p>${targetJob}</p>
      <div class="header-info">
        <div class="info-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span>${email}</span>
        </div>
        ${phone ? `
          <div class="info-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span>${phone}</span>
          </div>
        ` : ""}
      </div>
    </header>
    
    <div class="content">
      <section class="section">
        <h2 class="section-title">Perfil Profesional</h2>
        <p class="summary">${version.content.summary}</p>
      </section>
      
      <section class="section">
        <h2 class="section-title">Experiencia Profesional</h2>
        <div class="experience-list">
          ${(version.content.experience || []).map(exp => {
    const company = (exp as any).company || (exp as any).empresa || (exp as any).organization || "";
    const position = (exp as any).position || (exp as any).puesto || (exp as any).cargo || (exp as any).role || "";
    const startDate = (exp as any).startDate || (exp as any).start_date || (exp as any).fecha_inicio || "";
    const endDate = (exp as any).endDate || (exp as any).end_date || (exp as any).fecha_fin || "";
    const description = (exp as any).description || (exp as any).descripcion || (exp as any).desc || "";
    const achievements = (exp as any).achievements || (exp as any).logros || [];

    return `
            <div class="exp-item">
              <div class="exp-dot"></div>
              <div class="exp-header">
                <h3 class="exp-role">${position}</h3>
                <span class="exp-dates">${startDate} — ${endDate}</span>
              </div>
              <div class="exp-company">${company}</div>
              <p class="exp-desc">${description}</p>
              ${achievements.length > 0 ? `
              <ul class="achievement-list">
                ${achievements.map((ach: string) => `<li class="achievement-item">${ach}</li>`).join('')}
              </ul>` : ""}
            </div>`;
  }).join('')}
        </div>
      </section>
      
      <div class="grid-cols">
        <section class="section">
          <h2 class="section-title">Formación Académica</h2>
          ${(version.content.education || []).map(edu => {
    const institution = (edu as any).institution || (edu as any).institucion || (edu as any).school || (edu as any).university || "";
    const degree = (edu as any).degree || (edu as any).titulo || (edu as any).degree_name || "";
    const field = (edu as any).field || (edu as any).campo || (edu as any).area || "";
    const endDate = (edu as any).endDate || (edu as any).end_date || (edu as any).fecha_fin || "";

    return `
            <div class="edu-item">
              <h3 class="edu-degree">${degree}</h3>
              <p class="edu-field">${field}</p>
              <p class="edu-meta">${institution} • ${endDate}</p>
            </div>`;
  }).join('')}
        </section>
        
        <div class="space-y-6">
          <section class="section">
            <h2 class="section-title">Competencias</h2>
            <div class="skills-container">
              ${version.content.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </section>
          
          ${languages.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Idiomas</h2>
            <div class="space-y-2">
              ${languages.map((lang: any) => `
                <div class="lang-item">
                  <span style="font-weight: 500; color: #111827;">${lang.language}</span>
                  <span style="color: #6b7280;">${lang.level}</span>
                </div>
              `).join('')}
            </div>
          </section>` : ""}
        </div>
      </div>
    </div>
    
    <!-- Footer removed as per user request -->
  </div>
</body>
</html>`;
}

// Download template as real PDF (100% client-side using html2canvas + jsPDF)
export async function downloadTemplatePDF(
  version: CVVersion,
  template: TemplateType,
  hasWatermark: boolean,
  userData?: { name: string; email: string; phone?: string; targetJob?: string }
): Promise<void> {
  const html = generateTemplateHTML(version, template, hasWatermark, userData);

  // Generate filename
  const baseName = userData?.name || version.title || 'CV';
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${baseName.replace(/\s+/g, '_')}_${template}_${timestamp}.pdf`;

  try {
    // Dynamically import libraries
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
      min-height: 297mm;
      background: white;
    `;

    // Create an iframe to isolate styles
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      height: 1123px;
      border: none;
    `;
    document.body.appendChild(iframe);

    // Wait for iframe to be ready
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = 'about:blank';
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Could not access iframe document');
    }

    // Write HTML to iframe
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Wait for fonts and content to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the container element from iframe
    const contentElement = iframeDoc.querySelector('.container') || iframeDoc.body;

    // Convert to canvas
    const canvas = await html2canvas(contentElement as HTMLElement, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width at 96 DPI
      height: 1123, // A4 height at 96 DPI
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Handle multi-page if content is longer than one page
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Use a small threshold (2mm) to prevent blank pages due to rounding errors
    while (heightLeft > 2) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);

    // Cleanup
    document.body.removeChild(iframe);
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
}

// Generate PDF as Blob (for email attachments)
export async function generateTemplatePDFBlob(
  version: CVVersion,
  template: TemplateType,
  hasWatermark: boolean,
  userData?: { name: string; email: string; phone?: string; targetJob?: string }
): Promise<Blob> {
  const html = generateTemplateHTML(version, template, hasWatermark, userData);

  try {
    // Dynamically import libraries
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);
    const html2canvas = html2canvasModule.default;
    const { jsPDF } = jsPDFModule;

    // Create an iframe to isolate styles
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      height: 1123px;
      border: none;
    `;
    document.body.appendChild(iframe);

    // Wait for iframe to be ready
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = 'about:blank';
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Could not access iframe document');
    }

    // Write HTML to iframe
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Wait for fonts and content to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the container element from iframe
    const contentElement = iframeDoc.querySelector('.container') || iframeDoc.body;

    // Convert to canvas
    const canvas = await html2canvas(contentElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Handle multi-page
    const pageHeight = 297;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 2) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Cleanup iframe
    document.body.removeChild(iframe);

    // Return as Blob
    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

// Legacy print function (keep for backwards compatibility)
export function printTemplatePDF(
  version: CVVersion,
  template: TemplateType,
  hasWatermark: boolean,
  userData?: { name: string; email: string; phone?: string; targetJob?: string }
): void {
  const html = generateTemplateHTML(version, template, hasWatermark, userData);
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
