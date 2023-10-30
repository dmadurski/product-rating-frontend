import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfimationDialogComponent } from '../components/confimation-dialog/confimation-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmationDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfimationDialogComponent);

    return firstValueFrom(dialogRef.afterClosed());
  }
}