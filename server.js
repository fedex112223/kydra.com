const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const usersFilePath = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Leer usuarios desde el archivo JSON
const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

// Escribir usuarios en el archivo JSON
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    if (users.find(user => user.email === email)) {
        return res.status(400).send('User already exists');
    }
    users.push({ email, password });
    writeUsers(users);
    console.log(`Registrando usuario: ${email}`);
    res.redirect('/chat');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).send('Invalid credentials');
    }
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