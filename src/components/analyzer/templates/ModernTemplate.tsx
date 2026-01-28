import { CVVersion } from "@/types/cv";

interface ModernTemplateProps {
  version: CVVersion;
  hasWatermark?: boolean;
}

export function ModernTemplate({ version, hasWatermark = true }: ModernTemplateProps) {
  return (
    <div className="bg-white text-gray-900 relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }}>
      {hasWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-7xl font-bold text-gray-200/40 rotate-[-35deg] whitespace-nowrap tracking-wider">
            T2W CV BUILDER
          </span>
        </div>
      )}
      
      {/* Top accent bar */}
      <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
      
      <div className="p-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            {version.content.experience[0]?.position || "Profesional"}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent"></div>
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-primary">
              {version.title}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent"></div>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500">
              Perfil Profesional
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-[15px] pl-14" style={{ lineHeight: '1.8' }}>
            {version.content.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500">
              Experiencia Profesional
            </h2>
          </div>
          <div className="space-y-6 pl-14">
            {version.content.experience.map((exp, index) => (
              <div key={index} className="relative">
                {index < version.content.experience.length - 1 && (
                  <div className="absolute -left-7 top-8 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent"></div>
                )}
                <div className="absolute -left-[30px] top-1 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
                <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-xs font-medium text-gray-400 tracking-wide">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p className="text-primary font-medium text-sm mb-3">{exp.company}</p>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ lineHeight: '1.7' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Two columns */}
        <div className="grid grid-cols-5 gap-10">
          {/* Education - 3 cols */}
          <section className="col-span-3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500">
                Formación Académica
              </h2>
            </div>
            <div className="space-y-5 pl-14">
              {version.content.education.map((edu, index) => (
                <div key={index} className="relative pb-4 border-b border-gray-100 last:border-0">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-primary text-sm font-medium">{edu.field}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">{edu.institution}</p>
                    <span className="text-xs text-gray-400">{edu.startDate} — {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills - 2 cols */}
          <section className="col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500">
                Competencias
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 pl-14">
              {version.content.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-primary/5 to-primary/10 text-gray-700 text-sm font-medium rounded-lg border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60"></div>
    </div>
  );
}
