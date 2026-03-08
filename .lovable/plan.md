

## Plano: Restaurar Gerador UGC + Nova Página de Roteiro Clone

O gerador de cenas UGC anterior foi substituído pelo gerador de roteiro para clone de IA. O usuário quer ambos como páginas separadas.

### Mudanças

**1. Manter `/roteiros` como o novo Gerador de Roteiro para Clone (já implementado)**
- Nenhuma alteração necessária nesta página.

**2. Criar nova página `/ugc` — Gerador de Cenas UGC**
- Recriar o gerador de cenas UGC como página separada em `src/pages/UgcGeneratorPage.tsx`
- Formulário com: nome do produto, benefício principal, tom de voz, número de cenas (3-6)
- Estrutura de cada cena: cenário (scene), ação (action), diálogo (120-160 chars)
- Prompt 1 = hook (menciona produto + benefício), intermediários = desenvolvimento, último = CTA
- Cenário fixo por conjunto, ações variadas de um pool para evitar repetição
- Exportação individual como JSON técnico
- Usar edge function `generate-ugc` com IA para gerar dinamicamente

**3. Nova edge function `supabase/functions/generate-ugc/index.ts`**
- Recebe: produto, benefício, tom, número de cenas
- Usa `google/gemini-2.5-flash` para gerar as cenas
- Retorna JSON com array de cenas (scene, action, dialogue, hook/CTA tags)

**4. Novo hook `src/hooks/useUgcGeneration.ts`**
- Encapsula chamada à edge function e gerencia estado

**5. Atualizar navegação**
- `AppSidebar.tsx`: adicionar item "Cenas UGC" com path `/ugc` e emoji 🎬📝
- Renomear item existente de "Roteiros UGC" para "Roteiro Clone" no path `/roteiros`
- `Dashboard.tsx`: adicionar card para Cenas UGC, atualizar card existente para "Roteiro Clone"
- `App.tsx`: adicionar rota `/ugc` → `UgcGeneratorPage`

### Resultado
Duas ferramentas separadas: `/roteiros` para roteiros de clone IA (falas 80-140 chars) e `/ugc` para cenas UGC (diálogos 120-160 chars com scene/action/JSON export).

