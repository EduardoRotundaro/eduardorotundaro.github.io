# Decisões do projeto

Registro do que foi decidido, e **por quê**. O "porquê" é o que o README não carrega
e o que o Eduardo-de-2027 não vai lembrar.

---

## Fase 0 — 2026-08-28

### 1. Nome do repositório: `eduardorotundaro.github.io`

**Decisão:** renomear de `handbook` para `eduardorotundaro.github.io`.

**Por quê:** repositório de *usuário* publica na raiz do domínio. Isso elimina o
`base: '/handbook'` do `astro.config.mjs` e, com ele, a classe inteira do bug nº 1
do GitHub Pages — home sem CSS e links internos em 404, que reaparece a cada link
escrito à mão. URL final mais curta.

**Custo aceito:** consome o único slot de site de usuário da conta GitHub.
Estava parado e não havia outro site pessoal planejado.

**Consequência prática:** `npm run dev` e a URL de produção passam a ter o mesmo
caminho. Mesmo assim, todo fim de fase termina com `npm run build && npm run preview`
antes do push — o hábito vale para qualquer erro de caminho, não só base path.

### 2. Indexação: **não indexado**

**Decisão:** `<meta name="robots" content="noindex">` no layout base +
`public/robots.txt` com `Disallow: /`.

**Por quê:** o repositório é público por obrigação (GitHub Pages no plano Free exige),
e o conteúdo são notas de estudo sob nome real. Um verbete `status: semente`
afirmando com segurança algo tecnicamente errado é um artefato de reputação
profissional — e o badge de maturidade é interno ao site, invisível no resultado
de busca do Google.

**O que isso NÃO é:** privacidade. O repositório e o site continuam públicos e
acessíveis por link; `robots.txt` é convenção respeitada por crawlers bem-comportados,
não um bloqueio. A regra de nunca commitar credencial continua valendo integralmente.

**Reversível:** sim, e a qualquer momento. Se um dia o handbook amadurecer a ponto de
valer ser descoberto, remover as duas linhas basta.

### 3. Licença: CC BY 4.0 (texto) + MIT (código)

**Decisão:** ver [`LICENSE`](../LICENSE).

**Por quê:** repositório público sem `LICENSE` é juridicamente "todos os direitos
reservados" — ninguém pode reusar nada, o que contradiz a proposta de documentação
de fácil acesso. CC BY 4.0 permite citar e adaptar o texto dando crédito; MIT
permite copiar um snippet sem fricção. É a combinação usual em repositórios de
documentação, e separa corretamente prosa de código.

**Nota:** o `LICENSE` linka o texto legal completo do CC BY em vez de embuti-lo
(são ~7 mil palavras). É a prática recomendada pela própria Creative Commons.

---

## Pendências da Fase 0

- [ ] **Renomear o repositório no GitHub** — ação manual em
      Settings > General > Repository name (o `gh` CLI não está instalado nesta máquina).
      Depois: `git remote set-url origin https://github.com/EduardoRotundaro/eduardorotundaro.github.io.git`
- [ ] `robots.txt` e a meta tag `noindex` entram na **Fase 1**, quando o projeto
      Astro existir (dependem de `public/` e do layout).
