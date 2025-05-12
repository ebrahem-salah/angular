import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { User } from '../../../../models/users.models';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-user-editor',
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
    InputSwitchModule,
  ],
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.scss',
})
export class UserEditorComponent {
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  user = this.authService.users;
  isSubmatted = false;

  currentId = signal('');
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
  });

  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    const storedData = sessionStorage.getItem('userData');

    if (storedData) {
      // إذا كانت البيانات مخزنة في sessionStorage، استخدمها مباشرةً
      const userData = JSON.parse(storedData);
      if (userData) {
        this.Control.firstName.setValue(userData.firstName);
        this.Control.lastName.setValue(userData.lastName);
        this.Control.phone.setValue(userData.phone);
      }
    } else {
      this.Control.firstName.setValue(this.user()!.firstName);
      this.Control.lastName.setValue(this.user()!.lastName);
      this.Control.phone.setValue(this.user()!.phone);
    }
  }

  onSubmit() {
    const FormData = this.form.value;
    const subscription = this.authService
      .updateMyAccount(FormData as User)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User is updated ',
          });
          this.isSubmatted = true;
          this.router.navigate(['/customer/account']);
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
