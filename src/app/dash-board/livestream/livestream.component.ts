import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
})
export class LivestreamComponent implements OnInit {
  @ViewChild('localVideo', { static: false })
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false })
  remoteVideo!: ElementRef<HTMLVideoElement>;

  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection;
  userData: any = null;
  selectedStream: any = null;
  streamActive: boolean = false;
  availableStreams: any[] = [];
  private subscription: Subscription = new Subscription();

  private readonly config: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  constructor(private socket: SocketService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userData = user;
    });

    this.subscription.add(
      this.socket.on('signal', (data) => {
        this.handleSignal(data);
      })
    );

    this.subscription.add(
      this.socket.on('streams', (data) => {
        this.availableStreams = data;
      })
    );
  }

  // Start stream
  async startStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.localVideo.nativeElement.srcObject = this.localStream;

      this.createPeerConnection();

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit('signal', {
        description: this.peerConnection.localDescription,
        userId: this.userData._id,
        role: this.userData.role,
      });

      this.streamActive = true;
    } catch (err) {
      console.error('Error starting stream: ', err);
    }
  }

  // Join stream
  async joinStream(streamId: string): Promise<void> {
    const stream = this.availableStreams.find((s) => s.userId === streamId);
    if (!stream) {
      console.error('Stream not found');
      return;
    }

    this.createPeerConnection();

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(stream.description)
      );

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('signal', {
        description: this.peerConnection.localDescription,
      });
    } catch (err) {
      console.error('Error joining stream: ', err);
    }
  }

  // Stop stream
  stopStream(): void {
    this.localStream?.getTracks().forEach((track) => track.stop());
    if (this.localVideo) {
      this.localVideo.nativeElement.srcObject = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null!;
    }

    this.streamActive = false;
  }

  // Create peer connection
  createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection(this.config);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('signal', { candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      const [stream] = event.streams;

      if (this.remoteVideo?.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = stream;
        console.log('Video stream assigned to remote receiver');
      } else {
        console.error('Remote video element is not available');
      }
    };
  }

  // Handle signal
  async handleSignal(data: any): Promise<void> {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    try {
      if (data.description) {
        if (data.description.type === 'offer') {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.description)
          );

          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);

          this.socket.emit('signal', {
            description: this.peerConnection.localDescription,
          });
        } else if (data.description.type === 'answer') {
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.description)
          );
        }
      } else if (data.candidate) {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    } catch (error) {
      console.error('Error handling signal: ', error);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.stopStream();
  }
}
