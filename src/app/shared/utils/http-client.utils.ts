import { HttpParams } from '@angular/common/http';

export function convertObjectToHttpParams(params: Record<string, string | number>): HttpParams {
  const stringifiedParams = Object.entries(params).reduce(
    (result, [paramName, paramValue]) => ({ ...result, [paramName]: String(paramValue) }),
    {} as Record<string, string>
  );

  return new HttpParams({ fromObject: stringifiedParams });
}
