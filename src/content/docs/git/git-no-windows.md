---
title: Git no Windows - autocrlf e ignorecase
description: As duas configuracoes do Git que so mordem no Windows, e o .gitattributes que resolve a primeira antes do primeiro commit.
status: crescendo
tags: [git, windows]
---

:::tip[Em uma frase]
Crie `.gitattributes` com `* text=auto eol=lf` **no commit inicial**, e nunca renomeie um
arquivo mudando so a caixa das letras sem passar por um nome intermediario.
:::

## As duas configuracoes

No Windows, o Git vem com dois padroes que nao existem no Linux e que produzem bugs que
**nao reproduzem na maquina de quem usa Linux** -- normalmente o CI.

```bash
git config core.autocrlf   # true no Windows
git config core.ignorecase # true no Windows
```

## `core.autocrlf=true` -- fim de linha

Ao dar `checkout`, o Git converte LF para CRLF no disco; ao dar `add`, converte de volta
para LF. Na teoria e transparente. Na pratica, qualquer arquivo que entre no repositorio
por um caminho diferente (um editor, um gerador de codigo, um `cat > arquivo`) pode
gravar CRLF no objeto commitado, e a partir dai o diff fica poluido com o arquivo inteiro
marcado como alterado.

**Solucao:** um `.gitattributes` na raiz, que decide o fim de linha no repositorio e
ignora o `core.autocrlf` de cada maquina.

```
* text=auto eol=lf
```

**O detalhe que importa:** o `.gitattributes` so vale para o que for commitado **depois**
dele. Arquivos ja no repositorio mantem o que foi gravado. Por isso ele precisa entrar no
commit inicial -- criado depois, exige um `git add --renormalize .` e um commit de
normalizacao que toca todos os arquivos de uma vez.

## `core.ignorecase=true` -- caixa do nome do arquivo

O Git trata `Docker.md` e `docker.md` como o **mesmo** arquivo. O sistema de arquivos do
Windows tambem. O do Linux, nao.

O modo de falha e desagradavel: voce renomeia `Docker.md` para `docker.md` no explorador,
o `git status` nao mostra nada (o Git ve o mesmo arquivo), voce commita achando que
arrumou, e o build no CI Ubuntu continua quebrado procurando `docker.md` -- que la e um
arquivo que nao existe.

**Renomear so a caixa** exige um nome intermediario:

```bash
git mv --force Docker.md docker.tmp
git mv --force docker.tmp docker.md
```

**Verificar o que esta realmente versionado** (nao o que esta no disco):

```bash
git ls-files
```

Qualquer validador de nome de arquivo deve rodar sobre `git ls-files`, nunca sobre o
disco -- no Windows o disco mente.

## Por que nao desligar as duas

`core.autocrlf=false` resolve o fim de linha so na sua maquina; o `.gitattributes` resolve
para o repositorio inteiro e para todo mundo, para sempre. Prefira o segundo.

`core.ignorecase=false` no Windows faz o Git enxergar dois arquivos onde o sistema de
arquivos so consegue ter um, o que causa problemas piores que o original. Nao mexa.
