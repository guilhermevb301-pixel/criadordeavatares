

## Simplificar a Aba "Editar Avatar Existente"

### O que muda

1. **Remove o campo "Prompt Original"** -- o usuario nao precisa mais colar nenhum prompt. As modificacoes ficam disponiveis imediatamente.

2. **Remove a condicao `originalPrompt &&`** -- as modificacoes aparecem sempre, sem depender de input.

3. **Altera o prompt gerado** -- em vez de gerar `Modify the original image described as: "...". Changes: X. Y. Keep all other attributes unchanged.`, o resultado sera apenas o conteudo das modificacoes concatenadas, sem prefixo "Changes:" e sem a parte do prompt original.

   Exemplo: se o usuario selecionar "Alterar angulo para eye level" e "Aumentar realismo", o prompt copiado sera:
   ```
   Change the camera angle to eye level. Increase skin realism with visible pores and micro-imperfections. Keep all other attributes unchanged.
   ```

4. **Atualiza textos da UI**:
   - Subtitulo: "Escolha as modificacoes desejadas" (sem mencionar colar prompt)
   - Preview vazio: "Selecione modificacoes para gerar o prompt..."
   - Preview label: "Cole este prompt junto com o original no gerador de imagem"

### Arquivos afetados

- `src/components/builder/EditTab.tsx` -- remove Textarea, remove condicional, gera prompt direto das changes
- `src/lib/prompt-engine.ts` -- atualiza `generateEditPrompt` para retornar apenas as instrucoes de modificacao (sem o wrapper do prompt original)

### Detalhes tecnicos

**`generateEditPrompt`** muda de:
```
Modify the original image described as: "${originalPrompt}". Changes: ${changes.join('. ')}. Keep all other attributes unchanged.
```
Para uma nova funcao `generateEditInstructions(changes: string[])`:
```
${changes.join('. ')}. Keep all other attributes unchanged.
```

**`EditTab.tsx`**:
- Remove state `originalPrompt`
- Remove Textarea e seu label
- Remove condicional `originalPrompt &&` das modificacoes
- Gera prompt: `changes.length > 0 ? generateEditInstructions(changes) : ''`

