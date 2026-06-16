import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PublicationsModule } from './publications/publications.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/red-social-tp2'),
    UsersModule,
    AuthModule,
    PublicationsModule,
  ],
})
export class AppModule {}
