# Breno Coelho — Fotógrafo

Site do Breno Coelho, fotógrafo em Recife/PE. HTML, CSS e JavaScript puro, sem build e sem dependências.

## Rodar localmente
Abra o `index.html` no navegador, ou:
```bash
npx serve .
```

## Configurar
Em `script.js`, no topo:
- `whatsapp`: número com 55 + DDD (ex.: `5581999999999`)
- `galeriaClientes`: link da plataforma de galerias

No `index.html`, procure por `[` para achar o que falta preencher: preços, prazos, ano, e-mail, números e depoimentos.

## Funcionalidades
- Portfólio com filtro por categoria e lightbox (setas, teclado e swipe no celular)
- Pacotes com botão que já seleciona o serviço no formulário
- Formulário de orçamento que monta a mensagem pronta no WhatsApp (com máscara de telefone e validação)
- Botão flutuante do WhatsApp, menu mobile, perguntas frequentes, área do cliente
- Responsivo, acessível (teclado e leitor de tela) e com meta tags para compartilhar o link

## Publicar no GitHub Pages
Settings → Pages → Source: `main` / root. O site fica em `https://<usuario>.github.io/<repo>/`.
