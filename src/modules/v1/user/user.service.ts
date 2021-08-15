import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(protected readonly name: string) {
    this.name = name;
  }
}
