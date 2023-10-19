import { Component, OnInit, ViewChild } from '@angular/core';
import { Review } from 'src/app/model/review';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-review-table',
  templateUrl: './review-table.component.html',
  styleUrls: ['./review-table.component.css']
})
export class ReviewTableComponent implements OnInit {

  dataSource: MatTableDataSource<Review>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['product', 'score', 'comment', 'firstName', 'lastName', 'zipcode', 'dateAndTime'];

  constructor(private reviewService: ReviewService) {
    this.dataSource = new MatTableDataSource<Review>();
  }
  
  async ngOnInit(){
    try {
      const reviews = await this.reviewService.findAll();
      this.dataSource.data = reviews;
      console.log('Reviews:', reviews);
    } catch (error) {
      console.error('Error:', error);
      //Display error message to user
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
