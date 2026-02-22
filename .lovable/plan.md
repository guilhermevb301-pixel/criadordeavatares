

## Integrar Gemini para Geração de Imagens + Sistema de Login com Admin

### Resumo

Duas grandes funcionalidades:

1. **Geração de imagens com Gemini (Nano banana pro)** -- botão "Gerar Imagem" no PromptPreview que envia o prompt para o modelo `google/gemini-3-pro-image-preview` via edge function e exibe a imagem gerada diretamente no sistema.

2. **Sistema de login/senha com admin supremo** -- autenticação via Supabase Auth (email/senha). O email `guilhermevb301@gmail.com` é o dono supremo com permissões de edição de configurações do avatar, estilos de prompt, etc. Outros usuarios podem usar o sistema mas não editar configurações.

---

### Arquivos a criar

1. `supabase/functions/generate-image/index.ts` -- edge function que chama Lovable AI Gateway com modelo `google/gemini-3-pro-image-preview`
2. `src/pages/LoginPage.tsx` -- pagina de login com email/senha
3. `src/pages/SignupPage.tsx` -- pagina de cadastro
4. `src/hooks/useAuth.tsx` -- contexto de autenticação (AuthProvider + useAuth hook)
5. `src/hooks/useImageGeneration.ts` -- hook para chamar a edge function de geração de imagem

### Arquivos a modificar

1. `src/App.tsx` -- adicionar AuthProvider, rotas de login/signup, proteger rotas
2. `src/components/builder/PromptPreview.tsx` -- botão "Gerar Imagem com IA" + exibição da imagem gerada
3. `src/components/layout/AppSidebar.tsx` -- exibir nome do usuario logado + botão logout
4. `src/components/layout/AppLayout.tsx` -- redirecionar para login se não autenticado
5. `src/pages/AvatarBuilderPage.tsx` -- condicionar edição de campos de configuração ao admin
6. `supabase/config.toml` -- registrar a nova edge function

---

### 1. Edge Function: generate-image

Recebe o prompt, chama `https://ai.gateway.lovable.dev/v1/chat/completions` com:
- model: `google/gemini-3-pro-image-preview`
- modalities: `["image", "text"]`
- messages com o prompt do avatar

Retorna a imagem base64 gerada. Trata erros 429 (rate limit) e 402 (creditos).

### 2. Sistema de Autenticação

**Supabase Auth** com email/senha:
- Pagina de login simples e bonita com emojis
- Pagina de signup
- AuthProvider que gerencia sessão via `onAuthStateChange`
- Proteção de rotas: redireciona para `/login` se não logado

**Admin supremo**: verificação simples no frontend -- se `user.email === 'guilhermevb301@gmail.com'`, o usuario tem acesso admin. Isso controla:
- Visibilidade de campos de configuração editáveis (estilos de prompt, opções do builder)
- Acesso a funcionalidades de administração futuras

Nota: Para uma aplicação de configuração de prompts (sem dados sensíveis no banco), a verificação por email no frontend é adequada. Caso no futuro haja dados protegidos no banco, recomenda-se migrar para uma tabela `user_roles` com RLS.

### 3. UI de Geração de Imagem

No `PromptPreview`, adicionar:
- Botão "Gerar Imagem com IA" (com emoji de varinha magica)
- Estado de loading com spinner
- Area de exibição da imagem gerada (base64 renderizada como `<img>`)
- Botão para baixar a imagem
- Tratamento de erros com toast

### 4. Controle de Admin no Builder

- Campos como "Estilo Visual", opções dos blocos, etc., ficam editáveis apenas para o admin
- Usuarios normais podem selecionar as opções disponíveis, mas não editar/adicionar novas
- Na prática inicial: todos podem usar o builder normalmente. O controle de admin é para futuras funcionalidades de customização das opções (ex: adicionar novos estilos, editar prompt templates)

---

### Detalhes técnicos

**Edge function (generate-image/index.ts)**:

```text
POST /generate-image
Body: { prompt: string }
Response: { imageUrl: string } (base64 data URL)

- Usa LOVABLE_API_KEY (já disponível)
- CORS headers incluídos
- Trata 429 e 402
- verify_jwt = false no config.toml
```

**Hook useImageGeneration**:

```text
- Estado: loading, error, imageUrl
- Função: generateImage(prompt) -> chama edge function
- Retorna { generateImage, imageUrl, loading, error, reset }
```

**AuthProvider**:

```text
- Cria cliente Supabase com credenciais do projeto
- onAuthStateChange para manter sessão
- Expõe: user, session, signIn, signUp, signOut, isAdmin
- isAdmin = user?.email === 'guilhermevb301@gmail.com'
```

**Fluxo do usuario**:

```text
1. Abre o app -> redireciona para /login se não logado
2. Faz login com email/senha
3. Acessa o dashboard normalmente
4. No builder, configura avatar e clica "Gerar Imagem"
5. Imagem aparece ao lado do prompt
6. Pode baixar a imagem gerada
```

### Pre-requisito

Antes de implementar, preciso habilitar o Lovable Cloud (Supabase) para ter autenticação e edge functions disponíveis. Vou fazer isso no início da implementação.

