import { Injectable } from '@nestjs/common';

@Injectable({})
export class UtilityService {
  constructor() {}

  decodeAccessToken(cookie: string) {
    const [token] = cookie
      ?.split(';')
      .filter((item: string) => item.includes('access_token'));
    const [_, access_token] = token.split('=');
    return access_token;
  }

  getTableNameFromRoute(route_path: string) {
    const [table_name] = route_path
      .split('/')
      .filter((item: string) => item != '');
    return table_name;
  }
}
