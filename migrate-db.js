const { execSync } = require('child_process');

console.log('🔄 Updating database schema...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('🗄️ Pushing schema to database...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
  
  console.log('✅ Database migration completed successfully!');
  console.log('🚀 You can now start the application with: npm run dev');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('💡 Try running these commands manually:');
  console.log('   npx prisma generate');
  console.log('   npx prisma db push');
}