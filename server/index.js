require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // escolhera a port das variáveis de ambiente ou o valor padrão 5000
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json()); // libera o acesso pra todos os domínios (MUDAR DEPOIS)

app.get('/', (req, res) => {
    res.json({message: 'API funcionando!'});
});

app.post('/generateimage', async (req, res) => {
    const { prompt, size = '1024x1024'} = req.body;

    if (!prompt) {
        return res.status(400).json({error: 'O campo prompt é obrigatório.'});
    }

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                size: size,
                n: 1, // numero de imagens
                response_format: 'b64_json',
            }),
        });

        const data = await response.json();
        console.log(data);
        res.json({image: data.data[0].b64_json});
    }
    catch (error) {
        console.error('Erro ao fazer requisição para a OpenAI:', error);
        res.status(500).json({ error: 'Erro ao chamar a API da OpenAI.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

