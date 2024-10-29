const express = require('express');
const app = express();
app.use(express.json()); 

const handleError = require('./handleError.js');
const logger = require('./logger.js')

app.use(logger);

app.get('/', (req, res) => {
  res.statusCode(200).send('Welcome to GM2 Lucas')
});

app.get('/error', (req, res) => {
  const error = new Error('Not hiring lucas is a mistake')
  throw error
});


app.post('/', (req, res) => {
    res.json({
        message: 'Datos recibidos',
        data: req.body
    });
});

app.use(handleError)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
