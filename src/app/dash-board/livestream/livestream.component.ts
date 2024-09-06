import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
})
export class LivestreamComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  userData: any;
  availableStreams: any[] = [];
  selectedStream: string | null = null;
  messages: any[] = [];

  private peerConnection: RTCPeerConnection;
  private targetId: string | null = null;
  private localStream: MediaStream | null = null;

  constructor(
    private socketService: SocketService,
    private authService: AuthService
  ) {
    this.peerConnection = new RTCPeerConnection(); // Initialize peer connection
    this.peerConnection.onicecandidate =
      this.handleICECandidateEvent.bind(this);
    this.peerConnection.ontrack = this.handleTrackEvent.bind(this);
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userData = user;

        if (this.userData.role === 'subscriber') {
          this.socketService.on('streams-available', (streams: any) => {
            this.availableStreams = Object.keys(streams);
            console.log(this.availableStreams, '----------------------------');
          });

          this.socketService.on('offer', (data: any) => {
            const { offer, broadcasterId } = data;
            this.targetId = broadcasterId;
            this.peerConnection
              .setRemoteDescription(new RTCSessionDescription(offer))
              .then(() => this.peerConnection.createAnswer())
              .then((answer) => this.peerConnection.setLocalDescription(answer))
              .then(() => {
                this.socketService.emit('answer', {
                  answer: this.peerConnection.localDescription,
                  broadcasterId: this.targetId,
                });
              })
              .catch(console.error);
          });

          this.socketService.on(
            'ice-candidate',
            (candidate: RTCIceCandidate) => {
              this.peerConnection
                .addIceCandidate(new RTCIceCandidate(candidate))
                .catch(console.error);
            }
          );
        }
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  startStream() {
    if (this.userData.role === 'creator') {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.localStream = stream;
          const localVideo = document.getElementById(
            'localVideo'
          ) as HTMLVideoElement;
          if (localVideo) {
            localVideo.srcObject = stream;
          }
          stream
            .getTracks()
            .forEach((track) => this.peerConnection.addTrack(track, stream));
          this.peerConnection
            .createOffer()
            .then((offer) => this.peerConnection.setLocalDescription(offer))
            .then(() => {
              this.socketService.emit('offer', {
                offer: this.peerConnection.localDescription,
                broadcasterId: this.userData._id,
              });
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
  }

  joinStream(streamId: string) {
    this.selectedStream = streamId;
    this.socketService.emit('watch-stream', streamId);
  }

  private handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      this.socketService.emit('ice-candidate', {
        candidate: event.candidate,
        targetId: this.targetId,
      });
    }
  }

  private handleTrackEvent(event: RTCTrackEvent) {
    const remoteVideo = document.getElementById(
      'remoteVideo'
    ) as HTMLVideoElement;
    if (remoteVideo) {
      remoteVideo.srcObject = event.streams[0];
    }
  }
}
