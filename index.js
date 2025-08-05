const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode');
const fs = require('fs');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
  });

  sock.ev.on('creds.update', saveCreds);

  const mensagensProcessadas = new Set();

  const respostas = {
    "bom dia": nome => `Bom dia, ${nome}! ☀️ Eu sou o Rafael, assistente virtual. Como posso ajudar você?`,
    "boa tarde": nome => `Boa tarde, ${nome}! 👋 Sou o Rafael, assistente virtual. Qual sua dúvida?`,
    "boa noite": nome => `Boa noite, ${nome}! 🌙 Precisa de ajuda com nosso curso ou informações?`,
    "oi": nome => `Olá, ${nome}! 👋 Eu sou o Rafael, assistente virtual. Me diz, como posso te ajudar?`,
    "oiie": nome => `Oiie, ${nome}! 😊 Sou o Rafael, assistente virtual. Qual sua dúvida?`,
    "ola": nome => `Olá, ${nome}! 👋 Sou o Rafael, assistente virtual. Estou aqui pra ajudar.`,
    "olá": nome => `Olá, ${nome}! 👋 Me chamo Rafael, assistente virtual. Estou aqui pra ajudar.`,
    "boa": nome => `Tudo bem, ${nome}! 😄 Como posso ajudar você hoje?`,
    "duvida": nome => `❓ Pode me perguntar qualquer dúvida que eu te ajudo rapidinho, ${nome}! Qual é a sua?`,
    "estou com dúvida": nome => `❓ Pode me perguntar qualquer dúvida que eu te ajudo rapidinho, ${nome}! Qual é a sua?`,
 "quanto": "💸 Custa só R$35 e você garante acesso vitalício! 👉 Comece agora: https://pay.kiwify.com.br/oqjFfGk",
  "valor": "🚀 Por apenas R$35 você domina a criação de vídeos realista com IA . Começe agora mesmo: https://pay.kiwify.com.br/oqjFfGk",
  "preço": "✅ Últimas vagas por R$35! Aprenda a usar IA para criar vídeos virais e monetizar nas redes sociais. Acesse agora: https://pay.kiwify.com.br/oqjFfGk",
  "pagamento": "✅ Aceitamos Pix, Cartão ou Boleto. Só R$35 pra transformar suas ideias em vídeos com IA! Link direto: https://pay.kiwify.com.br/oqjFfGk",
  "link": "📲 Pronto pra começar? Aqui está seu link de acesso: https://pay.kiwify.com.br/oqjFfGk",
  "como faço para começar": "🎯 Começar é simples! Acesse agora por apenas R$35 e libere seu acesso vitalício: https://pay.kiwify.com.br/oqjFfGk",
  "sim": "✅ Ótima escolha! Garanta sua vaga agora mesmo: https://pay.kiwify.com.br/oqjFfGk",  
  "monetização": "💰 Quer ganhar dinheiro com vídeos? Nosso curso te ensina as melhores estratégias para monetizar conteúdo com IA",
   "monetizar": "💰 Quer ganhar dinheiro com vídeos? Nosso curso te ensina as melhores estratégias para monetizar conteúdo com IA.",
  "Ola,gostaria de tirar uma dúvida ": "Olá, aqui é o Rafael! Estou aqui para ajudar! Qual é a sua dúvida? 🤔",
  "curso": "📚 O curso é 100% online e prático! Você aprende passo a passo como criar vídeos realistas com IA usando só o celular. Mesmo sem experiência, você vai aprender a:\n\n1️⃣ Usar ferramentas de IA gratuitas com truques simples\n2️⃣ Criar prompts virais com ChatGPT (vídeo e imagem)\n3️⃣ Gerar vídeos automáticos com rosto, voz e movimento\n4️⃣ Editar vídeos magnéticos pra redes sociais\n5️⃣ Monetizar e ganhar em dólar com conteúdo IA 💸\n\n🎓 Acesso vitalício + suporte direto comigo!\n\n⏳ Últimas vagas com valor promocional!: https://pay.kiwify.com.br/oqjFfGk",
  "inteligência artificial": "🧠 Domine a criação de vídeos virais com Inteligência Artificial!\n\nAprenda passo a passo, mesmo sendo iniciante:\n✅ Use ferramentas gratuitas e simples\n💬 Crie prompts incríveis com ChatGPT (vídeos e imagens)\n🎬 Gere vídeos automáticos com rosto, voz e movimento\n🎯 Edite conteúdos magnéticos prontos pra viralizar\n💸 Aprenda estratégias reais para ganhar dinheiro online (inclusive em dólar!)\n\nAcesso vitalício + suporte direto comigo!\n👉 https://pay.kiwify.com.br/oqjFfGk",
  "ia": "🧠 Domine a criação de vídeos virais com Inteligência Artificial!\n\nAprenda passo a passo, mesmo sendo iniciante:\n✅ Use ferramentas gratuitas e simples\n💬 Crie prompts incríveis com ChatGPT (vídeos e imagens)\n🎬 Gere vídeos automáticos com rosto, voz e movimento\n🎯 Edite conteúdos magnéticos prontos pra viralizar\n💸 Aprenda estratégias reais para ganhar dinheiro online (inclusive em dólar!)\n\nAcesso vitalício + suporte direto comigo!\n👉 https://pay.kiwify.com.br/oqjFfGk",
 "garanti": "🔒 Compra 100% segura! Você tem 7 dias de garantia. Se não ficar satisfeito, devolvemos seu dinheiro integralmente, sem burocracia e com total facilidade.",
  "aula gratuita": "🎁 Quer ver como funciona antes? Assista a aula gratuita aqui: https://minitutorialveo.netlify.app/",
  "gratis": "🎥 Veja a amostra grátis e entenda como você pode criar vídeos com IA: https://minitutorialveo.netlify.app/",
  "como funciona": "📚 Você aprende passo a passo, com tutoriais práticos, como criar vídeos automáticos com IA e ganhar em dólar nas redes sociais. Aula grátis: https://minitutorialveo.netlify.app/",
  "aprende": "📚 Você aprende passo a passo, com tutoriais práticos, como criar vídeos automáticos com IA e ganhar em dólar nas redes sociais. Aula grátis: https://minitutorialveo.netlify.app/",
  "celular": "📱 Sim! Todo o curso é adaptado para celular. Só precisa de internet pra acessar quando quiser!",
  "suporte": "💬 Suporte direto comigo! Você pode tirar dúvidas e contar com orientação personalizada.",
  "iniciantes": "🚀 Sim! Mesmo que você nunca tenha usado IA, o curso é feito pra você aprender do zero.",
  "bônus": "🎁 Além das aulas, você ganha acesso a lives, templates prontos, grupo exclusivo e muito mais!",
  "grupo": "👥 Sim! Temos uma comunidade ativa onde você pode trocar ideias e fazer networking comigo e outros alunos.",
  "editar vídeos": "❌ Não precisa! O curso é pra quem quer criar vídeos automáticos sem complicação.",
  "online": "🌐 100% online! Você faz no seu tempo, de onde quiser.",
  "tempo": "📅 Você pode concluir em até 4 semanas, mas tem acesso vitalício pra ver quando quiser!",
  "parcelar": "💳 Claro! Aceitamos parcelamento no cartão de crédito em até 12x.",
  "conteúdo": "🔄 Atualizamos o curso com as últimas tendências de IA e ferramentas automáticas.",
  "diferencial": "🌟 É direto ao ponto, prático, com suporte real e técnicas testadas que funcionam!",
  "ganhar": "💰 Com certeza! A monetização é um dos pilares do curso. Você vai saber como ganhar em dólar!",
  "instrutor": "👨‍🏫 O curso é ensinado por mim, Rafael, e você terá contato direto comigo no grupo.",
  "viralizar vídeos": "📈 Sim! Estratégias pra viralizar e ganhar seguidores + dinheiro estão incluídas.",
  "como funciona": "🧠 Nosso curso é 100% online, prático e fácil para você aprender a criar vídeos virais usando IA. Confira: https://pay.kiwify.com.br/oqjFfGk",
  "mais informações": "📚 Veja todos os detalhes e informações aqui: https://treinamentogoogleveoo.netlify.app/",
  "baixar": "📥 Olá! Me chamo Rafael — peço que salve meu contato para receber atualizações exclusivas 😊 Me dá um *OK* quando terminar que eu te mando o link para baixar mais materiais, blz? 😉",
  "ok": "✅ Show! Aqui está o link para baixar os *Prompts Virais Google VEO3*:\n👉 https://drive.google.com/drive/folders/1A_llC1jO8CfrFVKufXjbayz7_iSJgjr9?usp=sharing",
"OK": "✅ Show! Aqui está o link para baixar os *Prompts Virais Google VEO3*:\n👉 https://drive.google.com/drive/folders/1A_llC1jO8CfrFVKufXjbayz7_iSJgjr9?usp=sharing",
"beleza": "✅ Perfeito! Aqui está o link dos Prompts Virais Google VEO3:\n👉 https://drive.google.com/drive/folders/1A_llC1jO8CfrFVKufXjbayz7_iSJgjr9?usp=sharing",
"grátis": "🎁 Quer ver como funciona antes? Assista a aula gratuita aqui: https://minitutorialveo.netlify.app/",
"gratis": "🎁 Quer ver como funciona antes? Assista a aula gratuita aqui: https://minitutorialveo.netlify.app/",
 "ajuda": "Olá! Aqui é o Rafael, seu assistente virtual. Estou aqui para te ajudar! 😊\nDiga qual é a sua dúvida: sobre o curso, pagamento, link ou qualquer outra coisa.\n\nSe preferir, pode acessar mais informações completas aqui:\nhttps://treinamentogoogleveoo.netlify.app/"
  };

  sock.ev.on('connection.update', async ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      await qrcode.toFile('qrcode.png', qr);
      console.log('📲 QR Code gerado e salvo em "qrcode.png". Escaneie com o WhatsApp.');
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      console.log('❌ Conexão encerrada. Motivo:', reason);

      if (reason === DisconnectReason.loggedOut || reason === 401) {
        console.log('⚠️ Sessão inválida. Apague a pasta auth_info e execute o bot novamente.');
        process.exit(1);
      } else {
        console.log('🔁 Tentando reconectar...');
        startBot();
      }
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado com sucesso!');
    }
  });

  async function enviarAudio(path, sender) {
    try {
      if (!fs.existsSync(path)) {
        await sock.sendMessage(sender, { text: '⚠️ Áudio não encontrado no servidor.' });
        return;
      }
      await sock.sendPresenceUpdate('recording', sender);
      await new Promise(r => setTimeout(r, 1500));
      await sock.sendMessage(sender, {
        audio: fs.readFileSync(path),
        mimetype: 'audio/mpeg',
        ptt: true
      });
    } catch (err) {
      console.error('Erro ao enviar áudio:', err);
      await sock.sendMessage(sender, { text: '❌ Erro ao enviar o áudio. Tente novamente.' });
    }
  }

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe || mensagensProcessadas.has(msg.key.id)) return;
    mensagensProcessadas.add(msg.key.id);

    const sender = msg.key.remoteJid;
    const textoOriginal = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();
    const texto = textoOriginal.toLowerCase();
    const nomeLead = msg.pushName || '';

    if (texto === "1") return await enviarAudio('./info.mp3', sender);
    if (texto === "2") return await enviarAudio('./preco.mp3', sender);

    const chaveEncontrada = Object.keys(respostas).find(chave => texto === chave || texto.includes(chave));

    async function sendTypingThenMessage(text) {
      await sock.sendPresenceUpdate('composing', sender);
      await new Promise(r => setTimeout(r, 1500));
      await sock.sendPresenceUpdate('paused', sender);
      await sock.sendMessage(sender, { text });
    }

    if (chaveEncontrada) {
      const resposta = respostas[chaveEncontrada];
      const mensagem = typeof resposta === 'function' ? resposta(nomeLead) : resposta;
      await sendTypingThenMessage(mensagem);
    } else {
      await sendTypingThenMessage(`${nomeLead}, não entendi muito bem... Mas tô aqui pra te ajudar! Escolha uma opção abaixo:\n\n` +
        "1 - 📘 Informações sobre o curso\n" +
        "2 - 💳 Preço e formas de pagamento\n" +
        "3 - 🔗 Link direto para se inscrever\n" +
        "4 - ❓ Tirar dúvidas ou falar comigo"
      );
    }
  });
}

startBot();

// Servidor web simples para visualizar e baixar o QR Code (necessário no Render)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta atual (inclui qrcode.png)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.send(`
    <h2>🤖 Bot WhatsApp Ativo!</h2>
    <p>Escaneie o QR abaixo com seu WhatsApp:</p>
    <img src="/qrcode.png" alt="QR Code" width="300"/>
    <p><a href="/qrcode.png" download>📥 Baixar QR Code</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web rodando: http://localhost:${PORT}`);
});

