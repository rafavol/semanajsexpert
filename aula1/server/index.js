const server = require('http').createServer((request, response) => {
    response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    });
    response.end('AAEEEE');
});

const socketIo = require('socket.io');
const io = socketIo(server, {
    cors: {
        origin: '*',
        credential: false
    }
})

io.on('connection', socket => {
    console.log('connection', socket.id);
    socket.on('join-room', (roomId, userId) => {
        //adiciona os usuários na mesma sala
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('disconnect', () => {
            console.log('disconnected', roomId, userId);
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        })
    })
})

const starServer = () => {
    const { address, port} = server.address();
    console.info(`app runnin at ${address}:${port}`);
}

server.listen(process.env.PORT || 3000, starServer)
