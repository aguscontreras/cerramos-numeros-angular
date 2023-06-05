export class Member {
  name: string;

  readonly id: string;

  constructor(name: string) {
    this.name = name;
    this.id = window.crypto.randomUUID();
  }
}
