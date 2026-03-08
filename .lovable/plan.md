

## Plano: Transformação Premium da Página Roteiro Clone

Reestruturação completa da página `/roteiros` em uma experiência premium de SaaS com layout split-panel, presets, perfil do clone, modo simples/avançado e resultado rico.

### Arquitetura de Componentes

Quebrar a página monolítica em componentes modulares:

```text
src/pages/ScriptGeneratorPage.tsx (orquestrador)
├── src/components/script/ScriptConfigPanel.tsx (painel esquerdo)
│   ├── PresetChips.tsx (presets rápidos)
│   ├── BasicFields.tsx (campos essenciais)
│   ├── CloneProfileFields.tsx (perfil do clone - modo avançado)
│   └── FalasSlider.tsx (slider 2-5)
├── src/components/script/ScriptResultPanel.tsx (painel direito)
│   ├── EmptyState.tsx (estado vazio elegante)
│   ├── LoadingState.tsx (skeleton premium)
│   ├── ResultHeader.tsx (resumo tema/objetivo/plataforma)
│   ├── FalaCard.tsx (card individual de fala)
│   └── ResultActions.tsx (ações gerais no topo)
└── src/lib/script-presets.ts (dados dos presets)
```

### 1. Layout Split-Panel Premium

- Desktop: grid `grid-cols-[400px_1fr]` com painel config à esquerda (scroll próprio) e resultado à direita (área principal, maior destaque)
- Mobile: stack vertical, config primeiro, resultado abaixo
- Painel esquerdo com fundo `card` e borda sutil, painel direito com fundo `background`
- Header no topo: "Roteiros pensados para seu clone soar mais humano, natural e convincente."

### 2. Presets (src/lib/script-presets.ts)

7 presets como chips clicáveis acima do formulário:
- Vídeo Viral, Autoridade, Vendas, Conteúdo Educativo, Resposta a Objeção, Chamada para Ação, Storytelling Curto
- Cada preset preenche: tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta com valores coerentes

### 3. Modo Simples / Avançado (Toggle)

- **Simples**: Tema, Objetivo, Público-alvo, Personalidade, Estilo, Plataforma, CTA, Nº falas
- **Avançado**: Tudo acima + seção "Perfil do Clone":
  - Como esse clone fala? (input)
  - Palavras que costuma usar (input)
  - Palavras que evita (input)
  - Nível de energia (select: baixo/médio/alto)
  - Arquétipo (select: mentor/vendedor/especialista/amigo/provocador/premium)
  - Tom emocional dominante (input)

### 4. Slider 2-5 Falas

- Range 2-5 (não mais 3-10)
- Texto de apoio: "Cada fala será gerada entre 80 e 140 caracteres para manter naturalidade, ritmo e boa performance em vídeo."

### 5. Estrutura Funcional das Falas (lógica no prompt)

- 2 falas: Hook + CTA
- 3 falas: Hook + Desenvolvimento + CTA
- 4 falas: Hook + Contexto + Desenvolvimento + CTA
- 5 falas: Hook + Contexto + Desenvolvimento + Virada + CTA

### 6. Resultado Premium (painel direito)

**Header do resultado**: badges com tema, objetivo, plataforma, nº falas

**Card de cada fala** com visual premium (glow sutil, borda accent):
- Título "Fala X" com badge da função (Hook/Contexto/Desenvolvimento/Virada/CTA)
- Texto da fala em destaque
- Contador: "118/140 caracteres" com cor verde/vermelho
- Intenção emocional
- Sugestão de expressão
- Sugestão de gesto/ação
- Sugestão de enquadramento
- Botões: Copiar, Regenerar, Mais natural, Mais persuasiva, Encurtar, Expandir

**Ações gerais** no topo do resultado:
- Copiar roteiro completo
- Gerar variações
- Versão mais natural
- Versão mais agressiva
- Transformar em legenda
- Transformar em prompt de vídeo
- Transformar em teleprompter

### 7. Estados Visuais

- **Vazio**: ilustração/ícone sutil + texto motivacional + seta indicando que deve preencher e gerar
- **Carregando**: skeleton cards animados com glow
- **Sucesso**: cards completos
- **Erro**: mensagem elegante com botão "Tentar novamente"

### 8. Atualizar Edge Function

- Modelo: `google/gemini-3-flash-preview` (default recomendado, mais recente)
- Expandir prompt para incluir campos do perfil do clone quando fornecidos
- Adicionar campos novos ao JSON de resposta: `funcao` (Hook/CTA/etc), `gesto`, `enquadramento`
- Adicionar parâmetro `action` para ações como "mais natural", "mais persuasiva", "encurtar", "expandir", "variações", "legenda", "prompt de vídeo", "teleprompter"
- Instruir a IA sobre a estrutura funcional (2 falas = Hook+CTA, etc.)

### 9. Atualizar Hook (useScriptGeneration)

- Expandir `ScriptParams` com campos do perfil do clone
- Expandir `Fala` com: `funcao`, `gesto`, `enquadramento`
- Adicionar métodos: `transformFala(index, action)`, `transformAll(action)` para ações como "mais natural", "encurtar", etc.

### 10. Estilo Visual

- Usar cores do tema dark existente: azul petróleo (primary), dourado (accent), bordas `border`
- Cards com `shadow-card` e hover `shadow-card-hover`
- Glow sutil com `shadow-glow-accent` nos cards de resultado
- Inputs e selects com estilo consistente
- Botão gerar com destaque dourado/accent, tamanho grande
- Responsivo: mobile stack, desktop split

### Arquivos a criar/editar

| Arquivo | Ação |
|---|---|
| `src/pages/ScriptGeneratorPage.tsx` | Reescrever completamente |
| `src/components/script/ScriptConfigPanel.tsx` | Criar |
| `src/components/script/ScriptResultPanel.tsx` | Criar |
| `src/components/script/FalaCard.tsx` | Criar |
| `src/components/script/PresetChips.tsx` | Criar |
| `src/lib/script-presets.ts` | Criar |
| `src/hooks/useScriptGeneration.ts` | Expandir interfaces e métodos |
| `supabase/functions/generate-script/index.ts` | Atualizar prompt, modelo e campos |

