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

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Category } from './../../../../models/category.models';
import { CategoriesService } from '../../../../service/categories.service';

@Component({
  selector: 'admin-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
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
  ],
})
export class AdminCategoriesComponent {
  private messageService = inject(MessageService);
  private categoryService = inject(CategoriesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  editMode = signal<boolean>(false);
  curentCategoryId = signal('');
  isSubmatted = false;
  selectedFile!: File;
  imageDisplay = signal<string | ArrayBuffer | null>('');
  get categoryControl() {
    return this.form.controls;
  }
  form = new FormGroup({
    name: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    image: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });
  category = {
    name: this.categoryControl.name.value,
    image: this.categoryControl.image.value,
  };

  ngOnInit(): void {
    this.getCategoryId();
    this.getCategoryId();
  }

  getCategoryId() {
    const subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode.set(true);
        const subscription = this.categoryService.get(params['id']).subscribe({
          next: (id: Category) => {
            this.categoryControl.name.setValue(id.name);
            this.curentCategoryId.set(params['id']);
            this.imageDisplay.set(id.image);
            this.categoryControl.image.setValue(id.image);
            // this.categoryControl.image.clearValidators();
          },
          error: (error) => {
            console.error('Error fetching category:', error);
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  onFileSelected(event: any) {
    console.log(event);
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay.set(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.isSubmatted = true;
    const categoryData = new FormData();
    Object.keys(this.categoryControl).map((key) => {
      categoryData.append(
        key,
        this.categoryControl[key as keyof typeof this.categoryControl].value
      );
    });
    if (this.editMode()) {
      this.updateCategory(categoryData);
    } else {
      this.createCategory(categoryData);
    }
  }
  updateCategory(categoryData: FormData) {
    const _id = this.curentCategoryId();
    const subscription = this.categoryService
      .update(_id as string, categoryData as unknown as Category)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category is updated ',
          });
          this.router.navigate(['admin/categories']);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Category is not updated',
            detail: 'Category is not updated',
          });
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }
  createCategory(categoryData: FormData) {
    const subscription = this.categoryService
      .add(categoryData as unknown as Category)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category is created',
          });
          this.router.navigate(['admin/categories']);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Category is not created',
            detail: 'Category is not created',
          });
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }
}
