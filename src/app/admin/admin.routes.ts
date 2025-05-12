import { ProductsService } from './../service/products.service';
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminService } from './admin.service';
import { AdminCategoriesComponent } from './pages/categories/categories-form/categories.component';
import { AdminCategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { AdminProductsComponent } from './pages/products/products-form/products.component';
import { AdminProductsListComponent } from './pages/products/products-list/products-list.component';
import { AdminUsersComponent } from './pages/users/users-form/users.component';
import { AdminUsersListComponent } from './pages/users/users-list/users-list.component';
import { AdminOrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { AdminOrdersDetilComponent } from './pages/orders/orders-detils/orders-detil.component';
import { adminGuard } from '../guards/auth.guard';
import { AdminSubCategoriesListComponent } from './pages/subCategories/subCategories-list/subCategories-list.component';
import { AdminSubCategoriesComponent } from './pages/subCategories/subCategories-form/subCategoriesForm.component';
import { AdminBrandsFormComponent } from './pages/brands/brands-form/BrandsForm.component';
import { AdminBrandsListComponent } from './pages/brands/brands-list/Brands-list.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    providers: [ProductsService],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'products',
        component: AdminProductsListComponent,
      },
      { path: 'products/form', component: AdminProductsComponent },
      { path: 'products/form/:id', component: AdminProductsComponent },

      { path: 'categories', component: AdminCategoriesListComponent },
      { path: 'categories/form', component: AdminCategoriesComponent },
      { path: 'categories/form/:id', component: AdminCategoriesComponent },

      { path: 'subcategories', component: AdminSubCategoriesListComponent },
      { path: 'subcategories/form', component: AdminSubCategoriesComponent },
      {
        path: 'subcategories/form/:id',
        component: AdminSubCategoriesComponent,
      },

      { path: 'users', component: AdminUsersListComponent ,canActivate: [adminGuard]},
      { path: 'users/form', component: AdminUsersComponent },
      { path: 'users/form/:id', component: AdminUsersComponent },

      { path: 'brands', component: AdminBrandsListComponent },
      { path: 'brands/form', component: AdminBrandsFormComponent },
      { path: 'brands/form/:id', component: AdminBrandsFormComponent },

      { path: 'orders', component: AdminOrdersListComponent },
      { path: 'orders/view/:id', component: AdminOrdersDetilComponent },
    ],
  },
];
