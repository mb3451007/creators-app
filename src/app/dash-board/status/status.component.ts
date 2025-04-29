import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  message: string = '...';

  constructor(private route: ActivatedRoute) {
    this.checkStatus();
  }

  checkStatus() {
    this.route.queryParams.subscribe((param: any) => {
      const status = param['status'];

      if (status === 'success') {
        this.message = 'Subscribed to creator successfully';
      } else if (status === 'failure') {
        this.message = 'Error Occured! Please try again';
      }
    });
  }
}
