

## Plano: Gerador de Roteiro para Clone de IA

A página `/roteiros` atual é um gerador de cenas UGC com diálogos hardcoded. O pedido é um gerador de roteiros para clones de IA com estrutura diferente: falas numeradas (80-140 chars), com intenção e sugestão de gesto. Vou usar IA (edge function) para gerar roteiros dinâmicos e personalizados.

### Mudanças

**1. Nova edge function `supabase/functions/generate-script/index.ts`**
- Recebe: tema, objetivo, público-alvo, estilo de fala, personalidade, plataforma, CTA, número de falas
- Usa modelo `google/gemini-2.5-flash` via Lovable AI para gerar o roteiro
- Prompt do sistema instrui o modelo a retornar JSON com array de falas, cada uma com: número, texto (80-140 chars), intenção, sugestão de expressão/gesto
- Valida que cada fala respeita os limites de caracteres

**2. Reescrever `src/pages/ScriptGeneratorPage.tsx`**
- Novo formulário com campos:
  - Tema do vídeo (input)
  - Objetivo (input)
  - Público-alvo (input)
  - Estilo de fala (select: casual, profissional, enérgico, calmo, humorístico)
  - Personalidade do clone (input)
  - Plataforma (select: TikTok, Reels, Shorts, LinkedIn)
  - CTA final (input)
  - Número de falas (slider, 3-10)
- Botão "Gerar Roteiro" chama a edge function
- Loading state durante geração
- Resultado exibido em cards por fala:
  - Número da fala
  - Texto exato
  - Intenção (badge/tag)
  - Sugestão de expressão/gesto
  - Contador de caracteres (verde se 80-140, vermelho se fora)
- Botão regenerar fala individual e copiar texto

**3. Novo hook `src/hooks/useScriptGeneration.ts`**
- Encapsula chamada à edge function `generate-script`
- Gerencia loading, error, results

### Estrutura do resultado (JSON da IA)

```json
{
  "falas": [
    {
      "numero": 1,
      "texto": "Imagina ter um clone seu que responde...",
      "intencao": "Prender atenção com curiosidade",
      "expressao": "Olhar direto pra câmera com leve sorriso"
    }
  ]
}
```

### Resultado
O usuário preenche os campos contextuais, a IA gera um roteiro completo com falas naturais, numeradas, dentro dos limites de caracteres, com intenção e sugestão de gesto para cada uma.

