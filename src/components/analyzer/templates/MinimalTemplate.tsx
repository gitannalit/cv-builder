import { CVVersion } from "@/types/cv";

interface MinimalTemplateProps {
  version: CVVersion;
  hasWatermark?: boolean;
}

export function MinimalTemplate({ version, hasWatermark = true }: MinimalTemplateProps) {
  return (
    <div className="bg-white text-gray-900 relative" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      {hasWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-7xl font-extralight text-gray-200/50 rotate-[-35deg] whitespace-nowrap tracking-[0.3em]">
            T2W CV BUILDER
          </span>
        </div>
      )}
      
      <div className="p-16">
        {/* Minimal Header */}
        <header className="mb-16">
          <h1 className="text-5xl font-extralight tracking-tight text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
            {version.content.experience[0]?.position || "Profesional"}
          </h1>
          <div className="flex items-center gap-6">
            <div className="w-24 h-[3px] bg-primary"></div>
            <span className="text-sm font-light tracking-[0.15em] uppercase text-gray-500">
              {version.title}
            </span>
          </div>
        </header>

        {/* Summary - Large quote style */}
        <section className="mb-14">
          <p className="text-xl font-light text-gray-600 leading-relaxed" style={{ lineHeight: '1.9' }}>
            {version.content.summary}
          </p>
        </section>

        {/* Experience - Editorial layout */}
        <section className="mb-14">
          <h2 className="text-[10px] font-medium tracking-[0.4em] uppercase text-gray-400 mb-8 flex items-center gap-4">
            <span>Experiencia</span>
            <div className="h-px flex-1 bg-gray-100"></div>
          </h2>
          <div className="space-y-10">
            {version.content.experience.map((exp, index) => (
              <div key={index} className="grid grid-cols-[180px_1fr] gap-8">
                <div className="text-right">
                  <div className="text-sm font-light text-gray-400 leading-snug">
                    {exp.startDate}
                    <br />
                    <span className="text-gray-300">↓</span>
                    <br />
                    {exp.endDate}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent"></div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1" style={{ letterSpacing: '-0.01em' }}>
                    {exp.position}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-4 tracking-wide">{exp.company}</p>
                  <p className="text-gray-500 text-[15px] leading-relaxed" style={{ lineHeight: '1.75' }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two columns - Education & Skills */}
        <div className="grid grid-cols-2 gap-16">
          {/* Education */}
          <section>
            <h2 className="text-[10px] font-medium tracking-[0.4em] uppercase text-gray-400 mb-8 flex items-center gap-4">
              <span>Formación</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </h2>
            <div className="space-y-6">
              {version.content.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 text-lg">{edu.degree}</h3>
                  <p className="text-primary text-sm font-medium">{edu.field}</p>
                  <p className="text-gray-400 text-sm mt-2">{edu.institution}</p>
                  <p className="text-gray-300 text-xs mt-1">{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-[10px] font-medium tracking-[0.4em] uppercase text-gray-400 mb-8 flex items-center gap-4">
              <span>Habilidades</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </h2>
            <div className="space-y-3">
              {version.content.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                  <span className="text-gray-600 font-light">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Minimal footer accent */}
      <div className="absolute bottom-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
}
