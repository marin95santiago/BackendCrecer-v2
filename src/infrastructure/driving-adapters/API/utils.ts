import permissionList from './permission.json'

/**
 * Validation
 * @param permission Permission to validate
 * @param userPermissions Session user permissions
 * @param doesSuperAdminHavePermission Does the super administrator have permission?
 * @returns if user has the permission: true, otherwise false
 */
export const validatePermission = (permission: string, userPermissions: string[], doesSuperAdminHavePermission: boolean): boolean => {
  let havePermission = false
  if (doesSuperAdminHavePermission) {
    havePermission = userPermissions.some(element => element === permissionList.super_admin)
    if (havePermission) return true
  }

  havePermission = userPermissions.some(element => element === permission)
  return havePermission
}
