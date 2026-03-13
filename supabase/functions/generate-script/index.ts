import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const funcaoMap: Record<number, string[]> = {
  2: ["Hook", "CTA"],
  3: ["Hook", "Desenvolvimento", "CTA"],
  4: ["Hook", "Contexto", "Desenvolvimento", "CTA"],
  5: ["Hook", "Contexto", "Desenvolvimento", "Virada", "CTA"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta, numFalas, cloneProfile, action, falaOriginal, falasOriginais, funcaoAlvo, sotaque, genero, startFrameBase64 } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const nFalas = Math.min(5, Math.max(2, numFalas || 3));
    const funcoes = funcaoMap[nFalas] || funcaoMap[3];

    const sotaqueText = sotaque && sotaque !== 'neutro' ? `, com sotaque ${sotaque}` : '';
    const startFrameText = startFrameBase64 ? '\nIMPORTANTE: Uma foto do start frame foi anexada. Analise a imagem e use o cenário, objetos, iluminação e posição como base para todas as cenas.' : '';

    // Build clone profile context
    let cloneCtx = "";
    if (cloneProfile) {
      const parts = [];
      if (cloneProfile.comoFala) parts.push(`Jeito de falar: ${cloneProfile.comoFala}`);
      if (cloneProfile.palavrasUsa) parts.push(`Palavras que usa: ${cloneProfile.palavrasUsa}`);
      if (cloneProfile.palavrasEvita) parts.push(`Palavras que NUNCA usa: ${cloneProfile.palavrasEvita}`);
      if (cloneProfile.nivelEnergia) parts.push(`Nível de energia: ${cloneProfile.nivelEnergia}`);
      if (cloneProfile.arquetipo) parts.push(`Arquétipo: ${cloneProfile.arquetipo}`);
      if (cloneProfile.tomEmocional) parts.push(`Tom emocional dominante: ${cloneProfile.tomEmocional}`);
      if (parts.length > 0) cloneCtx = `\n\nPERFIL DO CLONE (use para personalizar MUITO as falas):\n${parts.join("\n")}`;
    }

    // Handle text transform actions
    const textTransforms = ["legenda", "prompt-video", "teleprompter"];
    if (action && textTransforms.includes(action) && falasOriginais) {
      const roteiro = falasOriginais.join("\n");
      let transformPrompt = "";
      if (action === "legenda") {
        transformPrompt = `Transforme este roteiro em uma legenda para ${plataforma || "redes sociais"}. Mantenha o tom e a essência. Use emojis quando apropriado. Não use hashtags. Retorne APENAS JSON: {"texto": "legenda aqui"}`;
      } else if (action === "prompt-video") {
        transformPrompt = `Transforme este roteiro em um prompt detalhado para geração de vídeo com IA. Descreva cenas, enquadramentos, expressões e ações para cada fala. Retorne APENAS JSON: {"texto": "prompt completo aqui"}`;
      } else if (action === "teleprompter") {
        transformPrompt = `Formate este roteiro para teleprompter. Cada fala em uma linha separada, com marcações de pausa (//), ênfase (*palavra*) e respiração (...). Retorne APENAS JSON: {"texto": "texto formatado aqui"}`;
      }

      const resp = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: "Você é um especialista em conteúdo para vídeos curtos. Retorne APENAS JSON válido sem markdown." },
        { role: "user", content: `Roteiro original:\n${roteiro}\n\n${transformPrompt}` },
      ]);
      return jsonResponse(resp);
    }

    // Handle single fala transform actions
    const falaTransforms = ["mais-natural", "mais-persuasiva", "encurtar", "expandir"];
    if (action && falaTransforms.includes(action) && falaOriginal) {
      let instruction = "";
      if (action === "mais-natural") instruction = "Reescreva esta fala de forma mais natural, coloquial e humana. Mantenha entre 80-140 caracteres.";
      else if (action === "mais-persuasiva") instruction = "Reescreva esta fala de forma mais persuasiva e impactante. Mantenha entre 80-140 caracteres.";
      else if (action === "encurtar") instruction = "Encurte esta fala mantendo a essência. Resultado entre 80-100 caracteres.";
      else if (action === "expandir") instruction = "Expanda levemente esta fala sem ultrapassar 140 caracteres. Adicione mais detalhes ou emoção.";

      const sysPrompt = `Você é um roteirista brasileiro premium. ${instruction}${cloneCtx}
A voz do personagem tem sotaque: ${sotaque || 'neutro'}
${startFrameText}

Retorne APENAS JSON válido no formato estruturado:
{"falas":[{
  "numero":1,
  "funcao":"${funcaoAlvo || "Hook"}",
  "setup": {
    "scene": "descrição do cenário",
    "camera": "enquadramento e ângulo",
    "style": "estilo visual",
    "aspect_ratio": "9:16",
    "fps": 30,
    "duration_seconds": 8
  },
  "action": {
    "subject": "Criador(a)",
    "movement": "ação detalhada"
  },
  "audio": {
    "dialogue": "texto da fala entre 80-140 chars",
    "voice": "descrição da voz com sotaque${sotaqueText}"
  }
}]}`;

      const resp = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: sysPrompt },
        { role: "user", content: `Fala original: "${falaOriginal}"\nFunção: ${funcaoAlvo || "Hook"}` },
      ]);
      return jsonResponse(resp);
    }

    // Handle bulk transform (variacoes, mais-natural, mais-agressiva for all)
    if (action && ["variacoes", "mais-natural", "mais-agressiva"].includes(action) && falasOriginais) {
      let instruction = "";
      if (action === "variacoes") instruction = "Crie uma VARIAÇÃO completamente diferente deste roteiro, mantendo o tema e objetivo mas mudando abordagem e palavras.";
      else if (action === "mais-natural") instruction = "Reescreva TODO o roteiro de forma mais natural, coloquial e humana.";
      else if (action === "mais-agressiva") instruction = "Reescreva TODO o roteiro de forma mais agressiva, urgente e persuasiva.";

      const sysPrompt = buildMainSystemPrompt(nFalas, funcoes, cloneCtx, sotaque, startFrameText, instruction);
      const resp = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: sysPrompt },
        { role: "user", content: buildUserPrompt(tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta, nFalas, sotaque, `\nRoteiro original:\n${falasOriginais.join("\n")}`) },
      ]);
      return jsonResponse(resp);
    }

    // Default: generate new script
    const systemPrompt = buildMainSystemPrompt(nFalas, funcoes, cloneCtx, sotaque, startFrameText);
    const userPrompt = buildUserPrompt(tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta, nFalas, sotaque);

    // Build multimodal user message if image provided
    const userMessage = buildUserMessage(userPrompt, startFrameBase64);

    const resp = await callAI(LOVABLE_API_KEY, [
      { role: "system", content: systemPrompt },
      userMessage,
    ]);
    return jsonResponse(resp);

  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildMainSystemPrompt(nFalas: number, funcoes: string[], cloneCtx: string, sotaque?: string, startFrameText?: string, extraInstruction?: string): string {
  const sotaqueText = sotaque && sotaque !== 'neutro' ? sotaque : 'neutro';
  return `Você é um roteirista brasileiro de elite, especializado em vídeos curtos para clones de IA.
Seu trabalho é criar falas que soem EXTREMAMENTE humanas, naturais, performáveis.

${extraInstruction || ""}

Gere exatamente ${nFalas} falas com estas FUNÇÕES na ordem: ${funcoes.join(" → ")}

REGRAS OBRIGATÓRIAS:
- Cada fala DEVE ter no MÍNIMO 80 caracteres e no MÁXIMO 140 caracteres (conte com precisão!)
- As falas devem soar faladas por uma pessoa real, nunca robóticas
- Conecte as falas com fluidez narrativa
- A primeira fala (Hook) DEVE prender atenção nos primeiros 2 segundos
- A última fala DEVE fechar com impacto ou CTA forte
- Varie o ritmo: frases curtas + médias para manter dinamismo
- Use linguagem do dia a dia brasileiro, com personalidade
- O sotaque do personagem é: ${sotaqueText}
${startFrameText || ""}
${cloneCtx}

Retorne APENAS um JSON válido neste formato exato, sem markdown:
{
  "falas": [
    {
      "numero": 1,
      "funcao": "${funcoes[0]}",
      "setup": {
        "scene": "descrição detalhada do cenário",
        "camera": "enquadramento e ângulo de câmera",
        "style": "estilo visual do vídeo",
        "aspect_ratio": "9:16",
        "fps": 30,
        "duration_seconds": 8
      },
      "action": {
        "subject": "Criador(a)",
        "movement": "ação específica e detalhada"
      },
      "audio": {
        "dialogue": "texto da fala entre 80-140 chars",
        "voice": "descrição da voz com sotaque ${sotaqueText} e tom emocional"
      }
    }
  ]
}`;
}

function buildUserPrompt(tema: string, objetivo: string, publicoAlvo: string, estiloFala: string, personalidade: string, plataforma: string, cta: string, nFalas: number, sotaque?: string, extra?: string): string {
  return `Crie um roteiro premium para clone de IA:
- Tema: ${tema}
- Objetivo: ${objetivo}
- Público-alvo: ${publicoAlvo}
- Estilo de fala: ${estiloFala}
- Personalidade: ${personalidade}
- Plataforma: ${plataforma}
- CTA: ${cta || "definir automaticamente"}
- Número de falas: ${nFalas}
- Sotaque: ${sotaque || "neutro"}
${extra || ""}

LEMBRE: cada fala entre 80-140 caracteres. Conte com precisão. Use o formato JSON estruturado com setup/action/audio.`;
}

function buildUserMessage(textContent: string, startFrameBase64?: string): {role: string; content: any} {
  if (startFrameBase64) {
    return {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: startFrameBase64 } },
        { type: "text", text: `Esta é a foto do start frame. Analise todos os detalhes visuais e use como referência.\n\n${textContent}` },
      ],
    };
  }
  return { role: "user", content: textContent };
}

async function callAI(apiKey: string, messages: Array<{role: string; content: any}>) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      return { error: "Limite de requisições excedido. Tente novamente em alguns instantes.", _status: 429 };
    }
    if (response.status === 402) {
      return { error: "Créditos insuficientes. Adicione créditos ao workspace.", _status: 402 };
    }
    const t = await response.text();
    console.error("AI gateway error:", response.status, t);
    return { error: "Erro ao gerar roteiro", _status: 500 };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return { error: "Resposta vazia da IA", _status: 500 };

  try {
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch {
    console.error("Failed to parse AI response:", content);
    return { error: "Erro ao processar resposta da IA", _status: 500 };
  }
}

function jsonResponse(data: any) {
  const status = data._status || 200;
  if (data._status) delete data._status;
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
