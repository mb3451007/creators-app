import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { env } from 'src/app/environments/env.development';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: any = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getSubscriptions();
  }

  getSubscriptions() {
    this.http.get(`${env.baseURL}/stripe/subscriptions`).subscribe({
      next: (response) => {
        this.subscriptions = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  formatHumanDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  cancelSubscription(subsriptionId: string) {
    this.http
      .post(`${env.baseURL}/stripe/subscription/cancel`, {
        subscriptionId: subsriptionId,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: any) => {
          if (error.status === 400 && error.error.endDate) {
            const endDate = this.formatHumanDate(error.error.endDate);
            alert(
              `The Subscription is already unsubscribed and will end on: ${endDate} `
            );
          }
          console.log(error);
        },
      });
  }
}
