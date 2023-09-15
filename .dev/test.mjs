import paparse from 'papaparse';
import fs from 'fs';

var file = fs.readFileSync('./formations.csv').toString();

var csv = paparse.parse(file);

console.log(csv.data);