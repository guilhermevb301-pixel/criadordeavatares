

## Plano: Adicionar geração de imagem na página /avatar

A edge function `generate-image` e o hook `useImageGeneration` já existem e funcionam com o modelo `google/gemini-3-pro-image-preview`. O `AvatarPreview` component já tem toda a lógica de geração, loading, debounce e exibição. Só precisa ser reintegrado na página.

### Mudanças

**`src/pages/AvatarBuilderPage.tsx`**:
- Importar `AvatarPreview` novamente
- Substituir o bloco da coluna direita (desktop, linhas 734-739) que hoje mostra apenas `AvatarPromptCard` por `AvatarPreview` com o prompt, gender e configVersion
- Adicionar o `AvatarPreview` também na versão mobile (acima do accordion)
- Passar `onRandomize` se a função já existir no componente

O `AvatarPreview` já inclui internamente o `AvatarPromptCard`, o botão "Gerar Avatar", o loading skeleton, tratamento de erros e debounce de 3s para auto-regenerar.

### Resultado
O usuário configura o avatar na coluna esquerda, vê o prompt + imagem gerada na coluna direita, e clica "Gerar Avatar" para criar a imagem via IA.

