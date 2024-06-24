import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ProfileComponent } from './component/profile/profile.component';
import { MessagesComponent } from './component/messages/messages.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { ProfileInfoComponent } from './component/profile-info/profile-info.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'profile',component:ProfileComponent},
  {path:'messages',component:MessagesComponent},
  {path:'editprofile',component:EditProfileComponent},
  {path:'profileinfo',component:ProfileInfoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
