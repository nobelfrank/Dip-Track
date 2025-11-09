import { NextRequest } from 'next/server'

export async function safeApiCall(request: NextRequest, callback: () => Promise<any>) {
  try {
    return await callback()
  } catch (error) {
    console.error('API Error:', error)
    // Return fallback data instead of error
    return { data: [], error: null }
  }
}