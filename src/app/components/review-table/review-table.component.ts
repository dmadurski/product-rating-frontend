import { Component, OnInit, ViewChild } from '@angular/core';
import { Review } from 'src/app/model/review';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReviewService } from 'src/app/services/review.service';
import * as selectors from 'src/app/store/store.selectors';
import { AppState } from 'src/app/store/app-state';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-table',
  templateUrl: './review-table.component.html',
  styleUrls: ['./review-table.component.css']
})
export class ReviewTableComponent implements OnInit {
  reviews!: Review[];
  pagedReviews!: Review[];
  dataSource: MatTableDataSource<Review>;
  displayedColumns: string[] = ['product', 'score', 'comment', 'firstName', 'lastName', 'zipcode', 'dateAndTime'];
  shouldShowError: boolean = false;
  errorMessage?: string;
  isAdmin: boolean = false;

  @ViewChild('cardPaginator') cardPaginator!: MatPaginator;
  @ViewChild('tablePaginator') tablePaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private reviewService: ReviewService, private store: Store<AppState>) {
    this.dataSource = new MatTableDataSource<Review>();
  }
  
  async ngOnInit(){
    //Check if the user has the admin role
    const role = await firstValueFrom(this.store.select(selectors.selectRole).pipe(take(1)));
    if (role == "ADMIN") {
      this.isAdmin = true;
      this.displayedColumns.push("delete");
    }

    this.fetchReviews();
  }

  async fetchReviews(){
    //Retrieve all reviews from backend, and wait until the response is given, then assign data to sorters and paginators
    try {
      if(this.isAdmin) {
        this.reviews = await this.reviewService.findAll();
      } else {
        const ownerId = await firstValueFrom(this.store.select(selectors.selectUserId).pipe(take(1)));
        this.reviews = await this.reviewService.findReviewsByOwner(ownerId);
      }
      
      console.log(this.reviews);
      this.dataSource.data = this.reviews;
      this.dataSource.paginator = this.tablePaginator;
      this.dataSource.sort = this.sort;
      
      this.cardPaginator.length = this.reviews.length;
      this.pagedReviews = this.reviews.slice(0, this.cardPaginator.pageSize);
    } catch (error) {
      console.error('Error:', error);
      this.shouldShowError = true;
      this.errorMessage = 'An error occurred while loading reviews. Please try again later.';
    }
  }

  //Logic for the cardPaginator
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedReviews = this.reviews.slice(startIndex, endIndex);
    this.cardPaginator.pageIndex = event.pageIndex;
  }

  async deleteReview(ratingId: string | null) {
    console.log("RatingId: " + ratingId)
    if (ratingId) {
      try {
        await this.reviewService.deleteReview(ratingId);
        await this.fetchReviews();
      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while loading reviews. Please try again later.';
      }
    }
  }

}
