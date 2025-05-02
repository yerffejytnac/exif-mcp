import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/index.js';

/**
 * Main entry point for the exif-mcp server
 */
async function main() {
  try {
    console.error('Starting exif-mcp server...');
    
    // Create the MCP server
    const server = new McpServer({ 
      name: 'exif-mcp', 
      version: '1.0.0',
      description: 'Extract image metadata using exifr'
    });
    
    // Register all tools
    registerTools(server);
    
    // Connect using stdio transport
    console.error('Connecting to stdio transport...');
    await server.connect(new StdioServerTransport());
    
    console.error('exif-mcp server is running!');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.error('Shutting down exif-mcp server...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.error('Shutting down exif-mcp server...');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting exif-mcp server:', error);
    process.exit(1);
  }
}

// Run the server
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});