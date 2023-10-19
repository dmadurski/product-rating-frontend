import { Component } from '@angular/core';
import { Router, IsActiveMatchOptions } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(private router: Router) {}

  showSeeReviewsButton(): boolean {
    const options: IsActiveMatchOptions = {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'};
    return !this.router.isActive('/reviews', options);
  }

  showAddReviewButton(): boolean {
      const options: IsActiveMatchOptions = {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'};
      return !this.router.isActive('/newReview', options);
  }

}
