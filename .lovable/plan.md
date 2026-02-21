
## Refatoracao para Arquitetura Multi-Page com Sidebar

### Resumo

Reorganizar a aplicacao em 4 paginas com navegacao lateral fixa, mantendo todas as funcionalidades existentes e melhorando a experiencia visual com mais espacamento e hierarquia.

---

### Estrutura de Rotas

```text
/              -> Dashboard (novo)
/avatar        -> Criar Avatar Realista (builder atual reorganizado)
/avatar/edit   -> Editar Avatar Existente (tab atual vira sub-rota)
/roteiros      -> Gerar Roteiros UGC (novo)
/configuracoes -> Configuracoes (placeholder)
```

---

### Novos Arquivos

1. **`src/components/layout/AppSidebar.tsx`**
   - Sidebar fixa a esquerda com icones + labels
   - Links: Dashboard, Criar Avatar, Roteiros UGC, Configuracoes
   - Destaque visual no item ativo (usando `useLocation`)
   - Logo/brand no topo
   - ThemeToggle no rodape da sidebar
   - Responsivo: colapsavel em mobile (hamburger menu)

2. **`src/components/layout/AppLayout.tsx`**
   - Layout wrapper com sidebar + area de conteudo principal
   - Usa `<Outlet />` do react-router para renderizar paginas filhas
   - Transicoes suaves entre paginas (CSS transitions com fade/slide)

3. **`src/pages/Dashboard.tsx`**
   - 4 cards grandes centralizados em grid 2x2:
     - "Criar Avatar Realista" (icone User + Sparkles) -> navega para /avatar
     - "Gerar Roteiros UGC" (icone FileText) -> navega para /roteiros
     - "Producao de Video" (icone Video) -> placeholder/coming soon
     - "Configuracoes" (icone Settings) -> navega para /configuracoes
   - Cards com hover elevado, icones grandes, descricao curta
   - Layout minimalista e premium

4. **`src/pages/AvatarBuilderPage.tsx`**
   - Refatoracao do `BuilderPage.tsx` atual
   - Remove header proprio (sidebar cuida da navegacao)
   - Mantem selecao de genero inline (se genero nao selecionado, mostra cards de selecao)
   - Layout 2 colunas:
     - Esquerda: accordions de configuracao (como esta)
     - Direita: area de preview maior com prompt gerado + secao "Referencias Visuais" abaixo
   - Secao "Referencias Visuais": area com placeholders para upload/exibicao de imagens de inspiracao
   - Toggle "Novo Avatar" / "Editar Existente" vira sub-navegacao interna ou rotas separadas

5. **`src/pages/ScriptGeneratorPage.tsx`**
   - Pagina nova para geracao de roteiros UGC
   - Formulario com inputs:
     - Produto (text input)
     - Nicho (text input ou select)
     - Publico-alvo (text input)
     - Tom do Avatar (select: profissional, casual, engraçado, etc.)
     - Quantidade de videos (number input / slider 1-10)
   - Botao central grande "Gerar Roteiros"
   - Area de resultados: cards individuais por roteiro com conteudo em formato texto
   - Contador de caracteres em cada card
   - Nota: geracao sera placeholder por enquanto (sem IA conectada), mostrando estrutura de output

6. **`src/pages/SettingsPage.tsx`**
   - Pagina placeholder com titulo e descricao
   - Secoes futuras: Perfil, Preferencias, Plano

---

### Arquivos Modificados

1. **`src/App.tsx`**
   - Reestruturar rotas com layout aninhado:
     ```text
     <Route element={<AppLayout />}>
       <Route path="/" element={<Dashboard />} />
       <Route path="/avatar" element={<AvatarBuilderPage />} />
       <Route path="/roteiros" element={<ScriptGeneratorPage />} />
       <Route path="/configuracoes" element={<SettingsPage />} />
     </Route>
     ```

2. **`src/pages/BuilderPage.tsx`**
   - Renomear/refatorar para `AvatarBuilderPage.tsx`
   - Remover header duplicado (sidebar lida com navegacao)
   - Manter toda logica de builder intacta
   - Integrar selecao de genero como passo inicial inline
   - Adicionar secao "Referencias Visuais" na coluna direita abaixo do prompt preview

3. **`src/pages/Index.tsx`**
   - Sera substituido pelo Dashboard
   - Selecao de genero movida para dentro da pagina de avatar

---

### Detalhes da Sidebar

- Largura: ~240px em desktop, colapsavel a icones (~64px) em tablet, drawer em mobile
- Icones usados (lucide-react): `LayoutDashboard`, `UserCircle`, `FileText`, `Video`, `Settings`
- Fundo: usa tokens `sidebar-background`, `sidebar-foreground` ja definidos no CSS
- Item ativo: destaque com `sidebar-accent` + borda lateral ou fundo diferenciado
- Separador visual entre grupos de itens

### Design Visual

- Cards do dashboard: `rounded-2xl`, padding generoso (p-8 a p-10), sombra `shadow-card` com hover `shadow-card-hover` e `hover:-translate-y-1`
- Mais espacamento geral: `gap-6` entre blocos, padding `p-6` a `p-8` nas areas de conteudo
- Manter identidade escura atual com tokens semanticos
- Transicoes entre paginas: CSS `animate-in fade-in` do tailwindcss-animate (ja instalado)

### Nota sobre Framer Motion

O projeto nao tem Framer Motion instalado. Transicoes serao feitas com `tailwindcss-animate` (ja disponivel) usando classes como `animate-in`, `fade-in`, `slide-in-from-left` para manter o bundle leve. Se o resultado nao for satisfatorio, Framer Motion pode ser adicionado depois.
