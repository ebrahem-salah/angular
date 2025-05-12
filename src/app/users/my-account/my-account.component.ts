import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    DropdownModule,
    ButtonModule,
    PanelModule,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent {
  private authService = inject(AuthService);
  user = this.authService.users;
  

  ngOnInit(): void {
    this.authService.myAccount().subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

}
