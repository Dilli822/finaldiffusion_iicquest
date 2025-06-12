const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9080 });

const broadcasters = new Map(); // broadcasterId => ws
const viewers = new Map();      // viewerId => { ws, broadcasterId }

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function broadcastToRoom(broadcasterId, message, excludeWs = null) {
  // Send to broadcaster
  const broadcasterWs = broadcasters.get(broadcasterId);
  if (broadcasterWs && broadcasterWs !== excludeWs) {
    broadcasterWs.send(JSON.stringify(message));
  }
  
  // Send to all viewers in the room
  viewers.forEach((viewer, viewerId) => {
    if (viewer.broadcasterId === broadcasterId && viewer.ws !== excludeWs) {
      const messageWithViewerId = { ...message, viewerId };
      viewer.ws.send(JSON.stringify(messageWithViewerId));
    }
  });
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
        ws.broadcasterId = data.broadcasterId;

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

      case 'chat-message': {
        if (!data.broadcasterId || !data.message) {
          ws.send(JSON.stringify({ type: 'error', message: 'Missing broadcasterId or message in chat' }));
          return;
        }

        // Validate message length and content
        if (data.message.length > 500) {
          ws.send(JSON.stringify({ type: 'error', message: 'Message too long' }));
          return;
        }

        console.log(`Chat message from ${data.from}: ${data.message}`);

        // Broadcast chat message to all participants in the room except sender
        const chatMessage = {
          type: 'chat-message',
          message: data.message,
          from: data.from,
          timestamp: new Date().toISOString()
        };

        if (data.from === 'broadcaster') {
          // Message from broadcaster - send to all viewers
          viewers.forEach((viewer, viewerId) => {
            if (viewer.broadcasterId === data.broadcasterId) {
              viewer.ws.send(JSON.stringify(chatMessage));
            }
          });
        } else if (data.from === 'viewer' && data.viewerId) {
          // Message from viewer - send to broadcaster and other viewers
          chatMessage.viewerId = data.viewerId;
          
          // Send to broadcaster
          const broadcasterWs = broadcasters.get(data.broadcasterId);
          if (broadcasterWs) {
            broadcasterWs.send(JSON.stringify(chatMessage));
          }
          
          // Send to other viewers in the same room
          viewers.forEach((viewer, viewerId) => {
            if (viewer.broadcasterId === data.broadcasterId && viewerId !== data.viewerId) {
              viewer.ws.send(JSON.stringify(chatMessage));
            }
          });
        }
        break;
      }

      case 'leave': {
        if (ws.viewerId) {
          const viewer = viewers.get(ws.viewerId);
          if (viewer) {
            // Notify broadcaster that viewer left
            const broadcasterWs = broadcasters.get(viewer.broadcasterId);
            if (broadcasterWs) {
              broadcasterWs.send(JSON.stringify({ 
                type: 'viewer-left', 
                viewerId: ws.viewerId 
              }));
            }
            viewers.delete(ws.viewerId);
            console.log(`Viewer ${ws.viewerId} left room ${viewer.broadcasterId}`);
          }
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
    if (ws.broadcasterId && broadcasters.get(ws.broadcasterId) === ws) {
      // Broadcaster disconnected - notify all viewers
      viewers.forEach((viewer, viewerId) => {
        if (viewer.broadcasterId === ws.broadcasterId) {
          viewer.ws.send(JSON.stringify({ type: 'broadcaster-disconnected' }));
        }
      });
      
      // Remove all viewers from this broadcaster's room
      const viewersToRemove = [];
      viewers.forEach((viewer, viewerId) => {
        if (viewer.broadcasterId === ws.broadcasterId) {
          viewersToRemove.push(viewerId);
        }
      });
      viewersToRemove.forEach(viewerId => viewers.delete(viewerId));
      
      broadcasters.delete(ws.broadcasterId);
      console.log(`Broadcaster ${ws.broadcasterId} connection closed`);
    }
    
    if (ws.viewerId) {
      const viewer = viewers.get(ws.viewerId);
      if (viewer) {
        // Notify broadcaster that viewer left
        const broadcasterWs = broadcasters.get(viewer.broadcasterId);
        if (broadcasterWs) {
          broadcasterWs.send(JSON.stringify({ 
            type: 'viewer-left', 
            viewerId: ws.viewerId 
          }));
        }
      }
      viewers.delete(ws.viewerId);
      console.log(`Viewer ${ws.viewerId} connection closed`);
    }
  });
});

console.log('Signaling server with chat support running on ws://localhost:9080');