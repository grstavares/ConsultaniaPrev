import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { getUuidV4String } from './uuid';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {

  private loaders: string[] = [];
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public snackBar: MatSnackBar) { }

  showError(error: Error, message: string, completion?: () => void )  {

    const messagePanel = this.snackBar.open(message, 'OK', { duration: 3000 });
    messagePanel.afterDismissed().subscribe(() => {

      if (completion) { completion(); }

    });

  }

  startLoading(): string {

    const token = this.guid();
    this.loaders.push(token);
    this.isLoading.next(true);
    return token;

  }

  stopLoading(loadToken: string) {

    this.loaders = this.loaders.filter(token => token !== loadToken);
    if (this.loaders.length === 0) { this.isLoading.next(false); }

  }

  private s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  private guid() { return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4(); }

}
