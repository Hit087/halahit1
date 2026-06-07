const b = require('bcryptjs');
const fs = require('fs');
b.hash('susu.s.hit2279', 10).then(h => {
  fs.writeFileSync('myhash.txt', h);
  console.log('saved!');
});