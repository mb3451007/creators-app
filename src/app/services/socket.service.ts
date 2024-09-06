import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { env } from '../environments/env.development';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private peerConnection: RTCPeerConnection;
  private iceCandidatesQueue: RTCIceCandidate[] = [];
  private remoteDescriptionSet: boolean = false;

  constructor() {
    this.socket = io(`${env.baseURL}`, {
      withCredentials: true,
      forceNew: true,
    });
    this.peerConnection = new RTCPeerConnection();

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById(
        'remoteVideo'
      ) as HTMLVideoElement;

      if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Handle receiving an offer and sending back an answer
    this.socket.on('offer', async (data: any) => {
      const { offer, broadcasterId } = data;
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      this.remoteDescriptionSet = true;
      await this.processIceCandidateQueued();

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', { answer, broadcasterId });
    });

    // Handle receiving an answer
    this.socket.on('answer', async (answer: any) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      this.remoteDescriptionSet = true;
      await this.processIceCandidateQueued();
    });

    // Handle ICE candidates
    this.socket.on('ice-candidate', async (candidate: any) => {
      const iceCandidate = new RTCIceCandidate(candidate);
      if (this.remoteDescriptionSet) {
        this.peerConnection.addIceCandidate(iceCandidate);
      } else {
        this.iceCandidatesQueue.push(iceCandidate);
      }
    });
  }

  private async processIceCandidateQueued() {
    while (this.iceCandidatesQueue.length > 0) {
      const candidate = this.iceCandidatesQueue.shift();
      if (candidate) {
        await this.peerConnection.addIceCandidate(candidate);
      }
    }
  }

  // Method to start a stream
  async startStream(broadcasterId: string) {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    const localVideo = document.getElementById(
      'localVideo'
    ) as HTMLVideoElement;
    localVideo.srcObject = localStream;

    localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localStream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    const data = { offer: offer, broadcasterId: broadcasterId };
    this.socket.emit('offer', data); // Emit offer to the server
  }

  // Method to watch a stream
  async watchStream(broadcasterId: string) {
    this.socket.emit('watch-stream', broadcasterId); // Request to watch the stream

    this.socket.on('offer', async (data: any) => {
      const { offer } = data;
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      this.remoteDescriptionSet = true;
      await this.processIceCandidateQueued();

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', {
        answer: answer,
        broadcasterId: broadcasterId,
      }); // Send answer to the server
    });

    this.socket.on('stream-not-found', (message: any) => {
      console.error(message.message); // Handle the case where the stream is not found
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string, callback: (date: any) => void) {
    this.socket.on(event, callback);
  }

  addUser(userId: string, name: string): void {
    const data = { userId, name };
    this.emit('AddUser', data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
