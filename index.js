const path=require('path');
const p='/Users/adi/Documents/Study/Trimester 4/Development/Express/Course.txt'
const dirName=path.dirname(p);
const extention=path.extname(p);    
console.log(dirName);
console.log(extention);