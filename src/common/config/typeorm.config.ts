import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDataSourceFactory = async (options: DataSourceOptions) => {
  const datasource = await new DataSource(options).initialize();
  await datasource.runMigrations({ transaction: 'all' });
  return datasource;
};

export const getTypeormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> =>
  ({
    type: 'postgres',
    host: 'db',
    port: parseInt(configService.get('PG_PORT')),
    database: configService.get('PG_DB'),
    username: configService.get('PG_USER'),
    password: configService.get('PG_PASSWORD'),
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/typeorm/migrations/**/*.js'],
    autoLoadEntities: true,
    synchronize: false,
  } as TypeOrmModuleOptions);
