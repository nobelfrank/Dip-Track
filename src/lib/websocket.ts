import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import { NextApiResponse } from 'next'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join-room', (room: string) => {
      socket.join(room)
      console.log(`Socket ${socket.id} joined room: ${room}`)
    })

    socket.on('leave-room', (room: string) => {
      socket.leave(room)
      console.log(`Socket ${socket.id} left room: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

export const emitToRoom = (io: SocketIOServer, room: string, event: string, data: any) => {
  io.to(room).emit(event, data)
}

export const broadcastUpdate = (io: SocketIOServer, type: string, data: any) => {
  io.emit('update', { type, data, timestamp: new Date().toISOString() })
}