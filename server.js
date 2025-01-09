const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    // Aquí puedes agregar la lógica para registrar al usuario
    console.log(`Registrando usuario: ${email}`);
    res.redirect('/chat');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Aquí puedes agregar la lógica para iniciar sesión del usuario
    console.log(`Iniciando sesión usuario: ${email}`);
    res.redirect('/chat');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('chatMessage', (msg) => {
        console.log('Mensaje recibido:', msg);
        io.emit('chatMessage', msg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});