

## Plano: Limpar prompt — só incluir o que estiver selecionado

### Problema

O prompt engine inclui valores mesmo quando nada está selecionado. Causas identificadas:

1. **Ambiente tem fallback forçado** — linha 177: `state.environment || 'modern-living'` sempre injeta um ambiente mesmo se o usuário deselecionou
2. **Estado persistido antigo** — o localStorage pode conter valores de antes da feature de deseleção (ex: `piercingsTattoos` com `['neck-tattoo']` salvo de sessão anterior)
3. **Seções que produzem texto residual** — "maintaining direct eye contact" aparece mesmo sem expressão selecionada se qualquer custom text existir

### Arquivo a modificar: `src/lib/prompt-engine.ts`

**Mudanças:**

1. **Ambiente** — remover o fallback `|| 'modern-living'`, usar `state.environment` diretamente. Se vazio, não incluir seção de ambiente
2. **Todas as seções** — revisar cada bloco para garantir que `findOption` retornando `''` (nenhuma seleção) realmente pula a seção inteira
3. **Expressão** — só adicionar "maintaining direct eye contact" se uma expressão foi efetivamente selecionada
4. **Lighting** — só adicionar o bloco de "dimensional contrast" se iluminação foi selecionada
5. **Photo style** — só adicionar se algo foi selecionado
6. **Aspect ratio** — só adicionar se algo foi selecionado

### Arquivo a modificar: `src/stores/avatar-store.ts`

- Na função `merge` do persist, adicionar sanitização de `piercingsTattoos`, `beardStyle`, `glassesStyle`, `makeupStyle` para limpar valores inválidos de estado persistido antigo

### Princípio geral

Cada seção do prompt segue a regra: **se o valor final (após findOption + custom) for vazio, a seção é completamente omitida**. Nenhum fallback, nenhum default silencioso.

