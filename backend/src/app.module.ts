import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { RoomsModule } from '@/rooms/rooms.module';
import { ChatModule } from '@/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'chatdb',
        autoLoadEntities: true,
        synchronize: true,
        dropSchema: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RoomsModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
