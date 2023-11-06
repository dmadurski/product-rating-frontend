import { AfterViewInit, Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Review } from 'src/app/model/review';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReviewService } from 'src/app/services/review.service';
import * as selectors from 'src/app/store/store.selectors';
import { AppState } from 'src/app/store/app-state';
import { Store } from '@ngrx/store';
import { first, firstValueFrom, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-table',
  templateUrl: './review-table.component.html',
  styleUrls: ['./review-table.component.css']
})
export class ReviewTableComponent implements OnInit {
  reviews!: Review[];
  sortedReviews!: Review[];
  pagedReviews!: Review[];
  dataSource: MatTableDataSource<Review>;
  displayedColumns: string[] = ['product', 'score', 'comment', 'files', 'zipcode', 'dateAndTime'];
  shouldShowError: boolean = false;
  shouldShowSuccess: boolean = false;
  errorMessage?: string;
  isAdmin: boolean = false;

  @ViewChild('cardPaginator') cardPaginator!: MatPaginator;
  @ViewChild('tablePaginator') tablePaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private reviewService: ReviewService, private store: Store<AppState>, private renderer: Renderer2) {
    this.dataSource = new MatTableDataSource<Review>();

    
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { isSuccess: boolean };

    //Check if user was naviagated here as a result of a successful review submission
    //If so, show the success alert for 10 seconds
    if (state !== undefined && state.isSuccess === true) {
      console.log("Success found in state!");
      this.shouldShowSuccess = true;
      setTimeout(() => {
        this.shouldShowSuccess = false;
      }, 5000);
    }
  }
  
  async ngOnInit(){
    //Check if the user has the admin role
    const role = await firstValueFrom(this.store.select(selectors.selectRole).pipe(take(1)));
    if (role == "ADMIN") {
      this.isAdmin = true;
      this.displayedColumns.splice(4, 0, "firstName");
      this.displayedColumns.splice(5, 0, "lastName");
      this.displayedColumns.push("delete")
    }

    this.fetchReviews();
  }

  async fetchReviews(){
    //Retrieve all reviews from backend, and wait until the response is given, then assign data to sorters and paginators
    try {
      if(this.isAdmin) {
        this.reviews = await this.reviewService.findAll();
        this.sortedReviews = this.reviews.sort((a, b) => new Date(b.dateAndTime!).getTime() - new Date(a.dateAndTime!).getTime());
      } else {
        const ownerId = await firstValueFrom(this.store.select(selectors.selectUserId).pipe(take(1)));
        this.reviews = await this.reviewService.findReviewsByOwner(ownerId);
        this.sortedReviews = this.reviews.sort((a, b) => new Date(b.dateAndTime!).getTime() - new Date(a.dateAndTime!).getTime());
      }
      
      console.log(this.reviews);
      this.dataSource.data = this.reviews;
      this.dataSource.paginator = this.tablePaginator;
      this.dataSource.sort = this.sort;
      
      this.cardPaginator.length = this.sortedReviews.length;
      this.pagedReviews = this.sortedReviews.slice(0, this.cardPaginator.pageSize);
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
    this.pagedReviews = this.sortedReviews.slice(startIndex, endIndex);
    this.cardPaginator.pageIndex = event.pageIndex;
  }

 
  async deleteReview(ratingId: string | null) {
    console.log("RatingId: " + ratingId)
    if (ratingId) {
      try {

        await this.reviewService.deleteReview(ratingId);
        
        //Filter out the deleted review from the array of reviews
        this.reviews = this.reviews.filter((review) => review.ratingId !== ratingId);
        this.pagedReviews = this.pagedReviews.filter((review) => review.ratingId !== ratingId);

        this.dataSource.data = this.reviews;
        this.cardPaginator.length = this.sortedReviews.length;

      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while attempting to delete review. Please try again later.';
      }
    }
  }

  async downloadFile(imageId: string){
    try {

      const response = await this.reviewService.fetchReviewImage(imageId);
      const imageInfo: any = response.body;

      const encodedData = atob(imageInfo.content);
      const binaryData = new Uint8Array(
        Array.from(encodedData, (char) => char.charCodeAt(0))
      );
      const blob = new Blob([binaryData], { type: imageInfo.contentType });

      const url = window.URL.createObjectURL(blob);

      // window.open(url);

      const link = this.renderer.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', imageInfo.originalFilename);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log('Error:', error);
    }
  }
}