import { map, switchMap, tap } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { jwtDecode, JwtPayload } from 'jwt-decode';
// import { catchError, Observable, of, retry, switchMap, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class TokenService {
//   private refreshTokenUrl = 'http://localhost:3400/api/auth/refresh';
//   private http = inject(HttpClient);

//   private getCookie(name: string): string | null {
//     const cookies = document.cookie.split('; ');
//     for (let cookie of cookies) {
//       const [cookieName, cookieValue] = cookie.split('=');
//       if (cookieName === name) {
//         return decodeURIComponent(cookieValue);
//       }
//     }
//     return null;
//   }

//   private userRole: string | null = null;

//   getUserRole(): Observable<string | null> {
//     if (this.isUserLoggedIn()) {
//       if (this.userRole) {
//         return of(this.userRole);
//       }
//       const token = this.getAccessToken();
//       if (token) {
//         try {
//           const decoded: any = jwtDecode<JwtPayload>(token);
//           if (decoded.exp < Math.floor(new Date().getTime() / 1000)) {
//             return of(null);
//           }
//           this.userRole = decoded.role;
//           return of(this.userRole);
//         } catch (e) {
//           console.error('Error decoding token:', e);
//           return of(null);
//         }
//       }
//     }
//     return of(null);
//   }

//   setTokens(accessToken: string | null): void {
//     document.cookie = `accessToken=${accessToken}; sameSite=Strict; max-Age=${
//       3 * 60
//     }`;
//   }

//   getCsrfToken(): string | null {
//     return this.getCookie('XSRF-TOKEN');
//   }

//   getAccessToken(): string | null {
//     return this.getCookie('accessToken');
//   }

//   getRefreshToken(): string | null {
//     return this.getCookie('refreshToken');
//   }

//   private isTokenExpired(token: string): boolean {
//     try {
//       const decoded: any = jwtDecode<JwtPayload>(token);

//       return decoded.exp < Math.floor(new Date().getTime() / 1000);
//     } catch (e) {

//       return true;
//     }
//   }

//   isUserLoggedIn() {
//     return !!this.getAccessToken();
//   }

//   refreshToken(): Observable<any> {
//     const refreshToken = this.getRefreshToken();
//     // تحقق من وجود التوكن وصلاحيته
//     if (!refreshToken || this.isTokenExpired(refreshToken)) {
//       console.error('Invalid or expired token');
//       // this.redirectToLogin();

//       return throwError(() => new Error('No valid token available.'));
//     }

//     // إرسال طلب لتحديث التوكن
//     return this.http
//       .post(this.refreshTokenUrl, {}, { withCredentials: true })
//       .pipe(
//         // retry(2), // حاول التحديث مرتين قبل إرجاع خطأ
//         switchMap(() => {
//           // افترض أن الخادم يعيد accessToken و refreshToken
//           const newaccessToken = this.getAccessToken();

//           this.setTokens(newaccessToken);

//           return of(newaccessToken);
//         }),
//         catchError((error) => {
//           console.error('Error refreshing token:', error);
//           return throwError(() => new Error('Failed to refresh token.'));
//         })
//       );
//     // }
//   }
//   redirectToLogin(): void {
//     console.log('redirectToLogin');
//     this.clearTokens();
//     window.location.href = '/users/login'; // تحديث مسار صفحة تسجيل الدخول حسب الحاجة
//   }

//   updateAccessToken(): Observable<any> {
//     return this.refreshToken().pipe(
//       // retry(2), // حاول التحديث مرتين قبل إرجاع خطأ
//       switchMap(() => {
//         const accessToken = this.getAccessToken();
//         if ( accessToken) {

//           this.setTokens(accessToken);
//           return of(accessToken);
//         }

//         return throwError(() => new Error('Failed to update access token'));
//       }),
//       catchError((error) => {
//         console.error('Error updating access token:', error);
//         // this.clearTokens(); // تنظيف التوكنات في حال الفشل
//         return throwError(
//           () => new Error('Unauthorized - please log in again')
//         );
//       })
//     );
//   }

//   clearTokens(): void {
//     document.cookie = 'accessToken=; ';
//     document.cookie = 'refreshToken=; ';
//     document.cookie = 'XSRF-TOKEN=;';
//   }
// }
// ////////////////////////////// cookies

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthResponseData, RefreshResponseData } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshTokenUrl = 'http://localhost:3400/api/auth/refresh';
  private http = inject(HttpClient);
  private router = inject(Router);

  // دالة للتحقق من صلاحية التوكن
  isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      return Date.now() > decoded.exp * 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    console.log(cookies);
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  getUserRole(): Observable<string | null> {
    const token = this.getAccessToken();

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (this.isTokenExpired(token)) {
          this.getRefreshToken();
          console.log('tokenExpired');
          return of(null); // إعادة التوجيه أو أي إجراء آخر
        }
        if (decoded.role) {
          return of(decoded.role);
        }
      } catch (e) {
        console.error('Error decoding token:', e);
        return of(null);
      }
    }
    return of(null); // العودة إذا لم يكن المستخدم مسجلاً
  }

  getAccessToken(): string | null {
    console.log(localStorage.getItem('jwt'));
    return localStorage.getItem('jwt'); // يمكن تعديلها حسب مكان تخزين التوكن
  }

  getRefreshToken(): string | null {
    console.log(this.getCookie('refreshToken'), 'refreshToken');
    return this.getCookie('refreshToken');
  }

  // التحقق من تسجيل الدخول
  isUserLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // تحديث التوكن
  refreshTokens(): Observable<RefreshResponseData> {
    const refreshToken = this.getCookie('refreshToken');
    if (!refreshToken || this.isTokenExpired(refreshToken)) {
      this.redirectToLogin();
      return throwError(() => new Error('Invalid or expired refresh token.'));
    }
    return this.http
      .post<RefreshResponseData>(
        this.refreshTokenUrl,
        {},
        { withCredentials: true }
      )
      .pipe(
        switchMap((response) => {
          localStorage.setItem('jwt', response.token);
          return of(response);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            //   // أرسل المستخدم إلى صفحة تسجيل الدخول لأن التوكن غير صالح

            this.redirectToLogin();
          }
          return throwError(() => {
            new Error('Failed to get new access token');
            this.redirectToLogin();
          });
        })
      );
  }

  // refreshTokens(): Observable<any> {
  //   const refreshToken = this.getRefreshToken();

  //   if (!refreshToken || this.isTokenExpired(refreshToken)) {
  //     // تحقق من وجود التوكن وصلاحيته
  //     console.error('Invalid or expired token');
  //     this.redirectToLogin();
  //     return throwError(() => new Error('No valid token available.'));
  //   }

  //   // إرسال طلب لتحديث التوكن
  //   return this.http
  //     .post(this.refreshTokenUrl, {}, { withCredentials: true })
  //     .pipe(
  //       // retry(1), // حاول التحديث مرتين قبل إرجاع خطأ
  //       switchMap((res: any) => {
  //         // افترض أن الخادم يعيد accessToken و refreshToken
  //         window.localStorage.setItem('jwt', res.token);
  //         this.token.set(res.token);
  //         console.log(this.token(), '3');

  //         return of(res);
  //       }),
  //       catchError((error) => {
  //         // if (error.status === 403) {
  //         //   // أرسل المستخدم إلى صفحة تسجيل الدخول لأن التوكن غير صالح
  //         //   this.router.navigate(['/users/login']);
  //         // }

  //         this.redirectToLogin();
  //         console.error('Error refreshing token:', error);
  //         return throwError(() => new Error('Failed to refresh token.'));
  //       })
  //     );
  //   // }
  // }

  // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
  redirectToLogin(): void {
    window.localStorage.removeItem('jwt');
    this.router.navigate(['/users/login']);
    // تحديث مسار صفحة تسجيل الدخول حسب الحاجة
  }

  clearTokens(): void {
    window.localStorage.removeItem('jwt');
    document.cookie = 'refreshToken=; ';
    document.cookie = 'XSRF-TOKEN=;';
    this.router.navigate(['/']);
  }
}
