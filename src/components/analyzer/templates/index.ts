export { ModernTemplate } from './ModernTemplate';
export { ClassicTemplate } from './ClassicTemplate';
export { MinimalTemplate } from './MinimalTemplate';
export * from './CVTemplateModern';
export * from './CVTemplateExecutive';
export * from './CVTemplateCVPlus';

export type TemplateType = 'modern' | 'executive' | 'creative' | 'classic' | 'minimal' | 'cvplus';

export const templateInfo: Record<TemplateType, { name: string; description: string }> = {
  modern: {
    name: 'Moderno',
    description: 'Diseño limpio con acentos de color y estructura visual clara'
  },
  classic: {
    name: 'Clásico',
    description: 'Formato tradicional ideal para sectores corporativos'
  },
  minimal: {
    name: 'Minimalista',
    description: 'Elegante y espacioso, perfecto para creativos'
  },
  creative: {
    name: 'Creativo',
    description: 'Diseño con barra lateral, ideal para startups y tech'
  },
  executive: {
    name: 'Ejecutivo',
    description: 'Diseño sobrio y profesional para perfiles senior'
  },
  cvplus: {
    name: 'Premium CV+',
    description: 'Diseño ultra-elegante y distinguido, exclusivo para cuentas Pro'
  }
};
