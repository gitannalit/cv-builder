import { CVVersion } from "@/types/cv";

interface ClassicTemplateProps {
  version: CVVersion;
  hasWatermark?: boolean;
}

export function ClassicTemplate({ version, hasWatermark = true }: ClassicTemplateProps) {
  return (
    <div className="bg-[#fdfcfa] text-gray-800 relative" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Times New Roman', 'Georgia', serif" }}>
      {hasWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-7xl font-bold text-gray-300/30 rotate-[-35deg] whitespace-nowrap tracking-wider" style={{ fontFamily: "'Georgia', serif" }}>
            T2W CV BUILDER
          </span>
        </div>
      )}
      
      <div className="p-14">
        {/* Elegant Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-double border-gray-300">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-400"></div>
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-400"></div>
            </div>
          </div>
          <h1 className="text-4xl font-normal tracking-wide text-gray-800 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
            {version.content.experience[0]?.position || "Currículum Vitae"}
          </h1>
          <p className="text-lg text-gray-600 italic tracking-wide">
            {version.title}
          </p>
        </header>

        {/* Professional Summary */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-600 whitespace-nowrap">
              Resumen Ejecutivo
            </h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <p className="text-gray-700 leading-loose text-justify text-[15px] px-4 first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-primary">
            {version.content.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-600 whitespace-nowrap">
              Trayectoria Profesional
            </h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="space-y-8">
            {version.content.experience.map((exp, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-primary/30">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/20 ring-4 ring-[#fdfcfa]">
                  <div className="absolute inset-1 rounded-full bg-primary"></div>
                </div>
                <div className="flex flex-wrap justify-between items-baseline mb-2">
                  <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                    {exp.position}
                  </h3>
                  <span className="text-sm text-gray-500 italic">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p className="text-primary font-medium mb-3 tracking-wide">{exp.company}</p>
                <p className="text-gray-600 leading-relaxed text-justify" style={{ lineHeight: '1.75' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-600 whitespace-nowrap">
              Formación Académica
            </h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {version.content.education.map((edu, index) => (
              <div key={index} className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 text-lg" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                  {edu.degree}
                </h3>
                <p className="text-primary font-medium text-sm mb-2">{edu.field}</p>
                <div className="pt-3 border-t border-gray-100 mt-3">
                  <p className="text-gray-600 text-sm">{edu.institution}</p>
                  <p className="text-gray-400 text-xs italic mt-1">{edu.startDate} — {edu.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-600 whitespace-nowrap">
              Competencias Clave
            </h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {version.content.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
      
      {/* Footer ornament */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gray-300"></div>
          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
