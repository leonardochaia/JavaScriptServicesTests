import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

export class RequestLoggerInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`Request URL: ${request.url}`);
        if (request.headers.keys().length) {
            console.log(`Request Headers: ${JSON.stringify(request.headers)}`);
        }
        return next.handle(request)
            .pipe(catchError((e: HttpErrorResponse) => {
                console.error(`Request Failed: ${request.url}`);
                console.error(e);
                return ErrorObservable.create(e);
            }));
    }
}
