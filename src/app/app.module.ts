import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DashBoardModule } from './dash-board/dash-board.module';
import { FanvueLoginComponent } from './fanvue-login/fanvue-login.component';


@NgModule({
  declarations: [
    AppComponent,
    FanvueLoginComponent
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    // ReactiveFormsModule,
    BrowserAnimationsModule,
    DashBoardModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
