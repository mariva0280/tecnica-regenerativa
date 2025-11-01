export const getPayloadFromToken = token => {
    if (!token) throw new Error('Token is missing')

    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token format')

    try {
        const payloadB64 = parts[1]
        const payloadJSON = atob(payloadB64)
        const payload = JSON.parse(payloadJSON)

        return payload
    }  catch (error) {
        throw new Error('Failed to decode token payload')
    }
    
}