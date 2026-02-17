'use client';

import { io, Socket } from 'socket.io-client';

/**
 * WebSocket 클라이언트 (Socket.io)
 * 설계서 Section 6.10: WebSocket API (실시간 협업)
 */

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/v1/ws';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
