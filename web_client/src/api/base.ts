import axios from 'axios';
import { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export class BaseAPI<ResponseType> {
  apiPath: string;
  http: AxiosInstance;
  methods: string[];

  constructor(apiPath: string, methods: string[]) {
    this.apiPath = apiPath;
    this.methods = methods;
    this.http = axios.create({
      baseURL: '/api/v1/',
    });

    this.http.interceptors.request.use((request) => this.authHandler(request));
  }

  list(params?: object, apiPath?: string) {
    this.isMethodSupported('list');
    return this.http.get<ResponseType[]>(this.getPath(apiPath), {
      params: params,
    });
  }

  get(id: string | number, apiPath?: string) {
    this.isMethodSupported('get');
    return this.http.get<ResponseType>(this.getPath(apiPath) + id + '/');
  }

  update(id: string | number, data: ResponseType, apiPath?: string) {
    this.isMethodSupported('update');
    return this.http.put<ResponseType>(this.getPath(apiPath) + id + '/', data);
  }

  create(data: ResponseType, apiPath?: string) {
    this.isMethodSupported('create');
    return this.http.post<ResponseType>(this.getPath(apiPath), data);
  }

  delete(id: string | number, apiPath?: string) {
    this.isMethodSupported('delete');
    return this.http.delete(this.getPath(apiPath) + id + '/');
  }

  patch(id: string | number, data: ResponseType, apiPath?: string) {
    this.isMethodSupported('patch');
    return this.http.patch<ResponseType>(
      this.getPath(apiPath) + id + '/',
      data,
    );
  }

  getPath(apiPath: string | undefined) {
    return apiPath || this.apiPath;
  }

  private isMethodSupported(method: string) {
    if (!this.methods.includes(method)) {
      throw new ReferenceError(`Method ${method} is not supported`);
    }
  }

  private async authHandler(request) {
    request.headers['X-CSRFToken'] = Cookies.get('csrftoken');

    return request;
  }
}
