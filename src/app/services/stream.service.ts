import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../environments/env.development';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  constructor(private http: HttpClient) {}

  getStreams() {
    return this.http.get(`${env.baseURL}/streams/`);
  }
}
