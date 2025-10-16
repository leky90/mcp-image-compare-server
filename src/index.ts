#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError
} from '@modelcontextprotocol/sdk/types.js';
import { compareImages } from './tools/compare-images.js';
import { compareImageWithUrl } from './tools/compare-image-with-url.js';
import { compareUrls } from './tools/compare-urls.js';
import { closeBrowser } from './utils/screenshot.js';

// Create MCP server instance
const server = new Server(
    {
        name: 'mcp-image-compare-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Register list_tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'compare_images',
                description: 'Compare two local image files pixel by pixel. Supports PNG and JPEG formats. Returns the number of different pixels, percentage difference, and generates a diff image showing the differences.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        image1_path: {
                            type: 'string',
                            description: 'Absolute or relative path to the first image file'
                        },
                        image2_path: {
                            type: 'string',
                            description: 'Absolute or relative path to the second image file'
                        },
                        diff_output_path: {
                            type: 'string',
                            description: 'Optional: Path where the diff image will be saved. If not provided, a timestamped file will be created in the current directory.'
                        },
                        threshold: {
                            type: 'number',
                            description: 'Optional: Matching threshold (0-1). Lower values are more sensitive. Default: 0.1',
                            minimum: 0,
                            maximum: 1
                        },
                        includeAA: {
                            type: 'boolean',
                            description: 'Optional: If true, include anti-aliased pixels in the diff. Default: false'
                        }
                    },
                    required: ['image1_path', 'image2_path']
                }
            },
            {
                name: 'compare_image_with_url',
                description: 'Compare a local image file with a screenshot captured from a URL. Takes a screenshot of the webpage and compares it pixel by pixel with the provided image. Returns difference statistics and a diff image.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        image_path: {
                            type: 'string',
                            description: 'Absolute or relative path to the local image file'
                        },
                        url: {
                            type: 'string',
                            description: 'URL of the webpage to capture and compare'
                        },
                        diff_output_path: {
                            type: 'string',
                            description: 'Optional: Path where the diff image will be saved. If not provided, a timestamped file will be created.'
                        },
                        threshold: {
                            type: 'number',
                            description: 'Optional: Matching threshold (0-1). Lower values are more sensitive. Default: 0.1',
                            minimum: 0,
                            maximum: 1
                        },
                        includeAA: {
                            type: 'boolean',
                            description: 'Optional: If true, include anti-aliased pixels in the diff. Default: false'
                        }
                    },
                    required: ['image_path', 'url']
                }
            },
            {
                name: 'compare_urls',
                description: 'Compare screenshots from two different URLs. Captures screenshots of both webpages and compares them pixel by pixel. Returns difference statistics and a diff image showing the visual differences.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        url1: {
                            type: 'string',
                            description: 'URL of the first webpage to capture'
                        },
                        url2: {
                            type: 'string',
                            description: 'URL of the second webpage to capture'
                        },
                        diff_output_path: {
                            type: 'string',
                            description: 'Optional: Path where the diff image will be saved. If not provided, a timestamped file will be created.'
                        },
                        threshold: {
                            type: 'number',
                            description: 'Optional: Matching threshold (0-1). Lower values are more sensitive. Default: 0.1',
                            minimum: 0,
                            maximum: 1
                        },
                        includeAA: {
                            type: 'boolean',
                            description: 'Optional: If true, include anti-aliased pixels in the diff. Default: false'
                        }
                    },
                    required: ['url1', 'url2']
                }
            }
        ]
    };
});

// Register call_tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;

        switch (name) {
            case 'compare_images': {
                const result = await compareImages(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }

            case 'compare_image_with_url': {
                const result = await compareImageWithUrl(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }

            case 'compare_urls': {
                const result = await compareUrls(args as any);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }

            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                );
        }
    } catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        throw new McpError(
            ErrorCode.InternalError,
            `Error executing tool: ${error instanceof Error ? error.message : String(error)}`
        );
    }
});

// Graceful shutdown handler
async function cleanup() {
    try {
        await closeBrowser();
        await server.close();
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP Image Compare Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});

