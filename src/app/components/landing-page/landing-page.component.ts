import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, take } from 'rxjs';
import { AppState } from 'src/app/store/app-state';
import * as selectors from 'src/app/store/store.selectors';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor(private store: Store<AppState>) {}

  isNotAdmin = this.store.select(selectors.selectRole).pipe(
    map((userRole) => userRole !== 'ADMIN')
  );
    
}