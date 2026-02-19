import { forwardRef } from "react";

interface CVData {
    name: string;
    email: string;
    phone?: string;
    targetJob?: string;
    professionalSummary: string;
    workExperience: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
        achievements: string[];
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        startDate: string;
        endDate: string;
    }>;
    skills: string[];
    languages: Array<{ language: string; level: string }>;
}

interface CVTemplateExecutiveProps {
    data: CVData;
    showWatermark?: boolean;
}

export const CVTemplateExecutive = forwardRef<HTMLDivElement, CVTemplateExecutiveProps>(
    ({ data, showWatermark = false }, ref) => {
        return (
            <div
                ref={ref}
                data-cv-template="executive"
                className="bg-white shadow-2xl mx-auto flex flex-col"
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    fontFamily: "'Inter', sans-serif",
                    position: "relative"
                }}
            >
                {/* Watermark */}
                {showWatermark && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        style={{ opacity: 0.08 }}
                    >
                        <div className="text-6xl font-bold text-gray-900 rotate-[-30deg]">
                            VISTA PREVIA
                        </div>
                    </div>
                )}

                {/* Header - Dark Navy */}
                <header
                    className="text-white px-10 py-8"
                    style={{ backgroundColor: "#1a1a2e" }}
                >
                    <h1 className="text-4xl font-bold tracking-tight mb-1">
                        {data.name}
                    </h1>
                    <p className="text-xl text-gray-300 mb-4">
                        {data.targetJob || "Profesional"}
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {data.email}
                        </span>
                        {data.phone && (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {data.phone}
                            </span>
                        )}
                    </div>
                </header>

                <div className="px-10 py-8 flex-grow">
                    {/* Professional Summary */}
                    <section className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-widest mb-3 pb-2 border-b-2"
                            style={{ color: "#1a1a2e", borderColor: "#1a1a2e" }}
                        >
                            Perfil Profesional
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-[15px]">
                            {data.professionalSummary}
                        </p>
                    </section>

                    {/* Work Experience */}
                    {data.workExperience.length > 0 && (
                        <section className="mb-8">
                            <h2
                                className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                style={{ color: "#1a1a2e", borderColor: "#1a1a2e" }}
                            >
                                Experiencia Profesional
                            </h2>
                            <div className="space-y-6">
                                {data.workExperience.map((exp, i) => (
                                    <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gray-400" />
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                                <p className="text-gray-600 font-medium">{exp.company}</p>
                                            </div>
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                                        {exp.achievements.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {exp.achievements.map((ach, j) => (
                                                    <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                                        <span className="text-green-600 mt-1">✓</span>
                                                        {ach}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-8">
                        {/* Education */}
                        {data.education.length > 0 && (
                            <section>
                                <h2
                                    className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                    style={{ color: "#1a1a2e", borderColor: "#1a1a2e" }}
                                >
                                    Formación Académica
                                </h2>
                                <div className="space-y-3">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}</h3>
                                            <p className="text-sm text-gray-600">{edu.field}</p>
                                            <p className="text-xs text-gray-500">{edu.institution} • {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills & Languages */}
                        <div className="space-y-6">
                            {data.skills.length > 0 && (
                                <section>
                                    <h2
                                        className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                        style={{ color: "#1a1a2e", borderColor: "#1a1a2e" }}
                                    >
                                        Competencias
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills.slice(0, 5).map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 text-xs font-medium rounded"
                                                style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {data.languages.length > 0 && (
                                <section>
                                    <h2
                                        className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                        style={{ color: "#1a1a2e", borderColor: "#1a1a2e" }}
                                    >
                                        Idiomas
                                    </h2>
                                    <div className="space-y-2">
                                        {data.languages.map((lang, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-900">{lang.language}</span>
                                                <span className="text-gray-600">{lang.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer
                    className="px-10 py-4 text-center text-xs mt-auto"
                    style={{ backgroundColor: "#f9fafb", color: "#9ca3af" }}
                >
                    CV generado con T2W CV Builder • training2work.com
                </footer>
            </div>
        );
    }
);

CVTemplateExecutive.displayName = "CVTemplateExecutive";
