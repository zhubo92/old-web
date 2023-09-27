export enum HttpCodeEnum {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export interface IQueryParams {
  page: number;
  pageSize: number;
  isPage?: 0 | 1;
}
