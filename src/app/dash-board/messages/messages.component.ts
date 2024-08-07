import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConversationService } from 'src/app/services/conversation.service';
import { MessageService } from 'src/app/services/message.service';
import { PostService } from 'src/app/services/post.service';
import { Conversation } from 'src/app/models/conversation';
import { Message } from 'src/app/models/message';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  constructor(
    private conversationService: ConversationService,
    private postService: PostService,
    private messageService: MessageService,
    private socketService: SocketService,
    private Authservice: AuthService
  ) {}
  conversations: Conversation[] = [];
  messages: Message[] = [];
  selectedDiv: number = 0;
  showHide: boolean = true;
  activeDiv: number = 1;
  currentMessageConversation: Conversation | null = null;
  receiverID: number;
  currentUser: User | null = null;
  currentUserId: string | null = null;

  messageForm = new FormGroup({
    message: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.fetchConversations();
    this.Authservice.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserId = user._id;
        this.initializeSocketConnection();
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.subscription.unsubscribe();
  }

  initializeSocketConnection() {
    this.socketService.addUser(this.currentUser._id, this.currentUser.name);
    this.subscription.add(
      this.socketService.on(
        'getMessage',
        this.handleIncomingMessages.bind(this)
      )
    );
  }
  fetchConversations() {
    this.conversationService.getAllConversations().subscribe({
      next: (response: Conversation[]) => {
        this.conversations = response;
        if (this.conversations.length > 0) {
          this.fetchMessages(this.conversations[0]._id);
        }
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  fetchMessages(conversationId) {
    this.messageService.getAllMessages(conversationId).subscribe({
      next: (response: Message[]) => {
        this.messages = response;
        this.currentMessageConversation = this.conversations.find(
          (conversation) => conversation._id === conversationId
        );
        console.log(this.currentMessageConversation);
        this.receiverID = this.getOtherMemberIndexInConversations(
          this.currentMessageConversation
        );
        console.log(this.receiverID);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  getOtherMemberIndexInConversations(conversation: any) {
    return conversation.members.findIndex(
      (member) => member._id !== this.currentUserId
    );
  }

  getCurrentMemebersIdInConversation(): number {
    for (const conversation of this.conversations) {
      const memberIndex = conversation.members.findIndex((member) => {
        return member._id !== this.conversationService.userId;
      });
      if (memberIndex !== -1) {
        return memberIndex;
      }
    }
    return -1;
  }

  getConversationDetails(conversationId) {
    this.currentMessageConversation = this.conversations.find(
      (conversation) => conversation._id === conversationId
    );
  }

  handleIncomingMessages(data: any) {
    this.messages.push(data);
    console.log(this.messages);
  }

  sendMessage(conversationId: string, username: string, receiverId: string) {
    console.log(
      'conversationId: ',
      conversationId,

      'username: ',
      username,
      'receiverId: ',
      receiverId
    );
    if (this.messageForm.valid) {
      this.messageService
        .sendMessage(this.messageForm.value?.message, conversationId)
        .subscribe({
          next: (repsonse) => {
            const currentDate = new Date();
            let data = {
              conversationId: conversationId,
              userId: this.conversationService.userId,
              username: username,
              createdAt: currentDate.toISOString(),
              receiverId: receiverId,
              message: this.messageForm.value?.message,
            };

            this.socketService.emit('sendMessage', data);
            console.log('Sending msg-------------------------');
            this.handleIncomingMessages(data);
            this.messageForm.reset();
          },
          error: (error) => {
            console.log(error.error.message);
          },
        });
    }
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }

  selectDiv(divNumber: number): void {
    this.selectedDiv = divNumber;
  }
  setActiveDiv(divNumber: number) {
    this.activeDiv = divNumber;
  }
  chatHide() {
    this.showHide = true;
  }

  mediaHide() {
    this.showHide = false;
  }
}
