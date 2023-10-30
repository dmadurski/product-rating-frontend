import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { AppState } from '../store/app-state';
import * as selectors from 'src/app/store/store.selectors';
import { ConfirmationDialogService } from '../services/confirmation-dialog.service';

@Injectable({
  providedIn: 'root'
})
class AuthService {

  constructor(private router: Router, private store: Store<AppState>, private confirmationDialogService: ConfirmationDialogService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    const isLoggedIn = await firstValueFrom(this.store.select(selectors.selectLoginStatus).pipe(take(1))); 
    const savedState = localStorage.getItem('state');
    const userRole = await firstValueFrom(this.store.select(selectors.selectRole).pipe(take(1)));
    const isAdmin = (userRole === "ADMIN");

    if (!isLoggedIn && !savedState) {
      this.router.navigate(['/login']);
      return false;
    }

    if (next.routeConfig?.path === 'newReview' && isAdmin) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }

  async canDeactivate(component: any, next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (component.canDeactivate && component.canDeactivate()) {
      return true;
    }
    const userResponse = await this.confirmationDialogService.openConfirmationDialog();
    
    return userResponse;
  }
}

export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  return inject(AuthService).canActivate(next, state);
}

export const UnsavedChangesGuard: CanDeactivateFn<any> = (component: any, next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  return inject(AuthService).canDeactivate(component, next, state);
}