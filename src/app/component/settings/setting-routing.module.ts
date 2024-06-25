import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
  { path: '', component: SettingsComponent},
  //  {path:'account',component:AccountComponent} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SettingRoutingModule { }
  