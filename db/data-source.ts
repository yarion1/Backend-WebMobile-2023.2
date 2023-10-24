import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    database: 'postgres',
    host: 'localhost',
    password: 'postgres',
    username: 'postgres',
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/src/migrations/**/*.js"]
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;
