

## Reescrita: Gerador de Cenas UGC

Reescrita completa de `src/pages/ScriptGeneratorPage.tsx`, removendo toda logica de roteiros (ScriptResult, hook/body/cta) e substituindo por um gerador de cenas independentes para video.

---

### Arquivo afetado

`src/pages/ScriptGeneratorPage.tsx` -- reescrita completa.

---

### Modelo de dados

```text
interface UGCScene {
  id: number
  angle: string
  scene: string
  action: string
  audio: {
    dialogue: string
  }
}
```

### Pool de angulos

```text
const anglePool = [
  'Close-up frontal',
  'Medium shot lateral',
  'Over-the-shoulder',
  'Wide shot ambiente',
  'Low angle',
  'High angle',
  'POV camera'
]
```

### Funcao generateScenes

- Recebe produto, nicho, publico, tom, qty
- Embaralha o pool de angulos; se qty > 7, reinicia o pool embaralhado
- Gera dialogos naturais entre 140-220 caracteres, sem emojis, hashtags, "Hook", "CTA"
- Tom influencia o estilo do dialogo (ex: casual = giriass informais, profissional = vocabulario tecnico)
- Cada cena recebe scene (descricao de enquadramento/ambiente), action (movimentos/expressoes), e audio.dialogue

### Funcoes auxiliares

- **handleRegenerate(sceneId)** -- gera uma nova cena com angulo aleatorio e substitui apenas aquela no array
- **handleCopyJSON(scene)** -- copia JSON formatado sem id e sem angle:
  ```text
  { "scene": "...", "action": "...", "audio": { "dialogue": "..." } }
  ```
- Bloqueia copia se dialogue estiver fora de 140-220 caracteres

### Alteracoes de UI

| Elemento | Antes | Depois |
|----------|-------|--------|
| Titulo | Gerar Roteiros UGC | Gerador de Cenas UGC |
| Descricao | Crie scripts persuasivos... | Gere cenas independentes prontas para producao de video |
| Botao | Gerar Roteiros | Gerar Cenas |
| Estado vazio | Nenhum roteiro gerado | Nenhuma cena gerada |
| Import icons | FileText, Sparkles, Copy, Check | + RefreshCw (para regenerar) |

### Cards de resultado

Cada card contem:

1. **Header**: "Cena {n}" + Badge com o angulo (ex: "Close-up frontal")
2. **Corpo** dividido em 3 secoes visuais com labels:
   - **Scene** -- texto descritivo
   - **Action** -- movimentos e expressoes
   - **Dialogue** -- fala natural
3. **Contador de caracteres** do dialogue com cor condicional:
   - Verde (140-220 chars)
   - Vermelho (fora do intervalo)
4. **Botao Copiar JSON** -- desabilitado se dialogue fora do intervalo
5. **Botao Regenerar** -- icone RefreshCw, regenera apenas aquela cena

### O que permanece igual

- Layout 2 colunas (form esquerda, resultados direita)
- Formulario com os 5 inputs (produto, nicho, publico, tom, quantidade)
- toneOptions array
- Animacoes de entrada nos cards (animate-in fade-in slide-in-from-bottom-2)

