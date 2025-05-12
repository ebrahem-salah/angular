import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { PaginationResult, Users, User } from '../models/users.models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiService = inject(ApiService);
  
  usersCount = signal(0);
  url = '/users/administrator';
  getAll(): Observable<Users> {
    return this.apiService
      .getAllData<Users>(this.url)
      .pipe(tap((data) => this.usersCount.set(data.data.length)));
  }

  add(url: string, user: User): Observable<User> {
    return this.apiService.addNewData<User>(url, user);
  }
  delete(userId: string): Observable<User> {
    return this.apiService.deleteData<User>(`${this.url}/${userId}`);
  }
  get(userId: string): Observable<User> {
    return this.apiService.getOne<User>(`${this.url}/${userId}`);
  }
  update(id: string, user: User): Observable<User> {
    return this.apiService.updateData<User>(`${this.url}/` + id, user);
  }
}
