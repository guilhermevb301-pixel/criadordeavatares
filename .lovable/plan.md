

## Plano: Esconder seções desnecessárias quando foto de referência está ativa

Quando o toggle "📸 Vou anexar uma foto de referência" estiver ativado, as seções **DNA Visual**, **Estilo e Cabelo** e **Vibe e Estética** devem ser ocultadas, pois a foto já fornece essas informações.

### Mudanças

**`src/pages/AvatarBuilderPage.tsx`**:
- Filtrar o array `personalityAccordions` para excluir `dna-visual`, `estilo-cabelo` e `vibe` quando `state.useAttachedPhoto === true`
- Manter visíveis: **Acessórios e Identidade** (pois o usuário pode querer adicionar/remover óculos, piercings, etc.) e todas as **Configurações Técnicas** (roupa, ambiente, pose, câmera, etc.)

### Resultado
Com a foto de referência ativa, o builder mostra apenas as seções que fazem sentido customizar por cima da foto (acessórios, roupa, pose, câmera, iluminação, etc.). Ao desativar o toggle, todas as seções voltam a aparecer.

