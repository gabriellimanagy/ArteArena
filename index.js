const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const { action } = req.body;

  if (action.type === 'updateCard' && action.data.listAfter) {
    const cardName = action.data.card.name;
    const listBefore = action.data.listBefore.name;
    const listAfter = action.data.listAfter.name;

    // Aqui você pode adicionar a lógica para realizar uma ação com base no movimento do card
    console.log(`O card '${cardName}' foi movido da lista '${listBefore}' para a lista '${listAfter}'`);
  }

  res.sendStatus(200);
});

app.get('/consultar', (req, res) => {
  const url = "https://portal.kangu.com.br/tms/transporte/simular";
  const token = "b4b9beb7bce0c1dd89f43d5e9c2f560907b5471f7e44ba710bb43633acccc249";
  const cepOrigem = "04781-000";
  const cepDestino = "04829-220";
  const produtos = [
    {
      "vlrMerc": 600,
      "pesoMerc": 10,
      "produtos": [
        {
          "peso": 5,
          "altura": 5,
          "largura": 5,
          "comprimento": 5,
          "valor": 300,
          "quantidade": 2
        }
      ]
    }
  ];
  const body = JSON.stringify({
    "cep_origem": cepOrigem,
    "cep_destino": cepDestino,
    "produtos": produtos
  });
  fetch(url, {
    method: "POST",
    headers: {
      "token": token,
      "Content-Type": "application/json"
    },
    body: body
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erro ao consultar API externa' });
    });
});

app.listen(3005, () => {
  console.log('Servidor iniciado na porta 3005');
});

