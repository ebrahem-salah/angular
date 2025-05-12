// import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { catchError, Observable, switchMap, throwError } from 'rxjs';
// import { TokenService } from './token.service';
// import { environment } from '../../environments/environment.development';

// // AuthInterceptor (التعامل مع التوكن وتحديثه)
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const tokenService = inject(TokenService);
//   const accessToken = tokenService.getAccessToken();

//   if (accessToken) {
//     req = req.clone({
//       withCredentials: true,
//       setHeaders: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//   }

//   return next(req).pipe(
//     catchError((error) => {
//       if (error.status === 401) {
//         return tokenService.updateAccessToken().pipe(
//           switchMap(() => {
//             const newAccessToken = tokenService.getAccessToken();
//             req = req.clone({
//               withCredentials: true,
//               setHeaders: {
//                 Authorization: `Bearer ${newAccessToken}`,
//               },
//             });
//             return next(req);
//           })
//         );
//       }
//       return throwError(() => new Error('Unauthorized request'));
//     })
//   );
// };

// // refreshTokenInterceptor (تجديد التوكن إذا انتهت صلاحيته)
// export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const tokenService = inject(TokenService);
//   const token = tokenService.getAccessToken();
//   const isApiUrl = req.url.startsWith(environment.Url);

//   if (token && isApiUrl) {
//     console.log('1');
//     req = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` },
//       withCredentials: true, // تأكد من إرسال الكوكي
//     });
//   }

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         console.log('2')
//         return tokenService.refreshToken().pipe(
//           switchMap((data: any) => {
//             if (data?.accessToken && data?.refreshToken) {
//               tokenService.setTokens(data.accessToken, data.refreshToken);
//               console.log('3')
//               const clonedReq = req.clone({
//                 withCredentials: true,
//                 setHeaders: { Authorization: `Bearer ${data.accessToken}` },
//               });
//               return next(clonedReq);
//             } else {
//               return throwError(() => new Error('Filed refresh token '));
//             }
//           })
//         );
//       }
//       return throwError(() => new Error('An unknown error occurred'));
//     })
//   );
// };
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  Observable,
  of,
  retry,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment.development';

// دالة لإعداد الهيدر الخاص بالطلبات
function setRequestHeaders(req: any, accessToken: string) {
  return req.clone({
    setHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
}

// AuthInterceptor (إضافة Access Token إلى كل الطلبات)
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const tokenService = inject(TokenService);

//   let accessToken = tokenService.getAccessToken();
//   console.log(accessToken);
//   const isApiUrl = req.url.startsWith(environment.Url); // تحقق من URL

//   // إذا لم تكن API URL، مرر الطلب مباشرة
//   if (!isApiUrl) {
//     console.log('1');
//     return next(req);
//   }

//   // إذا كانت التوكنات موجودة، أضفها إلى الطلب
//   if (accessToken) {
//     console.log('2');

//     req = setRequestHeaders(req, accessToken);
//   }

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       // إذا كانت هناك مشكلة مصادقة (401) نجدد التوكن
//       if (error.status === 401) {
//         return tokenService.refreshTokens().pipe(
//           take(1),
//           switchMap((res) => {
//             const newAccessToken = res.token;
//             console.log(res);
//             accessToken = res.token;
//             if (newAccessToken) {
//               req = setRequestHeaders(req, newAccessToken);

//               return next(req);
//             }

//             return throwError(
//               () => new Error('Failed to get new access token')
//             );
//           })
//         );
//       }

//       // إذا كان الخطأ من نوع آخر، مرره كما هو
//       return throwError(() => error);
//     })
//   );
// };

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();
  const isApiUrl = req.url.startsWith(environment.Url); // تحقق من URL

  // إذا لم تكن API URL، مرر الطلب مباشرة
  if (!isApiUrl) {
    return next(req);
  }

  // إذا كانت التوكنات موجودة، أضفها إلى الطلب
  if (accessToken) {
    req = setRequestHeaders(req, accessToken);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      // إذا كانت هناك مشكلة مصادقة (401) نجدد التوكن
      if (error.status === 401) {
        return tokenService.refreshTokens().pipe(
          take(1),
          switchMap((res) => {
            const newAccessToken = res.token;
            if (newAccessToken) {
              req = setRequestHeaders(req, newAccessToken);
              return next(req);
            }

            return throwError(() => {
              new Error('Failed to get new access token');
              // tokenService.redirectToLogin();
            });
          }),
          catchError((refreshError) => {
            // إذا فشل تحديث التوكن، قم بتنظيف البيانات وأعد التوجيه إذا لزم الأمر
            console.error('Error refreshing tokens:', refreshError);
            return throwError(() => refreshError);
          })
        );
      }

      // إذا كان الخطأ من نوع آخر، مرره كما هو
      return throwError(() => error);
    })
  );
};
