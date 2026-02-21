

## Atualizacao do Gerador de Cenas UGC -- Narrativa Estruturada + Acoes Variadas

### Problema atual

Os dialogos sao genericos, repetitivos e sem estrutura narrativa real. A action e fixa para todos os prompts. Os dialogos usam cliches como "eu nao acreditei", "minha amiga me indicou", etc.

---

### O que muda

**1. Estrutura narrativa fixa por posicao**

Cada prompt recebe um papel narrativo baseado na sua posicao:

- Prompt 1 = Introducao (por que a pessoa esta falando, primeira impressao, situacao do dia a dia)
- Prompts do meio = Desenvolvimento (beneficios reais, sensacoes, experiencias especificas)
- Ultimo prompt = CTA natural ("deixei o link aqui embaixo", "se quiser testar, ta ai o link")

Quando qty = 1, o prompt combina introducao + CTA.
Quando qty = 2, prompt 1 = introducao, prompt 2 = CTA.

**2. Actions variadas e minimalistas**

A action deixa de ser fixa e passa a variar entre os prompts, usando um pool de movimentos suaves:

- Passa o produto de uma mao para a outra
- Levanta o frasco brevemente para a camera
- Abre a palma da mao enquanto explica
- Gira levemente o frasco enquanto fala
- Encosta o frasco de leve na bochecha
- Ajusta o cabelo usando a mao que nao segura o produto
- Inclina minimamente o corpo para enfatizar
- Olha para baixo 1 segundo e volta para a camera
- Segura o produto no colo e gesticula com as duas maos depois
- Levanta a sobrancelha ao falar de um beneficio
- Ri de leve e balanca o produto de forma natural

Regras: nunca repetir action consecutiva, movimentos suaves, coerentes com o dialogo.

O campo "Tipo de Acao" (range) no formulario sera REMOVIDO -- as actions agora sao sempre variadas e selecionadas automaticamente do pool.

**3. Dialogos reescritos por completo**

Todos os dialogos serao reescritos para seguir a estrutura narrativa. Cada tom tera grupos com:
- Frases de introducao (indice 0)
- Frases de desenvolvimento (indices 1-3)
- Frases de CTA (indice 4)

Frases PROIBIDAS removidas: "eu nao acreditei", "minha amiga me indicou", "comecei desacreditada", "spoiler nao era", "nao vivo mais sem", "entendi o hype".

**4. Scene continua fixa** -- nao muda.

---

### Arquivo afetado

`src/pages/ScriptGeneratorPage.tsx` -- reescrita dos dados e logica, UI permanece igual.

---

### Detalhes tecnicos

**Novo pool de actions** (substitui rangeOptions):

```text
const actionPool = [
  'Passa o produto de uma mão para a outra enquanto fala naturalmente',
  'Levanta o frasco brevemente na direção da câmera',
  'Abre a palma da mão enquanto explica o ponto',
  'Gira levemente o frasco enquanto fala',
  'Encosta o frasco de leve na bochecha e sorri',
  'Ajusta o cabelo com a mão livre enquanto continua falando',
  'Inclina minimamente o corpo para frente ao enfatizar',
  'Olha para baixo por um instante e volta para a câmera',
  'Segura o produto no colo e gesticula com as duas mãos',
  'Levanta a sobrancelha ao mencionar um benefício',
  'Ri de leve e balança o produto de forma natural',
]
```

**Nova estrutura dos dialogos** -- Cada tom tera grupos organizados em 3 categorias:

```text
dialoguesByRole: Record<string, {
  intro: string[]       // frases de introducao
  dev: string[]         // frases de desenvolvimento
  cta: string[]         // frases de CTA
}>
```

**generatePrompts atualizado**:

1. Seleciona scene aleatoria (fixa)
2. Embaralha actionPool, distribui uma action diferente por prompt
3. Para prompt 1: seleciona dialogo aleatorio de `intro`
4. Para prompts do meio: seleciona dialogos sequenciais de `dev`
5. Para ultimo prompt: seleciona dialogo aleatorio de `cta`
6. Salva estado para regeneracao

**Remocao do campo Range do formulario** -- o Select "Tipo de Acao" sera removido, e `canGenerate` nao depende mais de `range`.

**handleRegenerate** -- mesma logica cascata (regenera do prompt clicado em diante), mas agora respeita os papeis narrativos ao substituir dialogos.

