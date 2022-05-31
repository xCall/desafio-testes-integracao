import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'fin_api'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  console.log('🏦 successful database connection');
  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'fin_api' : host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'fin_api'
          : defaultOptions.database,
    }),
  );
};
