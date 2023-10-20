import { Component, OnInit, ViewChild } from '@angular/core';
import { Review } from 'src/app/model/review';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReviewService } from 'src/app/service/review.service';

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

  @ViewChild('cardPaginator') cardPaginator!: MatPaginator;
  @ViewChild('tablePaginator') tablePaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reviewService: ReviewService) {
    this.dataSource = new MatTableDataSource<Review>();
  }
  
  //Retrieve all reviews from backend, and wait until the response is given, then assign data to sorters and paginators
  async ngOnInit(){
    try {
      this.reviews = await this.reviewService.findAll();
      
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

}
