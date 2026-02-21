

## Correcao Completa: Prompts Separados com Continuidade Narrativa

### Resumo da Mudanca

O modelo atual gera N cenas independentes (cada uma com scene, action e dialogue diferentes). O novo modelo gera UMA cena fixa (scene + action) e N prompts separados com dialogos sequenciais que formam uma narrativa continua.

---

### Mudanca Conceitual

```text
ANTES:
  Cena 1 -> scene A, action A, dialogue A
  Cena 2 -> scene B, action B, dialogue B
  Cena 3 -> scene C, action C, dialogue C

DEPOIS:
  Prompt 1 -> scene FIXA, action FIXA, dialogue parte 1
  Prompt 2 -> scene FIXA, action FIXA, dialogue parte 2
  Prompt 3 -> scene FIXA, action FIXA, dialogue parte 3
```

---

### Arquivo afetado

`src/pages/ScriptGeneratorPage.tsx` -- reescrita completa.

---

### Novo campo no formulario: Tipo de Acao (Range)

Adicionar um Select entre "Tom do Avatar" e "Quantidade de videos" com as opcoes:

| Valor | Label | Action gerada |
|-------|-------|---------------|
| `parado` | Parado | Gesticula levemente com as maos enquanto fala, olha direto para a camera com expressao natural |
| `produto` | Com produto | Segura o produto na altura do peito, gesticula com uma mao enquanto apresenta com a outra |
| `pessoa` | Com pessoa | Gesticula em direcao a pessoa ao lado enquanto fala, alterna o olhar entre a camera e o interlocutor |

A action sera fixa por cena, determinada pelo range selecionado.

---

### Novo modelo de dados

```text
interface UGCPrompt {
  id: number          // 1, 2, 3...
  scene: string       // FIXA para todos os prompts
  action: string      // FIXA para todos os prompts (baseada no range)
  audio: {
    dialogue: string  // 120-160 caracteres, parte da narrativa
  }
}
```

Remover a interface UGCScene e o campo angle (nao mais necessario).

---

### Nova logica de geracao

**generatePrompts(produto, nicho, publico, tom, range, qty)**

1. Seleciona UMA scene aleatoria do pool (fixa para todos)
2. Define UMA action baseada no range selecionado (fixa para todos)
3. Gera qty dialogos sequenciais do pool de dialogos para o tom selecionado
4. Os dialogos sao selecionados em ordem do pool (sem repeticao) para garantir continuidade narrativa
5. Cada dialogo: 120-160 caracteres, sem emojis, sem hashtags

**Pool de dialogos**: Reescrever os dialogos existentes para que cada grupo de tom tenha frases que funcionam como partes sequenciais de uma narrativa (parte 1 introduz, parte 2 desenvolve, parte 3 aprofunda, parte 4 conclui).

---

### Regras de regeneracao

**handleRegenerate(promptId)**:

- Se regenerar Prompt 1: regenera TODOS os prompts (1, 2, 3...) pois a narrativa inteira depende do inicio
- Se regenerar Prompt 2+: regenera do prompt clicado ate o final (ex: regenerar 2 atualiza 2, 3, 4)
- Scene e action NUNCA mudam na regeneracao
- Apenas os dialogos sao substituidos, mantendo continuidade

Exibir tooltip explicativo: "Regenerar este prompt tambem atualizara os seguintes para manter a continuidade"

---

### Validacao de caracteres

- Intervalo valido: 120-160 caracteres (atualizado de 140-220)
- Contador de caracteres em cada card
- Verde: dentro do intervalo
- Vermelho: fora do intervalo
- Botao "Copiar JSON" desabilitado se fora do intervalo

---

### UI dos resultados

Cada card exibe:

**Header**: "Prompt 1", "Prompt 2", etc. (sem badge de angulo)

**Corpo**: 3 secoes (Scene, Action, Dialogue) -- scene e action serao iguais em todos os cards

**Rodape**: Contador de caracteres + botoes Copiar JSON e Regenerar

**JSON copiado** (formato exato):
```text
{
  "scene": "...",
  "action": "...",
  "audio": {
    "dialogue": "..."
  }
}
```

---

### Alteracoes no formulario

| Campo | Mudanca |
|-------|---------|
| Produto | Sem mudanca |
| Nicho | Sem mudanca |
| Publico-alvo | Sem mudanca |
| Tom do Avatar | Sem mudanca |
| **Tipo de Acao** | **NOVO** -- Select com opcoes: Parado, Com produto, Com pessoa |
| Quantidade de videos | Label muda para "Quantidade de prompts" |

**Botao**: permanece "Gerar Cenas"

**Titulo da pagina**: permanece "Gerador de Cenas UGC"

---

### Secao tecnica: Pool de dialogos sequenciais

Os dialogos existentes serao reorganizados em grupos de 4-5 frases que formam narrativas sequenciais. Exemplo para tom "casual":

- Grupo 1: (1) "Gente, eu nao acreditei quando vi..." (2) "Tava mega cetica no comeco..." (3) "Olha, vou ser sincera..." (4) "Nao e publi nao..."
- Grupo 2: (1) "Sabe aquele produto que voce descobre..." (2) "Minha amiga me indicou..." (3) "Comecei a usar meio desacreditada..." (4) "Se alguem me perguntasse..."

A funcao seleciona um grupo aleatorio e distribui as partes em ordem.

