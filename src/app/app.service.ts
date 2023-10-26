import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ImageResponse} from "./imageResponse.model";
import {environment} from "../environments/environment";

@Injectable({providedIn: 'root'})
export class AppService {
  backendUrl = environment.backendUrl;
  constructor(private http: HttpClient) {}

  getHomeImages() {
    this.http.get<ImageResponse>(`${this.backendUrl}/homepage/images`);
  }
}
