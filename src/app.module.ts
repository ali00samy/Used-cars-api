import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
import { ConfigModule, ConfigService } from '@nestjs/config'
const cookieSession = require('cookie-session')

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.${process.env.NODE_ENV}.env`,
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        entities: [User, Report],
      };
    },
  }),
  UsersModule,
  ReportsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor (private configSevice : ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: [this.configSevice.get('COOKIE_KEY')]
      }),
    )
    .forRoutes('*')
  }
}
