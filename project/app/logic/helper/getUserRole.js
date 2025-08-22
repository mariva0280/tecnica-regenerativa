import { data } from '../../data'
import { getPayloadFromToken } from './getPayloadFromToken'

export const getUserRole = () => {
    const token = data.getToken()
    if (!token) return null

    try {
        const payload = getPayloadFromToken(token)

        return payload.role || 'regular'
    } catch {
        return null
    }
}