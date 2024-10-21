const express = require('express');
const axios = require('axios');
const app = express();

// Permite receber dados em formato JSON
app.use(express.json());

// URL do webhook do Discord
const discordWebhookUrl = 'https://discordapp.com/api/webhooks/1297712477882028052/NHrpruwyLnh7H6aAuX7r9qp_EaEVq4CKVhvvTV5G5xbIgp6oWlv7Pzc7XS7xeGV122Hg';

// Função para enviar mensagem para o Discord
const sendDiscordMessage = async (message) => {
    try {
        await axios.post(discordWebhookUrl, { content: message });
        console.log('Mensagem enviada para o Discord com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar mensagem para o Discord:', error.response ? error.response.data : error.message);
    }
};

// Endpoint que receberá os eventos da Lastlink
app.post('/webhook/lastlink', async (req, res) => {
    const event = req.body;

    // Extrai os campos relevantes do evento
    const buyer = event.Data?.Buyer || {};

    const { Email, Name, PhoneNumber, Document } = buyer;

    // Monta a mensagem para enviar ao Discord com os campos solicitados
    const discordMessage = `
    **Novo Evento Recebido:**
    **Email:** ${Email || 'N/A'}
    **Name:** ${Name || 'N/A'}
    **PhoneNumber:** ${PhoneNumber || 'N/A'}
    **Document:** ${Document || 'N/A'}
    `;

    // Log para verificar no console o que foi capturado
    console.log('Evento capturado da Lastlink:', discordMessage);

    // Envia a mensagem para o Discord
    await sendDiscordMessage(discordMessage);

    // Retorna a resposta para Lastlink
    res.status(200).send('Evento recebido e enviado ao Discord');
});

// Define a porta do servidor e envia a mensagem "To online" para o Discord quando o servidor inicia
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Envia uma mensagem para o Discord informando que o servidor está online
    await sendDiscordMessage('To online: Servidor iniciado e conectado com o Discord!');
});
