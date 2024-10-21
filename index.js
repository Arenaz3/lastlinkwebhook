const express = require('express');
const axios = require('axios'); // Para enviar requisições para o Discord
const app = express();

// Permite receber dados em formato JSON
app.use(express.json());

// URL do webhook do Discord
const discordWebhookUrl = 'https://discordapp.com/api/webhooks/1297712477882028052/NHrpruwyLnh7H6aAuX7r9qp_EaEVq4CKVhvvTV5G5xbIgp6oWlv7Pzc7XS7xeGV122Hg';

// Endpoint que receberá os eventos da Lastlink
app.post('/webhook/lastlink', async (req, res) => {
    const event = req.body;

    console.log('Evento capturado:', event);  // Log do evento

    // Monta a mensagem para enviar ao Discord
    const discordMessage = {
        content: `Evento Capturado: ${JSON.stringify(event, null, 2)}`
    };

    // Envia a mensagem para o Discord
    try {
        await axios.post(discordWebhookUrl, discordMessage);
        console.log('Evento enviado para o Discord com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar evento para o Discord:', error);
    }

    // Retorna a resposta para Lastlink
    res.status(200).send('Evento recebido e enviado ao Discord');
});

// Define a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
