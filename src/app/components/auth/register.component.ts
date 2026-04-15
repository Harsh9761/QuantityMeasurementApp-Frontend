// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { UserService, RegisterDTO } from '../../services/user.service';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router,RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule,RouterModule,HttpClientModule],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {

//   user: RegisterDTO = { name: '', email: '', password: '' };
//   message: string = '';

//   constructor(private http: HttpClient,private service: UserService, private router: Router) {}

// register() {
//   this.http.post(
//     'http://localhost:8080/api/v1/users/register',
//     this.user,
//     { responseType: 'text' }   //  important
//   ).subscribe({
//     next: (res: string) => {
//       console.log(res);

//       this.router.navigateByUrl('/login'); // 
//     },
//     error: (err) => {
//       console.log(err);
//     }
//   });
// }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, RegisterDTO } from '../../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: RegisterDTO = { name: '', email: '', password: '' };
  message: string = '';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private service: UserService,
    private router: Router
  ) {}

  register() {

  this.message = '';
  this.loading = true;

  this.http.post(
    'http://localhost:8080/api/v1/users/register',
    this.user,
    { responseType: 'text' }
  ).subscribe({
    next: (res: string) => {
      this.loading = false;
      this.message = res;
      this.router.navigateByUrl('/login');
    },
    error: (err) => {
      this.loading = false;
      this.message = "Registration failed";
      console.log(err);
    }
  });

  }
}