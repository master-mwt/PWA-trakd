import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from 'src/app/domain/UserProfile';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css'],
})
export class ProfileUpdateComponent implements OnInit {
  @Input()
  user: UserProfile;

  @Output()
  updateCompleteEmitEv: EventEmitter<UserProfile>;

  profileForm: FormGroup;

  constructor() {
    this.updateCompleteEmitEv = new EventEmitter();
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required]),
      surname: new FormControl(this.user.surname, [Validators.required]),
    });
  }

  update(): void {
    this.updateCompleteEmitEv.emit({
      name: this.profileForm.value['name'],
      surname: this.profileForm.value['surname'],
      username: this.user.username,
    });
  }
}
