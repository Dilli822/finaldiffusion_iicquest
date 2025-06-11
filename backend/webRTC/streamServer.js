import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const broadcasters = new Map();
const viewers = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    let data;

    try {
      data = JSON.parse(message);
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    const { type } = data;

    switch (type) {
      case "broadcaster": {
        const { broadcasterId } = data;
        if (!broadcasterId) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "No broadcasterId provided",
            })
          );
          return;
        }
        broadcasters.set(broadcasterId, ws);
        ws.broadcasterId = broadcasterId;
        break;
      }

      case "viewer": {
        const { broadcasterId, viewerId, viewerName } = data;

        if (!broadcasterId || !viewerId) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Missing broadcasterId or viewerId",
            })
          );
          return;
        }

        const broadcasterWs = broadcasters.get(broadcasterId);
        if (!broadcasterWs) {
          ws.send(
            JSON.stringify({ type: "error", message: "Broadcaster not found" })
          );
          return;
        }

        viewers.set(viewerId, { ws, broadcasterId, viewerName }); // store viewerName here

        ws.send(JSON.stringify({ type: "viewer-id-confirmed", viewerId }));

        // Send viewerId and viewerName to broadcaster
        broadcasterWs.send(
          JSON.stringify({ type: "viewer", viewerId, viewerName })
        );
        break;
      }

      case "offer": {
        const { viewerId } = data;
        const viewer = viewers.get(viewerId);
        if (viewer) {
          viewer.ws.send(JSON.stringify(data));
        }
        break;
      }

      case "answer": {
        const { broadcasterId } = data;
        const broadcaster = broadcasters.get(broadcasterId);
        if (broadcaster) {
          broadcaster.send(JSON.stringify(data));
        }
        break;
      }

      case "ice-candidate": {
        const { to, viewerId, broadcasterId } = data;
        if (to === "viewer") {
          const viewer = viewers.get(viewerId);
          if (viewer) viewer.ws.send(JSON.stringify(data));
        } else if (to === "broadcaster") {
          const broadcaster = broadcasters.get(broadcasterId);
          if (broadcaster) broadcaster.send(JSON.stringify(data));
        }
        break;
      }
      case "leave": {
        const { viewerId, broadcasterId } = data;

        if (viewerId) {
          viewers.delete(viewerId);

          const broadcasterWs = broadcasters.get(broadcasterId);
          if (broadcasterWs) {
            broadcasterWs.send(
              JSON.stringify({ type: "viewer-left", viewerId })
            );
          }
        }
        break;
      }

      default:
        ws.send(
          JSON.stringify({ type: "error", message: "Unknown message type" })
        );
    }
  });

  ws.on("close", () => {
    if (ws.broadcasterId) {
      broadcasters.delete(ws.broadcasterId);
    }
    if (ws.viewerId) {
      viewers.delete(ws.viewerId);
      const broadcaster = broadcasters.get(ws.broadcasterId);
      if (broadcaster) {
        broadcaster.send(
          JSON.stringify({ type: "viewer-left", viewerId: ws.viewerId })
        );
      }
    }
  });
});

console.log("Signaling server running on ws://localhost:8080");
