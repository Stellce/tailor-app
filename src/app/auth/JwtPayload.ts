import * as jwt from 'jwt-decode';
export interface TailorJwtPayload extends jwt.JwtPayload {
  roles: string;
}
