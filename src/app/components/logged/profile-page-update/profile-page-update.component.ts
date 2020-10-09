import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from 'src/app/domain/UserProfile';

@Component({
  selector: 'app-profile-page-update',
  templateUrl: './profile-page-update.component.html',
  styleUrls: ['./profile-page-update.component.css'],
})
export class ProfilePageUpdateComponent implements OnInit {
  @Input()
  user: UserProfile;

  @Output()
  updateCompleteEmitEv: EventEmitter<string>;

  profileForm: FormGroup;

  constructor() {
    this.updateCompleteEmitEv = new EventEmitter();
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      name: new FormControl(this.user.name, [Validators.required]),
      surname: new FormControl(this.user.surname, [Validators.required]),
    });
  }

  update(): void {
    this.updateCompleteEmitEv.emit('success');
  }
}
