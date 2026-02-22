# 🎵 Lyrics Projection App

Uma aplicação web moderna e performática para projeção de letras de músicas, integrada diretamente com o **Notion**. Desenvolvida com **Next.js**, **Chakra UI** e **Framer Motion**, oferece uma experiência visual fluida inspirada no Apple Music.

![Tech](https://img.shields.io/badge/Tech-Next.js%20%7C%20Chakra%20UI%20%7C%20Docker-blueviolet)

---

## ✨ Funcionalidades

- 🔗 **Integração com Notion:** Sincronização automática das letras e lista de músicas.
- 📺 **Modo Projeção:** Interface limpa e imersiva para exibição em telões/projetores.
- ⌨️ **Navegação por Teclado:** Controle as letras facilmente com as setas do teclado.
- 🌫️ **Visual Premium:** Efeito de desfoque (blur) e destaque na linha ativa, com gradientes suaves.
- 🐳 **Pronto para Docker:** Configuração rápida e consistente em qualquer ambiente.

---

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ ou Docker & Docker Compose.
- Uma conta no Notion com uma Integração criada.

### Opção 1: Rodando Localmente

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd Lyrics
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:3000`

### Opção 2: Rodando via Docker (Recomendado)

A maneira mais rápida de subir o projeto é usando Docker:

```bash
docker-compose up --build
```
Isso iniciará o container da aplicação na porta **3000**.

---

## ⚙️ Configuração do Notion

Para que o aplicativo funcione, você precisará configurar seu banco de dados no Notion:

1. **Crie uma Integração:** Vá em [Notion My Integrations](https://www.notion.so/my-integrations) e crie um "Internal Integration Token".
2. **Prepare o Banco de Dados:**
   - O banco de dados deve ter as colunas: `Music` (Title) e `Group` (Select).
   - O conteúdo de cada página do banco de dados deve ser a letra da música (formatada linha a linha).
3. **Compartilhe o Banco de Dados:** Adicione a sua integração como conexão no banco de dados desejado.

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto facilitando o preenchimento automático (opcional, você pode inserir na tela de Login):

```env
NOTION_KEY=seu_token_aqui
NOTION_DATABASE_ID=seu_id_do_banco_de_dados
```

---

## ⌨️ Atalhos no Modo Projeção

| Tecla | Ação |
| :--- | :--- |
| `Seta para Direita / Baixo` | Avançar para a próxima estrofe |
| `Seta para Esquerda / Cima` | Voltar para a estrofe anterior |
| `Esc` | Sair do modo projeção |
| `Clique na Linha` | Pula diretamente para aquela estrofe |

---

## 🛠️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [@notionhq/client](https://github.com/makenotion/notion-sdk-js)
- [Docker](https://www.docker.com/)

---
