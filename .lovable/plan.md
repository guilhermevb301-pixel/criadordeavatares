

## Adicionar Campo de Texto Livre em Cada Seção do Builder

### Resumo

Adicionar um campo de texto "Personalizar" (Input) em cada seção de configuracao do avatar (Roupa, Ambiente, Posicao, Angulo de Camera, Expressao, Iluminacao, Estilo Fotografico, Proporcao, e sub-blocos de Aparencia). Isso permite que o usuario digite algo extra como "blusa vermelha" ou "em cima de um predio abandonado" alem das opcoes pre-definidas.

---

### Como funciona

- Abaixo das opcoes de cada bloco, aparece um campo de texto com placeholder contextualizado (ex: "Ex: blusa vermelha com estampa..." para Roupa, "Ex: em cima de um predio abandonado..." para Ambiente)
- O texto digitado e incluido no prompt final junto com as opcoes selecionadas
- Se o usuario so digitar texto sem selecionar opcoes, funciona tambem

---

### Arquivos a modificar

#### 1. `src/lib/avatar-config.ts`
- Adicionar novos campos ao `AvatarState` e `defaultAvatarState`:
  - `customClothing: string`
  - `customEnvironment: string`
  - `customPose: string`
  - `customCameraAngle: string`
  - `customCameraFraming: string`
  - `customExpression: string`
  - `customLighting: string`
  - `customPhotoStyle: string`
  - `customAspectRatio: string`
  - `customSkinTone: string`
  - `customEyeColor: string`
  - `customHairColor: string`
  - `customHairType: string`
  - `customFeatures: string`

Todos com default `''`.

#### 2. `src/lib/prompt-engine.ts`
- Em cada secao do prompt, apos coletar os valores das opcoes pre-definidas, concatenar o campo custom correspondente se preenchido
- Exemplo para roupa: se `state.customClothing` tem valor, adicionar ao final da secao de roupas

#### 3. `src/pages/AvatarBuilderPage.tsx`
- Em cada bloco do Accordion (e sub-blocos de appearance e camera), adicionar um `<Input>` abaixo do `<OptionGrid>` com:
  - Icone de lapis ou emoji
  - Placeholder contextualizado
  - Bind ao campo custom correspondente via `updateField`

---

### Detalhes tecnicos

**Novos campos no state** (14 campos string, todos default `''`):

```text
customClothing, customEnvironment, customPose, 
customCameraAngle, customCameraFraming, customExpression, 
customLighting, customPhotoStyle, customAspectRatio,
customSkinTone, customEyeColor, customHairColor, 
customHairType, customFeatures
```

**Prompt engine** -- para cada secao, o campo custom e adicionado com virgula apos os valores selecionados. Exemplo para roupa:

```text
// Antes: "wearing a casual t-shirt layered with wearing a hoodie"
// Depois: "wearing a casual t-shirt layered with wearing a hoodie, with red color and brand logo"
```

**UI** -- cada Input segue o padrao:

```text
<Input
  value={state.customClothing}
  onChange={(e) => updateField('customClothing', e.target.value)}
  placeholder="✏️ Ex: blusa vermelha com estampa..."
  className="mt-3"
/>
```

**Placeholders contextualizados:**
- Roupa: "Ex: blusa vermelha, terno azul marinho..."
- Ambiente: "Ex: em cima de um predio abandonado..."
- Posicao: "Ex: sentado em uma cadeira de escritorio..."
- Angulo: "Ex: camera de drone vista aerea..."
- Enquadramento: "Ex: apenas o rosto bem proximo..."
- Expressao: "Ex: sorriso com os olhos fechados..."
- Iluminacao: "Ex: luz roxa neon vindo da esquerda..."
- Estilo Foto: "Ex: foto com lente olho de peixe..."
- Proporcao: "Ex: formato panoramico ultra-wide..."
- Tom de Pele: "Ex: pele bronzeada com sardas..."
- Cor dos Olhos: "Ex: olhos heterocromicos verde e azul..."
- Cor do Cabelo: "Ex: cabelo com mechas roxas..."
- Tipo de Cabelo: "Ex: cabelo com trancas box braids..."
- Caracteristicas: "Ex: cicatriz no queixo, sobrancelha grossa..."

