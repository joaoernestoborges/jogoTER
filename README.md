# Trabalho de Ensino Religioso — Jogo Medieval

Jogo de plataforma 2D (canvas HTML5) ambientado no período medieval das Cruzadas,
desenvolvido como **Trabalho de Ensino Religioso**.

## Objetivo pedagógico

O jogo tem como objetivo abordar a **multirreligiosidade** e a **tolerância
religiosa**. Usando o contexto das Cruzadas — momento histórico de encontro e
conflito entre cristãos, muçulmanos e judeus —, a proposta é provocar a reflexão
sobre a diversidade de crenças, o diálogo entre religiões e o respeito às
diferenças no mundo atual.

## Como jogar

| Tecla           | Ação                                                     |
| --------------- | -------------------------------------------------------- |
| `A` / `D`       | Mover para a esquerda / direita                          |
| `Espaço`        | Pular / agir (abrir baú, sair de casa, pegar o escudo)   |
| `E` / `W` / `Q` | Esquiva combinada (cores) durante os golpes dos inimigos |

No celular: deslize o dedo para andar, toque com 1 dedo para pular/agir, toque
com 2 dedos para `Q`, 3 dedos para `W` e 4 dedos para `E`.

Percurso: interior da casa → aldeia medieval → casa do escudo → moinho (ranking
com estrelas conforme os corações) → fase 2. Abra o baú, pegue o escudo
templário, enfrente os soldados e o general e defenda a aldeia na fase 2.

## Rodando o projeto

Requisito: [Bun](https://bun.sh) (npm também funciona).

```sh
bun install        # instala as dependências
bun run dev        # servidor de desenvolvimento (http://localhost:8080)
bun run build      # build de produção (Nitro; alvo padrão Cloudflare)
bun run build:dev  # build em modo de desenvolvimento
bun run preview    # serve o build de produção
bun run lint       # ESLint (inclui regras do Prettier)
bun run format     # Prettier --write .
```

Não há testes automatizados nem CI neste projeto.

## Estrutura do código

- `src/routes/index.tsx` — todo o jogo: menu, créditos e o loop de canvas
  (900×520, aldeia com rolagem de 4× a largura da tela).
- `src/routes/` — rotas do TanStack Router (baseado em arquivos).
- `src/components/ui/` — componentes shadcn/ui.
- `src/styles.css` — tema Tailwind v4 (via CSS, sem arquivo de config).

## Créditos

Trabalho escolar de Ensino Religioso. Veja a tela de créditos do jogo.
