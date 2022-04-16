import { Component, OnInit } from '@angular/core';
import {ViewChild,ViewContainerRef,ComponentFactory,ComponentFactoryResolver} from '@angular/core';
import {AfterViewInit} from '@angular/core';
import {Input,Output,EventEmitter} from '@angular/core';
import { Payment } from 'src/app/models/payment';
import { RationCalculatorService } from 'src/app/services/ration-calculator.service';
import {ItemComponent} from 'src/app/views/item/item.component';

import {MemberPdfData} from 'src/app/models/member-pdf-data'
import {Item} from 'src/app/models/item';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit,AfterViewInit {
  @ViewChild('itemContainer',{read:ViewContainerRef,static:true}) itemContainer! : ViewContainerRef;
  @Input('userName') userName! : string;
  @Output() onCalculateRationTotal  : EventEmitter<boolean>;
  itemArray : any[]=[];
  userRationTotal : number = 0;
  userRationBalance : number = 0;
  itemNumber! : number;
  userId : number =0;

  payabletList : Payment [] = [];
  receivableList : Payment [] = [];

  

  constructor(private resolver : ComponentFactoryResolver,private srvRationCalulator : RationCalculatorService) { 
    this.onCalculateRationTotal = new EventEmitter<boolean>();

    this.srvRationCalulator.GetPersonRationAmount().subscribe((res)=>{
      this.userRationBalance =  (this.userRationTotal - res);     
    })

    this.srvRationCalulator.GetUserPaymentList().subscribe((res : Payment[]) =>{      
      this.payabletList =[];
      this.receivableList =[];
      res.forEach((data)=>{
         if(data.PaymentFromId == this.userId){
          this.payabletList.push(data);
         }
         if(data.PaymentToId == this.userId){
           this.receivableList.push(data);
         }
      })
      this.SetMemberPdfData();   
    })
    
  }

  ngOnInit() {
    this.payabletList =[];
    this.receivableList =[];
    this.itemNumber = 1;
  }


  ngAfterViewInit(){
     this.AddNewItem();
  }


  AddNewItem(){
     const factory = this.resolver.resolveComponentFactory(ItemComponent);
     const item = this.itemContainer.createComponent(factory);
     item.instance._ref = item;
     item.instance.rationItemAmount = 0;
     item.instance.itemId = this.itemNumber;
     
     this.itemNumber = this.itemNumber +1;
      
     item.instance.itemAmountchange.subscribe((res : boolean)=>{
       this.CalculateUserTotal();
     })

     item.instance.onAddNewItem.subscribe((res: boolean)=>{
      this.AddNewItem();
     })

     item.instance.onDeleteItem.subscribe((res:number)=>{
      this.DeleteItemFromArray(res);
     })

     this.itemArray.push(item);
     this.onCalculateRationTotal.emit(true);
  }



  DeleteItemFromArray(itemNumber : number){       
    this.itemArray =  this.itemArray.filter(data =>{     
    return data.instance.itemId != itemNumber
    });   
    this.CalculateUserTotal();
  }




  CalculateUserTotal(){    
    this.userRationTotal = 0;    
     this.itemArray.forEach((data)=>{     
       let amount : number = Number(data.instance.rationItemAmount);
       this.userRationTotal = this.userRationTotal + amount ;
     })

    this.srvRationCalulator.OnItemAmountChange(true);


  }



  CalCulate() : void{
    
  }

SetMemberPdfData(){
  debugger;
 let memPdfData = new MemberPdfData();
 memPdfData.userId = this.userId;
 memPdfData.userName = this.userName;
 memPdfData.payabletList = this.payabletList;
 memPdfData.receivableList = this.receivableList;
 memPdfData.userRationTotal = this.userRationTotal;
 memPdfData.userRationBalance = this.userRationBalance;

this.itemArray.forEach(data =>{
  let itemData = new Item();
  itemData.amount = data.instance.rationItemAmount;
  memPdfData.itemList.push(itemData);
})
this.srvRationCalulator.UpdateMemberPdfData(memPdfData);
}
  
}
