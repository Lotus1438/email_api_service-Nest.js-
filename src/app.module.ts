import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database.provider';
import { AuthenticationMiddleware } from './authentication.middleware';
import { RegisterModule } from './register/register.module';
import { RegisterService } from './register/register.service';

@Module({
  imports: [RegisterModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService, RegisterService],
  exports: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
