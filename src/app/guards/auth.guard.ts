import { TokenService } from './../service/token.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// حارس للتحقق من أن المستخدم هو "admin"
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  // التحقق من وجود توكن ودور المستخدم
  const role = tokenService.getUserRole();

  // إذا كان الدور "admin"، السماح بالوصول
  if (role === 'admin') {
    return true;
  } else {
    // إذا لم يكن "admin"، توجيه المستخدم إلى صفحة تسجيل الدخول
    router.navigate(['/users/login']);
    return false;
  }
};

// حارس للتحقق من أن المستخدم هو "user" أو "admin"
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  // التحقق من وجود توكن ودور المستخدم
  const role = tokenService.getUserRole();

  // إذا كان الدور "user" أو "admin"، السماح بالوصول
  if (role === 'user' || role === 'admin') {
    return true;
  } else {
    // إذا لم يكن الدور مناسبًا، توجيه المستخدم إلى صفحة تسجيل الدخول
    router.navigate(['/users/login']);
    return false;
  }
};

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  // التحقق من وجود توكن ودور المستخدم
  const role = tokenService.getUserRole();
  console.log(role)

  // إذا كان الدور "user" أو "admin"، السماح بالوصول
  if (role === 'user' || role === 'admin') {
    return false;
  } else {
    // إذا لم يكن الدور مناسبًا، توجيه المستخدم إلى صفحة تسجيل الدخول
    router.navigate(['/']);
    return true;
  }
};
