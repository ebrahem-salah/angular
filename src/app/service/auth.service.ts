import { Router } from '@angular/router';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { AuthResponseData } from '../models/auth.model';
import { User } from '../models/users.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private route = inject(Router);

  Urllogout = '/auth/logout';
  token = signal<string>('');
  role = signal<string>('');
  users = signal<User | undefined>(undefined);

  userName = computed(() => {
    const userData = this.users();
    return userData ? `${userData.firstName} ${userData.lastName}` : 'Login';
  });
  
  myAccount(): Observable<User> {
    return this.apiService.getOne<User>('/users/myAccount').pipe(
      tap((res) => {
        this.users.set(res);
        sessionStorage.setItem('userData', JSON.stringify(res)); // حفظ البيانات في sessionStorage
      })
    );
  }

  updateMyAccount(data: User): Observable<User> {
    return this.apiService
      .updateData<User>('/users/updateMyAccount', data)
      .pipe(
        tap((res) => {
          console.log(res);
          this.users.set(res);
          sessionStorage.setItem('userData', JSON.stringify(res)); // حفظ البيانات في sessionStorage
        })
      );
  }

  auth(url: string, user: AuthResponseData): Observable<AuthResponseData> {
    return this.apiService.addNewData<AuthResponseData>(url, user).pipe(
      tap((res) => {
        this.token.set(res.token);
        localStorage.setItem('jwt', res.token);
        this.role.set(res.role);
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.getOne<any>(this.Urllogout).pipe(
      tap(() => {
        this.users.set(undefined);
        this.token.set('');
        this.role.set('');
        window.sessionStorage.removeItem('userData');
      })
    );
  }
}
