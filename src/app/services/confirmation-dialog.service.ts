import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, timer } from 'rxjs';
import { ConfimationDialogComponent } from '../components/confimation-dialog/confimation-dialog.component';
import { ContinueSessionDialogComponent } from '../components/continue-session-dialog/continue-session-dialog.component';

@Injectable()
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmationDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfimationDialogComponent);

    return firstValueFrom(dialogRef.afterClosed());
  }

  openContinueSessionDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(ContinueSessionDialogComponent);

    //If the user does not provide an input within 5 minutes of dialog opening, automatically return true (logout)
    const timeLimit = timer(60000);
    const timerSubscription = timeLimit.subscribe(() => {
      dialogRef.close(true);
    });

    //If the user provides input, cancel the time limit
    const dialogRefSubscription = dialogRef.afterClosed().subscribe(() => {
      timerSubscription.unsubscribe();
    });

    return firstValueFrom(dialogRef.afterClosed());
  }
}