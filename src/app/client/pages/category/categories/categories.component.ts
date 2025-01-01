// import { Component, inject, OnInit } from '@angular/core';
// import { Category } from '../../../../models/category.models';
// import { CategoriesService } from '../../../../service/categories.service';
// import { MegaMenuModule } from 'primeng/megamenu';
// import { MenuItem } from 'primeng/api';
// import { MenuModule } from 'primeng/menu';
// import { ButtonModule } from 'primeng/button';
// import { FormsModule } from '@angular/forms';
// import { DropdownModule } from 'primeng/dropdown';
// import { CommonModule } from '@angular/common';
// import { TreeSelectModule } from 'primeng/treeselect';
// import { CheckboxModule } from 'primeng/checkbox';
// import { ListboxModule } from 'primeng/listbox';

// @Component({
//   selector: 'app-categories',
//   standalone: true,
//   imports: [
//     MegaMenuModule,
//     MenuModule,
//     ButtonModule,
//     DropdownModule,
//     FormsModule,
//     CommonModule,
//     TreeSelectModule,
//     CheckboxModule,
//     ListboxModule,
//   ],
//   templateUrl: './categories.component.html',
//   styleUrl: './categories.component.scss',
// })
// export class CategoriesComponent implements OnInit {
//   ngOnInit() {
//     this.getCategories();
//   }
//   private categoryService = inject(CategoriesService);

//   category: Category[] = [];

//   getCategories() {
//     this.categoryService.getAll().subscribe((data) => {
//       this.category = data.data;
//     });
//   }
//   categoryFilter() {
//     const selectedCategory = this.category
//       .filter((category) => category.checked)
//       .map((category) => category._id);
//     console.log(selectedCategory);
//   }
// }
