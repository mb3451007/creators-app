import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MessagesComponent } from './component/messages/messages.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {
    path: 'profile',
    loadChildren: () => import('./component/profile/profile-module.module').then(m => m.ProfileModuleModule)
  },
  {path:'messages',component:MessagesComponent},
  {path:'setting',
    loadChildren: () => import('./component/settings/setting.module').then(m => m.SettingModuleModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
