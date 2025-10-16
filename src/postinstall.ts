#!/usr/bin/env node

/**
 * Post-install script to guide users on setup
 */

console.log('\n✅ MCP Image Compare Server installed successfully!\n');
console.log('📚 Next steps:\n');
console.log('1. Install Playwright browser:');
console.log('   npx playwright install chromium\n');
console.log('2. Configure Claude Desktop:');
console.log('   - Windows: %APPDATA%\\Claude\\claude_desktop_config.json');
console.log('   - macOS: ~/Library/Application Support/Claude/claude_desktop_config.json\n');
console.log('3. Add this configuration:\n');
console.log('   {');
console.log('     "mcpServers": {');
console.log('       "image-compare": {');
console.log('         "command": "npx",');
console.log('         "args": ["-y", "mcp-image-compare-server"]');
console.log('       }');
console.log('     }');
console.log('   }\n');
console.log('4. Restart Claude Desktop\n');
console.log('📖 Documentation: https://github.com/yourusername/mcp-image-compare-server\n');
console.log('🎉 Happy comparing!\n');

