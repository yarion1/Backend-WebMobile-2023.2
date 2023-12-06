import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: "127.0.0.1",
            port: +this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_NAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
            entities: [],
            synchronize: true,
            autoLoadEntities: true,
        };
    }
}