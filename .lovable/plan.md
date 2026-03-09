

## Plano: Output JSON estruturado + campo de sotaque nos geradores UGC e Roteiro

### O que muda

Ambos os geradores (Cenas UGC e Roteiro Clone) precisam:
1. **Novo campo "Sotaque"** na UI de configuração
2. **Novo campo "Start Frame" (upload de imagem)** na UI - o usuário anexa uma foto de referência e a descrição é incluída no prompt
3. **Output no formato JSON estruturado** com `setup`, `action`, `audio` (conforme a estrutura que você enviou)

### Arquivos a modificar

#### 1. Edge Function `supabase/functions/generate-ugc/index.ts`
- Aceitar novos campos: `sotaque`, `startFrameDescription`
- Mudar o prompt do sistema para pedir output no novo formato JSON:
  ```json
  {
    "setup": { "scene", "camera", "style", "aspect_ratio", "fps", "duration_seconds" },
    "action": { "subject", "movement" },
    "audio": { "dialogue", "voice" }
  }
  ```
- Incluir o sotaque na descrição da voz (`audio.voice`)
- Incluir a descrição do start frame no `setup.scene` e `action`
- Cada cena retorna um objeto nesse formato (array de objetos)

#### 2. Edge Function `supabase/functions/generate-script/index.ts`
- Aceitar novos campos: `sotaque`, `startFrameDescription`
- Mudar o formato de saída para o mesmo JSON estruturado (setup/action/audio)
- Incluir sotaque na voz gerada
- Incluir start frame description no contexto

#### 3. Hook `src/hooks/useUgcGeneration.ts`
- Atualizar `UgcScene` interface para o novo formato JSON (setup/action/audio)
- Adicionar `sotaque` e `startFrameDescription` ao `UgcParams`

#### 4. Hook `src/hooks/useScriptGeneration.ts`
- Atualizar `Fala` interface para o novo formato JSON (setup/action/audio)
- Adicionar `sotaque` e `startFrameDescription` ao `ScriptParams`

#### 5. `src/pages/UgcGeneratorPage.tsx`
- Adicionar campo Select de **Sotaque** (ex: Paulista, Carioca, Mineiro, Gaúcho, Nordestino, Neutro)
- Adicionar botão de **upload de imagem** para start frame com preview
- Atualizar cards de resultado para exibir o novo formato JSON (setup/action/audio)
- Botão "Exportar JSON" agora exporta no formato correto
- Adicionar botão "Copiar Prompt" que copia o JSON completo da cena

#### 6. `src/components/script/ScriptConfigPanel.tsx`
- Adicionar campo Select de **Sotaque**
- Adicionar upload de **start frame** com preview

#### 7. `src/components/script/FalaCard.tsx`
- Atualizar para exibir o novo formato (setup/action/audio) em vez do formato atual
- Manter ações de copiar, regenerar, transformar

#### 8. `src/components/script/ScriptResultPanel.tsx`
- Ajustar para renderizar o novo formato de dados

### Sotaques disponíveis
- Neutro (padrão)
- Paulista
- Carioca
- Mineiro
- Gaúcho
- Nordestino
- Baiano

### Start Frame
- Upload de imagem via chat/input na UI
- A imagem é descrita pelo usuário em texto (campo de texto "Descreva a cena inicial / start frame")
- Essa descrição é enviada junto ao prompt para contextualizar o cenário

### Formato final de cada cena/fala (output)
```json
{
  "setup": {
    "scene": "descrição do cenário",
    "camera": "enquadramento e ângulo",
    "style": "estilo visual",
    "aspect_ratio": "9:16",
    "fps": 30,
    "duration_seconds": 8
  },
  "action": {
    "subject": "Criadora",
    "movement": "ação detalhada"
  },
  "audio": {
    "dialogue": "fala do personagem",
    "voice": "descrição da voz com sotaque"
  }
}
```

