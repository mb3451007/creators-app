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
export class MessagesComponent implements OnInit {
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
  activeUsers: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  limit: number = 4;

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

  // ngOnDestroy(): void {}

  initializeSocketConnection() {
    this.subscription.add(
      this.socketService.on(
        'getMessage',
        this.handleIncomingMessages.bind(this)
      )
    );
    this.subscription.add(
      this.socketService.on('user-activated', (userId) => {
        this.conversations.forEach((conversation) => {
          conversation.members.forEach((member) => {
            if (member._id === userId) {
              member.active = true;
            }
          });
        });
      })
    );
    this.subscription.add(
      this.socketService.on('user-deactivated', (userId) => {
        this.conversations.forEach((conversation) => {
          conversation.members.forEach((member) => {
            if (member._id === userId) {
              member.active = false;
            }
          });
        });
      })
    );
  }
  fetchConversations() {
    this.conversationService.getAllConversations().subscribe({
      next: (response: Conversation[]) => {
        this.conversations = response;
        console.log(this.conversations);
        if (this.conversations.length > 0) {
          this.fetchMessages(this.conversations[0]._id);
        }
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  fetchMessages(conversationId: string, page: number = 1) {
    const limit = 4;

    this.messageService.getAllMessages(conversationId, limit, page).subscribe({
      next: (response: Message[]) => {
        if (page === 1) {
          this.messages = response;
        } else {
          this.messages = [...response, ...this.messages];
        }

        this.currentMessageConversation = this.conversations.find(
          (conversation) => conversation._id === conversationId
        );

        this.receiverID = this.getOtherMemberIndexInConversations(
          this.currentMessageConversation
        );
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
  }

  sendMessage(conversationId: string, username: string, receiverId: string) {
    if (this.messageForm.valid) {
      this.messageService
        .sendMessage(this.messageForm.value?.message, conversationId)
        .subscribe({
          next: (repsonse) => {
            const currentDate = new Date();
            let data = {
              conversationId: conversationId,
              sender: this.currentUserId,
              username: username,
              createdAt: currentDate.toISOString(),
              receiverId: receiverId,
              message: this.messageForm.value?.message,
            };

            this.socketService.emit('sendMessage', data);

            this.handleIncomingMessages(data);
            this.messageForm.reset();
          },
          error: (error) => {
            console.log(error.error.message);
          },
        });
    }
  }
  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    if (scrollTop === 0 && !this.isLoading) {
      this.loadMoreMessages();
    }
  }
  loadMoreMessages(): void {
    this.isLoading = true;
    this.currentPage++; // Increment the page number to load older messages

    this.messageService
      .getAllMessages(
        this.currentMessageConversation._id,
        this.limit,
        this.currentPage
      )
      .subscribe({
        next: (response: Message[]) => {
          if (response.length > 0) {
            this.messages = [...response, ...this.messages]; // Prepend older messages
          } else {
            // No more messages to load
            this.currentPage--; // Go back to the previous page if there are no more messages
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error.error.message);
          this.isLoading = false;
        },
      });
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
