import { Controller, Get } from '@nestjs/common';
import { AppService, IUserInfo } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get-tweets')
  getTweeting(): IUserInfo[] {
    return this.appService.getTweeting();
  }
}
