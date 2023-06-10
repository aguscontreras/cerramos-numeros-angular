import { DEFAULT_PARTY_NAME } from './constants';
import { PartyLike } from './party-like.model';

export class Party implements PartyLike {
  name: string;

  date: Date;

  readonly id: string;

  constructor(name?: string) {
    this.name = name ?? DEFAULT_PARTY_NAME;
    this.date = new Date();
    this.id = window.crypto.randomUUID();
  }
}
