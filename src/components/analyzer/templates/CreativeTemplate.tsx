import { CVVersion } from "@/types/cv";

interface CreativeTemplateProps {
  version: CVVersion;
  hasWatermark?: boolean;
}

export function CreativeTemplate({ version, hasWatermark = true }: CreativeTemplateProps) {
  return (
    <div className="bg-[#0f172a] text-white relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Inter', sans-serif" }}>
      {hasWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <span className="text-7xl font-bold text-white/10 rotate-[-35deg] whitespace-nowrap tracking-wider">
            T2W CV BUILDER
          </span>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
      
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-[85mm] bg-gradient-to-b from-primary/90 via-primary to-primary/90 p-8 pt-12">
        {/* Profile circle */}
        <div className="mb-10">
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center border-4 border-white/30 shadow-2xl">
            <span className="text-4xl font-bold text-white">
              {version.content.experience[0]?.position?.charAt(0) || "CV"}
            </span>
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            {version.content.experience[0]?.position || "Profesional"}
          </h1>
          <p className="text-white/70 text-sm tracking-wider uppercase">
            {version.title}
          </p>
        </div>

        {/* Skills in sidebar */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-5 flex items-center gap-2">
            <div className="w-4 h-px bg-white/40"></div>
            Habilidades
          </h2>
          <div className="space-y-3">
            {version.content.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/90">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education in sidebar */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-5 flex items-center gap-2">
            <div className="w-4 h-px bg-white/40"></div>
            Formación
          </h2>
          <div className="space-y-5">
            {version.content.education.map((edu, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold text-white text-sm">{edu.degree}</p>
                <p className="text-white/70 text-xs mt-1">{edu.field}</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-white/50 text-xs">{edu.institution}</p>
                  <p className="text-white/40 text-xs mt-1">{edu.startDate} — {edu.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[85mm] p-10 pt-12">
        {/* Summary */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Sobre Mí
          </h2>
          <p className="text-gray-300 leading-relaxed text-[15px]" style={{ lineHeight: '1.85' }}>
            {version.content.summary}
          </p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            Experiencia Profesional
          </h2>
          <div className="space-y-6">
            {version.content.experience.map((exp, index) => (
              <div key={index} className="relative pl-8 group">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full"></div>
                <div className="absolute left-[-5px] top-0 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                    <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-primary font-medium text-sm mb-3">{exp.company}</p>
                  <p className="text-gray-400 text-sm leading-relaxed" style={{ lineHeight: '1.7' }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-[85mm] right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
    </div>
  );
}
