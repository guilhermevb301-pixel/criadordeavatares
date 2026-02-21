

## Foto Anexada + Referencia Famosa como Copia

### Resumo

Duas alteracoes no Avatar Creator:

1. **Toggle "Anexar Foto"** -- a pessoa escolhe se vai anexar uma foto ou nao. Se sim, o prompt inclui "use the attached photo as the base reference for the character".
2. **Referencia Famosa vira copia direta** -- em vez de "inspired by the visual vibe of X, without replicating exact likeness", o prompt passa a dizer "the character must look exactly like [nome], replicating their facial features, bone structure, and overall appearance as closely as possible".

---

### Arquivos afetados

1. `src/lib/avatar-config.ts` -- novo campo `useAttachedPhoto: boolean` no AvatarState
2. `src/stores/avatar-store.ts` -- default do novo campo
3. `src/pages/AvatarBuilderPage.tsx` -- toggle de foto + ajuste do label da referencia famosa
4. `src/lib/prompt-engine.ts` -- logica do prompt para foto e referencia

---

### 1. Estado (`avatar-config.ts` + `avatar-store.ts`)

Adicionar ao `AvatarState`:
```
useAttachedPhoto: boolean   (default: false)
```

### 2. UI (`AvatarBuilderPage.tsx`)

**Toggle de Foto Anexada** -- aparece entre o Estilo Visual e a Referencia Famosa:
- Card com Switch (toggle) e label: "📸 Vou anexar uma foto de referencia"
- Texto auxiliar: "Ative se voce vai enviar uma foto junto com o prompt"
- Usa componente Switch do shadcn

**Referencia Famosa** -- alterar textos:
- Label: "🌟 Quer copiar o visual de alguem? (opcional)"
- Placeholder: "Ex: Goku, Naruto, Angelina Jolie, Keanu Reeves..."
- Remover a palavra "inspirar", deixar claro que e copia

### 3. Prompt Engine (`prompt-engine.ts`)

**Foto anexada** -- se `useAttachedPhoto === true`, adicionar como primeira secao apos o opener:
```
use the attached photo as the base reference for the character
```

**Referencia famosa** -- trocar de:
```
inspired by the visual vibe of {nome}, without replicating exact likeness
```
Para:
```
the character must look exactly like {nome}, replicating their facial features, bone structure, and overall appearance as closely as possible
```

### Detalhes tecnicos

- O Switch importa de `@/components/ui/switch` (ja existe no projeto)
- O campo `useAttachedPhoto` e persistido no zustand junto com o resto do state
- A ordem dos elementos na UI fica: Estilo Visual > Toggle Foto > Referencia Famosa > Idade > Accordion

