import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginData } from 'src/app/domain/LoginData';
import { FormsModule } from '@angular/forms';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login: LoginData;

  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.login = { username: '', password: '' };
  }

  submit() {
    // Is this right here ?
    console.log(JSON.stringify(this.login));
    this.authService.authenticate(this.login).subscribe(
      (loginResult) => {
        localStorage.setItem(
          AppConstants.LOGIN_STORAGE,
          JSON.stringify(loginResult)
        );
        console.log(loginResult);
        this.router.navigate(['logged']);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }
}
