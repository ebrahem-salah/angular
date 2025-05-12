import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Validators,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Categories, Category } from '../../../../models/category.models';
import { SubCategoriesService } from '../../../../service/subCategories.service';
import {
  SubCategories,
  SubCategory,
} from '../../../../models/subcategory.models';
import { CategoriesService } from '../../../../service/categories.service';

@Component({
  selector: 'admin-subCategoriesForm',
  standalone: true,
  templateUrl: './subCategoriesForm.component.html',
  styleUrl: './subCategoriesForm.component.scss',
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
export class AdminSubCategoriesComponent {
  private messageService = inject(MessageService);
  private subCategoryService = inject(SubCategoriesService);
  private CategoryService = inject(CategoriesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  editMode = signal<boolean>(false);
  curentSubCategoryId = signal('');
  isSubmatted = false;
  selectedFile!: File;
  imageDisplay = signal<string | ArrayBuffer | null>('');
  subCategory = signal<SubCategory[]>([]);
  category = this.CategoryService.category;

  get subCategoryControl() {
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

    category: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });


  ngOnInit(): void {
    this.getSubCategoryId();
    this.getAll(); // استدعاء تحميل التصنيفات
  }

  getSubCategoryId() {
    const subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode.set(true);
        const subscription = this.subCategoryService
          .get(params['id'])
          .subscribe({
            next: (id) => {
              this.subCategoryControl.name.setValue(id.name);
              this.subCategoryControl.category.setValue(id.category.name); // إرسال الكائن
              this.curentSubCategoryId.set(params['id']);
              this.imageDisplay.set(id.image);
              this.subCategoryControl.image.setValue(id.image);
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

  getAll() {
    const subscription = this.CategoryService.getAll().subscribe({
      next: (res: Categories) => {
        this.category.set(res.data); // تعيين المصفوفة documents
      },

      error: (err) => console.error(err),
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

    const subCategoriesData = new FormData();
    Object.keys(this.subCategoryControl).map((key) => {
      subCategoriesData.append(
        key,
        this.subCategoryControl[key as keyof typeof this.subCategoryControl]
          .value
      );
    });

    if (this.editMode()) {
      this.updateSubCategory(subCategoriesData);
    } else {
      this.createSubCategory(subCategoriesData);
    }
  }
  updateSubCategory(categoryData: FormData) {
    const _id = this.curentSubCategoryId();
    const subscription = this.subCategoryService
      .update(_id as string, categoryData as unknown as SubCategory)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'SubCategory is updated ',
          });
          this.router.navigate(['admin/subcategories']);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'SubCategory is not updated',
            detail: 'SubCategory is not updated',
          });
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }

  createSubCategory(categoryData: FormData) {
    const subscription = this.subCategoryService
      .add(categoryData as unknown as SubCategory)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'SubCategory is created',
          });
          this.router.navigate(['admin/subcategories']);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'SubCategory is not created',
            detail: 'SubCategory is not created',
          });
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }
}
