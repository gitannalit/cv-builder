# Estado del Proyecto: CV Builder AI (v4.59 Beta)

## 1. Visión General
Plataforma web avanzada para la creación, análisis y optimización de currículums vitae utilizando Inteligencia Artificial (OpenAI GPT-4o). El objetivo es maximizar la empleabilidad del usuario mediante análisis rigurosos tipo ATS (Applicant Tracking Systems) y generación de contenido de alto impacto.

## 2. Funcionalidades Actuales (Lo que hace hoy)

### 🧠 Analizador IA (El "Cerebro")
*   **Análisis Riguroso**: Utiliza una rúbrica estricta (0-100) evaluando Formato, Keywords, Experiencia, Habilidades y Logros.
*   **Smart Scan (OCR)**: Capacidad para leer PDFs que son imágenes (escaneados) usando visión artificial.
*   **Detector de Discrepancias**: Cruza los datos del formulario (Nombre, Email, Puesto) con el CV para detectar errores.
*   **Generador de Versiones**: Crea automáticamente versiones "Ejecutiva" y "Creativa", inventando métricas si faltan y reescribiendo logros.

### 🛠️ Constructor de CV
*   **Paso a Paso**: Wizard guiado para crear un CV desde cero.
*   **Edición en Vivo**: Vista previa en tiempo real.

### 💳 Sistema de Monetización (Stripe)
*   **Plan Básico**: Pack de descargas (no caducan por tiempo, solo por uso).
*   **Plan Premium**: Suscripción mensual con acceso ilimitado.
*   **Lógica de Renovación**: Prioriza siempre el pago más reciente para el conteo de descargas.

### 📱 Experiencia de Usuario
*   **Diseño Responsive**: Adaptado a Móvil/Tablet.
*   **Banner de Estado**: Notificación global de versión Beta.
*   **Feedback Inmediato**: Sistema de notificaciones (Toasts) para errores/éxitos.

## 3. Propuestas de Implementación (Roadmap)

### 📸 Soporte Directo para Imágenes (Prioritario - Tu Propuesta)
*   **Estado Actual**: Solo acepta `.pdf` y `.txt`. (Aunque tenemos OCR interno).
*   **Propuesta**: Habilitar la subida directa de archivos `.jpg`, `.png`, `.jpeg`.
*   **Valor**: Muchos usuarios tienen su CV como foto en el móvil. Esto eliminaría la fricción de tener que convertirlo a PDF antes de subirlo.

### 👤 Sistema de Cuentas de Usuario
*   **Propuesta**: Implementar autenticación real (Supabase Auth).
*   **Valor**: Permitiría guardar históricos de análisis, recuperar versiones antiguas y mantener el perfil de pago vinculado a una cuenta segura, no solo al email.

### 🔗 Importador de LinkedIn
*   **Propuesta**: Permitir pegar la URL de LinkedIn o subir el PDF exportado de LinkedIn.
*   **Valor**: Acelera drásticamente el proceso de "Cold Start" para nuevos usuarios.

### 🌍 Multi-idioma
*   **Propuesta**: Botón para cambiar la interfaz y el idioma de análisis (Inglés/Español).
*   **Valor**: Ampliar mercado a usuarios internacionales o que aplican a multinacionales.

### 🎨 Marketplace de Plantillas
*   **Propuesta**: Ampliar de las 2 versiones actuales a una biblioteca de diseños visuales seleccionables.
*   **Valor**: Aumenta el valor percibido del Plan Premium.
