import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Review} from "./reviews/review.model";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../../auth/error-dialog/error-dialog.component";
import {Observable, Subject} from "rxjs";
import {NewReview} from "./reviews/new-review.model";
import {NewReply} from "./reviews/new-reply.model";
import {ReviewsRes} from "./reviews/reviews-res.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  backendUrl: string = environment.backendUrl;
  private reviewListener = new Subject<ReviewsRes>();
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }
  getReviewListener(): Observable<{ content: Review[], last: boolean, first: boolean }> {
    return this.reviewListener.asObservable();
  }

  getReviews(coatModelId: string, page?: number) {
    if(!page) page = 0;
    let params = new HttpParams().set('page', page);
    this.http.get<{content: Review[], last: boolean, first: boolean}>(`${this.backendUrl}/reviews/${coatModelId}`, {params: params}).subscribe(reviews => {
      this.reviewListener.next(reviews);
    })
  }

  createReview(review: NewReview, coatModelId: string, page?: number) {
    if(!page) page = 0;
    this.http.post(`${this.backendUrl}/reviews`, {...review}, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getReviews(coatModelId, page);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Review created', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err);
        this.getReviews(coatModelId, page);
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }
  updateReview(review: NewReview, coatModelId: string, page?: number) {
    if(!page) page = 0;
    const formData = new FormData();
    formData.append('content', review.content);
    formData.append('rating', review.rating as unknown as string);
    this.http.put(`${this.backendUrl}/reviews/${review.id}`, formData, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getReviews(coatModelId, page);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Review updated', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err)
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }
  deleteReview(reviewId: string, coatModelId: string) {
    this.http.delete(`${this.backendUrl}/reviews/${reviewId}`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getReviews(coatModelId, 0);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Review deleted', isSuccessful: true}})
      },
      error: () => {
        this.reviewListener.next({} as ReviewsRes);
        this.dialog.open(ErrorDialogComponent)
      }
    })
  }
  createReply(newReply: NewReply, reviewId: string, coatModelId: string) {
    const formData = new FormData();
    formData.append('content', newReply.content);
    this.http.post(`${this.backendUrl}/reviews/${reviewId}/reply`, formData, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getReviews(coatModelId);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Answer was sent', isSuccessful: true}})
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent);
      }
    })
  }

  deleteReply(replyId: string, coatModelId: string, page: number) {
    this.http.delete(`${this.backendUrl}/reviews/${replyId}/reply`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getReviews(coatModelId, page);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Answer deleted', isSuccessful: true}})
      },
      error: () => this.dialog.open(ErrorDialogComponent)
    })
  }
}
