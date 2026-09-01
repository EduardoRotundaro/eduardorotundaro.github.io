---
title: nvm-windows - trocar de versao do Node
description: Como o nvm-windows difere do nvm do Linux, por que ele as vezes pede terminal como administrador, e como fixar a versao do projeto com .nvmrc.
status: crescendo
tags: [node, windows, ferramentas]
---

:::tip[Em uma frase]
`nvm use` no Windows troca a versao **globalmente** trocando um symlink -- por isso pode
exigir terminal como administrador, e por isso ele nao le `.nvmrc` sozinho.
:::

## Comandos

```powershell
nvm list                 # versoes instaladas; * marca a ativa
nvm install 22.12.0      # instala uma versao especifica
nvm use 22.12.0          # ativa (afeta o sistema inteiro)
nvm list available       # o que da para instalar
```

## Ele nao e o mesmo nvm do Linux

Sao dois projetos diferentes com o mesmo nome. O `nvm` do Linux/macOS e uma funcao de
shell que altera o `PATH` da sessao atual. O **nvm-windows** e um executavel que troca um
**symlink** apontando para a versao ativa.

Tres consequencias praticas:

1. **A troca e global, nao por terminal.** Rodar `nvm use 20` muda a versao para todos os
   terminais e para o VSCode -- inclusive os ja abertos, na proxima vez que invocarem
   `node`.
2. **Pode pedir privilegio de administrador.** Criar symlink no Windows exige o
   [Modo de Desenvolvedor](ms-settings:developers) ligado ou um terminal elevado. Se
   `nvm use` falhar sem mensagem clara, e quase sempre isso.
3. **Ele nao le `.nvmrc`.** `nvm use` sem argumento nao funciona como no Linux. Ou voce
   digita a versao, ou usa uma alternativa como o [fnm](https://github.com/Schniz/fnm),
   que le o arquivo.

## `.nvmrc` continua valendo a pena

Mesmo sem o nvm-windows le-lo, o arquivo e a **fonte unica de verdade** da versao do
projeto -- e o CI le:

```yaml
- uses: actions/setup-node@v7
  with:
    node-version-file: '.nvmrc'
    cache: npm
```

Sem isso, a versao do Node aparece hardcoded no workflow e na sua maquina em lugares
diferentes, e as duas divergem em silencio. O sintoma tipico e um build que passa local e
quebra no CI meses depois.

## Descobrir a versao que um projeto exige

O campo `engines` do pacote e a resposta autoritativa:

```bash
npm view astro engines
# { npm: '>=9.6.5', node: '>=22.12.0', pnpm: '>=7.1.0' }
```

Vale checar **antes** de comecar a instalar: um `npm install` que falha por versao de Node
gasta bem mais tempo do que essa consulta.
