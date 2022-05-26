import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database.provider';
import { LoggerMiddleware } from './logger.middleware';
import { UserRoleModule } from './user_role/user_role.modules';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { MessageModule } from './messages/message.modules';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    UserRoleModule,
    UserModule,
    LoginModule,
    MessageModule,
    MenuModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
