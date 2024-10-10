import { Component, OnDestroy, OnInit } from '@angular/core';
import Peer from 'peerjs';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
})
export class LivestreamComponent implements OnInit, OnDestroy {
  peer: any;
  userData: any;
  myVideoStream: MediaStream | undefined;
  videoGrid: HTMLElement | null = null;
  subscription: Subscription = new Subscription();
  activeStreams: any[] = [];
  constructor(
    private socket: SocketService,
    private auth: AuthService,
    private postService: PostService
  ) {
    this.auth.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  ngOnInit(): void {
    this.videoGrid = document.getElementById('video-grid');

    // Initialize PeerJS
    this.peer = new Peer(undefined, {
      path: 'peerjs',
      host: 'oboplatform.com',
      port: 3000,
      secure: true,
    });

    // Peer ID ready event
    this.peer.on('open', (id) => {
      console.log('Peer connected with ID:', id);
    });

    this.socket.addUser(this.userData._id, this.userData.name);

    // Listen for other user connections
    this.peer.on('call', (call: any) => {
      // Answer with your own stream if available (for streamer side)
      if (this.myVideoStream) {
        call.answer(this.myVideoStream); // Streamer answering a viewer's call
        const video = document.createElement('video');
        call.on('stream', (userVideoStream: MediaStream) => {
          this.addVideoStream(video, userVideoStream);
        });
      } else {
        // Viewer answers the call with no stream (if they don't have a stream)
        call.answer(); // Viewers don't send streams, they receive
        const video = document.createElement('video');
        call.on('stream', (userVideoStream: MediaStream) => {
          this.addVideoStream(video, userVideoStream); // Viewer receives the stream
        });
      }
    });

    // Handle new user connected to the room
    this.socket.on('user-connected', (userId: string) => {
      if (this.myVideoStream) {
        // Streamer connects to the viewer
        this.connectNewUser(userId, this.myVideoStream);
        console.log('User is connected', userId);
      }
    });
    this.subscription.add(
      this.socket.on('active-streams', (streams) => {
        console.log('Active streams received:', streams); // Add this line for debugging
        this.activeStreams = streams;
      })
    );
  }
  ngOnDestroy(): void {
    this.socket.disconnect();
    this.subscription.unsubscribe();
  }

  // Start the stream as a
  startStream(): void {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream: MediaStream) => {
        this.myVideoStream = stream;
        const myVideo = document.createElement('video');
        myVideo.muted = true;
        this.addVideoStream(myVideo, stream);

        // Notify server to join the room with the broadcaster's peer ID
        this.socket.emit('join-room', {
          roomId: this.userData._id, // Replace with actual room ID
          peerId: this.peer.id,
        });

        this.socket.emit('stream-started', {
          roomId: this.userData._id, // Replace with actual room ID
          peerId: this.peer.id,
        });
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });
  }

  // Viewer joins an existing stream
  joinStream(roomId: string): void {
    // Notify server to join the room as a viewer (no stream yet)
    this.socket.emit('join-room', {
      roomId: roomId, // Replace with actual room ID
      peerId: this.peer.id,
    });
  }

  // Streamer connects to a new viewer user
  connectNewUser(userId: string, stream: MediaStream): void {
    const call = this.peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream: MediaStream) => {
      this.addVideoStream(video, userVideoStream);
    });
  }

  // Add a video stream to the video grid
  addVideoStream(video: HTMLVideoElement, stream: MediaStream): void {
    video.srcObject = stream;
    this.videoGrid?.append(video);
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
}
