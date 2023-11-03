import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { ImageDetails } from 'src/app/model/image-details';
import { Review } from 'src/app/model/review';
import { ReviewService } from 'src/app/services/review.service';
import { AppState } from 'src/app/store/app-state';
import * as selectors from 'src/app/store/store.selectors';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {

  form!: FormGroup;
  isEditable: boolean = true;
  characterCount: number = 0;
  formSubmitted: boolean = false;
  formSuccess: boolean = false;
  shouldShowError: boolean = false;
  errorMessage?: string;
  shouldShowFileError: boolean = false;
  fileErrorMessage?: string;
  products = [
    'iConnectX',
    'EmployMe',
    'WeInvite',
    'CompanyTRAK',
  ];
  userFirstName?: string;
  userLastName?: string;
  files: File[] = [];
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;

  constructor(private router: Router, private reviewService: ReviewService, private fb: FormBuilder, private store: Store<AppState>) {
    this.initializeForm();
  }

  async initializeForm() {
    await this.loadStoreData();
    this.isEditable = false;

    this.form = this.fb.group({ 
      product: new FormControl('', Validators.required),
      score: new FormControl(0, [Validators.required, Validators.pattern(/^[1-5]*$/)]),
      comment: new FormControl('', Validators.pattern(/^.{1,500}$/)),
      firstName: new FormControl(this.userFirstName, [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      lastName: new FormControl(this.userLastName, [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      zipcode: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{5}|\d{9})$/)]),
    });
  }

  //Fetch stored data, and use it to populate name fields
  async loadStoreData() {
    try {
      this.userFirstName = await firstValueFrom(this.store.select(selectors.selectFirstName).pipe(take(1)));
      this.userLastName = await firstValueFrom(this.store.select(selectors.selectLastName).pipe(take(1)));
    } catch (error) {
      console.error('Error fetching stored data:', error);
    }
  }

  //Handle input when a file is dropped
  onFileDropped(event: any) {
    this.prepareFilesList(event);
  }

  //Handle input when a file is selected via the file browser
  fileBrowseHandler(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      this.prepareFilesList(inputElement.files);
    }
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  prepareFilesList(fileList: FileList) {
    this.shouldShowFileError = false;
    const files: File[] = Array.from(fileList);

    let invalidFiles = 0;
    for (const file of files) {
      if(this.isFileTypeAllowed(file.type)) {
        if(this.files.length >= 2){
          this.fileErrorMessage = "Only 2 attachments are allowed. Please remove an attached file before adding another"
          this.shouldShowFileError = true;
        } else if (file.size > 1000000){
          //File size limit of 1MB
          this.fileErrorMessage = "File cannot exceed 1MB in size"
          this.shouldShowFileError = true;
        } else if (this.files.some(existingFile => existingFile.name === file.name)) {
          //The two files cannot chare the same name
          this.fileErrorMessage = "File names must be unique. Please rename the current file and re-upload"
          this.shouldShowFileError = true;
        } else {
          this.files.push(file);
        }
      } else {
        invalidFiles += 1;
        console.error("Invalid file: " + file);
      }
    }

    if (invalidFiles > 0) {
      invalidFiles = 0;
      this.fileErrorMessage = "Only jpg, jpeg, png, & pdf files are accepted"
      this.shouldShowFileError = true;
    }
    this.fileDropEl.nativeElement.value = "";
  }

  //Format image size to readable text format
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  isFileTypeAllowed(fileType: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    return allowedTypes.includes(fileType);
  }

  //Data binding methods
  setProduct(product: string) {
    this.form.get('product')!.setValue(product);
  }

  setScore(score: number) {
    this.form.get('score')!.setValue(score);
  }

  setComment(comment: string) {
    this.form.get('comment')!.setValue(comment);
    this.characterCount = comment.length;
  }

  setFirstName(firstName: string) {
    this.form.get('firstName')!.setValue(firstName);
  }

  setLastName(lastName: string) {
    this.form.get('lastName')!.setValue(lastName);
  }

  setZipcode(zipcode: string) {
    this.form.get('zipcode')!.setValue(zipcode);
  }

  async submitReview(event: Event){
    event.preventDefault();

    this.formSubmitted = true;

    //If all form inputs are correct, create a new formData object
    if (this.form.valid) {
      const formData = new FormData();
      const userId = await firstValueFrom(this.store.select(selectors.selectUserId).pipe(take(1)));

      formData.append('userId', userId);
      formData.append('firstName', this.form.get('firstName')?.value);
      formData.append('lastName', this.form.get('lastName')?.value);
      formData.append('zipcode', this.form.get('zipcode')?.value);
      formData.append('product', this.form.get('product')?.value);
      formData.append('score', this.form.get('score')?.value);
      formData.append('comment', this.form.get('comment')?.value);

      //For each file uploaded, send it to the Spring API to be saved, then store the details returned to the formdata object
      const imageDetailsList: ImageDetails[] = [];
      for (let i = 0; i < this.files.length; i++) {
        const imageFormData = new FormData();
        imageFormData.append('imageFile', this.files[i]);
        const imageDetails: ImageDetails = await this.reviewService.saveImage(imageFormData);
        console.log(imageDetails);
        imageDetailsList.push(imageDetails);
      }
      formData.append('imageDetailsList', JSON.stringify(imageDetailsList));
      console.log(formData.get('imageDetailsList'));

      try {
        const response = await this.reviewService.newReview(formData);
        this.formSuccess = true;
        this.router.navigate(['/reviews']);
      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while attempting to save the review. Please try again later.';
      }
    }
  }
}