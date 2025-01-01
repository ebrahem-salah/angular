import { SearchComponent } from './client/search/search/search.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './client/pages/home/home.component';
import { AdminHomeComponent } from './admin/pages/home/home.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { adminGuard, authGuard, loginGuard } from './guards/auth.guard';
import { ProductsListComponent } from './client/pages/productss/products-list/products-list.component';
import { LayoutComponent } from './client/layout/layout.component';
import { ProductsPageComponent } from './client/pages/productss/products-page/products-page.component';
import { CartPageComponent } from './client/pages/cart/cart-page/cart-page.component';
import { SearchResultItemComponent } from './client/search/search-result-item/search-result-item.component';
import { SearchResultListComponent } from './client/search/search-result-list/search-result-list.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      { path: 'products', component: ProductsListComponent },
      { path: 'search/:keyword', component: SearchComponent },

      { path: 'products/:productId', component: ProductsPageComponent },
      {
        path: 'category/:categoryId',
        component: ProductsListComponent,
      },
      {
        path: 'subcategory/:productId',
        component: ProductsListComponent,
      },
      {
        path: 'cart',
        component: CartPageComponent,
        canActivate: [authGuard],
      },
      { path: 'search-results-list', component: SearchResultListComponent },
      // {
      //   path: 'categories',
      //   component: CategoriesComponent,
      //   children: [
      //     {
      //       path: ':categoryId/subcategories',
      //       component: SubcategoriesComponent,
      //       children: [
      //         {
      //           path: ':subCategoryId/products',
      //           component: ProductsComponent,
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },

  {
    path: 'admin',
    component: AdminHomeComponent,
    loadChildren: () =>
      import('./admin/admin.routes').then((admin) => admin.routes),
    canActivate: [adminGuard],
  },

  {
    path: 'users/register',
    component: RegisterComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'users/login',
    component: LoginComponent,
  },
];
