import { Component, OnInit } from '@angular/core';
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
} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'it']);
    translate.use(translate.getBrowserLang() === 'it' ? 'it' : 'en');
  }

  ngOnInit(): void {}

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
