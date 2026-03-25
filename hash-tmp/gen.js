const fs = require('fs');
const bcrypt = require('bcryptjs');

// To force $2a$ prefix for Spring Boot compatibility (though bcryptjs defaults to $2a$)
const salt = bcrypt.genSaltSync(10);
const adminHash = bcrypt.hashSync('admin123', salt);
const bankHash = bcrypt.hashSync('bank123', salt);

const content = `ADMIN=${adminHash}\nBANK=${bankHash}\n`;
fs.writeFileSync('C:/Users/DELL/Desktop/cms/hash-tmp/out.txt', content);
