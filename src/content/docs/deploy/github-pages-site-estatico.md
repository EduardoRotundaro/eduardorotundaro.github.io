---
title: Publicar site estatico no GitHub Pages
description: Repositorio de usuario x de projeto, o bug do base path, e o workflow minimo do GitHub Actions para publicar um SSG.
status: crescendo
tags: [deploy, github, ci]
---

:::tip[Em uma frase]
Repositorio chamado `<usuario>.github.io` publica na raiz e dispensa `base`; qualquer
outro nome publica em `/<repo>/` e exige configurar `base` -- que e a origem de quase
todo site quebrado no Pages.
:::

## As duas formas de repositorio

| Tipo | Nome do repo | URL | `base` |
| --- | --- | --- | --- |
| De usuario | `<usuario>.github.io` | `https://<usuario>.github.io/` | nenhum |
| De projeto | qualquer outro | `https://<usuario>.github.io/<repo>/` | `/<repo>` |

Voce tem direito a **um** repositorio de usuario por conta. Gaste-o com o site que mais
importa: ele elimina uma classe inteira de bug.

## O bug do base path

Num repositorio de projeto, o site e servido sob um prefixo. Todo caminho absoluto que o
site gera (`/style.css`, `/assets/x.js`) aponta para a raiz do dominio, onde nao ha nada.
O sintoma classico: **a home carrega sem CSS nenhum e os links internos dao 404** -- so em
producao.

Por que passa despercebido: `astro dev` (e a maioria dos dev servers) serve na **raiz**,
sem o prefixo. O erro so existe no build.

**Como pegar antes do push:**

```bash
npm run build && npm run preview
```

O `preview` respeita o `base` e reproduz o problema localmente em segundos, em vez de
esperar o ciclo push -> CI -> propagacao. Adote como criterio: nada vai para o `main`
antes de passar pelo `preview`.

## Limites do plano gratuito

- **1 GB** de tamanho publicado
- **100 GB/mes** de banda (limite suave)
- **10 builds/hora** -- limite suave que **nao se aplica** quando voce publica com um
  workflow proprio do GitHub Actions
- O repositorio precisa ser **publico**. Pages em repositorio privado exige plano pago --
  e mesmo assim o site publicado continua acessivel publicamente.

## Workflow minimo

Em `Settings > Pages`, defina **Source = GitHub Actions**. Depois:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'
          cache: npm
      - uses: actions/configure-pages@v6
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

Tres pontos que custam tempo:

- **`configure-pages` vem ANTES do build.** A razao de existir dele e emitir outputs
  (`base_path`) para o gerador consumir. Depois do build, ele e decorativo.
- **`permissions` e `id-token: write` nao sao opcionais** -- sem eles o `deploy-pages`
  falha com erro de credencial que nao explica a causa.
- **O starter oficial do GitHub costuma estar desatualizado.** Confira as versoes das
  actions na pagina de releases de cada uma antes do primeiro push: um major inexistente
  falha com `Unable to resolve action`, logo no primeiro deploy.

## Dominio proprio

O arquivo `CNAME` no repositorio e **ignorado** quando o deploy e feito via Actions.
Configure o dominio em `Settings > Pages`, e os registros DNS no seu provedor.
