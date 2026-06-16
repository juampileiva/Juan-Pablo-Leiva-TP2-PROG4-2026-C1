import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PublicationsModule } from './publications/publications.module';

@Module({
  imports: [
    // Conexión principal a la base de datos MongoDB local
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/red-social-db'),
    AuthModule,
    UsersModule,
    PublicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}