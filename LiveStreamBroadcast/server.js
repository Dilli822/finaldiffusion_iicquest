const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9080 });

const broadcasters = new Map(); // broadcasterId => ws
const viewers = new Map();      // viewerId => { ws, broadcasterId }

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

wss.on('connection', (ws) => {
  console.log('New connection established');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      return;
    }

    switch (data.type) {
      case 'broadcaster': {
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId provided' }));
          return;
        }
        broadcasters.set(data.broadcasterId, ws);
        ws.broadcasterId = data.broadcasterId;
        console.log(`Broadcaster registered: ${data.broadcasterId}`);
        break;
      }

      case 'viewer': {
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId provided' }));
          return;
        }
        const broadcasterWs = broadcasters.get(data.broadcasterId);
        if (!broadcasterWs) {
          ws.send(JSON.stringify({ type: 'error', message: 'Broadcaster not found' }));
          return;
        }
        const viewerId = generateId();
        viewers.set(viewerId, { ws, broadcasterId: data.broadcasterId });
        ws.viewerId = viewerId;

        ws.send(JSON.stringify({ type: 'viewer-id', viewerId }));
        console.log(`Viewer registered: ${viewerId} for broadcaster: ${data.broadcasterId}`);

        // Notify broadcaster about new viewer
        broadcasterWs.send(JSON.stringify({ type: 'viewer', viewerId }));
        break;
      }

      case 'offer': {
        if (!data.viewerId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No viewerId in offer' }));
          console.error('Offer missing viewerId:', data);
          return;
        }
        const viewer = viewers.get(data.viewerId);
        if (viewer) {
          viewer.ws.send(JSON.stringify(data));
          console.log(`Offer forwarded to viewer ${data.viewerId}`);
        } else {
          console.error(`Offer: viewer ${data.viewerId} not found`);
        }
        break;
      }

      case 'answer': {
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId in answer' }));
          console.error('Answer missing broadcasterId:', data);
          return;
        }
        const broadcasterWs = broadcasters.get(data.broadcasterId);
        if (broadcasterWs) {
          broadcasterWs.send(JSON.stringify(data));
          console.log(`Answer forwarded to broadcaster ${data.broadcasterId}`);
        } else {
          console.error(`Answer: broadcaster ${data.broadcasterId} not found`);
        }
        break;
      }

      case 'ice-candidate': {
        if (data.to === 'viewer') {
          if (!data.viewerId) {
            ws.send(JSON.stringify({ type: 'error', message: 'No viewerId in ice-candidate' }));
            console.error('ICE candidate missing viewerId:', data);
            return;
          }
          const viewer = viewers.get(data.viewerId);
          if (viewer) {
            viewer.ws.send(JSON.stringify(data));
            console.log(`ICE candidate forwarded to viewer ${data.viewerId}`);
          } else {
            console.error(`ICE candidate: viewer ${data.viewerId} not found`);
          }
        } else if (data.to === 'broadcaster') {
          if (!data.broadcasterId) {
            ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId in ice-candidate' }));
            console.error('ICE candidate missing broadcasterId:', data);
            return;
          }
          const broadcasterWs = broadcasters.get(data.broadcasterId);
          if (broadcasterWs) {
            broadcasterWs.send(JSON.stringify(data));
            console.log(`ICE candidate forwarded to broadcaster ${data.broadcasterId}`);
          } else {
            console.error(`ICE candidate: broadcaster ${data.broadcasterId} not found`);
          }
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid "to" in ice-candidate' }));
          console.error('Invalid "to" field in ice-candidate:', data);
        }
        break;
      }

      default: {
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        console.error('Unknown message type:', data.type);
      }
    }
  });

  ws.on('close', () => {
    if (ws.broadcasterId) {
      broadcasters.delete(ws.broadcasterId);
      console.log(`Broadcaster ${ws.broadcasterId} connection closed`);
    }
    if (ws.viewerId) {
      viewers.delete(ws.viewerId);
      console.log(`Viewer ${ws.viewerId} connection closed`);
    }
  });
});

console.log('Signaling server running on ws://localhost:8080');
