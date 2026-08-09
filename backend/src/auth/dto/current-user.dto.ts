import { UserRole } from '../../common/enums';

export class CurrentUserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  roles: UserRole[]; // Placeholder for future RBAC mapping
}
