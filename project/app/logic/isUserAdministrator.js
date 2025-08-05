import { getPayloadFromToken } from './helper/getPayloadFromToken'
import { data } from '../data'

export const isUserAdministrator = () => {
    try {
        const payload = getPayloadFromToken(data.getToken())

        const { role } = payload

        return role === 'admin'
    } catch {
        return false
    }
}
