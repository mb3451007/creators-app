import { Member } from './member';

export class Conversation {
  _id: string = '';

  members: Member[] = [];
  createdAt: Date;

  constructor(
    _id: string = '',

    members: Member[] = [],
    createdAt: Date = new Date()
  ) {
    this._id = _id;

    this.members = members;
    this.createdAt = createdAt;
  }
}
