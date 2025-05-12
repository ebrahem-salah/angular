import { TokenService } from './../service/token.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

// حارس للتحقق من أن المستخدم هو "admin"

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  // التحقق من وجود توكن ودور المستخدم
  return tokenService.getUserRole().pipe(
    map((role) => {
      if (role === 'admin') {
        console.log(role, 'adminGuard');

        return true;
      } else {
        router.navigate(['/']);
        console.log(false, 'adminGuard1');

        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/']);
      console.log(false, 'adminGuard2');

      return of(false);
    })
  );
};

//   return tokenService.getUserRole().pipe(
//     map((role) => {
//       // إذا كان الدور "admin"، السماح بالوصول

//       if (role === 'admin') {
//         return true;
//       } else {
//         // إذا لم يكن "admin"، توجيه المستخدم إلى صفحة تسجيل الدخول

//         router.navigate(['/users/login']);
//         return false;
//       }
//     }),
//     catchError(() => {
//       // إذا لم يكن "admin"، توجيه المستخدم إلى صفحة تسجيل الدخول

//       router.navigate(['/users/login']);
//       return of(false);
//     })
//   );
// };

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  return tokenService.getUserRole().pipe(
    map((role) => {
      if (role === 'user' || role === 'admin') {
        return true;
      } else {
        router.navigate(['/users/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/users/login']);

      return of(false);
    })
  );
};

//   return tokenService.getUserRole().pipe(
//     map((role) => {
//       if (role === 'user' || role === 'admin') {
//         return true;
//       } else {
//         router.navigate(['/users/login']);
//         return false;
//       }
//     }),
//     catchError(() => {
//       router.navigate(['/users/login']);
//       return of(false);
//     })
//   );
// };

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  //   // التحقق من وجود توكن ودور المستخدم

  return tokenService.getUserRole().pipe(
    map((role) => {
      //   // إذا كان الدور "user" أو "admin"، السماح بالوصول

      if (role === 'user' || role === 'admin') {
        router.navigate(['/']);
        return false;
      } else {
        //     // إذا لم يكن الدور مناسبًا، توجيه المستخدم إلى صفحة تسجيل الدخول
        return true;
      }
    }),
    catchError(() => {
      return of(true);
    })
  );
};
