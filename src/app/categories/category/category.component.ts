import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  @Input() images: string[] | undefined;
  @Input() selectedCategoryImages: string[];
  firstFormFilled: boolean = false;
  constructor(private activatedRoute: ActivatedRoute) {}

  onFirstFormFilled(calcScnd: any) {
    this.firstFormFilled = true;
    console.log(calcScnd)
    calcScnd.nativeElement.scrollIntoView({behavior: "smooth"});
  }

}
