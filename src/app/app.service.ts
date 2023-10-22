import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ImageResponse} from "./imageResponse.model";

@Injectable({providedIn: 'root'})
export class AppService {


  constructor(private http: HttpClient) {}

  getHomeImages() {
    this.http.get<ImageResponse>('http://localhost:8080/api/v1/homepage/images');
  }
}
