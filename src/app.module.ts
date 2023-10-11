import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigService} from './config/typeorm.config';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot(), TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useClass: TypeOrmConfigService,
    })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
