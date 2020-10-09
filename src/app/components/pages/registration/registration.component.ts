import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfile } from 'src/app/domain/UserProfile';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  user: UserProfile;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = { username: '', password: '', name: '', surname: '' };
  }

  submit(): void {
    this.auth.signUp(this.user).subscribe(
      (user) => {
        console.log('registration complete');
        console.log(user);
        this.router.navigate(['login']);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }
}
