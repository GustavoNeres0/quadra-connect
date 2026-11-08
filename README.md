# Quadra Connect – Aplicação do Cliente

Aplicação web responsiva (React + TypeScript + Vite + Tailwind CSS + shadcn/ui), pensada para uso em celular, para jogadores buscarem quadras, verem horários disponíveis e fazerem reservas. Consome a API [quadra_connect_api](https://github.com/higorxi/quadra_connect_api).

## Funcionalidades

- Cadastro e login
- Busca de quadras e visualização de horários
- Realização e acompanhamento de reservas
- Perfil do cliente

## Pré-requisitos

- Node.js 20+ e npm
- A API do Quadra Connect rodando (padrão `http://localhost:3000`)

## Configuração

Crie um arquivo `.env` na raiz:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=<url do projeto Supabase>
VITE_SUPABASE_PUBLISHABLE_KEY=<chave publicável do Supabase>
```

Se `VITE_API_BASE_URL` não for definida, a aplicação usa `http://localhost:3000`. As variáveis do Supabase ainda são usadas por parte do fluxo do cliente e estão sendo migradas para a API.

## Executar

```bash
npm install
npm run dev           # desenvolvimento
npm run build         # build de produção
npm run lint
npm test              # testes (Jest)
npm run test:coverage
```

## Executar o sistema completo

1. Suba a API (`quadra_connect_api`) e confirme que ela responde.
2. Suba o painel do locador (`quadra_connect_admin`).
3. Suba esta aplicação com `npm run dev`.

A API só aceita CORS das origens listadas em seu `src/main.ts`; se o Vite subir em outra porta, ajuste essa lista na API.
