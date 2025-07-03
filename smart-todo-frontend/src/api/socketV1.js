let socket = null;
let reconnectTimeout = null;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000/ws/tasks/';

export const connectWebSocket = (onMessage, onOpen, onClose, onError, retry = true) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.warn('WebSocket already connected');
    return;
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = event => {
    console.log('[WebSocket Open]', event);
    if (onOpen) onOpen(event);
  };

  socket.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      console.log('[WebSocket Message]', data);
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error('WebSocket message parse error:', err);
    }
  };

  socket.onerror = error => {
    console.error('[WebSocket Error]', error);
    if (onError) onError(error);
  };

  socket.onclose = event => {
    console.warn('[WebSocket Closed]', event);
    if (onClose) onClose(event);

    if (retry) {
      reconnectTimeout = setTimeout(() => {
        console.log('[WebSocket Reconnecting]');
        connectWebSocket(onMessage, onOpen, onClose, onError, retry);
      }, 3000); // Reconnect after 3s
    }
  };
};

export const sendMessage = data => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn('WebSocket is not open. Message not sent:', data);
  }
};

export const closeWebSocket = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (socket) {
    socket.close();
    socket = null;
  }
};

export const getSocket = () => socket;
