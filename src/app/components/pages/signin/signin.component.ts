import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginData } from 'src/app/domain/LoginData';
import { FormsModule } from '@angular/forms';
import { AppConstants } from 'src/app/app.constants';
import { UserProfile } from 'src/app/domain/UserProfile';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  login: LoginData;
  user: UserProfile;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.login = { username: '', password: '' };
  }

  submit() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
    console.log(JSON.stringify(this.login));
    this.authService.authenticate(this.login).subscribe(
      (loginResult) => {
        localStorage.setItem(
          AppConstants.LOGIN_STORAGE,
          JSON.stringify(loginResult)
        );
        console.log(loginResult);
        this.router.navigate(['account']);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }
}
