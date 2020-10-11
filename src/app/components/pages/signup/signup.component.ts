import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { UserSignUp } from 'src/app/domain/UserSignUp';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  user: UserSignUp;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = { username: '', password: '', name: '', surname: '' };
  }

  submit(): void {
    this.auth.signUp(this.user).subscribe(
      (user) => {
        console.log('registration complete');
        console.log(user);
        this.router.navigate(['signin']);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }
}
