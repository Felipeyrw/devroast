# DevRoast

Paste seu código. Receba um roast. Sem dó.

DevRoast é uma ferramenta para desenvolvedores que querem melhorar seu código através de feedbacks diretos e sem filtros. Cole seu código, escolha o modo de análise e veja a avaliação.

## Funcionalidades

- **Editor de código** — cole seu código diretamente na interface
- **Modo roast** — ativa a máxima sarcasmo na análise
- **Pontuação** — cada código recebe uma nota de 0 a 10
- **Leaderboard** — ranking dos piores códigos já submetidos
- **Análise detalhada** — cards com problemas identificados, sugestões de melhoria e diffs

## Como funciona

1. Cole seu código no editor
2. Ative o modo roast (opcional, mas recomendado)
3. Clique em "roast_my_code"
4. Receba sua nota e análise

## Páginas

- **`/`** — página inicial com editor e leaderboard
- **`/examples`** — biblioteca de componentes UI

## Design

Interface escura com tipografia monospaced (JetBrains Mono). Paleta de cores com verde esmeralda (#10B981) para ações, vermelho para erros e amarelo para avisos.

## Rodando localmente

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.
