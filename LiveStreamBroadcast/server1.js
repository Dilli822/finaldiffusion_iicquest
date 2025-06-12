const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const broadcasters = new Map(); // broadcasterId => ws
const viewers = new Map(); // viewerId => { ws, broadcasterId }

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      return;
    }

    switch (data.type) {
      case 'broadcaster':
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId provided' }));
          return;
        }
        broadcasters.set(data.broadcasterId, ws);
        ws.broadcasterId = data.broadcasterId;
        break;

      case 'viewer':
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId provided' }));
          return;
        }
        const bWs = broadcasters.get(data.broadcasterId);
        if (!bWs) {
          ws.send(JSON.stringify({ type: 'error', message: 'Broadcaster not found' }));
          return;
        }
        const viewerId = generateId();
        viewers.set(viewerId, { ws, broadcasterId: data.broadcasterId });
        ws.viewerId = viewerId;
        ws.send(JSON.stringify({ type: 'viewer-id', viewerId }));
        // Notify broadcaster
        bWs.send(JSON.stringify({ type: 'viewer', viewerId }));
        break;

      case 'offer':
        {
          // broadcaster sends offer to viewer
          const v = viewers.get(data.viewerId);
          if (v) {
            v.ws.send(JSON.stringify(data));
          }
        }
        break;

      case 'answer':
        {
          // viewer sends answer to broadcaster
          const b = broadcasters.get(data.broadcasterId);
          if (b) {
            b.send(JSON.stringify(data));
          }
        }
        break;

      case 'ice-candidate':
        if (data.to === 'viewer') {
          const v = viewers.get(data.viewerId);
          if (v) v.ws.send(JSON.stringify(data));
        } else if (data.to === 'broadcaster') {
          const b = broadcasters.get(data.broadcasterId);
          if (b) b.send(JSON.stringify(data));
        }
        break;

      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  });

  ws.on('close', () => {
    if (ws.broadcasterId) {
      broadcasters.delete(ws.broadcasterId);
    }
    if (ws.viewerId) {
      viewers.delete(ws.viewerId);
    }
  });
});

console.log('Signaling server running on ws://localhost:8080');
