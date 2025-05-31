import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, Optional, signal } from '@angular/core';
import { catchError, map, Observable, retry, take, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private readonly URL = environment.Url;
  // private readonly URL = 'https://udemy-lpqr.onrender.com/api';
  errorMessage = signal<string>('');
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
      this.errorMessage.set(errorMessage);
      console.log(this.errorMessage(), '2');
    } else {
      // Server-side error
      switch (error.status) {
        case 500:
          errorMessage = 'Server Error!';
          break;
        case 503:
          errorMessage = 'Service Unavailable!';
          break;

        case 404:
          errorMessage = 'Resource not found!';
          break;
        case 401:
          errorMessage = 'Unauthorized access!';
          break;
        default:
          // errorMessage = 'An unknown error occurred!';
          errorMessage = error.error.message;
      }
    }
    console.log(error.error.message);
    this.errorMessage.set(errorMessage);
    // console.error(`Error occurred at ${error.url} - ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
  getAllData<T>(
    url: string,
    filter?: Record<string, string | number>
  ): Observable<T> {
    this.errorMessage.set(''); // إعادة التعيين هنا
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach((key) => {
        params = params.set(key, filter[key].toString());
      });
    }
    return this.http
      .get<T>(`${this.URL}${url}`, { params, withCredentials: true })
      .pipe(
        retry(1),
        catchError((error) => this.handleError(error))
      );
  }

  getOne<T>(url: string): Observable<T> {
    this.errorMessage.set(''); // إعادة التعيين هنا
    return this.http.get<T>(`${this.URL}${url}`).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  // إضافة عنصر جديد
  addNewData<T>(url: string, data?: T): Observable<T> {
    this.errorMessage.set(''); // إعادة التعيين هنا

    return this.http
      .post<T>(`${this.URL}${url}`, data, { withCredentials: true })
      .pipe(
        retry(1),
        catchError((error) => this.handleError(error))
      );
  }

  // تحديث عنصر
  updateData<T>(url: string, data: T): Observable<T> {
    this.errorMessage.set(''); // إعادة التعيين هنا

    return this.http
      .put<T>(`${this.URL}${url}`, data, { withCredentials: true })
      .pipe(
        retry(1),
        catchError((error) => this.handleError(error))
      );
  }

  // حذف عنصر
  deleteData<T>(url: string): Observable<T> {
    this.errorMessage.set(''); // إعادة التعيين هنا

    return this.http
      .delete<T>(`${this.URL}${url}`, { withCredentials: true })
      .pipe(
        retry(1),
        catchError((error) => this.handleError(error))
      );
  }
}
