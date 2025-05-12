import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AddressService } from '../../../../service/address.service';
import { address, User } from '../../../../models/users.models';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-address',
  standalone: true,
  providers: [MessageService],
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    InputNumberModule,
    DropdownModule,
    EditorModule,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent {
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private addressService = inject(AddressService);
  private authService = inject(AuthService);

  isSubmatted = false;
  user = this.authService.users;
  get Control() {
    return this.form.controls;
  }

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    phone: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    secondPhone: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    street: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    governorate: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    region: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    buildingNo: new FormControl(0, {
      validators: Validators.required,
      nonNullable: true,
    }),
    floor: new FormControl(0, {
      validators: Validators.required,
      nonNullable: true,
    }),
    landmark: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    const storedData = sessionStorage.getItem('userData');

    if (storedData) {
      // إذا كانت البيانات مخزنة في sessionStorage، استخدمها مباشرةً
      const userData = JSON.parse(storedData).addresses[0];
      if (userData) {
        this.form.patchValue(userData);
      }
    } else {
      const userData = this.user()!.addresses[0];
      if (userData) {
        this.form.patchValue(userData);
      } else {
        this.authService.myAccount().subscribe();
      }
    }
  }

  onSubmit() {
    const FormData = this.form.value;
    const subscription = this.addressService
      .addMyAddress(FormData as address)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User is updated ',
          });
          this.router.navigate(['/customer/account']);
          this.isSubmatted = true;
          this.authService.myAccount().subscribe();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User is not updated',
          });
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
