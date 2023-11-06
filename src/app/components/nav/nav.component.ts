import { Component, OnInit } from '@angular/core';
import { Router, IsActiveMatchOptions } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, take } from 'rxjs';
import { AppState } from 'src/app/store/app-state';
import { resetState } from 'src/app/store/store.actions';
import * as selectors from 'src/app/store/store.selectors';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(private router: Router, private store: Store<AppState>) {}

  userLoggedIn = this.store.select(selectors.selectLoginStatus);
  userFirstName = this.store.select(selectors.selectFirstName);
  isNotAdmin = this.store.select(selectors.selectRole).pipe(
    map((userRole) => userRole !== 'ADMIN')
  );

  shouldShowLoginButton(): boolean {
    const options: IsActiveMatchOptions = {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'};
    return !this.router.isActive('/login', options);
  }

  shouldShowRegisterButton(): boolean {
    const options: IsActiveMatchOptions = {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'};
    return !this.router.isActive('/register', options);
  }

  shouldShowReviewsButton(): boolean {
    const options: IsActiveMatchOptions = {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'};
    return (!this.router.isActive('/reviews', options) && !this.router.isActive('/home', options));
  }

  shouldShowAddReviewButton(): boolean {
    const options: IsActiveMatchOptions = {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'};
    return (!this.router.isActive('/newReview', options) && !this.router.isActive('/home', options));
  }

  logout() {
    localStorage.clear();
    this.store.dispatch(resetState());
    this.router.navigate(['/login']);
  }

}
