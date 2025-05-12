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
import { SearchResultListComponent } from './client/search/search-result-list/search-result-list.component';
import { ProductsListSubComponent } from './client/pages/productss/products-list-subcategory/products-list-Sub.component';
import { UserProfileComponent } from './client/pages/user/user-profile/user-profile.component';
import { CheckoutComponent } from './client/pages/cart/checkout/checkout.component';
import { MyAccountComponent } from './users/my-account/my-account.component';
import { UserEditorComponent } from './client/pages/user/user-editor/user-editor.component';
import { AddressComponent } from './client/pages/user/address/address.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Home',
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
        component: ProductsListSubComponent,
      },
      {
        path: 'cart',
        component: CartPageComponent,
        // canActivate: [authGuard],
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        // canActivate: [authGuard],
      },
      {
        path: 'customer/account',
        component: UserProfileComponent,
        title: 'My Account',

        canActivate: [authGuard],
      },
      {
        path: 'customer/account/edit/:',
        component: UserEditorComponent,
        title: 'My Account',

        canActivate: [authGuard],
      },
      {
        path: 'customer/account/address/:',
        component: AddressComponent,
        title: 'My Address',

        canActivate: [authGuard],
      },

      { path: 'search-results-list', component: SearchResultListComponent },
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
    canActivate: [loginGuard],
  },
];
