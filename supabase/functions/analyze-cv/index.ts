import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres un experto senior en recursos humanos y sistemas ATS (Applicant Tracking Systems) especializado en el mercado laboral español.
Proporcionas análisis exhaustivos, rigurosos y detallados de currículums vitae.
Respondes SOLO con JSON válido, sin texto adicional antes o después.

PRINCIPIO FUNDAMENTAL: VERACIDAD ESTRICTA.
- NO INVENTES información que no aparezca explícitamente en el texto.
- Si falta información (fechas, métricas, estudios), SEÑÁLALO como problema, NO intentes rellenarlo.
- Basa tu análisis EXCLUSIVAMENTE en el texto proporcionado.

Criterios de evaluación:
1. PUNTUACIÓN ATS (0-100): Evalúa rigurosamente la compatibilidad con sistemas automáticos.
2. ANÁLISIS POR CATEGORÍAS: Puntúa Formato, Keywords, Experiencia, Habilidades y Logros.
3. PROBLEMAS DETECTADOS: Clasifica por CRITICAL, WARNING e INFO. Cada problema debe tener una solución específica.
4. PALABRAS CLAVE FALTANTES: Lista específica de keywords del sector que faltan en el CV.
5. RECOMENDACIONES PRIORITARIAS: Mínimo 5 acciones concretas para mejorar el CV.
6. ESTIMACIÓN SALARIAL: Basada en el mercado español actual, años de experiencia y sector.
7. CONSISTENCIA DE DATOS: Verifica si los 'Datos del candidato' proporcionados coinciden con el contenido del CV.

RÚBRICA DE PUNTUACIÓN ESTRICTA (Sigue estos baremos para asegurar consistencia):

1. FORMATO (Máx 15 pts):
   - Perfecto (limpio, sin tablas complejas, estructura estándar): 15 pts
   - Bueno (legible pero con columnas complejas o iconos): 10 pts
   - Regular (desordenado o diseño anticuado): 5 pts
   - Malo (ilegible para ATS, todo imagen): 0 pts

2. KEYWORDS (Máx 25 pts):
   - Excelencia (>80% palabras clave del sector): 25 pts
   - Bueno (>50% palabras clave): 15 pts
   - Pobre (pocas palabras clave): 5 pts

3. EXPERIENCIA (Máx 25 pts):
   - Alto Impacto (con logros cuantificables %, €): 25 pts
   - Estándar (descripción de tareas sin métricas): 15 pts
   - Básico (solo lista de puestos): 5 pts

4. HABILIDADES (Máx 15 pts):
   - Completas (Hard + Soft skills relevantes y separadas): 15 pts
   - Genéricas: 5 pts

5. LOGROS (Máx 20 pts):
   - Claramente definidos y destacados: 20 pts
   - Mencionados vagamente: 10 pts
   - Inexistentes: 0 pts

NOTA: Si detectas discrepancias en "Consistencia de Datos", RESTA 10 PUNTOS a la nota final.

Sé extremadamente crítico, rígido y profesional. No regales puntos.`;

const USER_PROMPT = (cvText: string) => `Analiza el siguiente currículum vitae y proporciona un análisis detallado en formato JSON siguiendo los estándares ATS más estrictos.
Ten en cuenta los "Datos del candidato" proporcionados al inicio (si los hay) y compáralos con el texto del CV.

CV a analizar:
"""
${cvText}
"""

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "atsScore": <número 0-100>,
  "formatScore": <número 0-100>,
  "keywordsScore": <número 0-100>,
  "experienceScore": <número 0-100>,
  "skillsScore": <número 0-100>,
  "achievementsScore": <número 0-100>,
  "problems": [
    {
      "message": "<descripción clara del problema encontrado>",
      "suggestion": "<solución específica, detallada y accionable>",
      "severity": "<critical|warning|info>",
      "category": "<contenido|logros|formato|keywords|estructura|habilidades>"
    }
  ],
  "missingKeywords": ["<palabra1>", "<palabra2>"],
  "recommendations": ["<recomendación1>", "<recomendación2>"],
  "salaryRange": {
    "min": <número anual bruto en EUR>,
    "max": <número anual bruto en EUR>,
    "currency": "EUR"
  }
}

IMPORTANTE: 
1. Debes encontrar al menos 3 problemas o áreas de mejora, incluso si el CV es bueno. Sé muy riguroso.
2. SI los "Datos del candidato" (Nombre, Email, Teléfono, Puesto Objetivo) NO coinciden con los del CV, genera obligatoriamente un problema (severity: warning/critical) avisando de la discrepancia. Ej: "El email proporcionado no coincide con el del CV".
3. NO INVENTES NADA. Si el CV no menciona algo, no asumas que lo tiene.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText, cvImage, action, targetJob, keyAchievements, name, email, phone, experienceYears, selectedKeywords, generateSummary, verified } = await req.json();

    // Specific logic for verified CVs (Perfect Score)
    if (verified === true && (!action || action === 'analyze')) {
      return new Response(JSON.stringify({
        atsScore: 100,
        formatScore: 100,
        keywordsScore: 100,
        experienceScore: 100,
        skillsScore: 100,
        achievementsScore: 100,
        problems: [],
        missingKeywords: [],
        recommendations: ["Tu CV está perfectamente optimizado. ¡Buen trabajo!"],
        salaryRange: null // Or keep existing estimate logic if preferred, but simpler to omit or mock
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let systemPrompt = SYSTEM_PROMPT;
    let userPromptText = USER_PROMPT(cvText || "El usuario ha proporcionado una imagen del CV.");

    // User context formatting
    let userContext = "";
    if (!action || action === "analyze" || action === "versions" || action === "actionPlan") {
      userContext = [

        targetJob ? `Puesto objetivo: ${targetJob}` : "",
        experienceYears ? `Años de experiencia: ${experienceYears}` : ""
      ].filter(Boolean).join("\n");
    }

    // Handle different actions setup (prompts)
    if (action === "extract") {
      systemPrompt = `Eres un experto en extracción de datos de currículums. Respondes SOLO con JSON válido.

REGLAS ESTRICTAS DE EXTRACCIÓN:
- Extrae ÚNICAMENTE la información que aparece EXPLÍCITAMENTE en el texto del CV.
- NO INVENTES datos. Si un campo no está visible en el texto, devuelve un array vacío [] o cadena vacía "".
- NO "corrijas" ni "adivines" direcciones de email o números de teléfono.
- Si encuentras MÚLTIPLES nombres, emails o teléfonos, inclúyelos TODOS en sus respectivos arrays.`;
      userPromptText = `Extrae TODOS los datos del siguiente CV de forma exhaustiva y devuélvelos en formato JSON estructurado.

IMPORTANTE: 
- Extrae todas y cada una de las experiencias laborales y formación académica que aparezcan. NO resumas ni omitas ninguna.
- Para las descripciones de experiencia, mantén el detalle original, incluyendo logros y responsabilidades.
- Si un dato NO aparece claramente en el CV, devuelve array vacío [] o cadena vacía "".
- Si hay VARIOS nombres, emails o teléfonos, devuélvelos TODOS en los arrays correspondientes.
- NO INVENTES NADA.
      
Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "names": ["<nombre/apellido 1>", "<nombre/apellido 2 si existe>"],
  "emails": ["<email 1>", "<email 2 si existe>"],
  "phones": ["<teléfono 1>", "<teléfono 2 si existe>"],
  "fullName": "<nombre completo principal o vacío>",
  "email": "<email principal o vacío>",
  "phone": "<teléfono principal o vacío>",
  "location": "<ubicación o vacío>",
  "linkedIn": "<url linkedin o vacío>",
  "portfolio": "<url portfolio o vacío>",
  "professionalSummary": "<resumen profesional o vacío>",
  "workExperience": [
    {
      "company": "<empresa>",
      "position": "<puesto>",
      "startDate": "<fecha inicio YYYY-MM>",
      "endDate": "<fecha fin YYYY-MM o 'Presente'>",
      "description": "<descripción>"
    }
  ],
  "education": [
    {
      "institution": "<institución>",
      "degree": "<título>",
      "field": "<campo de estudio>",
      "startDate": "<fecha inicio YYYY-MM>",
      "endDate": "<fecha fin YYYY-MM>"
    }
  ],
  "skills": ["<habilidad1>", "<habilidad2>"],
  "languages": ["<idioma1 (nivel)>", "<idioma2 (nivel)>"],
  "certifications": ["<certificación1>", "<certificación2>"]
}`;
    } else if (action === "transcribe") {
      systemPrompt = "Eres un asistente útil que transcribe texto de imágenes de documentos con alta precisión. Tu única tarea es extraer todo el texto visible del documento tal cual aparece. Mantén el formato básico (saltos de línea) pero no añadas explicaciones, ni markdown, ni JSON. Solo el texto plano.";
      userPromptText = "Transcribe todo el texto que veas en esta imagen del CV. Devuelve solo el texto extraído.";
    } else if (action === "actionPlan") {
      systemPrompt = `Eres un coach de carrera profesional. Proporcionas planes de acción detallados y personalizados para mejorar la empleabilidad. Respondes SOLO con JSON válido.`;
      userPromptText = `Analiza el currículum proporcionado abajo.
    
CV a analizar:
Basándote en el CV proporcionado, crea un plan de acción detallado para mejorar la empleabilidad.
       
Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "immediate": [{ "action": "", "howTo": "", "priority": "high|medium|low" }],
  "shortTerm": [{ "action": "", "howTo": "", "priority": "high|medium|low" }],
  "longTerm": [{ "action": "", "howTo": "", "priority": "high|medium|low" }],
  "trainingRecommendations": [{ "course": "", "provider": "", "reason": "" }],
  "linkedInTips": [],
  "interviewPrep": []
}`;
    } else if (action === "versions") {
      // selectedKeywords and generateSummary come from the request body destructuring at line 101
      const effectiveSelectedKeywords = selectedKeywords || [];
      const effectiveGenerateSummary = generateSummary !== false; // Default true for backwards compat

      systemPrompt = `Eres un experto redactor de CVs senior. Tu trabajo es TRANSFORMAR el contenido original en un CV profesional de alto impacto.

REGLAS DE ORO:
1. NO inventes hechos (empresas, cargos, fechas, títulos o certificaciones que no existan).
2. SÍ puedes (y debes) mejorar la redacción, expandir puntos clave y usar un lenguaje profesional para que el CV brille.
3. Asegúrate de incluir TODA la experiencia laboral relevante sin omitir detalles importantes.
4. Si se proporcionan logros manuales o habilidades adicionales, intégralos de forma natural y destacada.

LO QUE ESTÁ PROHIBIDO:
❌ NO inventes puestos de trabajo nuevos.
❌ NO inventes títulos universitarios.
❌ NO inventes métricas específicas falsas si no hay una base en el CV (ej: no pongas "35%" si el CV no menciona un aumento).

LO QUE SE FOMENTA:
✓ Usar verbos de acción potentes (Lideré, Implementé, Optimicé).
✓ Mejorar la estructura y flujo de las descripciones.
✓ Articular responsabilidades vagas para que suenen profesionales y orientadas a resultados.
✓ Incluir habilidades de la lista "Habilidades adicionales seleccionadas" y los logros manuales.

DATOS DE CONTACTO: Usa EXCLUSIVAMENTE el nombre, email y teléfono que aparecen en el texto del CV o en los datos del candidato proporcionados.`;

      userPromptText = `CV a analizar:

INSTRUCCIONES ESTRICTAS:
${targetJob ? `Puesto objetivo: "${targetJob}".` : ""}
${keyAchievements ? `Logros proporcionados manualmente por el usuario (estos SÍ puedes incluir): "${keyAchievements}".` : ""}
${effectiveSelectedKeywords.length > 0 ? `Habilidades adicionales APROBADAS por el usuario para añadir: "${effectiveSelectedKeywords.join(", ")}".` : "NO hay habilidades adicionales aprobadas. Usa SOLO las del CV original."}
${!effectiveGenerateSummary ? `RESUMEN PROFESIONAL: El usuario NO quiere resumen profesional. Deja el campo "summary" VACÍO ("").` : `RESUMEN PROFESIONAL: Genera un resumen basado ÚNICAMENTE en la información del CV, sin inventar logros ni características.`}

PROCESO DE GENERACIÓN:
1. Lee el CV original cuidadosamente
2. Identifica CADA pieza de información
3. Mejora la redacción SIN añadir información nueva
4. Incluye SOLO las habilidades del CV + las de la lista aprobada
5. Si hay logros manuales, inclúyelos como logros destacados

VERIFICACIÓN FINAL:
Antes de generar, pregúntate: "¿Esta información está en el CV original o fue proporcionada explícitamente por el usuario?" Si la respuesta es NO, NO la incluyas.

Genera:
1. Versión Ejecutiva/Formal
2. Versión Moderna/Creativa

Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "formal": {
    "type": "formal",
    "title": "Versión Ejecutiva (Optimizada ATS)",
    "description": "Ideal para banca, consultoría y corporaciones",
    "personalDetails": {
      "name": "<nombre EXACTO del CV>",
      "email": "<email EXACTO del CV>",
      "phone": "<teléfono EXACTO del CV>"
    },
    "content": {
      "summary": "<resumen basado en info real del CV o vacío si no aprobado>",
      "experience": [
        {
          "company": "<empresa EXACTA del CV>",
          "position": "<puesto EXACTO del CV>",
          "startDate": "<fecha EXACTA>",
          "endDate": "<fecha EXACTA o Presente>",
          "description": "<descripción mejorada en redacción, misma información>"
        }
      ],
      "education": [
        {
          "institution": "<institución EXACTA del CV>",
          "degree": "<título EXACTO del CV>",
          "field": "<campo EXACTO del CV>",
          "startDate": "<fecha>",
          "endDate": "<fecha>"
        }
      ],
      "skills": ["<habilidades del CV + aprobadas ÚNICAMENTE>"]
    }
  },
  "creative": {
    "type": "creative",
    "title": "Versión Moderna (Alto Impacto)",
    "description": "Ideal para startups, tech y creativos",
    "personalDetails": {
      "name": "<nombre EXACTO del CV>",
      "email": "<email EXACTO del CV>",
      "phone": "<teléfono EXACTO del CV>"
    },
    "content": {
      "summary": "<resumen con tono más dinámico, misma información real>",
      "experience": [
        {
          "company": "<empresa del CV>",
          "position": "<puesto del CV>",
          "startDate": "<fecha>",
          "endDate": "<fecha o Presente>",
          "description": "<descripción con enfoque en impacto, misma información>"
        }
      ],
      "education": [
        {
          "institution": "<institución del CV>",
          "degree": "<título del CV>",
          "field": "<campo del CV>",
          "startDate": "<fecha>",
          "endDate": "<fecha>"
        }
      ],
      "skills": ["<habilidades del CV + aprobadas ÚNICAMENTE>"]
    }
  }
}`;
    }

    // Prepend user context if it exists and we're not extracting (extraction needs raw data usually, but context helps disambiguate)
    if (userContext && action !== "extract") {
      userPromptText = `Datos del candidato:\n${userContext}\n\n` + userPromptText;
    }

    // Construct messages payload
    let messages;
    if (cvImage) {
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPromptText },
            { type: "image_url", image_url: { url: cvImage } }
          ]
        }
      ];
    } else {
      // Original text-based flow
      // Re-insert the cvText into the prompt if it was pulled out
      const finalUserPrompt = cvText
        ? userPromptText.replace("CV a analizar:", `CV a analizar:\n"""\n${cvText}\n"""\n`)
        : userPromptText;

      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: finalUserPrompt }
      ];
    }

    console.log(`Processing CV analysis with action: ${action || "analyze"}, hasImage: ${!!cvImage}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: action === "transcribe" ? "gpt-4o" : "gpt-4o-mini",
        messages: messages,
        temperature: 0.0,
        response_format: action === "transcribe" ? undefined : { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Por favor, inténtalo de nuevo más tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Por favor, añade créditos a tu cuenta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from AI");
    }

    // Parse the JSON response
    let result;
    if (action === "transcribe") {
      // For transcription, we just want the raw text
      result = { text: content };
    } else {
      try {
        // Clean the response - remove markdown code blocks if present
        let cleanContent = content.trim();
        if (cleanContent.startsWith("```json")) {
          cleanContent = cleanContent.slice(7);
        }
        if (cleanContent.startsWith("```")) {
          cleanContent = cleanContent.slice(3);
        }
        if (cleanContent.endsWith("```")) {
          cleanContent = cleanContent.slice(0, -3);
        }
        result = JSON.parse(cleanContent.trim());

        if (action === "analyze") {
          console.log(`AI Analysis Result: ${JSON.stringify({
            atsScore: result.atsScore,
            problemsCount: result.problems?.length || 0,
            hasSalary: !!result.salaryRange
          })}`);
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-cv function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
