const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./models/index');
const enqueteRoutes = require('./routes/enqueteRoutes');
const opcaoRoutes = require('./routes/opcaoRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/enquetes', enqueteRoutes);
app.use('/opcoes', opcaoRoutes);

// Iniciar servidor e conectar ao banco
sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});
