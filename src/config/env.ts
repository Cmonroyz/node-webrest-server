import 'dotenv/config';
import { get } from 'env-var';


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  PUBLIC_PATH: get('PUEBLIC_PATH').default('public').asString(),
}