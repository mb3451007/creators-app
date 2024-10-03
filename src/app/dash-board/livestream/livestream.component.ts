import { Component } from '@angular/core';
import Peer from 'peerjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
})
export class LivestreamComponent {
  peer: any;
  userData: any;
  myVideoStream: MediaStream | undefined;
  videoGrid: HTMLElement | null = null;

  constructor(private socket: SocketService, private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  ngOnInit(): void {
    this.videoGrid = document.getElementById('video-grid');

    // Create a video element for own stream
    const myVideo = document.createElement('video');
    myVideo.muted = true;

    // PeerJS setup
    this.peer = new Peer(undefined, {
      path: 'peerjs',
      host: '/',
      port: 3000,
    });

    // When the peer connects
    this.peer.on('open', (id) => {
      // Replace ROOM_ID with actual value or a variable
      this.socket.emit('join-room', {
        roomId: '1234',
        peerId: id,
      });
    });

    // Get video and audio stream from user's camera
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream: MediaStream) => {
        this.myVideoStream = stream;
        this.addVideoStream(myVideo, stream);

        // Answer peer calls with your stream
        this.peer.on('call', (call: any) => {
          call.answer(stream); // Answer the call with the current stream
          const video = document.createElement('video');
          call.on('stream', (userVideoStream: MediaStream) => {
            this.addVideoStream(video, userVideoStream);
          });
        });

        // Handle user-connected event from socket
        this.socket.on('user-connected', (userId: string) => {
          this.connectNewUser(userId, stream);
        });
      });
  }

  // Function to connect to new user
  connectNewUser(userId: string, stream: MediaStream): void {
    const call = this.peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream: MediaStream) => {
      this.addVideoStream(video, userVideoStream);
    });
  }

  // Add a video stream to the grid
  addVideoStream(video: HTMLVideoElement, stream: MediaStream): void {
    video.srcObject = stream;
    this.videoGrid?.append(video);
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
}
