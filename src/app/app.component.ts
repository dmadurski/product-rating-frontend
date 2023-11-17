import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app-state';
import { login, updateFirstName, updateLastName, updateRole, updateToken, updateUserId } from './store/store.actions';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'product-rating-frontend';

  constructor(private store: Store<AppState>, private tokenService: TokenService) {}

  //Before the page is closed or refreshed, if the user was logged in, save the state to local storage
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    
    this.store.subscribe(state => {
      if (state.login == true){
        const stateToSave = {
          login: state.login,
          firstName: state.firstName,
          lastName: state.lastName,
          userId: state.userId,
          token: state.token,
          role: state.role,
        };
        localStorage.setItem('state', JSON.stringify(stateToSave));
      }
    });
  }
  
  async ngOnInit(): Promise<void> {
    //If there is a state saved in local storage, restore the values.
    const savedState = localStorage.getItem('state');

    if (savedState) {
      const parsedState = JSON.parse(savedState);
      this.store.dispatch(login());
      this.store.dispatch(updateFirstName({ newFirstName: parsedState.firstName }));
      this.store.dispatch(updateLastName({ newLastName: parsedState.lastName }));
      this.store.dispatch(updateUserId({ newUserId: parsedState.userId }));
      this.store.dispatch(updateToken({ newToken: parsedState.token }));
      this.store.dispatch(updateRole({ newRole: parsedState.role }));

      //Clear local storage once Ngrx data is restored
      localStorage.clear();
    }

    //Automatically check the status of the stored JWT token every 5 minutes
    setInterval(this.tokenService.verifyToken.bind(this.tokenService), 300000);
  }
}
