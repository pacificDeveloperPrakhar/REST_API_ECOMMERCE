const { colorReset, color } = require("./src/utils/color_codes");

const host = process.env.host || 'localhost';
const port = process.env.port || '3000';

const bgBlue = '\x1b[44m';
const whiteText = '\x1b[37m';
const reset = '\x1b[0m';
console.log('------------------------------------------------------------------------------------------------------------')
console.log(`${'\x1b[41m'}Endpoints for the services${reset}`)
console.log()
console.log(`products: ${bgBlue}${whiteText}  http://${host}:${port}/api/v1/products${reset}`);
