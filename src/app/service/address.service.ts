import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { address } from '../models/users.models';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiService = inject(ApiService);

  Url = '/address';
  address = signal<address | undefined>(undefined);

  addMyAddress(data: address): Observable<address> {
    return this.apiService.addNewData<address>(this.Url, data).pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }

  getMyAddress(): Observable<address > {
    return this.apiService.getOne<address >(this.Url).pipe(
      tap((res: address ) => {
        this.address.set(res as address);
        console.log(res, 'res');
      })
    );
  }
}
