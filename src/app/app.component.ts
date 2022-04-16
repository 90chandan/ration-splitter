import { Component, PACKAGE_ROOT_URL } from '@angular/core';
import { OnDestroy } from '@angular/core'

import { MemberPdfData } from 'src/app/models/member-pdf-data';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { JsonPipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'splitRation';
  memberPdfDataList: MemberPdfData[] = [];
  paragrapArray: any[] = [];
  totalAmount: number = 0;
  perPersonAmount: number = 0;



  print() {
    debugger;
    this.paragrapArray = [];
    if (localStorage.getItem('service_TotalAmount')) {
      let amt = JSON.parse(localStorage.getItem('service_TotalAmount'));
      if (amt != undefined && amt != null) {
        this.totalAmount = amt;
      }

    }

    if (localStorage.getItem('service_PerPersonAmount')) {
      let amt = JSON.parse(localStorage.getItem('service_PerPersonAmount'));
      if (amt != null && amt != undefined) {
        this.perPersonAmount = amt;
      }
    }


    if (localStorage.getItem('serivce_memberPdfData') === null) {
    }
    else {
      this.memberPdfDataList = JSON.parse(localStorage.getItem('serivce_memberPdfData'));
      if (this.memberPdfDataList.length > 0) {

        let header: any = { text: 'Ration Calculator ', style: 'header' }
        this.paragrapArray.push(header);

        let summaryText: string = 'Total : ' + this.formattAmount(this.totalAmount) + " \t Per Person :" + this.formattAmount(this.perPersonAmount);
        let summaryObj: any = { text: summaryText, style: 'summary' }
        this.paragrapArray.push(summaryObj);

        this.memberPdfDataList.forEach((data, index) => {
          let userNameText: string = this.memberPdfDataList[index].userName + " ";
          let memberNameObj: any = { text: userNameText, style: 'anotherStyle' }
          this.paragrapArray.push(memberNameObj);

          let para: string = '';
          para =  "Expenses : ";

          this.memberPdfDataList[index].itemList.forEach((data, index) => {
            if (index == 0) {
              para = para + " " + this.formattAmount(data.amount);
            } else {
              para = para + " + " + this.formattAmount(data.amount);
            }
          })


          para = para + " = " + this.formattAmount(this.memberPdfDataList[index].userRationTotal);

          para = para + "\n Balance : \t" + this.formattAmount(this.memberPdfDataList[index].userRationBalance);

          let newformat = {
            text: para
          }
          this.paragrapArray.push(newformat);


          if (this.memberPdfDataList[index].payabletList.length > 0) {
            let payableText: string = '';
            payableText = payableText + "Payable:\t"
            this.memberPdfDataList[index].payabletList.forEach(data => {
              payableText = payableText + data.PaymentToUserName + " : " + this.formattAmount(data.Amount) + "\t"
            })
            let payableObj: any = { text: payableText, style: 'payableCss' }
            this.paragrapArray.push(payableObj);
          }



          if (this.memberPdfDataList[index].receivableList.length > 0) {
            let receivableText: string = '';
            receivableText = receivableText + "Recievable:\t"
            this.memberPdfDataList[index].receivableList.forEach(data => {
              receivableText = receivableText + data.PaymentFromUserName + " : " + this.formattAmount(data.Amount) + "\t"
            })
            let receivableObj: any = { text: receivableText, style: 'reveivable' }
            this.paragrapArray.push(receivableObj);
          }

          let header: any = { text: ' ', style: 'linebreakerCss' }
          this.paragrapArray.push(header);


        })
      }
    }
    // -----------------------------------------------------------------


    var docDefinition = {
      content: this.paragrapArray,
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center'
        },
        summary: {
          fontSize: 18,
          bold: true,
          alignment: 'right',
          italics: true,
        },
        anotherStyle: {
          fontSize: 14,
          bold: true,
          italics: true,
          alignment: 'left'
        },
        payableCss: {
          background: 'red'
        },
        reveivable: {
          background: 'green'
        },
        linebreakerCss: {
          alignment: 'left'
        }
      }

    };
    // -----------------------------------------------------------------

    pdfMake.createPdf(docDefinition).open();
    pdfMake.createPdf(docDefinition).download();
  }

  formattAmount(amount: number): number {
    let newAmount: number = Math.round((amount + Number.EPSILON) * 100) / 100;
    return newAmount;
  }

}
