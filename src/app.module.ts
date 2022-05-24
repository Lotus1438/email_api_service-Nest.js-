import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database.provider';
// import { AuthenticationMiddleware } from './authentication.middleware';
import { RegisterModule } from './register/register.module';
import { RegisterService } from './register/register.service';
import { LoggerMiddleware } from './utils/logger.middleware';
import { UserRoleModule } from './user_role/user_role.modules';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RegisterModule,
    UserRoleModule,
    UserModule,
    LoginModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, RegisterService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
