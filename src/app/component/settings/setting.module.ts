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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      SettingsComponent,
       AccountComponent,
       CreatorComponent,
       PaymentComponent,
       NotificationComponent,
       PrivacyComponent,
       SupportComponent,
  ],
    imports: [
      CommonModule,
      SettingRoutingModule,
      RouterModule,
      MatFormFieldModule, 
      MatInputModule, 
      MatIconModule,
      FormsModule,
    ]
    
  })
  export class SettingModuleModule { }