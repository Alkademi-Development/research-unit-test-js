import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

const localURL = 'http://192.168.18.174:4000/'; // isi url ini jika ingin menggunakan local
let appHost = process?.env?.BASE_URL || localURL;

if (localURL != '') {
  appHost = localURL;
}

export {
    appHost,
}