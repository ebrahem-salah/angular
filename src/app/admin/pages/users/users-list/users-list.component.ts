import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PaginationResult,
  User,
  Users,
} from './../../../../models/users.models';
import { UsersService } from '../../../../service/users.service';

import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'admin-users-list',
  standalone: true,
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    PaginatorModule,
    TableModule,
    RouterLink,
    ToastModule,
    ConfirmDialogModule,
    DatePipe,
    ColorPickerModule,
    CommonModule,
    RatingModule,
    FormsModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class AdminUsersListComponent {
  private messageService = inject(MessageService);
  private usersService = inject(UsersService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  // products!: Product[];
  pagination = signal<PaginationResult[]>([]);
  users = signal<User[]>([]);
  resulte = signal<number>(0);
  error = signal('');

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const subscription = this.usersService.getAll().subscribe({
      next: (res: Users) => {
        console.log(res);
        this.pagination.set(res.PaginationResult);
        this.users.set(res.data); // تعيين المصفوفة documents
        this.resulte.set(res.resulte);
      },

      error: (err) => console.error(err.message),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteUser(usersId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this User ?',
      header: 'Delete User',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        const subscription = this.usersService.delete(usersId).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User is deleted ',
            });
            this.getAll();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User not deleted',
            });
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      },
    });
  }
}
