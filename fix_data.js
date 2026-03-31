const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('C:\\Users\\DELL\\Desktop\\cms\\frontend\\src\\pages');
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace setX(response.data.data)
  content = content.replace(/(set[A-Z]\w*)\(\s*response\.data\.data\s*\)/g, "$1(response.data.data?.content || response.data.data)");
  
  // Replace setX(res.data.data)
  content = content.replace(/(set[A-Z]\w*)\(\s*res\.data\.data\s*\)/g, "$1(res.data.data?.content || res.data.data)");

  // Replace setX(Array.isArray(response.data.data) ? response.data.data : [])
  content = content.replace(/(set[A-Z]\w*)\(\s*Array\.isArray\(response\.data\.data\)\s*\?\s*response\.data\.data\s*:\s*\[\]\s*\)/g, 
    "$1(response.data.data?.content || response.data.data || [])");
    
  // Replace Array.isArray checks for res.data.data
  content = content.replace(/(set[A-Z]\w*)\(\s*Array\.isArray\(res\.data\.data\)\s*\?\s*res\.data\.data\s*:\s*\[\]\s*\)/g, 
    "$1(res.data.data?.content || res.data.data || [])");

  // Arrays from Promise.all responses
  content = content.replace(/(set[A-Z]\w*)\(\s*responses\[(\d+)\]\.data\.data\s*\)/g, "$1(responses[$2].data.data?.content || responses[$2].data.data)");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed ' + path.basename(file));
    fixedCount++;
  }
});

console.log(`\nSuccessfully patched ${fixedCount} files.`);
