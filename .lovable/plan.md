

## Plano: Start Frame como foto anexada com leitura por IA (visão)

### Resumo

Trocar o campo de texto "Start Frame" por um **input de upload de imagem** em ambas as páginas (UGC e Roteiro). A imagem é enviada como base64 ao modelo de IA (Gemini com visão multimodal), que analisa a foto e usa a descrição visual diretamente no prompt para gerar as cenas.

### Fluxo

1. Usuário faz upload de uma foto na UI
2. A foto é convertida para base64 no frontend
3. O base64 é enviado ao edge function junto com os outros parâmetros
4. O edge function envia a imagem ao modelo Gemini (que suporta visão) como parte da mensagem multimodal
5. O modelo analisa a foto e gera as cenas com base no cenário real da imagem

### Arquivos a modificar

#### 1. `src/pages/UgcGeneratorPage.tsx`
- Trocar o `Textarea` de startFrameDescription por um `<input type="file" accept="image/*">` com preview da imagem
- Converter a imagem para base64 no `onChange`
- Guardar o base64 no state (`startFrameBase64`) em vez de texto
- Enviar `startFrameBase64` nos params

#### 2. `src/components/script/ScriptConfigPanel.tsx`
- Mesma mudança: trocar Textarea por input de imagem com preview
- Converter para base64 e enviar como `startFrameBase64`

#### 3. `src/hooks/useUgcGeneration.ts`
- Trocar `startFrameDescription: string` por `startFrameBase64?: string` no `UgcParams`

#### 4. `src/hooks/useScriptGeneration.ts`
- Trocar `startFrameDescription?: string` por `startFrameBase64?: string` no `ScriptParams`

#### 5. `supabase/functions/generate-ugc/index.ts`
- Receber `startFrameBase64` no body
- Montar a mensagem multimodal usando o formato do Gemini/OpenAI Vision:
  ```json
  {
    "role": "user",
    "content": [
      { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } },
      { "type": "text", "text": "Esta é a foto do start frame. Use-a como referência..." }
    ]
  }
  ```
- Usar modelo `google/gemini-2.5-flash` (já suporta visão)

#### 6. `supabase/functions/generate-script/index.ts`
- Mesma mudança: receber `startFrameBase64` e montar mensagem multimodal
- Incluir a imagem na chamada ao modelo

### Detalhes técnicos

- **Modelo**: `google/gemini-2.5-flash` já suporta input multimodal (texto + imagem) via a API compatível com OpenAI
- **Formato da imagem**: base64 data URL (`data:image/jpeg;base64,...`)
- **Limite de tamanho**: Limitar upload a ~5MB no frontend para evitar payloads muito grandes
- **Preview**: Mostrar thumbnail da imagem selecionada com botão de remover

