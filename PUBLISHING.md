# Guia de Publicação e Manutenção - RedRecon Portfolio

Este guia descreve como gerenciar, atualizar e publicar seu site usando GitHub Pages. Como o site é 100% estático (HTML/CSS/JS), **não é necessário nenhum backend**.

## 1. Configuração Inicial (Feito apenas uma vez)

Antes de começar, você precisa conectar esta pasta a um repositório no GitHub.

1.  Crie um **novo repositório** no GitHub (ex: `portfolio-redrecon`).
2.  Desmarque a opção "Initialize with README".
3.  No seu terminal (dentro da pasta do projeto), rode:

```bash
# Iniciar o git
git init

# Adicionar todos os arquivos
git add .

# Criar o primeiro commit
git commit -m "Deploy inicial: Site completo com blog expandido"

# Conectar ao GitHub (substitua USUARIO pelo seu user real)
git remote add origin https://github.com/USUARIO/portfolio-redrecon.git

# Enviar os arquivos
git push -u origin main
```

4.  **Ativar GitHub Pages:**
    *   Vá em **Settings** > **Pages** no repositório do GitHub.
    *   Em **Source**, selecione `Deploy from a branch`.
    *   Em **Branch**, selecione `main` e pasta `/ (root)`.
    *   Clique em **Save**.
    *   Seu site estará no ar em `https://USUARIO.github.io/portfolio-redrecon`.

---

## 2. Como Publicar um Novo Artigo (Ciclo Constante)

Para manter o blog vivo, siga este processo simples:

### Passo 1: Criar o Arquivo do Artigo

O jeito mais fácil é duplicar um artigo existente para manter o estilo.

1.  Vá para a pasta `blog/`.
2.  Copie um arquivo existente (ex: `ad-red-team-essentials.html`) e renomeie para seu novo tema (ex: `nova-vulnerabilidade.html`).
3.  Edite o novo arquivo:
    *   Mude o `<title>`.
    *   Atualize o `<h1>` e os metadados (Data, Tópico).
    *   Escreva seu conteúdo mantendo a estrutura `<section>`, `<h2>`, `<p>`.

### Passo 2: Adicionar ao Índice

Para que as pessoas encontrem o artigo, adicione-o à página principal do blog.

1.  Abra `blog.html`.
2.  Encontre a div `<div class="blog-grid">`.
3.  Duplique o primeiro bloco `<article>...</article>`.
4.  Atualize os dados:
    *   **Link:** `<a href="blog/nova-vulnerabilidade.html">`
    *   **Título:** O título do novo post.
    *   **Resumo:** Uma breve descrição.
    *   **Tags:** Ex: `WEB SEC`, `RED TEAM`.

---

## 3. Enviando as Atualizações

Sempre que você criar um post ou mudar algo no site (textos, cores), envie para o GitHub:

```bash
# 1. Veja o que mudou
git status

# 2. Prepare os arquivos
git add .

# 3. Salve com uma mensagem explicativa
git commit -m "Blog: Novo post sobre Nova Vulnerabilidade"

# 4. Publique
git push
```

**Pronto!** O GitHub Pages vai detectar a mudança e atualizar o site automaticamente em 1 ou 2 minutos.

---

## Dicas Extras

*   **Imagens:** Salve novas imagens em `img/` e use caminhos relativos: `<img src="../img/minha-foto.jpg">`.
*   **Backups:** O GitHub serve como seu backup. Mantenha-o sempre sincronizado.
