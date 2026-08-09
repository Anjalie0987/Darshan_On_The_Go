import { CurrentUserDto } from './current-user.dto';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: CurrentUserDto;
}
