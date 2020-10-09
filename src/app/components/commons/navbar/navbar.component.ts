import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBars as faSBars,
  faCompass as faSCompass,
  faSearch as faSSearch,
  faHeart as faSHeart,
  faSave as faSSave,
  faInfoCircle as faSInfoCircle,
  faUserCircle as faSUserCircle,
  faTrophy as faSTrophy,
  faStar as faSStar,
  faTh as faSTh,
  faThList as faSThList,
  faFlag as faSFlag,
  faUser as faSUser,
  faSignOutAlt as faSSignOutAlt,
  faUserPlus as faSUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { RefreshCollectionAction } from 'src/app/actions/collection.actions';
import { RefreshUserAction } from 'src/app/actions/user.actions';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfile } from 'src/app/domain/UserProfile';
import { selectUser } from 'src/app/selectors/user.selector';
import { IAppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  //icons
  faSCompass = faSCompass;
  faSSearch = faSSearch;
  faSHeart = faSHeart;
  faSBars = faSBars;
  faSSave = faSSave;
  faSInfoCircle = faSInfoCircle;
  faSUserCircle = faSUserCircle;
  faSTrophy = faSTrophy;
  faSStar = faSStar;
  faSTh = faSTh;
  faSThList = faSThList;
  faSFlag = faSFlag;
  faSUser = faSUser;
  faSSignOutAlt = faSSignOutAlt;
  faSUserPlus = faSUserPlus;

  user: UserProfile;

  constructor(
    public translate: TranslateService,
    private store: Store<IAppState>,
    private auth: AuthService,
    private router: Router
  ) {
    translate.addLangs(['en', 'it']);
    translate.use(translate.getBrowserLang() === 'it' ? 'it' : 'en');
    // listen user selector
    store.pipe(select(selectUser)).subscribe((userProfile) => {
      this.user = userProfile;
    });
  }

  ngOnInit(): void {
    // if token is valid then require user profile
    if (this.auth.isAuthenticated()) {
      this.store.dispatch(new RefreshUserAction());
      this.store.dispatch(new RefreshCollectionAction());
    }
  }

  logout(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
      this.router.navigate(['']);
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
