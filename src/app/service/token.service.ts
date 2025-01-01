import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshTokenUrl = 'http://localhost:3400/api/auth/refresh';
  private http = inject(HttpClient);

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded: any = jwtDecode<JwtPayload>(token);
        if (decoded.exp < Math.floor(new Date().getTime() / 1000)) {
          return null;
        }
        return decoded.role;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    document.cookie = `accessToken=${accessToken}; httpOnly , sameSite: "strict",
    maxAge: 3 * 60 * 1000, }`;
    document.cookie = `refreshToken=${refreshToken};   httpOnly , sameSite: "strict",
    maxAge: 3 * 60 * 1000, }`;
  }

  getAccessToken(): string | null {
    return this.getCookie('accessToken');
  }

  getRefreshToken(): string | null {
    return this.getCookie('refreshToken');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode<JwtPayload>(token);
      console.log('16');

      return decoded.exp < Math.floor(new Date().getTime() / 1000);
    } catch (e) {
      console.log('17');

      return true;
    }
  }

  isUserLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshToken(): Observable<any> {
    if (this.isUserLoggedIn()) {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken || this.isTokenExpired(refreshToken)) {
        console.log('11');
        console.log(refreshToken);
        return throwError(() => new Error('No valid refresh token available'));
      }
      return this.http
        .post(this.refreshTokenUrl, {}, { withCredentials: true })
        .pipe(
          catchError((error) => {
            console.error('Error refreshing token:', error);
            console.log('12');
            console.log(error);
            return throwError(() => new Error('Failed to refresh token'));
          })
        );
    }
    return throwError(() => new Error('Failed to loging'));
  }

  updateAccessToken(): Observable<any> {
    return this.refreshToken().pipe(
      switchMap(() => {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        console.log('13');
        if (refreshToken && accessToken) {
          console.log('14');

          this.setTokens(accessToken, refreshToken);
          return of(accessToken);
        }

        console.log('15');

        return throwError(() => new Error('Failed to update access token'));
      }),
      catchError((error) => {
        console.error('Error updating access token:', error);
        this.clearTokens(); // تنظيف التوكنات في حال الفشل
        return throwError(
          () => new Error('Unauthorized - please log in again')
        );
      })
    );
  }

  clearTokens(): void {
    document.cookie = 'accessToken=; Max-Age=0; path=/; Secure';
    document.cookie = 'refreshToken=; Max-Age=0; path=/; Secure';
  }
}
