import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/users.models';
import { UsersService } from '../../service/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../service/token.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
  ],
  providers: [MessageService, CookieService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLogin: boolean = false; // حالياً هي false لأنه يجب التحقق من تسجيل الدخول عند البداية
  error = signal('');
  ngOnInit() {
    if (this.isUserLoggedIn()) {
      this.isLogin = true;
      this.router.navigateByUrl('/'); // يمكن توجيه المستخدم مباشرة إلى الصفحة الرئيسية أو أي مكان آخر
    }
  }
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
  });

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
  isUserLoggedIn(): boolean {
    // return !!localStorage.getItem('accessToken'); // تحقق إذا كان التوكن موجودًا في localStorage
    return !!this.tokenService.getAccessToken();
  }

  // (اختياري) وظيفة لتسجيل الخروج
  logout() {
    // localStorage.removeItem('accessToken'); // إزالة التوكن من localStorage
    // localStorage.removeItem('username'); // إزالة التوكن من localStorage
    this.tokenService.clearTokens(); // إلغاء التوكن من خدمات التوكن
    this.isLogin = false; // تعيين حالة تسجيل الخروج
    this.router.navigateByUrl('/login'); // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
  }
  Login() {
    const url = '/auth/login';
    const postData = { ...this.loginForm.value };
    const subscription = this.usersService
      .add(url, postData as User)
      .subscribe({
        next: (res: User) => {
          this.router.navigateByUrl('/');
          // window.localStorage.setItem('accessToken', res.accessToken);
          window.localStorage.setItem('username', res.name);
          // هنا تأكد من تمرير كلا التوكنين

          // this.tokenService.setTokens(res, res.refreshToken);

          this.isLogin = true; // تعيين حالة تسجيل الدخول
        },
        error: (error) => {
          // console.log(error);
          this.isLogin = false;
          if (error?.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Email or password is invalid.',
            });
          }
          if (error?.status === 429) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Too many requests. Please try again after 15 minutes.',
            });
          }
          if (error?.status === 500) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error in the server, please try again later.',
            });
          }
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
