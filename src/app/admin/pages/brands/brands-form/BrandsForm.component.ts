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
import { BrandsService } from '../../../../service/brands.service';
import { Brand } from '../../../../models/brands.models';

@Component({
  selector: 'admin-brands-form',
  standalone: true,
  templateUrl: './BrandsForm.component.html',
  styleUrl: './BrandsForm.component.scss',
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
export class AdminBrandsFormComponent {
  private messageService = inject(MessageService);
  private brandsService = inject(BrandsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  editMode = signal<boolean>(false);
  curentId = signal('');
  isSubmatted = false;
  selectedFile!: File;
  imageDisplay = signal<string | ArrayBuffer | null>('');

  get brandsControl() {
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

  brands = {
    name: this.brandsControl.name.value,
    image: this.brandsControl.image.value,
  };

  ngOnInit(): void {
    this.getCategoryId();
    this.getCategoryId();
  }

  getCategoryId() {
    const subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode.set(true);
        const subscription = this.brandsService.get(params['id']).subscribe({
          next: (id: Category) => {
            this.brandsControl.name.setValue(id.name);
            this.curentId.set(params['id']);
            this.imageDisplay.set(id.image);
            this.brandsControl.image.setValue(id.image);
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
    const Data = new FormData();
    Object.keys(this.brandsControl).map((key) => {
      Data.append(
        key,
        this.brandsControl[key as keyof typeof this.brandsControl].value
      );
    });
    if (this.editMode()) {
      this.update(Data);
    } else {
      this.create(Data);
    }
  }
  update(Data: FormData) {
    const _id = this.curentId();
    const subscription = this.brandsService
      .update(_id as string, Data as unknown as Brand)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand is updated ',
          });
          this.router.navigate(['admin/brands']);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Brand is not updated',
            detail: 'Brand is not updated',
          });
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }
  create(Data: FormData) {
    const subscription = this.brandsService
      .add(Data as unknown as Brand)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand is created',
          });
          this.router.navigate(['admin/brands']);
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Brand is not created',
            detail: 'Brand is not created',
          });
          this.destroyRef.onDestroy(() => subscription.unsubscribe());
        },
      });
  }
}
