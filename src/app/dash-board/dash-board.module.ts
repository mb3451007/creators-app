import { NgModule } from '@angular/core';
import { DashBoardRoutingModule } from './dash-board-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashBoardComponent } from './dash-board.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { SuggestedCreatorComponent } from './suggested-creator/suggested-creator.component';
import { DiscoverComponent } from './discover/discover.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ProfileModuleModule } from './profile/profile-module.module';
import { SettingModuleModule } from './settings/setting.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { TimeAgoPipe } from '../pipes/timeago.pipe';
import { LivestreamComponent } from './livestream/livestream.component';
import { ModalComponent } from '../modal/modal.component';
import { FollowingComponent } from './following/following.component';
import { NotificationComponent } from './notification/notification.component';
import { PostComponent } from './post/post.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PackageComponent } from './package/package.component';

@NgModule({
  declarations: [
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MessagesComponent,
    SuggestedCreatorComponent,
    DiscoverComponent,
    DashBoardComponent,
    TimeAgoPipe,
    LivestreamComponent,
    ModalComponent,
    FollowingComponent,
    NotificationComponent,
    PostComponent,
    NewsFeedComponent,
    UserProfileComponent,
    PackageComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    DashBoardRoutingModule,
    ProfileModuleModule,
    SettingModuleModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  bootstrap: [DashBoardComponent],
})
export class DashBoardModule {}
