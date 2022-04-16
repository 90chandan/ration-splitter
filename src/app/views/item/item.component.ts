import { Component, OnInit } from '@angular/core';
import {EventEmitter,Output} from  '@angular/core'

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  _ref : any;
  itemId : number =0;
  rationItemAmount : number = 0;


  @Output() itemAmountchange : EventEmitter<boolean>;
  @Output() onAddNewItem :EventEmitter<boolean>;
  @Output() onDeleteItem : EventEmitter<number>;

  constructor() { 
    this.itemAmountchange = new EventEmitter<boolean>();
    this.onAddNewItem = new  EventEmitter<boolean>();
    this.onDeleteItem = new EventEmitter<number>();
  }

  ngOnInit() {
  }

  onDestryCompeonent(){
    let currItemId = Number(this._ref.instance.itemId);
    this.onDeleteItem.emit(currItemId);
    this._ref.destroy();
  }
  
  onAmountChange($event : any ){   
    let currAmount : number = Number($event.target.value);
    this.rationItemAmount = currAmount;
    this.itemAmountchange.emit(true);
   
  }

  OnAddNewItem(){
    this.onAddNewItem.emit(true);
  }

}
