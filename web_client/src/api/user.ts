import { BaseAPI } from './base';

export interface IUserType {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  date_joined?: string;
  password?: string;
}

class _MeAPI extends BaseAPI<IUserType> {
  constructor() {
    super('auth/me/', ['get']);
  }

  get() {
    return this.http.get<IUserType>(this.apiPath);
  }
}

class _AuthAPI extends BaseAPI<IUserType> {
  constructor() {
    super('auth/', []);
  }

  login(username: string, password: string) {
    return this.http.post(this.apiPath + 'login/', {
      username: username,
      password: password,
    });
  }

  logout() {
    return this.http.post(this.apiPath + 'logout/');
  }

  signUp(user: IUserType) {
    return this.http.post(this.apiPath + 'sign-up/', user);
  }
}

export const MeAPI = new _MeAPI();
export const AuthAPI = new _AuthAPI();
