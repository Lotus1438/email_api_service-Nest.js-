import { Module , MiddlewareConsumer} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationMiddleware } from './authentication.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    AppService,
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('/user');
  }
}
