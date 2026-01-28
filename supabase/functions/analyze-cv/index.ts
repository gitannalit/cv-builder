import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres un experto senior en recursos humanos y sistemas ATS (Applicant Tracking Systems) especializado en el mercado laboral español.
Proporcionas análisis exhaustivos, rigurosos y detallados de currículums vitae.
Respondes SOLO con JSON válido, sin texto adicional antes o después.

Criterios de evaluación:
1. PUNTUACIÓN ATS (0-100): Evalúa rigurosamente la compatibilidad con sistemas automáticos.
2. ANÁLISIS POR CATEGORÍAS: Puntúa Formato, Keywords, Experiencia, Habilidades y Logros.
3. PROBLEMAS DETECTADOS: Clasifica por CRITICAL, WARNING e INFO. Cada problema debe tener una solución específica.
4. PALABRAS CLAVE FALTANTES: Lista específica de keywords del sector que faltan en el CV.
5. RECOMENDACIONES PRIORITARIAS: Mínimo 5 acciones concretas para mejorar el CV.
6. ESTIMACIÓN SALARIAL: Basada en el mercado español actual, años de experiencia y sector.

Sé extremadamente crítico y profesional.`;

const USER_PROMPT = (cvText: string) => `Analiza el siguiente currículum vitae y proporciona un análisis detallado en formato JSON siguiendo los estándares ATS más estrictos:

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

IMPORTANTE: Debes encontrar al menos 3 problemas o áreas de mejora, incluso si el CV es bueno. Sé muy riguroso.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText, action, targetJob, keyAchievements, name, email, phone, experienceYears } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = SYSTEM_PROMPT;
    let userPrompt = USER_PROMPT(cvText);

    // Add user context to the prompt if available (for default analysis)
    if (!action || action === "analyze") {
      const userContext = [
        name ? `Nombre: ${name}` : "",
        email ? `Email: ${email}` : "",
        phone ? `Teléfono: ${phone}` : "",
        targetJob ? `Puesto objetivo: ${targetJob}` : "",
        experienceYears ? `Años de experiencia: ${experienceYears}` : ""
      ].filter(Boolean).join("\n");

      if (userContext) {
        userPrompt = `Analiza el siguiente currículum vitae teniendo en cuenta estos datos del candidato:\n${userContext}\n\n` + userPrompt;
      }
    }

    // Handle different actions
    if (action === "extract") {
      systemPrompt = `Eres un experto en extracción de datos de currículums. Respondes SOLO con JSON válido.`;
      userPrompt = `Extrae los datos del siguiente CV y devuélvelos en formato JSON estructurado:

CV:
"""
${cvText}
"""

Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "fullName": "<nombre completo>",
  "email": "<email>",
  "phone": "<teléfono>",
  "location": "<ubicación>",
  "linkedIn": "<url linkedin o vacío>",
  "portfolio": "<url portfolio o vacío>",
  "professionalSummary": "<resumen profesional>",
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
    } else if (action === "actionPlan") {
      systemPrompt = `Eres un coach de carrera profesional. Proporcionas planes de acción detallados y personalizados para mejorar la empleabilidad. Respondes SOLO con JSON válido.`;
      userPrompt = `Basándote en el siguiente CV, crea un plan de acción detallado para mejorar la empleabilidad:

CV:
"""
${cvText}
"""

Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "immediate": [
    {
      "action": "<título de la acción>",
      "howTo": "<descripción detallada de cómo hacerlo>",
      "priority": "<high|medium|low>"
    }
  ],
  "shortTerm": [
    {
      "action": "<título>",
      "howTo": "<descripción>",
      "priority": "<high|medium|low>"
    }
  ],
  "longTerm": [
    {
      "action": "<título>",
      "howTo": "<descripción>",
      "priority": "<high|medium|low>"
    }
  ],
  "trainingRecommendations": [
    {
      "course": "<nombre del curso>",
      "provider": "<plataforma/proveedor>",
      "reason": "<por qué es importante para este perfil>"
    }
  ],
  "linkedInTips": ["<consejo1>", "<consejo2>"],
  "interviewPrep": ["<consejo1>", "<consejo2>"]
}`;
    } else if (action === "versions") {
      systemPrompt = `Eres un experto en redacción de currículums profesionales. Generas contenido profesional y atractivo adaptado a diferentes estilos. Respondes SOLO con JSON válido.`;
      userPrompt = `Basándote en el siguiente CV, genera dos versiones optimizadas con contenido completo.
${targetJob ? `El usuario quiere optimizar su CV para el puesto de: "${targetJob}".` : ""}
${keyAchievements ? `El usuario quiere destacar estos logros específicos:
"${keyAchievements}"` : ""}

CV original:
"""
${cvText}
"""

Genera:
1. Versión Ejecutiva/Formal: Tono sobrio, enfocado en resultados, ideal para banca/consultoría.
2. Versión Moderna/Creativa: Tono dinámico, storytelling, ideal para startups/tech.

Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "formal": {
    "type": "formal",
    "title": "Versión Ejecutiva",
    "description": "Ideal para banca, consultoría y corporaciones",
    "content": {
      "summary": "<resumen profesional formal reescrito, 3-4 oraciones>",
      "experience": [
        {
          "company": "<empresa>",
          "position": "<puesto optimizado>",
          "startDate": "<fecha inicio>",
          "endDate": "<fecha fin o Presente>",
          "description": "<descripción mejorada con logros cuantificables>"
        }
      ],
      "education": [
        {
          "institution": "<institución>",
          "degree": "<título>",
          "field": "<campo>",
          "startDate": "<fecha inicio>",
          "endDate": "<fecha fin>"
        }
      ],
      "skills": ["<habilidad1>", "<habilidad2>", "<habilidad3>"]
    }
  },
  "creative": {
    "type": "creative",
    "title": "Versión Moderna",
    "description": "Ideal para startups, tech y creativos",
    "content": {
      "summary": "<resumen profesional creativo con storytelling>",
      "experience": [
        {
          "company": "<empresa>",
          "position": "<puesto con enfoque dinámico>",
          "startDate": "<fecha inicio>",
          "endDate": "<fecha fin o Presente>",
          "description": "<descripción con narrativa atractiva>"
        }
      ],
      "education": [
        {
          "institution": "<institución>",
          "degree": "<título>",
          "field": "<campo>",
          "startDate": "<fecha inicio>",
          "endDate": "<fecha fin>"
        }
      ],
      "skills": ["<habilidad1>", "<habilidad2>", "<habilidad3>"]
    }
  }
}`;
    }

    console.log(`Processing CV analysis with action: ${action || "analyze"}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
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
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from AI");
    }

    // Parse the JSON response
    let result;
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
      console.log(`AI Analysis Result: ${JSON.stringify({ 
        atsScore: result.atsScore, 
        problemsCount: result.problems?.length || 0,
        hasSalary: !!result.salaryRange
      })}`);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
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
