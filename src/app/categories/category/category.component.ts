import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  @Input() images: string[];
  @Input() selectedCategoryImages: string[];
  firstFormFilled: boolean = false;

  onFirstFormFilled(calcScnd: any) {
    this.firstFormFilled = true;
    console.log(calcScnd);
  }

}
