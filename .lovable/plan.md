

## Ajuste do Prompt 1: Hook Direto no Produto

### O que muda

As frases de **introdução** (`intro`) de todos os 6 tons serão reescritas para seguir a nova regra:

- Começa falando **diretamente sobre o produto**
- Menciona **um benefício principal** logo na primeira frase
- Tom empolgado mas natural
- 120 a 160 caracteres
- Sem enrolação, sem contextualização lenta

### O que NÃO muda

- Scene, action, dev, cta -- tudo permanece como está
- Lógica de geração, regeneração, UI -- nada muda
- Apenas o conteúdo do array `intro` de cada tom é reescrito

### Arquivo afetado

`src/pages/ScriptGeneratorPage.tsx` -- apenas os arrays `intro` dentro de `dialoguesByRole`.

### Novos diálogos de introdução por tom

**Profissional**
- "Esse produto aqui entrega firmeza real na pele desde as primeiras aplicações, a formulação é concentrada e a absorção é rápida demais"
- "Esse sérum trouxe uniformidade pro meu tom de pele em poucas semanas, a concentração ativa faz diferença visível no dia a dia"
- "Esse produto estabiliza a pele de um jeito que nenhum outro conseguiu, hidratação profunda sem peso e com resultado mensurável"
- "Esse sérum aqui resolveu a textura irregular da minha pele, um passo só na rotina e já percebi evolução consistente"

**Casual**
- "Esse produto aqui virou meu favorito porque ele deixa a pele macia e uniforme logo nos primeiros dias, muito fácil de usar"
- "Esse sérum me surpreendeu real porque traz luminosidade rápida sem ficar pesado e encaixa perfeito na rotina do dia a dia"
- "Esse produto aqui resolveu pra mim aquela textura chatinha na pele, um passo só e já dá pra ver diferença rápido"
- "Esse sérum aqui é bom demais gente, a pele fica hidratada o dia inteiro sem oleosidade e a textura melhora muito"

**Engraçado**
- "Esse produto aqui fez minha pele ficar tão boa que meu marido achou que eu troquei de rosto durante a semana"
- "Esse sérum deixou minha pele tão bonita que minha colega jurou que fiz procedimento, calma gente é um produto só"
- "Esse produto fez minha mãe ligar preocupada achando que gastei fortunas no dermatologista, mas é só um passo na rotina"
- "Esse sérum aqui deixa a pele tão boa que acordo bonita e levo susto, e olha que isso não é fácil"

**Urgente**
- "Esse produto aqui entrega resultado visível em poucos dias, absorção imediata e a pele já muda de textura rapidamente"
- "Esse sérum age rápido demais, em três dias a textura da pele já mudou e o toque ficou completamente diferente"
- "Esse produto aqui não demora meses pra funcionar, em semanas você já percebe a evolução clara e consistente na pele"
- "Esse sérum entrega resultado desde a primeira semana, a pele responde rápido e você sente a diferença no toque diário"

**Educativo**
- "Esse produto tem concentração ativa na faixa ideal segundo estudos, a formulação respeita a barreira cutânea e entrega resultado real"
- "Esse sérum combina niacinamida e ácido hialurônico em sinergia, hidrata sem oleosidade e uniformiza o tom de forma funcional"
- "Esse produto tem pH calibrado pra otimizar a penetração dos ativos, cada ingrediente está ali com dosagem funcional precisa"
- "Esse sérum usa tecnologia de liberação prolongada que mantém os ativos trabalhando por horas, diferente de fórmulas convencionais"

**Inspirador**
- "Esse produto aqui mudou como eu me sinto toda manhã, a pele ficou mais bonita e minha confiança subiu junto com ela"
- "Esse sérum virou meu ritual de cuidado diário, dois minutos que transformam minha pele e mudam o tom do meu dia"
- "Esse produto me fez gostar mais do que vejo no espelho, a pele ficou confortável e isso mudou minha atitude toda"
- "Esse sérum trouxe uma leveza pra minha rotina que reflete na pele e na forma como me trato todos os dias"

