import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PricesComponent implements OnInit{
  elementData = [
    {pos: 1, name: 'Name1', price: '45.06'}
  ]
  displayedColumns: string[] = ['pos', 'name', 'price']

  ngOnInit() {
    const data = [];
    for(let i = 0; i <= 10; i ++) {
      data.push({pos: i, name: `Товар ${i}`, price: (Math.random()*100).toFixed(2)});
    }
    this.elementData = data;
    console.log((Math.random()*100).toFixed(2))
  }
}
