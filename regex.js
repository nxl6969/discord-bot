let date = 'Jan 1987';
let reg = /(\w+ (\d+))/;

let result = date.match(reg);
console.log(result[2]);
