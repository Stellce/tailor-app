import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class AppService {
  private doChangeHeader: boolean = false;
  doChangeHeaderListener = new Subject<boolean>();
  getDoChangeHeader() {
    return this.doChangeHeader;
  }

  getDoChangeHeaderListener() {
    return this.doChangeHeaderListener.asObservable();
  }

  changeHeaderListener(change: boolean) {
    this.doChangeHeaderListener.next(change);
  }
}
