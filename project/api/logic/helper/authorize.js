import { AuthorizationError } from 'com'

export const assertRole = (role, allowed) => {
    if (!allowed.includes(role)) throw new AuthorizationError('not allowed')
}