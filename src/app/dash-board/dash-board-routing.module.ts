import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { DiscoverComponent } from './discover/discover.component';
import { SuggestedCreatorComponent } from './suggested-creator/suggested-creator.component';
import { DashBoardComponent } from './dash-board.component';
// import { DashBoardComponent } from './dash-board.component';

const routes: Routes = [
   {path:'dashboard',component:DashBoardComponent,children:[
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {path:'home',component:HomeComponent},
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile-module.module').then(m => m.ProfileModuleModule)
    },
    {path:'messages',component:MessagesComponent},
    {path:'setting',
      loadChildren: () => import('./settings/setting.module').then(m => m.SettingModuleModule)
    },
    {path:'discover',component:DiscoverComponent},
    {path:'suggested',component:SuggestedCreatorComponent}
  
   ]},

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashBoardRoutingModule { }