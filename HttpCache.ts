import {Observable, EMPTY} from "rxjs";
import {HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {shareReplay, catchError} from "rxjs/operators";

@Injectable()
export class HttpCache extends HttpClient {
  private cache = {};

  getc<T>(url: string, options?: any, cacheTime?: number): Observable<T> {
    let key = url;
    if (options) {
      key = key + '|' + JSON.stringify(options);
    }
    if (this.cache[key]) {
      return this.cache[key];
    }
    this.cache[key] = super.get(url, options).pipe(
      shareReplay(1),
      catchError(err => {
        this.cache[key] = false;
        return EMPTY;
      }));
    if (cacheTime) {
      setTimeout(() => {
        this.cache[key] = false;
      }, cacheTime);
    }
    return this.cache[key];
  }
}
