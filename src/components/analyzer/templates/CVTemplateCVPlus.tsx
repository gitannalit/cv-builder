import { forwardRef, useRef } from "react";
import { EditableField } from "../EditableField";
import { DraggablePhoto, PhotoPosition } from "../DraggablePhoto";

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

interface CVTemplateCVPlusProps {
    data: CVData;
    showWatermark?: boolean;
    editable?: boolean;
    onDataChange?: (data: CVData) => void;
    photoUrl?: string | null;
    photoPosition?: PhotoPosition;
    photoSize?: number;
    photoShape?: 'circle' | 'rect';
    onPhotoChange?: (url: string | null) => void;
    onPhotoPositionChange?: (pos: PhotoPosition) => void;
    onPhotoSizeChange?: (size: number) => void;
    onPhotoShapeChange?: (shape: 'circle' | 'rect') => void;
}

export const CVTemplateCVPlus = forwardRef<HTMLDivElement, CVTemplateCVPlusProps>(
    ({
        data,
        showWatermark = false,
        editable = false,
        onDataChange,
        photoUrl,
        photoPosition = { x: 74, y: 3 },
        photoSize = 100,
        photoShape = 'rect',
        onPhotoChange,
        onPhotoPositionChange,
        onPhotoSizeChange,
        onPhotoShapeChange
    }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);

        const update = (partial: Partial<CVData>) => {
            if (onDataChange) {
                onDataChange({ ...data, ...partial });
            }
        };

        const updateExperience = (index: number, field: string, value: string) => {
            const updated = [...data.workExperience];
            updated[index] = { ...updated[index], [field]: value };
            update({ workExperience: updated });
        };

        const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
            const updated = [...data.workExperience];
            const achievements = [...updated[expIndex].achievements];
            achievements[achIndex] = value;
            updated[expIndex] = { ...updated[expIndex], achievements };
            update({ workExperience: updated });
        };

        const updateEducation = (index: number, field: string, value: string) => {
            const updated = [...data.education];
            updated[index] = { ...updated[index], [field]: value };
            update({ education: updated });
        };

        const updateSkill = (index: number, value: string) => {
            const updated = [...data.skills];
            updated[index] = value;
            update({ skills: updated });
        };

        const updateLanguage = (index: number, field: string, value: string) => {
            const updated = [...data.languages];
            updated[index] = { ...updated[index], [field]: value };
            update({ languages: updated });
        };

        return (
            <div
                ref={(node) => {
                    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }}
                data-cv-template="cvplus"
                className="bg-white shadow-2xl mx-auto flex flex-col relative"
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    fontFamily: "'Playfair Display', serif",
                    position: "relative"
                }}
            >
                {/* Subtle Background Accent */}
                <div className="absolute top-0 right-0 w-[45%] h-[350px] bg-gradient-to-bl from-amber-50 to-transparent pointer-events-none" />

                {(photoUrl || editable) && (
                    <DraggablePhoto
                        photoUrl={photoUrl ?? null}
                        position={photoPosition}
                        size={photoSize}
                        shape={photoShape}
                        onPhotoChange={onPhotoChange ?? (() => { })}
                        onPositionChange={onPhotoPositionChange ?? (() => { })}
                        onSizeChange={onPhotoSizeChange ?? (() => { })}
                        onShapeChange={onPhotoShapeChange ?? (() => { })}
                        editable={editable}
                        containerRef={containerRef}
                    />
                )}
                {showWatermark && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        style={{ opacity: 0.08 }}
                    >
                        <div className="text-6xl font-black text-gray-900 rotate-[-30deg] font-sans">
                            PREMIUM
                        </div>
                    </div>
                )}

                {/* Elegant Header */}
                <header className="px-12 pt-14 pb-8 flex justify-between items-end border-b border-gray-100 z-10 relative">
                    <div className="max-w-[70%]">
                        <h1 className="text-[42px] font-bold text-gray-900 leading-tight tracking-tight mb-2">
                            <EditableField
                                value={data.name}
                                onChange={(v) => update({ name: v })}
                                editable={editable}
                                tag="span"
                            />
                        </h1>
                        <p className="text-[22px] text-amber-700 italic font-medium">
                            <EditableField
                                value={data.targetJob || "Profesional Excepcional"}
                                onChange={(v) => update({ targetJob: v })}
                                editable={editable}
                                tag="span"
                            />
                        </p>
                    </div>
                </header>

                <div className="px-12 py-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500 font-sans border-b border-gray-50 bg-gray-50/30">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <EditableField value={data.email} onChange={(v) => update({ email: v })} editable={editable} tag="span" />
                    </span>
                    {data.phone && (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <EditableField value={data.phone} onChange={(v) => update({ phone: v })} editable={editable} tag="span" />
                        </span>
                    )}
                </div>

                <div className="px-12 py-10 flex-grow grid grid-cols-12 gap-10 font-sans relative z-10">

                    {/* Main Column */}
                    <div className="col-span-8 space-y-10">
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-3">
                                <span className="w-6 h-[1px] bg-amber-600"></span>
                                Perfil
                            </h2>
                            <EditableField
                                value={data.professionalSummary}
                                onChange={(v) => update({ professionalSummary: v })}
                                editable={editable}
                                tag="p"
                                className="text-gray-700 leading-[1.8] text-[15px] font-serif"
                            />
                        </section>

                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-3">
                                <span className="w-6 h-[1px] bg-amber-600"></span>
                                Experiencia
                            </h2>
                            <div className="space-y-8">
                                {data.workExperience.map((exp, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="font-bold text-[17px] text-gray-900 tracking-tight">
                                                <EditableField value={exp.position} onChange={(v) => updateExperience(i, "position", v)} editable={editable} tag="span" />
                                            </h3>
                                            <span className="text-[13px] font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full whitespace-nowrap">
                                                <EditableField value={exp.startDate} onChange={(v) => updateExperience(i, "startDate", v)} editable={editable} tag="span" /> - <EditableField value={exp.endDate} onChange={(v) => updateExperience(i, "endDate", v)} editable={editable} tag="span" />
                                            </span>
                                        </div>
                                        <div className="text-[14px] font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                                            <EditableField value={exp.company} onChange={(v) => updateExperience(i, "company", v)} editable={editable} tag="span" />
                                        </div>
                                        <EditableField
                                            value={exp.description}
                                            onChange={(v) => updateExperience(i, "description", v)}
                                            editable={editable}
                                            tag="p"
                                            className="text-[14.5px] text-gray-600 leading-[1.7] mb-3"
                                        />
                                        {exp.achievements.length > 0 && (
                                            <ul className="space-y-2">
                                                {exp.achievements.map((ach, j) => (
                                                    <li key={j} className="text-[14px] text-gray-600 flex items-start gap-3 leading-[1.6]">
                                                        <span className="text-amber-500 text-lg leading-none mt-[-1px]">·</span>
                                                        <EditableField
                                                            value={ach}
                                                            onChange={(v) => updateAchievement(i, j, v)}
                                                            editable={editable}
                                                            tag="span"
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <div className="col-span-4 space-y-10">
                        {data.skills.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-amber-600"></span>
                                    Skills
                                </h2>
                                <div className="space-y-3">
                                    {data.skills.slice(0, 8).map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
                                            <span className="text-[14px] font-medium text-gray-700">
                                                <EditableField value={skill} onChange={(v) => updateSkill(i, v)} editable={editable} tag="span" />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-amber-600"></span>
                                    Educación
                                </h2>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="font-bold text-gray-900 text-[14px] leading-snug mb-1">
                                                <EditableField value={edu.degree} onChange={(v) => updateEducation(i, "degree", v)} editable={editable} tag="span" />
                                            </h3>
                                            <p className="text-[13px] text-amber-700 font-medium mb-1">
                                                <EditableField value={edu.field} onChange={(v) => updateEducation(i, "field", v)} editable={editable} tag="span" />
                                            </p>
                                            <div className="text-[12px] text-gray-500">
                                                <EditableField value={edu.institution} onChange={(v) => updateEducation(i, "institution", v)} editable={editable} tag="span" />
                                                <br />
                                                <span className="italic">
                                                    <EditableField value={edu.endDate} onChange={(v) => updateEducation(i, "endDate", v)} editable={editable} tag="span" />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-amber-600"></span>
                                    Idiomas
                                </h2>
                                <div className="space-y-3 pb-8">
                                    {data.languages.map((lang, i) => (
                                        <div key={i} className="border-b border-gray-100 pb-2">
                                            <div className="font-semibold text-[14px] text-gray-900">
                                                <EditableField value={lang.language} onChange={(v) => updateLanguage(i, "language", v)} editable={editable} tag="span" />
                                            </div>
                                            <div className="text-[13px] text-amber-700 italic">
                                                <EditableField value={lang.level} onChange={(v) => updateLanguage(i, "level", v)} editable={editable} tag="span" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

CVTemplateCVPlus.displayName = "CVTemplateCVPlus";
