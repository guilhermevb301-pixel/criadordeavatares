import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { produto, beneficio, tom, numCenas } = await req.json();

    if (!produto || !beneficio || !tom || !numCenas) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios: produto, beneficio, tom, numCenas' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Você é um roteirista especialista em conteúdo UGC (User Generated Content) para redes sociais.

Gere exatamente ${numCenas} cenas para um vídeo UGC sobre o produto "${produto}".

Regras obrigatórias:
- Cada cena tem: scene (cenário), action (ação do criador), dialogue (fala), type (hook/development/cta)
- O cenário (scene) deve ser o MESMO para todas as cenas (ambiente fixo, ex: "Banheiro iluminado com luz natural")
- As ações (action) devem ser DIFERENTES e variadas entre as cenas. Use ações como: segurar produto, aplicar produto, mostrar resultado, gesticular, olhar pra câmera, apontar, etc.
- Cada diálogo deve ter entre 120 e 160 caracteres (OBRIGATÓRIO)
- A primeira cena deve ser type "hook" — mencionando o produto "${produto}" e o benefício "${beneficio}" logo na primeira frase para prender atenção
- As cenas intermediárias devem ser type "development" — desenvolver experiência, resultados, sensações
- A última cena deve ser type "cta" — fechar com chamada para ação natural
- Tom de voz: ${tom}
- Linguagem natural, humana, sem clichês, própria para vídeo curto
- Conecte as falas para ter continuidade narrativa
- Evite linguagem robótica ou publicitária genérica

Retorne APENAS um JSON válido no formato:
{
  "scenes": [
    {
      "numero": 1,
      "scene": "descrição do cenário",
      "action": "ação específica do criador",
      "dialogue": "texto da fala entre 120-160 chars",
      "type": "hook|development|cta"
    }
  ]
}`;

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Gere ${numCenas} cenas UGC para o produto "${produto}" com benefício "${beneficio}" no tom "${tom}".` },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return new Response(JSON.stringify({ error: 'Erro ao chamar IA' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: 'Resposta inválida da IA' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
