import { Injectable } from '@nestjs/common';
import { DbInfoInterface, MysqlConfigInterface, MysqlResponseInterface } from './interfaces';
const MySQLEvents = require('@rodrigogs/mysql-events');

@Injectable()
export class MysqlConsumerService {

  async setUpConsumer(config: MysqlConfigInterface, callback: (event: MysqlResponseInterface) => void): Promise<void> {
    const dbInfo = this.getDbInfoFromUrl(config.dbUrl);
    const dbInstance = this.getDbIntance(dbInfo);
    await dbInstance.start();
  
    dbInstance.addTrigger({
      name: config.name,
      expression: `${dbInfo.dbName}.${config.tableName}.*`,
      statement: MySQLEvents.STATEMENTS[config.statement],
      onEvent: callback,
    });
    
    dbInstance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    dbInstance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  }
    
  getDbIntance(dbInfo: DbInfoInterface) {
    return new MySQLEvents({
      host: dbInfo.host,
      port: dbInfo.port,
      user: dbInfo.user,
      password: dbInfo.password,
    }, {
      startAtEnd: true,
      excludedSchemas: {
        mysql: true,
      },
    });
  }

  getDbInfoFromUrl(dbUrl: string): DbInfoInterface {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: Number(url.port),
      user: url.username,
      password: url.password,
      dbName: url.pathname.split('/')[1]
    };
  }

}
