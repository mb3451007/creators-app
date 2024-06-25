import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting-routing.module';
import { AccountComponent } from './account/account.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { CreatorComponent } from './creator/creator.component';
import { PaymentComponent } from './payment/payment.component';
import { NotificationComponent } from './notification/notification.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SupportComponent } from './support/support.component';

@NgModule({
    declarations: [
      SettingsComponent,
       AccountComponent,
       CreatorComponent,
       PaymentComponent,
       NotificationComponent,
       PrivacyComponent,
       SupportComponent
  ],
    imports: [
      CommonModule,
      SettingRoutingModule,
      RouterModule
    ]
    
  })
  export class SettingModuleModule { }