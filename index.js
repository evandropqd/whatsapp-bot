const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Cria o cliente com autenticação local persistente
const client = new Client({
    authStrategy: new LocalAuth(), // Usa a pasta .wwebjs_auth para salvar a sessão
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true // importante para rodar na nuvem
    }
});

// Gera QR Code no terminal (Render não mostra, mas útil localmente)
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('🔐 Escaneie o QR Code no seu celular!');
});

client.on('ready', () => {
    console.log('🤖 Bot conectado e pronto!');
});

client.on('message', message => {
    console.log(`📩 Mensagem recebida de ${message.from}: ${message.body}`);
    
    if (message.body.toLowerCase() === 'oi') {
        message.reply('Olá! Eu sou um bot do WhatsApp rodando na nuvem 😄');
    }
});

client.initialize();
