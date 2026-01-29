import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  @Get('hello')
  hello(){
    return {
      message: 'Backend is running'
    }
  }
  
}
