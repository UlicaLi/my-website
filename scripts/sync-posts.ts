import fs from 'node:fs';
import path from 'node:path';

// 配置
const SOURCE_DIR = '/Users/ulica/Documents/tech_stack';
const TARGET_DIR = path.join(process.cwd(), 'public/posts');
const MANIFEST_FILE = path.join(TARGET_DIR, 'manifest.json');

// 确保目标目录存在
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// 清空目标目录（保留目录本身，删除文件）
// 注意：这会删除 public/posts 下的所有文件，请确保该目录只用于存放同步的文件
const files = fs.readdirSync(TARGET_DIR);
for (const file of files) {
  if (file === 'manifest.json') continue; // 稍后会覆盖
  fs.unlinkSync(path.join(TARGET_DIR, file));
}

// 检查源目录是否存在
if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Source directory not found: ${SOURCE_DIR}`);
  console.warn('Skipping markdown sync.');
  // 创建一个空的 manifest 以防前端报错
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify([], null, 2));
  process.exit(0);
}

// 读取源目录并复制 .md 文件
const sourceFiles = fs.readdirSync(SOURCE_DIR);
const manifest: { fileName: string; title: string; lastModified: string }[] = [];

console.log(`Syncing markdown files from ${SOURCE_DIR} to ${TARGET_DIR}...`);

for (const file of sourceFiles) {
  if (path.extname(file).toLowerCase() === '.md') {
    const sourcePath = path.join(SOURCE_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);

    // 复制文件
    fs.copyFileSync(sourcePath, targetPath);

    // 获取文件信息
    const stats = fs.statSync(sourcePath);
    
    // 添加到清单
    manifest.push({
      fileName: file,
      // 简单的标题处理：去除扩展名
      title: path.basename(file, '.md'),
      lastModified: stats.mtime.toISOString()
    });

    console.log(`  -> Copied: ${file}`);
  }
}

// 写入清单文件
fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
console.log(`Synced ${manifest.length} files. Manifest generated.`);
