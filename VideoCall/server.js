const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const users = new Map();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'login':
                handleLogin(ws, data.username);
                break;
            case 'offer':
            case 'answer':
            case 'ice-candidate':
                sendToUser(data.target, JSON.stringify(data));
                break;
            case 'call-request':
                sendToUser(data.target, JSON.stringify(data));
                break;
        }
    });

    ws.on('close', () => {
        users.forEach((value, key) => {
            if (value === ws) {
                users.delete(key);
                broadcastUserList();
            }
        });
    });
});

function handleLogin(ws, username) {
    console.log(`User ${username} logged in`);
    users.set(username, ws);
    ws.username = username;
    broadcastUserList();
}

function broadcastUserList() {
    const userList = Array.from(users.keys());
    console.log('Broadcasting user list:', userList);
    const message = JSON.stringify({
        type: 'user-list',
        users: userList
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function sendToUser(username, message) {
    const userWs = users.get(username);
    if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(message);
    }
}

console.log('WebSocket server is running on port 8080');
