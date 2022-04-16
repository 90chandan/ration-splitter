import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RationComponent } from './views/ration/ration.component';
import { ItemComponent } from './views/item/item.component';
import { UserComponent } from './views/user/user.component';
import { MemberlistComponent } from './views/memberlist/memberlist.component';
import { PaneDirective } from './views/pane.directive';


import {RationCalculatorService} from 'src/app/services/ration-calculator.service';
import {PdfGenerateService} from 'src/app/services/pdf-generate.service'



// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
  declarations: [
    AppComponent,
    RationComponent,
    ItemComponent,
    UserComponent,
    MemberlistComponent,
    PaneDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
    // BrowserAnimationsModule
    
  ],
  entryComponents:[
    UserComponent,
    ItemComponent
  ],
  providers: [
    RationCalculatorService,
    PdfGenerateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
