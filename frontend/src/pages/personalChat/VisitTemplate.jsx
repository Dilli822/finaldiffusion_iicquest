<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebRTC Video Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .error-area {
            text-align: center;
            padding: 20px;
            background: rgba(255, 0, 0, 0.3);
            border-radius: 10px;
            margin-bottom: 20px;
            display: none;
        }
        
        .error-area h2 {
            margin-top: 0;
            color: #ffcccb;
        }
        
        .error-area button {
            padding: 12px 25px;
            font-size: 16px;
            border: none;
            border-radius: 25px;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 5px;
        }
        
        .error-area button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .video-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        
        video {
            width: 320px;
            height: 240px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            background: #000;
        }
        
        .status {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            font-weight: bold;
        }
        
        .error {
            background: rgba(255, 0, 0, 0.3);
        }
        
        .success {
            background: rgba(0, 255, 0, 0.3);
        }
        
        .call-area {
            display: none;
        }

        .user-info {
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
        }

        .peer-list {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
        }

        .peer-list h3 {
            text-align: center;
            margin-bottom: 20px;
            color: #fff;
        }

        .peer-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .peer-item:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }

        .peer-name {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
        }

        .peer-status {
            font-size: 14px;
            color: #ccc;
            margin-left: 10px;
        }

        .call-btn {
            padding: 10px 20px;
            font-size: 14px;
            border: none;
            border-radius: 20px;
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .call-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .call-btn:disabled {
            background: rgba(255, 255, 255, 0.3);
            cursor: not-allowed;
            transform: none;
        }

        .hangup-btn {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            padding: 12px 25px;
            font-size: 16px;
            border: none;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 20px auto;
            display: block;
        }

        .hangup-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .hangup-btn:disabled {
            background: rgba(255, 255, 255, 0.3);
            cursor: not-allowed;
            transform: none;
            display: none;
        }

        .no-peers {
            text-align: center;
            color: #ccc;
            font-style: italic;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 WebRTC Video Chat</h1>
        
        <div id="errorArea" class="error-area">
            <h2>❌ No Username Cookie Found</h2>
            <p>Please set a username cookie to access the video chat.</p>
            <button id="setCookieBtn">Set Demo Cookie</button>
        </div>
        
        <div id="callArea" class="call-area">
            <div class="user-info">
                <span>Logged in as: <strong id="currentUser"></strong></span>
            </div>
            
            <div id="status" class="status">Connecting...</div>
            
            <div class="video-container">
                <div>
                    <h3>Your Video</h3>
                    <video id="localVideo" autoplay playsinline muted></video>
                </div>
                <div>
                    <h3>Remote Video</h3>
                    <video id="remoteVideo" autoplay playsinline></video>
                </div>
            </div>
            
            <button id="hangupButton" class="hangup-btn" disabled>📵 Hang Up</button>
            
            <div class="peer-list">
                <h3>👥 Online Users</h3>
                <div id="peerList">
                    <div class="no-peers">No other users online</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let localStream;
        let remoteStream;
        let peerConnection;
        let websocket;
        let localUsername;
        let isInCall = false;
        let currentCallTarget = null;
        const configuration = {
            'iceServers': [
                {'urls': 'stun:stun.l.google.com:19302'},
                {'urls': 'stun:stun1.l.google.com:19302'}
            ]
        };
        
        // DOM elements
        const errorArea = document.getElementById('errorArea');
        const callArea = document.getElementById('callArea');
        const setCookieBtn = document.getElementById('setCookieBtn');
        const currentUserSpan = document.getElementById('currentUser');
        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        const peerListDiv = document.getElementById('peerList');
        const hangupButton = document.getElementById('hangupButton');
        const status = document.getElementById('status');
        
        // Cookie helper functions
        function setCookie(name, value, days = 30) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = ${name}=${value};expires=${expires.toUTCString()};path=/;
        }
        
        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
        
        // Event listeners
        setCookieBtn.addEventListener('click', setDemoCookie);
        hangupButton.addEventListener('click', hangup);
        
        function updateStatus(message, type = '') {
            status.textContent = message;
            status.className = status ${type};
        }
        
        function setDemoCookie() {
            const demoUsers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'];
            const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
            
            setCookie('username', randomUser);
            updateStatus(Demo cookie set for user "${randomUser}". Refreshing..., 'success');
            
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
        
        function checkCookieAndLogin() {
            const savedUsername = getCookie('username');
            if (!savedUsername) {
                errorArea.style.display = 'block';
                callArea.style.display = 'none';
                return false;
            }
            
            localUsername = savedUsername;
            currentUserSpan.textContent = localUsername;
            errorArea.style.display = 'none';
            callArea.style.display = 'block';
            
            connectToServer();
            return true;
        }
        
        function connectToServer() {
            updateStatus('Connecting to server...', '');
            
            const wsUrl = window.location.protocol === 'https:' ? 'wss://localhost:8080' : 'ws://localhost:8080';
            websocket = new WebSocket(wsUrl);
            
            websocket.onopen = () => {
                console.log('WebSocket connected');
                updateStatus('Connected to server', 'success');
                sendSignalingMessage({type: 'login', username: localUsername});
                updateStatus('Ready to make calls', 'success');
            };
            
            websocket.onmessage = handleSignalingMessage;
            
            websocket.onclose = () => {
                updateStatus('Disconnected from server', 'error');
                setTimeout(() => {
                    if (!websocket || websocket.readyState === WebSocket.CLOSED) {
                        updateStatus('Attempting to reconnect...', '');
                        connectToServer();
                    }
                }, 3000);
            };
            
            websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                updateStatus('Connection error. Please try again.', 'error');
            };
        }
        
        function updatePeerList(users) {
            console.log('Updating peer list:', users);
            
            const availableUsers = users.filter(user => user !== localUsername);
            
            if (availableUsers.length === 0) {
                peerListDiv.innerHTML = '<div class="no-peers">No other users online</div>';
                updateStatus('No other users online', '');
            } else {
                peerListDiv.innerHTML = '';
                availableUsers.forEach(user => {
                    const peerItem = document.createElement('div');
                    peerItem.className = 'peer-item';
                    
                    const peerInfo = document.createElement('div');
                    peerInfo.innerHTML = `
                        <span class="peer-name">${user}</span>
                        <span class="peer-status">Online</span>
                    `;
                    
                    const callBtn = document.createElement('button');
                    callBtn.className = 'call-btn';
                    callBtn.textContent = '📞 Call';
                    callBtn.disabled = isInCall;
                    callBtn.onclick = () => initiateCall(user);
                    
                    peerItem.appendChild(peerInfo);
                    peerItem.appendChild(callBtn);
                    peerListDiv.appendChild(peerItem);
                });
                
                updateStatus(${availableUsers.length} user(s) online, 'success');
            }
        }
        
        function startLocalStream() {
            return new Promise((resolve, reject) => {
                updateStatus('Accessing camera and microphone...', '');
                
                navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240 },
                    audio: true
                })
                .then(stream => {
                    localStream = stream;
                    localVideo.srcObject = stream;
                    updateStatus('Camera and microphone ready', 'success');
                    resolve(stream);
                })
                .catch(error => {
                    console.error('Error accessing media devices:', error);
                    updateStatus('Error accessing camera/microphone. Please check permissions.', 'error');
                    reject(error);
                });
            });
        }
        
        function initiateCall(remoteUsername) {
            if (isInCall) {
                updateStatus('Already in a call', 'error');
                return;
            }
            
            currentCallTarget = remoteUsername;
            
            if (!localStream) {
                startLocalStream().then(() => {
                    updateStatus(Calling ${remoteUsername}..., '');
                    sendSignalingMessage({
                        type: 'call-request',
                        target: remoteUsername
                    });
                }).catch(() => {
                    updateStatus('Cannot make call without camera/microphone access', 'error');
                    currentCallTarget = null;
                });
            } else {
                updateStatus(Calling ${remoteUsername}..., '');
                sendSignalingMessage({
                    type: 'call-request',
                    target: remoteUsername
                });
            }
        }
        
        function call(remoteUsername) {
            if (isInCall) return;
            
            const proceedWithCall = () => {
                isInCall = true;
                currentCallTarget = remoteUsername;
                peerConnection = new RTCPeerConnection(configuration);
                
                localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });
            
                peerConnection.ontrack = event => {
                    console.log('Received remote stream');
                    remoteVideo.srcObject = event.streams[0];
                    remoteStream = event.streams[0];
                    updateStatus(Connected with ${remoteUsername}, 'success');
                };
            
                peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        sendSignalingMessage({
                            type: 'ice-candidate',
                            candidate: event.candidate,
                            target: remoteUsername
                        });
                    }
                };
                
                peerConnection.onconnectionstatechange = () => {
                    console.log('Connection state:', peerConnection.connectionState);
                    if (peerConnection.connectionState === 'connected') {
                        updateStatus(Connected with ${remoteUsername}, 'success');
                    } else if (peerConnection.connectionState === 'disconnected') {
                        updateStatus('Call disconnected', 'error');
                        hangup();
                    }
                };
            
                peerConnection.createOffer()
                    .then(offer => peerConnection.setLocalDescription(offer))
                    .then(() => {
                        sendSignalingMessage({
                            type: 'offer',
                            offer: peerConnection.localDescription,
                            target: remoteUsername
                        });
                    })
                    .catch(error => {
                        console.error('Error creating offer:', error);
                        updateStatus('Error creating call', 'error');
                        isInCall = false;
                        currentCallTarget = null;
                    });
            
                updateCallButtonStates();
                hangupButton.disabled = false;
            };
            
            if (!localStream) {
                startLocalStream().then(proceedWithCall).catch(error => {
                    updateStatus('Cannot start call without camera/microphone access', 'error');
                    currentCallTarget = null;
                });
            } else {
                proceedWithCall();
            }
        }
        
        function hangup() {
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            
            remoteVideo.srcObject = null;
            remoteStream = null;
            isInCall = false;
            
            hangupButton.disabled = true;
            updateCallButtonStates();
            
            updateStatus('Call ended', '');
            
            if (currentCallTarget) {
                sendSignalingMessage({
                    type: 'hangup',
                    target: currentCallTarget
                });
                currentCallTarget = null;
            }
        }
        
        function updateCallButtonStates() {
            const callButtons = document.querySelectorAll('.call-btn');
            callButtons.forEach(btn => {
                btn.disabled = isInCall;
            });
        }
        
        function sendSignalingMessage(message) {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                message.sender = localUsername;
                websocket.send(JSON.stringify(message));
            } else {
                updateStatus('Connection lost. Trying to reconnect...', 'error');
            }
        }
        
        function handleSignalingMessage(event) {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);

            switch(message.type) {
                case 'user-list':
                    updatePeerList(message.users);
                    break;
                case 'call-request':
                    handleCallRequest(message.sender);
                    break;
                case 'offer':
                    handleOffer(message.offer, message.sender);
                    break;
                case 'answer':
                    handleAnswer(message.answer);
                    break;
                case 'ice-candidate':
                    handleIceCandidate(message.candidate);
                    break;
                case 'hangup':
                    handleRemoteHangup();
                    break;
                case 'user-disconnected':
                    handleUserDisconnected(message.username);
                    break;
            }
        }
        
        function handleCallRequest(sender) {
            if (isInCall) {
                sendSignalingMessage({
                    type: 'busy',
                    target: sender
                });
                return;
            }
            
            updateStatus(Incoming call from ${sender}, '');
            
            if (confirm(📞 Incoming call from ${sender}. Do you want to answer?)) {
                if (!localStream) {
                    startLocalStream().then(() => {
                        call(sender);
                    }).catch(() => {
                        updateStatus('Cannot answer call without camera/microphone access', 'error');
                        sendSignalingMessage({
                            type: 'call-rejected',
                            target: sender
                        });
                    });
                } else {
                    call(sender);
                }
            } else {
                sendSignalingMessage({
                    type: 'call-rejected',
                    target: sender
                });
            }
        }
        
        function handleOffer(offer, sender) {
            if (isInCall) return;
            
            isInCall = true;
            currentCallTarget = sender;
            peerConnection = new RTCPeerConnection(configuration);
            
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
            
            peerConnection.ontrack = event => {
                remoteVideo.srcObject = event.streams[0];
                remoteStream = event.streams[0];
                updateStatus(Connected with ${sender}, 'success');
            };
            
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    sendSignalingMessage({
                        type: 'ice-candidate',
                        candidate: event.candidate,
                        target: sender
                    });
                }
            };
            
            peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => peerConnection.createAnswer())
                .then(answer => peerConnection.setLocalDescription(answer))
                .then(() => {
                    sendSignalingMessage({
                        type: 'answer',
                        answer: peerConnection.localDescription,
                        target: sender
                    });
                })
                .catch(error => {
                    console.error('Error handling offer:', error);
                    updateStatus('Error handling incoming call', 'error');
                    isInCall = false;
                    currentCallTarget = null;
                });
        
            updateCallButtonStates();
            hangupButton.disabled = false;
        }
        
        function handleAnswer(answer) {
            if (peerConnection) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                    .catch(error => {
                        console.error('Error handling answer:', error);
                        updateStatus('Error connecting call', 'error');
                    });
            }
        }
        
        function handleIceCandidate(candidate) {
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(error => {
                        console.error('Error adding ICE candidate:', error);
                    });
            }
        }
        
        function handleRemoteHangup() {
            hangup();
            updateStatus('Remote user ended the call', '');
        }
        
        function handleUserDisconnected(username) {
            if (isInCall && currentCallTarget === username) {
                hangup();
                updateStatus(${username} disconnected, 'error');
            }
        }
        
        // Initialize on page load
        window.addEventListener('load', () => {
            checkCookieAndLogin();
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (websocket) {
                websocket.close();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        });
    </script>
</body>
</html>