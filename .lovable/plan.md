

## Plano de Implementacao - 3 Mudancas

### 1. Adicionar Aspect Ratio ao Builder

Novo bloco "Proporcao da Imagem" no builder com opcoes de aspect ratio comuns para geradores de imagem:

- **Opcoes:** 1:1 (Quadrado), 4:5 (Instagram Retrato), 9:16 (Stories/Reels), 16:9 (Widescreen), 3:4 (Retrato Classico), 2:3 (Pinterest)
- Cada opcao tera um `promptValue` em ingles (ex: "1:1 square aspect ratio", "9:16 vertical portrait aspect ratio")
- Sera adicionado como bloco no accordion, com icone `RatioIcon` (ou similar do Lucide)

**Arquivos afetados:**
- `src/lib/avatar-config.ts` -- adicionar opcoes de aspect ratio, campo `aspectRatio` no `AvatarState` e `defaultAvatarState`
- `src/stores/avatar-store.ts` -- o campo ja sera incluso automaticamente pelo spread do state
- `src/lib/prompt-engine.ts` -- incluir aspect ratio no prompt gerado
- `src/pages/BuilderPage.tsx` -- adicionar icone ao `iconMap`

---

### 2. Melhorar o Estilo do Prompt Gerado

O prompt atual gera frases curtas separadas por pontos. O exemplo fornecido pelo usuario e um paragrafo continuo, descritivo, com linguagem editorial e detalhes tecnicos de pele/camera muito mais ricos.

**Mudancas no `prompt-engine.ts`:**
- Reformular `generatePrompt` para gerar um unico paragrafo fluido em vez de frases separadas por ". "
- Usar virgulas e ponto-e-virgula como separadores (estilo editorial)
- Adicionar descritores mais ricos e tecnicos nos `promptValue` de cada opcao (pores visiveis, micro-imperfeicoes, zero suavizacao, foco nos olhos, etc.)
- Melhorar os finishing modifiers para incluir: "skin rendered hyper-realistically with visible pores, micro-imperfections, natural redness, and zero smoothing; razor-sharp focus on the eyes, natural color balance, no HDR, no over-sharpening, no stylization; fully photorealistic, authentic, and human, with no text, no logos, no branding, no CGI look, and no AI artifacts"
- Mudar o join de `. ` para `, ` e reestruturar as partes como clausulas dentro de um paragrafo coeso

---

### 3. Dark Mode por Padrao

O projeto ja tem tokens de dark mode definidos no CSS (`:root` e `.dark`). Basta:

- Alterar `index.html` para adicionar classe `dark` ao `<html>`
- Ou configurar `next-themes` (ja instalado) para default `dark`
- Verificar que todas as paginas usam os tokens semanticos (ja usam: `bg-background`, `text-foreground`, etc.)

**Arquivos afetados:**
- `src/App.tsx` ou `index.html` -- aplicar tema dark como padrao
- Possivelmente `src/main.tsx` se usar ThemeProvider

---

### Detalhes Tecnicos

**avatar-config.ts:**
```
// Nova lista de aspect ratios
const aspectRatios: OptionItem[] = [
  { id: '1-1', label: '1:1 Quadrado', promptValue: '1:1 square aspect ratio' },
  { id: '4-5', label: '4:5 Instagram', promptValue: '4:5 vertical aspect ratio' },
  { id: '9-16', label: '9:16 Stories', promptValue: '9:16 vertical portrait aspect ratio' },
  { id: '16-9', label: '16:9 Widescreen', promptValue: '16:9 widescreen horizontal aspect ratio' },
  { id: '3-4', label: '3:4 Retrato', promptValue: '3:4 classic portrait aspect ratio' },
  { id: '2-3', label: '2:3 Pinterest', promptValue: '2:3 tall portrait aspect ratio' },
];

// Novo bloco no getBuilderBlocks
{ id: 'aspectRatio', title: 'Proporcao da Imagem', icon: 'Ratio', ... }

// AvatarState ganha: aspectRatio: string
// defaultAvatarState ganha: aspectRatio: ''
```

**prompt-engine.ts:**
- Reestruturar para gerar prompt no estilo: "Ultra-photorealistic professional portrait, [framing] depicting [subject] with [appearance details]; [clothing]; expression is [expression], [pose]; environment is [environment]; lighting is [lighting]; skin rendered hyper-realistically with visible pores...; camera look is [photoStyle]; [aspect ratio]; fully photorealistic..."

**Dark mode:**
- Configurar ThemeProvider do `next-themes` com `defaultTheme="dark"` ou adicionar `class="dark"` ao HTML

