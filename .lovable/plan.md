

## Atualizar Avatar Creator: Estilo Visual, Referencia Famosa e Ambientes Tematicos

### Resumo

Adicionar 3 novos recursos ao builder de avatar:
1. Campo "Estilo Visual" com 6 opcoes (chips)
2. Campo opcional "Referencia de pessoa famosa" (texto livre)
3. Ambiente tematico que muda conforme o estilo visual escolhido

---

### Arquivos afetados

1. **`src/lib/avatar-config.ts`** -- novos dados e tipos
2. **`src/stores/avatar-store.ts`** -- novos campos no state
3. **`src/pages/AvatarBuilderPage.tsx`** -- UI dos novos campos
4. **`src/lib/prompt-engine.ts`** -- logica de geracao do prompt

---

### 1. Novos dados em `avatar-config.ts`

**Tipo VisualStyle** e opcoes:

```text
visualStyles: OptionItem[]
- realistic  | Realista     | "ultra realistic professional portrait"
- cartoon    | Cartoon      | "colorful cartoon-style character illustration"
- anime      | Anime        | "high quality anime-style character illustration"
- low-poly   | Low-Poly     | "low-poly 3D rendered character"
- watercolor | Aquarela     | "watercolor painting style portrait"
- pixel-art  | Pixel Art    | "16-bit pixel art character, retro game style"
```

**Ambientes tematicos** (para Cartoon/Anime/Pixel Art):

```text
thematicEnvironments: OptionItem[]
- neutral-stylized     | Neutro estilizado           | "in a stylized neutral background with soft colors"
- anime-futuristic     | Cidade futurista em anime   | "in a futuristic anime city with neon lights and tall buildings"
- anime-school         | Escola japonesa em anime    | "in a Japanese anime school hallway with cherry blossoms"
- ninja-village        | Vila ninja inspirada em Naruto | "in a stylized ninja village environment inspired by Naruto, wooden houses, banners, vibrant sky, anime background (not an exact copy of any specific scene)"
- hero-academy         | Academia de herois shonen   | "in a shonen-style hero academy training ground, inspired by anime (not an exact copy of any specific scene)"
- rpg-fantasy          | Mundo de RPG fantasia anime | "in an anime-style fantasy RPG world with castles and magical forests"
- cartoon-city         | Cidade colorida cartoon     | "in a colorful cartoon city with exaggerated proportions and vibrant colors"
- pixel-world          | Mundo pixelado 16-bit       | "in a 16-bit pixel art city street environment, simple blocky buildings, limited color palette, retro game vibe"
- custom               | Outro (texto livre)         | "" (usa texto digitado pelo usuario)
```

**AvatarState** recebe 3 novos campos:

```text
visualStyle: string        (default: 'realistic')
celebrityRef: string       (default: '')
thematicEnvironment: string (default: '')
customThematicEnv: string   (default: '')
```

**Regra de ambiente**: estilos `realistic`, `watercolor`, `low-poly` usam o campo `environment` existente. Estilos `cartoon`, `anime`, `pixel-art` usam `thematicEnvironment`.

---

### 2. Store atualizado (`avatar-store.ts`)

Adicionar os 4 novos campos ao `defaultAvatarState` e ao tipo. Quando `visualStyle` muda de/para um estilo tematico, limpar o campo de ambiente correspondente que nao se aplica mais.

---

### 3. UI no `AvatarBuilderPage.tsx`

**Estilo Visual** -- aparece ANTES do slider de idade, como chips clicaveis (grupo de botoes com estilo similar ao OptionGrid). Icone: Palette.

**Referencia Famosa** -- campo de texto (Input) logo abaixo do estilo visual:
- Label: "Quer se inspirar em alguem famoso? (opcional)"
- Placeholder: "Ex: Angelina Jolie, Keanu Reeves..."

**Ambiente** -- o bloco "Ambiente" no Accordion muda:
- Se estilo = realistic/watercolor/low-poly: mostra as opcoes de ambiente atuais (environments)
- Se estilo = cartoon/anime/pixel-art: mostra as opcoes tematicas (thematicEnvironments). Se "Outro" selecionado, aparece um Input de texto livre.

---

### 4. Prompt Engine (`prompt-engine.ts`)

**Abertura do prompt** muda conforme o estilo:

- `realistic`: "Ultra-photorealistic professional portrait, {framing} depicting {subject}"
- `cartoon`: "Colorful cartoon-style character illustration, {framing} depicting {subject}"
- `anime`: "High quality anime-style character illustration, {framing} depicting {subject}"
- `low-poly`: "Low-poly 3D rendered character, {framing} depicting {subject}"
- `watercolor`: "Watercolor painting style portrait, {framing} depicting {subject}"
- `pixel-art`: "16-bit pixel art character in retro game style, {framing} depicting {subject}"

**Referencia famosa** -- se `celebrityRef` preenchido, adicionar secao:
`"inspired by the visual vibe of {nome}, without replicating exact likeness"`

**Ambiente** -- se estilo tematico, usar `thematicEnvironment` em vez de `environment`. Se "custom", usar texto livre prefixado com o estilo: `"{style}-style character in {texto do usuario}"`.

**Bloco de realismo de pele** -- so aparece para estilo `realistic`. Para outros estilos, nao incluir.

**Finishing modifiers** -- adaptar para estilos nao-realistas (remover "photorealistic" e "photograph" quando estilo nao for realistic).

---

### Detalhes tecnicos de implementacao

**Ordem dos novos elementos na UI:**
1. Estilo Visual (chips) -- acima do slider de idade
2. Referencia Famosa (input texto) -- abaixo do estilo visual
3. Accordion de blocos (com ambiente adaptado)

**Condicional de ambiente no Accordion:**
```text
Se visualStyle in ['cartoon','anime','pixel-art']:
  Mostrar thematicEnvironments com OptionGrid
  Se selecionado 'custom': mostrar Input de texto
Senao:
  Mostrar environments normais (atual)
```

**Prompt engine -- finishing modifiers por estilo:**
- realistic: manter atual ("real high-budget photograph...")
- cartoon/anime: "the final image must be a polished {style} illustration with consistent style, no text, no logos, no branding"
- low-poly: "the final image must be a clean low-poly 3D render with consistent geometry, no text, no logos"
- watercolor: "the final image must look like a hand-painted watercolor with natural brush strokes, no text, no logos"
- pixel-art: "the final image must be consistent 16-bit pixel art with limited color palette, no text, no logos"

