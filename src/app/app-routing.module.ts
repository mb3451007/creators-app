import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MessagesComponent } from './component/messages/messages.component';
import { SettingsComponent } from './component/settings/settings.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {
    path: 'profile',
    loadChildren: () => import('./component/profile/profile-module.module').then(m => m.ProfileModuleModule)
  },
  // { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path:'messages',component:MessagesComponent},
  {path:'setting',component:SettingsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
