import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta, numFalas } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um roteirista brasileiro especializado em vídeos curtos para clones de IA.

Gere um roteiro com exatamente ${numFalas || 5} falas.

REGRAS OBRIGATÓRIAS:
- Cada fala DEVE ter no MÍNIMO 80 caracteres e no MÁXIMO 140 caracteres (conte com cuidado!)
- As falas devem soar naturais, humanas, conversadas — próprias para vídeo curto
- Evite linguagem robótica ou formal demais
- Conecte uma fala à outra de forma fluida
- A primeira fala deve prender atenção imediatamente
- A última fala deve fechar com CTA ou impacto

Retorne APENAS um JSON válido neste formato exato, sem markdown, sem código:
{
  "falas": [
    {
      "numero": 1,
      "texto": "texto da fala aqui entre 80 e 140 caracteres",
      "intencao": "objetivo desta fala no roteiro",
      "expressao": "sugestão curta de expressão facial ou gesto"
    }
  ]
}`;

    const userPrompt = `Crie um roteiro para clone de IA com estas especificações:
- Tema do vídeo: ${tema}
- Objetivo: ${objetivo}
- Público-alvo: ${publicoAlvo}
- Estilo de fala: ${estiloFala}
- Personalidade do clone: ${personalidade}
- Plataforma: ${plataforma}
- CTA final desejado: ${cta}
- Número de falas: ${numFalas || 5}

Lembre-se: cada fala deve ter entre 80 e 140 caracteres. Conte os caracteres com precisão.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar roteiro" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "Resposta vazia da IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JSON from response (handle possible markdown wrapping)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Erro ao processar resposta da IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
