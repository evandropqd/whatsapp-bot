
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));
const userStage = {};

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname || 'amigo(a)';
    const userId = msg.from;
    const input = msg.body.trim().toLowerCase();

    if (input.match(/^(menu|oi|olá|ola|iniciar)$/) && userId.endsWith('@c.us')) {
        userStage[userId] = 'main';
        await delay(2000);
        await client.sendMessage(userId, `Olá ${name.split(" ")[0]}! Tudo bem? Escolha uma das opções a seguir:

1: Terapias
2: Apenas conversar com você`);
        return;
    }

    if (!userStage[userId]) return;

    if (userStage[userId] === 'main') {
        if (input === '1') {
            userStage[userId] = 'terapias';
            await delay(2000);
            await client.sendMessage(userId, `Escolha a terapia:

1: Constelação Familiar
2: Mapa Numerológico`);
            return;
        }
        if (input === '2') {
            userStage[userId] = null;
            await delay(2000);
            await client.sendMessage(userId, 'Fique à vontade para conversar comigo! Estou aqui para te ouvir.');
            return;
        }
    }

    if (userStage[userId] === 'terapias') {
        if (input === '1') {
            userStage[userId] = 'constelacao_confirma';
            const textoConstelacao = `A Constelação Familiar é uma abordagem terapêutica sistêmica desenvolvida por Bert Hellinger. Ela permite observar as dinâmicas ocultas que atuam dentro de um sistema familiar, trazendo uma nova perspectiva sobre situações da vida pessoal, profissional e afetiva.

Muitas vezes, vivemos dificuldades ou bloqueios emocionais que podem estar ligados a traumas e dinâmicas familiares ocultas. A Constelação permite trazer à luz essas questões e restaurar o equilíbrio dentro do sistema familiar.

Esse processo pode ser feito individualmente ou em grupo e traz clareza para diversos aspectos da vida, como relacionamentos, prosperidade e bem-estar.

Gostaria de agendar a sua? O valor da sessão é R$350,00.

Assista um vídeo explicativo:
https://youtube.com/shorts/qaU_4JDdC2s?feature=share

Digite: Sim ou Não.

1: Sim
2: Não`;
            await delay(2000);
            await client.sendMessage(userId, textoConstelacao);
            return;
        }
        if (input === '2') {
            userStage[userId] = 'mapa_confirma';
            const textoMapa = `O Mapa Numerológico é uma ferramenta poderosa de autoconhecimento que revela características profundas sobre sua personalidade, missão de vida e principais desafios. Com base na análise dos números do seu nome completo e da sua data de nascimento, o mapa traz informações valiosas sobre seus potenciais, comportamentos e caminhos de evolução.

Essa leitura ajuda a entender como certos padrões podem estar se repetindo ao longo da sua vida e quais são as oportunidades que você pode aproveitar de acordo com a sua vibração numérica.

Além de descrever aspectos como talentos naturais, pontos a desenvolver e tendências para o futuro, o Mapa Numerológico também aponta influências que podem impactar relacionamentos, carreira e questões emocionais.

Esse processo oferece uma visão clara sobre o momento atual e orientações para que você possa tomar decisões mais conscientes e alinhadas com seu propósito.

Tem interesse em fazer o seu Mapa Numerológico?
O valor da leitura completa é R$350,00.

Assista um vídeo explicativo:
https://youtube.com/shorts/vwYAIN_TLYI

1: Sim
2: Não`;
            await delay(2000);
            await client.sendMessage(userId, textoMapa);
            return;
        }
    }

    if (userStage[userId] === 'constelacao_confirma') {
        if (input === '1') {
            userStage[userId] = 'constelacao_horario';
            await delay(2000);
            await client.sendMessage(userId, `Qual o melhor período para você?

1: Manhã
2: Tarde
3: Noite`);
            return;
        }
        if (input === '2') {
            userStage[userId] = null;
            await delay(2000);
            await client.sendMessage(userId, 'Sem problemas! Caso tenha dúvidas ou queira conversar, estou à disposição.');
            return;
        }
    }

    if (userStage[userId] === 'constelacao_horario') {
        if (input === '1' || input === '2' || input === '3') {
            userStage[userId] = null;
            await delay(2000);
            await client.sendMessage(userId, 'Perfeito! Aguarde nosso contato para agendarmos sua sessão.');
            return;
        }
    }

    if (userStage[userId] === 'mapa_confirma') {
        if (input === '1') {
            userStage[userId] = null;
            await delay(2000);
            await client.sendMessage(userId, 'Perfeito! Em breve entraremos em contato para continuar o processo.');
            return;
        }
        if (input === '2') {
            userStage[userId] = null;
            await delay(2000);
            await client.sendMessage(userId, 'Tudo bem! Se precisar de mais informações, é só me chamar.');
            return;
        }
    }
});
