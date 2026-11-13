# Breno Coelho — Fotógrafo

Site do Breno Coelho, fotógrafo em Recife/PE. HTML, CSS e JavaScript puro, sem build e sem dependências.

## Páginas (uma por link)
| Arquivo | O que é |
|---|---|
| `index.html` | Link da bio — página de entrada com todos os links |
| `portfolio.html` | Portfólio com filtro (Ensaios, Esportes, Torcidas, Eventos) e foto ampliada |
| `sobre.html` | Quem é o Breno + depoimentos |
| `pacotes.html` | Pacotes, como funciona e perguntas frequentes |
| `agendar.html` | Agendamento em 4 etapas: serviço → data/horário → dados → confirmação |
| `cliente.html` | Área do cliente (acesso à galeria) |

Links diretos úteis: `agendar.html?servico=esportivos` já abre o agendamento com o serviço escolhido
(`individual`, `casal`, `esportivos`, `eventos`) e `portfolio.html?cat=torcidas` abre o portfólio filtrado.

## Configurar (tudo no topo do `script.js`)
- `whatsapp` — número com 55 + DDD
- `email` — Gmail do Breno para receber os pedidos por e-mail (via FormSubmit).
  Na **primeira** vez que alguém agendar, o FormSubmit manda um e-mail de ativação pro Breno: é só clicar em **Activate Form**.
- `galeriaClientes` — link da plataforma de galerias
- `servicos` / `extras` — nomes, preços e horários (**os preços atuais são fictícios, para teste**)
- `datasBloqueadas` e `ocupados` — dias e horários indisponíveis (valores de teste)
- `sinal`, `antecedenciaDias`, `mesesAFrente`, `diasFechados`

Os preços também aparecem escritos em `pacotes.html` — se mudar no `script.js`, mude lá também.
Procure por `[` nos HTMLs para achar o que falta preencher (ano, números, depoimentos).

## Agendamento
1. Cliente escolhe o serviço e extras (vê o total na hora)
2. Escolhe data no calendário e horário (dias e horários ocupados aparecem riscados)
3. Preenche nome, WhatsApp, e-mail, local e ideia
4. Revisa o resumo com total e sinal e toca em **Confirmar pelo WhatsApp** — abre a conversa com a mensagem pronta
   (serviço, extras, data, horário, local, valores e dados). Se o `email` estiver configurado, o pedido também chega no Gmail.

Como o site é estático, a agenda não bloqueia horários sozinha: o Breno atualiza `datasBloqueadas`/`ocupados`
quando fechar um horário (ou, no futuro, dá pra ligar num Google Agenda / Calendly).

## Rodar localmente
```bash
npx serve .
```

## Publicar no GitHub Pages
Settings → Pages → Source: `main` / root.
