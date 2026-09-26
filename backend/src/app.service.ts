import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'REC Core API',
      timestamp: new Date().toISOString(),
      languages: ['fa', 'ru', 'en'],
    };
  }
}
