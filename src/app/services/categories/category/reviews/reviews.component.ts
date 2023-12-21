import {Component, OnInit} from '@angular/core';
import {Review} from "./review.model";
import {ReviewsService} from "../reviews.service";
import {ModelsService} from "../models.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../../../auth/error-dialog/error-dialog.component";
import {AuthService} from "../../../../auth/auth.service";
import {OrdersService} from "../../../../account/orders/orders.service";
import {NewReview} from "./new-review.model";
import {NewReply} from "./new-reply.model";
import {User} from "../../../../account/user.model";
import {YesNoDialogComponent} from "../../../../account/yes-no-dialog/yes-no-dialog.component";
import {AppService} from "../../../../app.service";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit{
  reviews: Review[];
  reviewsSub: Subscription;
  reviewForm: FormGroup;
  review: Review;
  rating: number;
  stars = [
    {rate: 1},
    {rate: 2},
    {rate: 3},
    {rate: 4},
    {rate: 5}
  ]
  page: number = 0;
  allowComments: boolean = false;
  ordersSub: Subscription;
  isLastPage: boolean = false;
  isFirstPage: boolean = false;
  isReviewLoaded: boolean = false;
  reply: NewReview = {id: ''} as NewReview;
  user: User;
  coatModelId: string;
  modelSub: Subscription;
  isReviewFormFreezed: boolean = false;

  constructor(
    private reviewsService: ReviewsService,
    private modelsService: ModelsService,
    private dialog: MatDialog,
    protected authService: AuthService,
    private ordersService: OrdersService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.coatModelId = this.modelsService.getSelectedModel().id;
    this.modelSub = this.modelsService.getSelectedModelListener().subscribe(model => {
      this.coatModelId = model.id;
      this.reviewsService.getReviews(this.coatModelId, this.page);
      this.review = {} as Review;
      this.updateForm();
      this.isReviewLoaded = false;
    })
    this.reviewsSub = this.reviewsService.getReviewListener().subscribe(reviews => {
      console.log('next')
      this.isReviewFormFreezed = false;
      if(!reviews.content) return;
      this.reviews = reviews.content.map(review => {
        review.createdAt = this.appService.fixDateStr(review.createdAt);
        if(review.reply)review.reply.createdAt = this.appService.fixDateStr(review.reply.createdAt);
        return review;
      });
      this.isLastPage = reviews.last;
      this.isFirstPage = reviews.first;
      this.review = this.reviews.find(review => review.clientUsername === this.user.username);
      if(this.review) {
        this.updateForm();
        this.isReviewLoaded = true;
      }
    })
    this.reviewsService.getReviews(this.coatModelId, this.page);
    this.createForm();
    if(this.user?.isAuth)this.hasCompletedOrder();
  }

  private createForm() {
    this.reviewForm = new FormGroup({
      content: new FormControl('', Validators.required),
      rating: new FormControl('', Validators.required)
    });
  }
  private updateForm() {
    this.reviewForm.patchValue({
      content: this.review.content,
      rating: this.review.rating,
      reply: this.review.reply
    })
    this.rating = this.review.rating;
  }

  private hasCompletedOrder() {
    this.ordersSub = this.ordersService.getOrdersListener().subscribe(orders => {
      this.allowComments = orders.some(order =>
        order.coatModel.id === this.coatModelId && order.status === 'COMPLETED');
    })
    this.ordersService.requestAssignedOrders();
  }
  onAnswer(id: string) {
    this.reply.id = id;
  }

  nextPage() {
    if(this.isLastPage) return;
    this.page += 1;
    this.reviewsService.getReviews(this.coatModelId, this.page);
  }
  prevPage() {
    if(this.page - 1 < 0) return;
    this.page--;
    this.reviewsService.getReviews(this.coatModelId, this.page);
  }
  setRating(rating: number) {
    this.rating = rating;
  }
  onCreateReview() {
    this.isReviewFormFreezed = true;
    const newReview: NewReview = {
      id: this.review?.id || '',
      content: this.reviewForm.controls['content'].value,
      rating: this.reviewForm.controls['rating'].value,
      coatModelId: this.coatModelId
    }
    if(!this.rating) return this.dialog.open(ErrorDialogComponent, {data: {message: 'Введiть оцiнку'}});
    if(this.reviewForm.invalid) return;
    if(this.isReviewLoaded) {
      this.reviewsService.updateReview(newReview, this.coatModelId, this.page);
    } else {
      this.reviewsService.createReview(newReview, this.coatModelId, this.page);
    }
  }
  onDeleteReview(reviewId: string) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {data: {message: 'Видалити вiдгук?'}})
    dialogRef.afterClosed().subscribe(res => {
      if(res && res.event === 'Yes') {
        this.reviewsService.deleteReview(reviewId, this.coatModelId);
        this.rating = 0;
        this.reviewForm.reset();
        this.isReviewLoaded = false;
        this.isReviewFormFreezed = true;
      }
    })
  }
  onReply(reviewId: string) {
    const newReply: NewReply = {
      content: this.reply.content
    }
    this.reviewsService.createReply(newReply, reviewId, this.coatModelId);
    this.reply.content = '';
  }

  onDeleteReply(reviewId: string) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {data: {message: 'Видалити вiдповiдь?'}})
    dialogRef.afterClosed().subscribe(res => {
      if(res.event === 'Yes') {
        this.reviewsService.deleteReply(reviewId, this.coatModelId, this.page);
        this.rating = 0;
      }
    })
  }
  protected readonly Array = Array;
}
