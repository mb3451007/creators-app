import { Component, OnInit, OnDestroy } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
} from 'agora-rtc-sdk-ng';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
})
export class LivestreamComponent implements OnInit, OnDestroy {
  private client: IAgoraRTCClient;
  private localAudioTrack: ILocalAudioTrack;
  private localVideoTrack: ILocalVideoTrack;
  private APP_ID = '869766876d184dbc9416f0874d876fed'; // Replace with your Agora App ID
  private TOKEN = null; // Replace with your Agora Token
  private CHANNEL: string;
  activeStreams: any = [];
  userData: any;
  streamJoined: boolean = false;

  constructor(
    private authService: AuthService,
    private socket: SocketService,
    private postService: PostService
  ) {
    this.authService.user$.subscribe((user) => {
      this.userData = user;
      this.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
      if (this.userData.role === 'creator') {
        this.client.setClientRole('host');
      }
    });
  }

  ngOnInit() {
    // Join the channel

    // await this.client.join(this.APP_ID, this.CHANNEL, this.TOKEN, null);
    // // console.log('User joined channel:', this.CHANNEL);

    // if (this.userData.role === 'creator') {
    //   // Create local tracks for the creator
    //   [this.localAudioTrack, this.localVideoTrack] =
    //     await AgoraRTC.createMicrophoneAndCameraTracks();

    //   // Publish the local tracks
    //   await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
    //   // console.log('Local tracks published');

    //   // Play the local video track
    //   this.localVideoTrack.play('local-video');

    //   this.socket.emit('stream-start', {
    //     channel: this.CHANNEL,
    //     creator: this.userData.name,
    //   });
    // }

    // // Subscribe to remote users
    // this.client.on('user-published', async (user, mediaType) => {
    //   await this.client.subscribe(user, mediaType);
    //   // console.log('User published:', user);

    //   if (mediaType === 'video') {
    //     const remoteVideoTrack = user.videoTrack;
    //     remoteVideoTrack.play('remote-video'); // Play the remote video in the div with id 'remote-video'
    //   }

    //   if (mediaType === 'audio') {
    //     const remoteAudioTrack = user.audioTrack;
    //     remoteAudioTrack.play();
    //   }
    // });
    this.socket.on('active-streams', (streams) => {
      this.activeStreams = streams;
      console.log(this.activeStreams, 'Active Streams are Here-------------');
    });
  }

  ngOnDestroy() {
    if (this.userData.role === 'creator') {
      // Stop and release the local tracks
      this.localAudioTrack.close();
      this.localVideoTrack.close();
      this.socket.emit('stream-end', { channelName: this.CHANNEL });
    }
    this.client.leave();
    this.streamJoined = false;
    // console.log('User left the channel');
  }
  async joinStream(stream: any) {
    this.CHANNEL = stream.channel;
    await this.client.join(this.APP_ID, this.CHANNEL, this.TOKEN, null);
    console.log('User joined channel: ', this.CHANNEL);
    this.client.on('user-published', async (user, mediaType) => {
      await this.client.subscribe(user, mediaType);
      console.log('User published:', user);
      this.streamJoined = true;

      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play('remote-video');
      }

      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });
  }

  async startStream() {
    this.CHANNEL = this.userData._id;
    await this.client.join(this.APP_ID, this.CHANNEL, this.TOKEN, null);

    [this.localAudioTrack, this.localVideoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks();

    await this.client.publish([this.localAudioTrack, this.localVideoTrack]);

    this.localVideoTrack.play('local-video');

    this.socket.emit('stream-start', {
      channel: this.CHANNEL,
      creator: this.userData.name,
    });
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
}
