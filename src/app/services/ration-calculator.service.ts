import { Injectable } from '@angular/core';
import {Observable, Subject,of} from 'rxjs'

import {Payment} from 'src/app/models/payment';
import {UserBalance} from 'src/app/models/user-balance'

import {MemberPdfData} from 'src/app/models/member-pdf-data'
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RationCalculatorService {
rationAmount = new Subject<number>();
perPersonRationAmount = new Subject<number>();
itemAmountChange = new Subject<boolean>();
paymentList = new Subject<Payment[]>();

memberPdfDataList : MemberPdfData[] =[]


constructor() { }


GetTotalRationAmount() : Observable<number>{
 return this.rationAmount.asObservable()
}

GetPersonRationAmount():Observable<number>{
  return this.perPersonRationAmount.asObservable();
}

UpdateTotalRationAmount(total : number){
    this.rationAmount.next(total);
    localStorage.setItem("service_TotalAmount",JSON.stringify(total));
}

UpdatePerPersonRationAmount(amount : number){
  this.perPersonRationAmount.next(amount);
  localStorage.setItem("service_PerPersonAmount",JSON.stringify(amount));
}

OnItemAmountChange(isChange : boolean){
  this.itemAmountChange.next(isChange);
}

GetItemAmountchange() : Observable<boolean> {
 return this.itemAmountChange.asObservable();
}

GetUserPaymentList():Observable<Payment[]>{
return this.paymentList.asObservable();
}

UpdateUserPaymentList(userBalance : UserBalance[]) {
  
  let tempBalanceList : UserBalance[] = userBalance;
  let payList : Payment[] = [];

  tempBalanceList.forEach(data=>{
    if(data.balanceAmount > 0){
       tempBalanceList.forEach((res)=>{

         if(data.balanceAmount > 0){
          if(res.userId != data.userId && res.balanceAmount < 0  ){
            let tempbalance =  -(res.balanceAmount);
            
            let payment : Payment = new Payment();
            if(tempbalance > data.balanceAmount){               
               payment.Amount = data.balanceAmount;
               
               payment.PaymentFromId = res.userId;
               payment.PaymentFromUserName = res.userName;

               payment.PaymentToId = data.userId;       
               payment.PaymentToUserName = data.userName;
               res.balanceAmount = tempbalance - data.balanceAmount;
               res.balanceAmount = -res.balanceAmount;
               data.balanceAmount =0;            
             }
            else if(data.balanceAmount > tempbalance){                           
              payment.Amount = tempbalance;

              payment.PaymentFromId = res.userId;
              payment.PaymentFromUserName = res.userName;

              payment.PaymentToId = data.userId;
              payment.PaymentToUserName= data.userName;

              data.balanceAmount = data.balanceAmount - tempbalance;
              res.balanceAmount = 0;             
             }
             else if( data.balanceAmount == tempbalance){
               payment.Amount = tempbalance;

               payment.PaymentFromId = res.userId;
               payment.PaymentFromUserName = res.userName;

               payment.PaymentToId = data.userId;
               payment.PaymentToUserName = data.userName;

               res.balanceAmount = 0;
               data.balanceAmount = 0;

             }             
             else{
 
            }

          payList.push(payment);
            
          }
         }
         
       })
    }
  })

  console.log(payList);
  this.paymentList.next(payList);
}


UpdateMemberPdfData(paramData : MemberPdfData){
  debugger;
  if(localStorage.getItem('serivce_memberPdfData') === null){
    localStorage.setItem('serivce_memberPdfData',JSON.stringify(this.memberPdfDataList));
  }
  else{
    this.memberPdfDataList = JSON.parse(localStorage.getItem('serivce_memberPdfData'));
    if(this.memberPdfDataList.length <= 0){
      this.memberPdfDataList.push(paramData);
      localStorage.setItem('serivce_memberPdfData',JSON.stringify(this.memberPdfDataList));
    }else{
      let memberIndexNum = -1;
      this.memberPdfDataList.forEach( (data,index) =>{
        if(data.userId == paramData.userId){
          memberIndexNum = index;
        }
      })

      if(memberIndexNum != -1){
        this.memberPdfDataList[memberIndexNum] = paramData;
      }
      else{
        this.memberPdfDataList.push(paramData);
      }
      localStorage.setItem('serivce_memberPdfData',JSON.stringify(this.memberPdfDataList));
      
    }
  }
  

  


}



}
