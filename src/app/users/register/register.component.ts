import { AuthService } from './../../service/auth.service';
import { Component, inject, signal } from '@angular/core';
import { User } from '../../models/users.models';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { AuthResponseData } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private router: Router) {}
  private authService = inject(AuthService);

  registerForm = this.fb.group(
    {
      firstName: [
        '',
        [Validators.required], //Validators.pattern(/^[a-zA-Z]+(?:[a-zA-Z]+)*$/)
      ],
      lastName: [
        '',
        [Validators.required], //Validators.pattern(/^[a-zA-Z]+(?:[a-zA-Z]+)*$/)
      ],

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
    }
    // { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  get firstName() {
    return this.registerForm.controls['firstName'];
  }
  get lastName() {
    return this.registerForm.controls['lastName'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get passwordConfirm() {
    return this.registerForm.controls['passwordConfirm'];
  }

  registerr: boolean = false;
  isLoging = signal(false);
  isLoading = signal(false);
  error = signal<string>('');
  //   Observable = {
  //   next: (res: any) => {
  //     alert('Registration successful');
  //     this.registerr = false;
  //     this.router.navigate(['/login']);
  //     console.log(res.message);
  //   },
  //   error: (errorMessage) => {
  //     console.log(errorMessage);
  //     this.error.set(errorMessage);
  //   },

  //   // error: (res: any) => {
  //   //   alert(res.error.errors[0]?.msg || res.error.errors[0]?.message);
  //   // },
  // };

  register() {
    const url = '/auth/signup';
    const postData = { ...this.registerForm.value };
    // delete postData.passwordConfirm;
    this.authService.auth(url, postData as AuthResponseData).subscribe({
      next: () => {
        alert('Registration successfuly');
        this.registerr = false;
        this.router.navigate(['/users/login']);
        delete postData.passwordConfirm;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
