import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';

import { UsersService } from './../../../../service/users.service';
import { User, Users, PaginationResult } from '../../../../models/users.models';

@Component({
  selector: 'admin-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class AdminUsersComponent {
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editMode = signal<boolean>(false);
  currentId = signal('');
  isSubmatted = false;
  user = signal<User[]>([]);
  get Control() {
    return this.form.controls;
  }

  form = new FormGroup({
    name: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    role: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    active: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.getId();
  }

  getId() {
    const subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode.set(true);
        const subscription = this.usersService.get(params['id']).subscribe({
          next: (id: User) => {
            this.currentId.set(params['id']);
            this.Control.role.setValue(id.role);
            this.Control.active.setValue(id.active);
            this.Control.name.setValue(id.firstName);
            this.Control.name.setValue(id.lastName);
          },

          error: () => {
            console.error('Error fetching product:');
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    this.isSubmatted = true;
    const FormData = this.form.value;
    this.update(FormData as User);
  }

  private update(FormData: User) {
    const _id = this.currentId();

    const subscription = this.usersService
      .update(_id as string, FormData as User)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User is updated ',
          });
          this.router.navigate(['admin/users']);
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
