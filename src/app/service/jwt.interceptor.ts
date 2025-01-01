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
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment.development';

// AuthInterceptor (إضافة Access Token إلى كل الطلبات)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  // إضافة التوكن إذا كان موجودًا
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true, // إرسال الكوكي إذا لزم الأمر
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // إذا كانت هناك مشكلة مصادقة (401) نجدد التوكن
      if (error.status === 401) {
        return tokenService.updateAccessToken().pipe(
          switchMap(() => {
            const newAccessToken = tokenService.getAccessToken();
            if (newAccessToken) {
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              return next(req);
            }
            return throwError(
              () => new Error('Failed to get new access token')
            );
          })
        );
      }
      return throwError(() => error);
    })
  );
};

// Interceptor لتحديث التوكن إذا لزم الأمر
export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  const isApiUrl = req.url.startsWith(environment.Url); // تأكد من أن الطلب يذهب إلى API محدد

  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // إذا انتهت صلاحية التوكن، نحاول التحديث باستخدام refreshToken
        return tokenService.refreshToken().pipe(
          switchMap(() => {
            const accessToken = tokenService.getAccessToken();
            const refreshToken = tokenService.getRefreshToken();
            if (accessToken && refreshToken) {
              tokenService.setTokens(accessToken, refreshToken);
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
              });
              return next(clonedReq);
            } else {
              tokenService.clearTokens();
              return throwError(() => new Error('Failed to refresh token'));
            }
          }),
          catchError((refreshError) => {
            tokenService.clearTokens(); // مسح التوكنات في حال فشل التحديث
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error); // أخطاء أخرى
    })
  );
};
