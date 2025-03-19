import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { DiscoverComponent } from './discover/discover.component';
import { SuggestedCreatorComponent } from './suggested-creator/suggested-creator.component';
import { DashBoardComponent } from './dash-board.component';
import { authGuard } from '../guards/auth.guard';
import { FollowingComponent } from './following/following.component';
import { LivestreamComponent } from './livestream/livestream.component';
import { NotificationComponent } from './notification/notification.component';
import { PostComponent } from './post/post.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PackageComponent } from './package/package.component';
// import { DashBoardComponent } from './dash-board.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashBoardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'newsfeed', component: NewsFeedComponent },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile-module.module').then(
            (m) => m.ProfileModuleModule
          ),
      },
      { path: 'messages', component: MessagesComponent },
      { path: 'livestream', component: LivestreamComponent },

      {
        path: 'setting',
        loadChildren: () =>
          import('./settings/setting.module').then(
            (m) => m.SettingModuleModule
          ),
      },
      { path: 'discover', component: DiscoverComponent },
      { path: 'package', component: PackageComponent },
      { path: 'suggested', component: SuggestedCreatorComponent },
      { path: 'following', component: FollowingComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'post/:postId', component: PostComponent },
      { path: 'home', component: HomeComponent },
      { path: 'user/:userId', component: UserProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashBoardRoutingModule {}
