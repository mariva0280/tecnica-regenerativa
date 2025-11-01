import { getUserRole } from './helper/getUserRole.js'

export const isUserRole = role => getUserRole() === role
export const hasAnyRole = roles => roles.includes(getUserRole() || 'regular')

export const canSeeStudentArea = () => hasAnyRole(['regular', 'curator', 'admin', 'superadmin'])
export const canCreateVideos = () => hasAnyRole(['curator', 'admin', 'superadmin'])
export const canManageWhiteList = () => hasAnyRole(['admin', 'superadmin'])
export const canManageUsers = () => hasAnyRole(['admin', 'superadmin']) 
export const canDeleteVideos = () => hasAnyRole(['admin', 'superadmin'])    
export const isAdminLike = () => hasAnyRole(['admin', 'superadmin'])
export const canAccessPanel = () => canCreateVideos() || canManageUsers() || canManageWhiteList()
export const canMigrateQuestions = () => hasAnyRole(['curator', 'admin', 'superadmin'])
