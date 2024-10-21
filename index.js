const express = require('express');
const app = express();

// Permite receber dados em formato JSON
app.use(express.json());

// Endpoint que receberá o webhook da Lastlink
app.post('/webhook/lastlink', (req, res) => {
    const event = req.body;

    console.log('Evento capturado:', event);

    // Você pode processar os dados aqui, salvar no banco ou enviar para outro lugar
    // Por enquanto, vamos apenas responder que recebemos
    res.status(200).send('Evento recebido com sucesso');
});

// Definindo a porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
