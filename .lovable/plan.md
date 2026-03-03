

## Problema

O preview do avatar usa **imagens estáticas do Unsplash** — uma foto fixa para masculino e outra para feminino. Não importa o que o usuário selecione (cabelo, pele, estilo), a imagem nunca muda. O único feedback visual é um shimmer sutil que dura 1.2s, mas a imagem continua a mesma.

O projeto já tem um hook `useImageGeneration` e uma edge function `generate-image` que poderiam gerar imagens via IA, mas não estão conectados ao preview.

## Plano

### 1. Gerar preview real com IA usando Lovable AI

Conectar o `AvatarPreview` ao modelo de geração de imagens `google/gemini-3-pro-image-preview` via edge function para gerar um avatar baseado no prompt construído pelo usuário.

**Mudanças:**

- **`supabase/functions/generate-image/index.ts`** — Atualizar a edge function para chamar o modelo de imagem do Lovable AI (`google/gemini-3-pro-image-preview`) com o prompt gerado, retornando a imagem como base64 ou URL.

- **`src/components/builder/AvatarPreview.tsx`**:
  - Integrar `useImageGeneration` hook
  - Adicionar lógica de debounce (~2s após última mudança) para auto-gerar preview
  - Mostrar loading skeleton/shimmer enquanto gera
  - Exibir imagem gerada quando disponível, fallback para placeholder
  - Mostrar mensagem de erro amigável se falhar

- **`src/pages/AvatarBuilderPage.tsx`**:
  - Passar o prompt completo e um trigger de geração para o `AvatarPreview`

### 2. Feedback visual melhorado durante geração

- Substituir o shimmer curto por um skeleton loader com animação de pulso contínuo enquanto a IA gera
- Mostrar badge "Gerando..." durante o processo
- Mostrar badge "Atualizado" quando a imagem nova chegar

### 3. Controle de custo

- Gerar apenas quando o usuário parar de clicar por 2 segundos (debounce)
- Botão manual "Gerar Preview" como alternativa ao auto-generate
- Cache da última imagem gerada para não re-gerar se o prompt não mudou

