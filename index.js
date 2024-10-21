const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');  // Usando o pacote mysql2
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

// Função para conectar ao MySQL e inserir dados
const insertIntoDatabase = async (name, email) => {
    try {
        // Conexão com o banco de dados
        const connection = await mysql.createConnection({
            host: 'srv1576.hstgr.io',
            user: 'u388516662_OneMi',
            password: 'Sapo99gordo!',
            database: 'u388516662_OneMi'
        });

        // Query de inserção
        const query = 'INSERT INTO vendas (nome_cliente, email_cliente) VALUES (?, ?)';
        await connection.execute(query, [name, email]);

        console.log('Dados inseridos com sucesso no banco de dados!');
        await connection.end();

        // Envia um log ao Discord informando que os dados foram inseridos
        await sendDiscordMessage('---> Enviado Email e Name para o DB\n---> Comprador Registrado no DB');
    } catch (error) {
        console.error('Erro ao inserir no banco de dados:', error.message);

        // Envia um log ao Discord informando que houve um erro na inserção
        await sendDiscordMessage(`Erro ao inserir no banco de dados: ${error.message}`);
    }
};

// Endpoint que receberá os eventos da Lastlink
app.post('/webhook/lastlink', async (req, res) => {
    const event = req.body;

    // Extrai os campos relevantes do evento
    const buyer = event.Data?.Buyer || {};
    const { Email, Name, PhoneNumber, Document } = buyer;

    // Monta a mensagem inicial para enviar ao Discord com os detalhes do comprador
    const discordMessage = `
    **Novo Evento Recebido:**
    **Email:** ${Email || 'N/A'}
    **Name:** ${Name || 'N/A'}
    **PhoneNumber:** ${PhoneNumber || 'N/A'}
    **Document:** ${Document || 'N/A'}
    `;

    // Log para verificar no console o que foi capturado
    console.log('Evento capturado da Lastlink:', discordMessage);

    // Envia a mensagem inicial para o Discord
    await sendDiscordMessage(discordMessage);

    // Insere os dados no banco de dados se estiverem disponíveis
    if (Email && Name) {
        await insertIntoDatabase(Name, Email);
    } else {
        const warningMessage = 'Email ou Nome não disponíveis, nada será inserido no banco de dados.';
        console.log(warningMessage);

        // Envia uma mensagem para o Discord informando que os dados não foram inseridos
        await sendDiscordMessage(warningMessage);
    }

    // Retorna a resposta para Lastlink
    res.status(200).send('Evento recebido, enviado ao Discord e processado');
});

// Define a porta do servidor e envia a mensagem "To online" para o Discord quando o servidor inicia
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Envia uma mensagem para o Discord informando que o servidor está online
    await sendDiscordMessage('To online: Servidor iniciado e conectado com o Discord!');
});
