const fs = require('fs');
const path = require('path');

// 清理函数
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        cleanDirectory(filePath);
        // 删除空目录
        try {
          fs.rmdirSync(filePath);
        } catch (e) {
          // 目录不为空，跳过
        }
      } else {
        // 删除文件
        fs.unlinkSync(filePath);
      }
    });
  }
}

// 需要清理的目录
const dirsToClean = [
  'node_modules/.cache',
  'dist',
  'unpackage',
  '.hbuilderx'
];

console.log('开始清理缓存文件...');

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`清理目录: ${dir}`);
    cleanDirectory(dir);
  }
});

console.log('清理完成！');
console.log('请重新运行 npm install 和编译命令');
