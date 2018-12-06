import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class UiService {

  constructor(public snackBar: MatSnackBar) { }

  showError(error: Error, message: string, completion?: () => void )  {

    const messagePanel = this.snackBar.open(message, 'OK', { duration: 3000 });
    messagePanel.afterDismissed().subscribe(() => {

      if (completion) { completion(); }

    });

  }

}
