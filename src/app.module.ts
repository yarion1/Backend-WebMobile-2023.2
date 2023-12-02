import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { ApiServiceModule } from './api-service/api-service.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
    imports: [ConfigModule.forRoot(), TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useClass: TypeOrmConfigService,
    }),
        AuthModule,
        UsersModule,
        PlaylistsModule,
        ApiServiceModule,
        FavoritesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
