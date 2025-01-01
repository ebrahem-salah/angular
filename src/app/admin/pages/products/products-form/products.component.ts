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

import { ProductsService } from '../../../../service/products.service';
import { Product } from '../../../../models/poduct.models';
import {
  Category,
} from '../../../../models/category.models';
import { CategoriesService } from '../../../../service/categories.service';
import { SubCategory } from '../../../../models/subcategory.models';
import { Brand } from '../../../../models/brands.models';
import { SubCategoriesService } from '../../../../service/subCategories.service';
import { BrandsService } from '../../../../service/brands.service';
import { combineLatest } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'admin-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
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
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class AdminProductsComponent {
  private messageService = inject(MessageService);
  private categoryService = inject(CategoriesService);
  private subCategoryService = inject(SubCategoriesService);
  private brandsService = inject(BrandsService);
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  editMode = signal<boolean>(false);
  currentId = signal('');
  isSubmatted = false;
  selectedFile!: File;
  category = signal<Category[]>([]);
  subCategory = signal<SubCategory[]>([]);
  brands = signal<Brand[]>([]);
  pagination: unknown;
  imageDisplay = signal<string | ArrayBuffer | null>('');
  imagesDisplay = signal<(string | ArrayBuffer)[]>([]);
  selectedFiles: string[] = [];

  get Control() {
    return this.form.controls;
  }
  form = new FormGroup({
    title: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    brand: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    colors: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    images: new FormControl([] as (string | ArrayBuffer)[], {
      validators: Validators.required,
      nonNullable: true,
    }),
    imageCover: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    price: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    quantity: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    category: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    subcategory: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  ngOnInit() {
    const subscription = combineLatest([
      this.brandsService.getAll(),
      this.categoryService.getAll(),
    ]).subscribe({
      next: (data) => {
        this.brands.set(data[0].data);
        this.category.set(data[1].data); // تعيين المصفوفة documents
      },
      error(err) {
        console.log('Error fetching product:', err);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.getId();
  }

  getId() {
    const subscription = this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.editMode.set(true);
        const subscription = this.productsService.get(params['id']).subscribe({
          next: (id: Product) => {
            this.currentId.set(params['id']);
            this.Control.title.setValue(id.title);
            this.Control.brand.setValue(id.brand._id);
            this.Control.category.setValue(id.category._id);
            this.Control.price.setValue(id.price.toString());
            this.Control.quantity.setValue(id.quantity.toString());
            this.Control.imageCover.setValue(id.imageCover);
            this.Control.images.setValue(id.images);
            this.Control.description.setValue(id.description);
            this.Control.subcategory.setValue(id.subcategory._id);
            this.Control.colors.setValue(id.colors[0]);
            this.imageDisplay.set(id?.imageCover);
            this.imagesDisplay.set(id?.images);
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

  onFilesSelected(event: any) {
    const files = event.target.files;
    let images: (string | ArrayBuffer)[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        // this.form.get('images')?.updateValueAndValidity;
        // this.form.patchValue({ images: files[i] });

        this.selectedFiles.push(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          images.push(fileReader.result as string | ArrayBuffer);
          this.imagesDisplay.set(images);
        };
        fileReader.readAsDataURL(file);
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ imageCover: file });
      this.form.get('imageCover')?.updateValueAndValidity;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay.set(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
    console.log(this.imagesDisplay(), 'image display');
  }

  onSubmit() {
    this.isSubmatted = true;
    const productFormData = new FormData();
    this.selectedFiles.forEach((file) => {
      productFormData.append('images', file);
    });

    Object.keys(this.Control).map((key) => {
      const controlValue = this.Control[key as keyof typeof this.Control].value;

      if (Array.isArray(controlValue)) {
        productFormData.append(key, JSON.stringify(controlValue));
      } else {
        productFormData.append(key, controlValue);
      }
    });

    if (this.editMode()) {
      this.update(productFormData);
    } else {
      this.create(productFormData);
    }
  }

  onCategoryChange(categoryId: string): void {
    if (categoryId) {
      // جلب Subcategories بناءً على Category ID
      this.categoryService.getAll(categoryId).subscribe({
        next: (data) => {
          this.subCategory.set(
            data.data.map((item: Category) => ({
              ...item,
              category: item, // ربط التصنيف الفرعي بالتصنيف الرئيسي
            }))
          );
          console.log(data.data);
        },
      });
    } else {
      // إذا لم يتم اختيار Category، قم بإعادة تعيين Subcategories
      this.subCategory.set([]);
    }
  }

  // onSubmit() {
  //   this.isSubmatted = true;
  //   const productFormData = new FormData();
  //   Object.keys(this.Control).map((key) => {
  //     const controlValue = this.Control[key as keyof typeof this.Control].value;

  //     if (Array.isArray(controlValue)) {
  //       productFormData.append(key, JSON.stringify(controlValue));
  //     } else {
  //       productFormData.append(key, controlValue);
  //     }
  //   });
  //   console.log(productFormData);

  //   if (this.editMode()) {
  //     this.update(productFormData);
  //   } else {
  //     this.create(productFormData);
  //   }
  // }

  private update(productFormData: FormData) {
    const _id = this.currentId();
    const subscription = this.productsService
      .update(_id as string, productFormData as unknown as Product)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product is updated ',
          });
          this.router.navigate(['admin/products']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not updated',
          });
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  private create(productData: FormData) {
    const subscription = this.productsService
      .add(productData as unknown as Product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product is created',
          });
          this.router.navigate(['admin/products']);
        },

        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not created',
          });
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
