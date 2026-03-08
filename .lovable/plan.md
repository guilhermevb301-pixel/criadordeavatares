
## Plano: Saída em JSON Premium + Campo de Sotaque + Start Frame em Ambas as Páginas

### O que precisa mudar

**Ambas as páginas (Cenas UGC e Roteiro Clone) precisam:**

1. **Novo campo: Sotaque do personagem** — select com opções (Paulistano, Carioca, Mineiro, Gaúcho, Nordestino, Neutro/Nacional, Outro) + campo de texto para descrever o sotaque livre
2. **Upload de Start Frame** — campo para o usuário anexar a foto/imagem que será usada como frame inicial do vídeo
3. **Saída em JSON estruturado** — cada cena/fala exportada no formato exato solicitado:

```json
{
  "setup": {
    "scene": "...",
    "camera": "...",
    "style": "...",
    "aspect_ratio": "9:16",
    "fps": 30,
    "duration_seconds": 8
  },
  "action": {
    "subject": "...",
    "movement": "..."
  },
  "audio": {
    "dialogue": "...",
    "voice": "Voz [gênero] natural, [sotaque], estilo criador de conteúdo."
  }
}
```

---

### Arquivos a editar

| Arquivo | O que muda |
|---|---|
| `src/hooks/useUgcGeneration.ts` | Adicionar `sotaque` e `startFrameUrl` ao `UgcParams`; adaptar interface `UgcScene` para novo schema JSON |
| `src/hooks/useScriptGeneration.ts` | Adicionar `sotaque` e `startFrameUrl` ao `ScriptParams` |
| `src/pages/UgcGeneratorPage.tsx` | Adicionar select de sotaque, upload de start frame, botão "Exportar JSON completo" por cena |
| `src/components/script/ScriptConfigPanel.tsx` | Adicionar select de sotaque e upload de start frame na seção básica |
| `src/components/script/FalaCard.tsx` | Adicionar botão "Exportar JSON" no formato estruturado por fala |
| `supabase/functions/generate-ugc/index.ts` | Receber `sotaque` e instruir a IA a incluir a voz com sotaque no campo `audio.voice`; retornar o schema completo |
| `supabase/functions/generate-script/index.ts` | Receber `sotaque`; incluir na voz gerada para cada fala |

---

### Detalhes de cada mudança

**1. Campo de Sotaque**
- Select com: Neutro/Nacional, Paulistano, Carioca, Mineiro, Gaúcho, Nordestino, Baiano, Outro
- Se "Outro": exibe input de texto livre para descrever
- Passado ao edge function como `sotaque: "Carioca"`
- A IA usa no campo `audio.voice`: `"Voz feminina natural, espontânea, sotaque carioca, estilo criadora de conteúdo."`

**2. Start Frame**
- Botão de upload de imagem (aceita jpg/png/webp) — upload local usando `<input type="file">`
- Preview miniatura da imagem selecionada ao lado do botão
- O `startFrameUrl` é salvo como base64 data URL para inclusão no JSON exportado
- Não precisa de storage — fica no estado local, incluído no JSON como referência ao exportar

**3. Formato JSON de saída das Cenas UGC**
- A edge function `generate-ugc` recebe o sotaque e retorna a estrutura completa em JSON por cena:
  ```json
  {
    "setup": { "scene": "...", "camera": "...", "style": "...", "aspect_ratio": "9:16", "fps": 30, "duration_seconds": 8 },
    "action": { "subject": "Criadora", "movement": "..." },
    "audio": { "dialogue": "...", "voice": "Voz feminina natural, sotaque paulistano, estilo criadora de conteúdo." }
  }
  ```
- O botão "Exportar JSON" copia esse objeto completo (incluindo `start_frame` se fornecido)
- A UI ainda exibe `scene`, `action`, `dialogue` individualmente para legibilidade

**4. Formato JSON de saída do Roteiro Clone**
- Cada fala do `FalaCard` ganha botão "Exportar JSON" no mesmo schema
- A edge function passa o sotaque para o campo `audio.voice` gerado

**5. Edge functions**
- `generate-ugc`: Recebe `sotaque`. Prompt atualizado para retornar por cena um objeto com `setup`, `action`, `audio` completos. O `audio.voice` inclui sotaque.
- `generate-script`: Recebe `sotaque`. Cada fala do JSON de resposta ganha campo `voice` com sotaque descrito. No export do FalaCard monta o schema completo.

---

### Fluxo de exportação JSON completo (UGC)

```text
Usuário preenche: produto, benefício, tom, sotaque, start frame (opcional)
  → Gera cenas
  → Cada cena exibe: cenário, ação, diálogo (UI visual)
  → Botão "📋 JSON" copia:
    {
      "start_frame": "data:image/jpeg;base64,...", // se fornecido
      "setup": { ... },
      "action": { ... },
      "audio": { "dialogue": "...", "voice": "sotaque carioca..." }
    }
```

### O que NÃO muda
- Layout visual existente de ambas as páginas
- Lógica de regeneração de cenas
- Presets do Roteiro Clone
- Modo simples/avançado

