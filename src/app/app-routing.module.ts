import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FanvueLoginComponent } from './fanvue-login/fanvue-login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {path:'login',component:FanvueLoginComponent},
  // {
  //   path: '',
  //   loadChildren: () => import('./dash-board/dash-board.module').then((m) => m.DashBoardModule)
  // },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
