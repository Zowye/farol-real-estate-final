export default defineEventHandler(async (event) => {
  return {
    message: 'pong',
    timestamp: new Date().toISOString()
  }
})
