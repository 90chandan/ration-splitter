import { Component, OnInit,ComponentRef } from '@angular/core';
import {AfterViewInit,ComponentFactory,ComponentFactoryResolver} from '@angular/core';
import {ViewChild,ViewContainerRef} from '@angular/core';
import { RationCalculatorService } from 'src/app/services/ration-calculator.service';

import {UserComponent} from 'src/app/views/user/user.component';
import {UserDetails} from 'src/app/models/user-details';

import {Payment} from 'src/app/models/payment';
import {UserBalance} from 'src/app/models/user-balance'
import { PdfGenerateService } from 'src/app/services/pdf-generate.service';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
  
  @ViewChild('rationUser1',{read:ViewContainerRef,static:false}) rationUserContainerRef1! : ViewContainerRef;
  @ViewChild('rationUser2',{read:ViewContainerRef,static:false}) rationUserContainerRef2! : ViewContainerRef;
  @ViewChild('rationUser3',{read:ViewContainerRef,static:false}) rationUserContainerRef3! : ViewContainerRef;

  username : string =''
  userList! : any[];
  perPersonAmount : number = 0;
  userNumber : number = 0;
  rationTotalAmount : number =0;
  erroMsg : string =''
  
  payableReceivableList! : Payment[];

  constructor(private resolver : ComponentFactoryResolver,private srvRationCalulator : RationCalculatorService ,private pdfGenerator : PdfGenerateService) {     
    this.srvRationCalulator.GetItemAmountchange().subscribe((res : boolean)=>{
      this.CalculateRationTotal();
      this.GetPaymentList();
    })
  }

  CalculateRationTotal(){
    this.rationTotalAmount = 0;
    this.userList.forEach((data :any)=>{                  
      let itemArray :any[] = data.UserComponent.instance.itemArray;
        itemArray.forEach((item)=>{                
          let currItemAmount = item.instance.rationItemAmount;
          this.rationTotalAmount = this.rationTotalAmount + currItemAmount;
        })
    })

  this.perPersonAmount = (this.rationTotalAmount/ this.userList.length);
  this.srvRationCalulator.UpdatePerPersonRationAmount(this.perPersonAmount);  
  this.srvRationCalulator.UpdateTotalRationAmount(this.rationTotalAmount);
  }


  GetPaymentList(){   
    let userBalanceList : UserBalance[] =[];
    this.userList.forEach((data: any)=>{   
      let userbalance :UserBalance = new UserBalance();
      userbalance.userId = data.UserComponent.instance.userId;
      userbalance.balanceAmount = data.UserComponent.instance.userRationBalance;      
      userbalance.userName = data.UserComponent.instance.userName;
      userBalanceList.push(userbalance);
    })
    
    this.srvRationCalulator.UpdateUserPaymentList(userBalanceList);
  }

  
  
  ngOnInit() {
    this.userList =[];
    this.userNumber = 1;
  }

  onTextChange(event : any){    
    this.clearErrorMsg();
  }

  clearErrorMsg(){
    
    this.erroMsg = '';
  }

  ChkUserExist() : boolean {
    let isUserExist : boolean = false;

    this.userList.forEach((data: UserDetails)=>{
      if(data.UserName == this.username){
        isUserExist  = true;
      }
    })
    return isUserExist;
  }
  
  AddMember(){    

    if(this.username == ""){     
     this.erroMsg ='usernname can not be mpty';
     return;
    }

    if(this.ChkUserExist()){
      this.erroMsg = ' usernname "'+this.username +  '" already exist';
      return;
    }

    let userdetail = new UserDetails();
    userdetail.UserId =  this.userNumber;
    userdetail.UserName = this.username;

    let index =(this.userList.length %3);
    const factory = this.resolver.resolveComponentFactory(UserComponent);
    if( index ==0){      
      const user = this.rationUserContainerRef1.createComponent(factory);
      user.instance.userName = this.username;     
      user.instance.userId = this.userNumber;
      userdetail.UserComponent = user;    
      user.instance.onCalculateRationTotal.subscribe((data :boolean)=>{      
        this.CalculateRationTotal();
      })
    }
    else if( index == 1){      
      const user = this.rationUserContainerRef2.createComponent(factory);
      user.instance.userName = this.username;     
      user.instance.userId = this.userNumber;
      userdetail.UserComponent = user;    
      user.instance.onCalculateRationTotal.subscribe((data :boolean)=>{      
        this.CalculateRationTotal();
      })

    }else{      
      const user = this.rationUserContainerRef3.createComponent(factory);
      user.instance.userName = this.username;     
      user.instance.userId = this.userNumber;
      userdetail.UserComponent = user;    
      user.instance.onCalculateRationTotal.subscribe((data :boolean)=>{      
        this.CalculateRationTotal();
      })

    }
    

    
    
    this.userList.push(userdetail);


    
    this.userNumber = this.userNumber +1;
  }


  CreatePDF(){
    debugger;
    // this.pdfGenerator.print();
  }


}
