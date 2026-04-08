import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule   //  for routerLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = {
    email: '',
    password: ''
  };

  message: string = '';

  constructor(
    private http: HttpClient,
    private router: Router   //  for navigation
  ) {}

  // Normal Login (JWT)
//  login() {
//   this.http.post('http://localhost:8080/api/v1/users/login', this.user, { responseType: 'text' })
//     .subscribe({
//       next: (token: string) => {
//         console.log("JWT:", token);

//         // save token
//         localStorage.setItem('token', token);

//         //  direct redirect
//         this.router.navigateByUrl('/');
//       },
//       error: (err) => {
//         console.error("Login error:", err);
//         this.message = 'Login failed! ' + (err.error || 'Invalid credentials');
//       }
//     });
// }

login() {
  //  Input validation
  if (!this.user.email || !this.user.password) {
    this.message = "All fields are required";
    return;
  }

  //  Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.user.email)) {
    this.message = "Invalid email format";
    return;
  }

  this.http.post(
    'http://localhost:8080/api/v1/users/login',
    this.user,
    { responseType: 'text' }
  ).subscribe({

    next: (res: string) => {
      console.log("Response:", res);

      //  Error response check
      if (!res || res.toLowerCase().includes("invalid")) {
        this.message = res || "Invalid credentials";
        return;
      }

      // JWT token check
      if (res.startsWith("eyJ")) {
        localStorage.setItem('token', res);

        console.log("Token stored:", localStorage.getItem("token"));

        // clear message
        this.message = "";

        // redirect
        this.router.navigateByUrl('/');
      } else {
        this.message = "User Not Found!!";
      }
    },

    error: (err) => {
      console.error("Login error:", err);

      if (err.status === 401) {
        this.message = "Invalid email or password";
      } else if (err.status === 0) {
        this.message = "Server not reachable";
      } else {
        this.message = "Something went wrong";
      }
    }
  });
}
  //  Google OAuth Login
  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}