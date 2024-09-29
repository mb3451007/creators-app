import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
})
export class LivestreamComponent implements OnInit {
  constructor(private socket: SocketService, private auth: AuthService) {}
  @ViewChild('localVideo', { static: false }) localVideo: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;
  private localStream: MediaStream;
  private peerConnection: RTCPeerConnection;
  userData: any;
  private readonly config: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
  streamActive: boolean = false;
  private subscription: Subscription = new Subscription();
  availableStreams: any = [];

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userData = user;
    });
    this.subscription.add(
      this.socket.on('signal', (data) => {
        console.log(data);
        this.handleSignal(data);
      })
    );
    this.subscription.add(
      this.socket.on('streams', (data) => {
        console.log(data, '------------Here');
        this.availableStreams = data;
      })
    );
  }

  //start stream
  async startStream() {
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
      console.log('Got Error: ', err);
    }
  }

  // stop stream
  stopStream() {
    this.localStream.getTracks().forEach((track) => {
      track.stop();
    });
    this.localVideo.nativeElement.srcObject = null;

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.streamActive = false;
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.config);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('signal', { candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      console.log('Received remote stream:', stream);

      if (this.remoteVideo && this.remoteVideo.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = stream;
        console.log('Stream assigned to remote video');
      } else {
        console.error('Remote video element is not available');
      }
    };
  }
  //handle signal
  async handleSignal(data: any) {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    if (data.description) {
      if (data.description.type === 'offer') {
        console.log('offer received');
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.description)
        );

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.socket.emit('signal', {
          description: this.peerConnection.localDescription,
        });
      } else if (data.description.type === 'answer') {
        console.log('answer  received');
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.description)
        );
      }
    } else if (data.candidate) {
      console.log('ice candidate  received');
      try {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (error) {
        console.error('Error adding ICE candidate: ', error);
      }
    }
  }
}
