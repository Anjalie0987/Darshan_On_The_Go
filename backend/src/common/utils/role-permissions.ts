import { AdminRole } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

export const RolePermissions: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(Permission),
  
  [AdminRole.ADMIN]: [
    Permission.TempleCreate,
    Permission.TempleUpdate,
    Permission.TempleDelete,
    Permission.TemplePublish,
    Permission.TempleView,
    Permission.UserView,
    Permission.AnalyticsView,
  ],
  
  [AdminRole.TEMPLE_MANAGER]: [
    Permission.TempleCreate,
    Permission.TempleUpdate,
    Permission.TemplePublish,
    Permission.TempleView,
    Permission.AnalyticsView,
  ],
  
  [AdminRole.CONTENT_MANAGER]: [
    Permission.TempleUpdate,
    Permission.TempleView,
  ],
  
  [AdminRole.VIEWER]: [
    Permission.TempleView,
    Permission.UserView,
    Permission.AnalyticsView,
  ],
};
