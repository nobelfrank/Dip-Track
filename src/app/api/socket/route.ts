import { NextRequest } from 'next/server'
import { NextApiResponseServerIO } from '@/lib/websocket'

export async function GET(req: NextRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...')
    
    const { initSocket } = await import('@/lib/websocket')
    const io = initSocket(res.socket.server)
    res.socket.server.io = io
  }

  return new Response('Socket.IO server initialized', { status: 200 })
}