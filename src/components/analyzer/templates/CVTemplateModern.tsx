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

interface CVTemplateModernProps {
    data: CVData;
    showWatermark?: boolean;
}

export const CVTemplateModern = forwardRef<HTMLDivElement, CVTemplateModernProps>(
    ({ data, showWatermark = false }, ref) => {
        const primaryColor = "#00BFA6"; // T2W Turquoise
        const darkColor = "#0d1117";

        return (
            <div
                ref={ref}
                data-cv-template="modern"
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

                {/* Decorative Top Bar */}
                <div
                    className="h-2"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88)` }}
                />

                <div className="flex flex-grow">
                    {/* Left Sidebar */}
                    <aside
                        className="w-[35%] text-white p-8"
                        style={{ backgroundColor: darkColor }}
                    >
                        {/* Profile Circle */}
                        <div
                            className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-bold"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {data.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>

                        {/* Name */}
                        <h1 className="text-2xl font-bold text-center mb-1">
                            {data.name}
                        </h1>
                        <p
                            className="text-center text-sm mb-8"
                            style={{ color: primaryColor }}
                        >
                            {data.targetJob || "Profesional"}
                        </p>

                        {/* Contact */}
                        <section className="mb-8">
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b"
                                style={{ borderColor: primaryColor, color: primaryColor }}
                            >
                                Contacto
                            </h2>
                            <div className="space-y-3 text-sm text-gray-300">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${primaryColor}20` }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="break-all">{data.email}</span>
                                </div>
                                {data.phone && (
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${primaryColor}20` }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span>{data.phone}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Skills */}
                        {data.skills.length > 0 && (
                            <section className="mb-8">
                                <h2
                                    className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b"
                                    style={{ borderColor: primaryColor, color: primaryColor }}
                                >
                                    Habilidades
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.slice(0, 5).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-xs rounded-full"
                                            style={{
                                                backgroundColor: `${primaryColor}20`,
                                                color: primaryColor
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {data.languages.length > 0 && (
                            <section className="mb-8">
                                <h2
                                    className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b"
                                    style={{ borderColor: primaryColor, color: primaryColor }}
                                >
                                    Idiomas
                                </h2>
                                <div className="space-y-3">
                                    {data.languages.map((lang, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white">{lang.language}</span>
                                                <span className="text-gray-400">{lang.level}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        backgroundColor: primaryColor,
                                                        width: lang.level.toLowerCase().includes("nativo") || lang.level.toLowerCase().includes("c2") ? "100%" :
                                                            lang.level.toLowerCase().includes("avanzado") || lang.level.toLowerCase().includes("c1") ? "85%" :
                                                                lang.level.toLowerCase().includes("intermedio") || lang.level.toLowerCase().includes("b") ? "60%" : "40%"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {data.education.length > 0 && (
                            <section>
                                <h2
                                    className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b"
                                    style={{ borderColor: primaryColor, color: primaryColor }}
                                >
                                    Formación
                                </h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-white text-sm">{edu.degree}</h3>
                                            <p className="text-xs text-gray-400">{edu.field}</p>
                                            <p className="text-xs text-gray-500 mt-1">{edu.institution}</p>
                                            <p className="text-xs" style={{ color: primaryColor }}>{edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-8">
                        {/* Professional Summary */}
                        <section className="mb-8">
                            <h2
                                className="text-lg font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
                                style={{ borderColor: primaryColor, color: darkColor }}
                            >
                                <span
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                Sobre Mí
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {data.professionalSummary}
                            </p>
                        </section>

                        {/* Work Experience */}
                        {data.workExperience.length > 0 && (
                            <section>
                                <h2
                                    className="text-lg font-bold mb-6 pb-2 border-b-2 flex items-center gap-2"
                                    style={{ borderColor: primaryColor, color: darkColor }}
                                >
                                    <span
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    Experiencia Laboral
                                </h2>
                                <div className="space-y-6">
                                    {data.workExperience.map((exp, i) => (
                                        <div key={i} className="relative">
                                            {/* Timeline dot */}
                                            <div
                                                className="absolute -left-4 top-2 w-3 h-3 rounded-full border-2 bg-white"
                                                style={{ borderColor: primaryColor }}
                                            />
                                            {/* Timeline line */}
                                            {i < data.workExperience.length - 1 && (
                                                <div
                                                    className="absolute -left-[10px] top-5 w-0.5 h-full"
                                                    style={{ backgroundColor: `${primaryColor}40` }}
                                                />
                                            )}

                                            <div className="pl-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                                        <p style={{ color: primaryColor }} className="font-medium">{exp.company}</p>
                                                    </div>
                                                    <span
                                                        className="text-xs px-3 py-1 rounded-full"
                                                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                                                    >
                                                        {exp.startDate} - {exp.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{exp.description}</p>
                                                {exp.achievements.length > 0 && (
                                                    <ul className="space-y-1">
                                                        {exp.achievements.map((ach, j) => (
                                                            <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                                                <span style={{ color: primaryColor }}>▸</span>
                                                                {ach}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>

                {/* Footer */}
                <footer
                    className="py-3 text-center text-xs mt-auto"
                    style={{ backgroundColor: darkColor, color: "#6b7280" }}
                >
                    CV generado con <span style={{ color: primaryColor }}>T2W CV Builder</span> • training2work.com
                </footer>
            </div>
        );
    }
);

CVTemplateModern.displayName = "CVTemplateModern";
