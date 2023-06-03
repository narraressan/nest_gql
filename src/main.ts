import { bootstrap } from './App';

const { APP_PORT, ENV } = process.env;
bootstrap(parseInt(APP_PORT), ENV);
