import { Component, OnInit,OnDestroy } from '@angular/core';


@Component({
  selector: 'app-ration',
  templateUrl: './ration.component.html',
  styleUrls: ['./ration.component.css']
})
export class RationComponent implements OnInit,OnDestroy {

  constructor() {     
    localStorage.clear();
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    localStorage.clear();
  }

}
