# MCP Image Compare Server

[![npm version](https://badge.fury.io/js/mcp-image-compare-server.svg)](https://www.npmjs.com/package/mcp-image-compare-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mcp-image-compare-server)](https://nodejs.org)

> **[Tiếng Việt](README-VN.md)** | English

A Model Context Protocol (MCP) server for pixel-perfect image comparison using [Pixelmatch](https://github.com/mapbox/pixelmatch) from Mapbox. Compare images, capture and compare screenshots, detect visual differences with precision.

## Features

- 🎯 **Pixel-perfect comparison** - Detect even single-pixel differences
- 🎨 **Perceptual color difference** - YIQ color space for human-like perception
- 🔍 **Anti-aliasing detection** - Smart detection and exclusion of anti-aliased pixels
- 📊 **Detailed statistics** - Pixel count, percentage, dimensions
- 🖼️ **Visual diff output** - Color-coded difference visualization
- 🌐 **Web screenshot support** - Compare with live websites
- 📁 **Multiple formats** - PNG and JPEG support
- ⚡ **Fast & lightweight** - ~60-80KB package size

## Quick Start

### Installation

```bash
# Install globally
npm install -g mcp-image-compare-server

# Install Chromium for screenshots
npx playwright install chromium
```

### Configuration

#### For Claude Desktop

Add to your Claude Desktop config file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "image-compare": {
      "command": "npx",
      "args": ["-y", "mcp-image-compare-server"]
    }
  }
}
```

Restart Claude Desktop after configuration.

#### For Cursor

Add to your Cursor MCP settings file:

**Windows:** `%APPDATA%\Cursor\User\globalStorage\mcp.json`  
**macOS:** `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`  
**Linux:** `~/.config/Cursor/User/globalStorage/mcp.json`

```json
{
  "mcpServers": {
    "image-compare": {
      "command": "npx",
      "args": ["-y", "mcp-image-compare-server"]
    }
  }
}
```

Or through Cursor settings:

1. Open Cursor Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "MCP"
3. Click "Edit in settings.json"
4. Add the configuration above

Restart Cursor after configuration.

### Usage

Ask in Claude Desktop or Cursor:

```
Compare image1.png and image2.png
```

That's it! 🎉

## Tools

### 1. compare_images

Compare two local image files.

**Parameters:**

- `image1_path` (string, required) - Path to first image
- `image2_path` (string, required) - Path to second image
- `diff_output_path` (string, optional) - Where to save diff image
- `threshold` (number, optional) - Comparison threshold (0-1), default 0.1
- `includeAA` (boolean, optional) - Include anti-aliased pixels, default false

**Example:**

```json
{
  "image1_path": "./screenshots/before.png",
  "image2_path": "./screenshots/after.png",
  "diff_output_path": "./diff-result.png",
  "threshold": 0.1
}
```

### 2. compare_image_with_url

Compare a local image with a screenshot from a URL.

**Parameters:**

- `image_path` (string, required) - Path to local image
- `url` (string, required) - URL to capture and compare
- `diff_output_path` (string, optional) - Where to save diff image
- `threshold` (number, optional) - Comparison threshold (0-1), default 0.1
- `includeAA` (boolean, optional) - Include anti-aliased pixels, default false

**Example:**

```json
{
  "image_path": "./design-mockup.png",
  "url": "https://example.com",
  "threshold": 0.15
}
```

### 3. compare_urls

Compare screenshots from two different URLs.

**Parameters:**

- `url1` (string, required) - First URL to capture
- `url2` (string, required) - Second URL to capture
- `diff_output_path` (string, optional) - Where to save diff image
- `threshold` (number, optional) - Comparison threshold (0-1), default 0.1
- `includeAA` (boolean, optional) - Include anti-aliased pixels, default false

**Example:**

```json
{
  "url1": "https://staging.example.com",
  "url2": "https://production.example.com"
}
```

## Output Format

All tools return JSON with detailed statistics:

```json
{
  "success": true,
  "diffPixels": 1234,
  "totalPixels": 921600,
  "percentDiff": 0.13,
  "width": 1280,
  "height": 720,
  "diffImagePath": "/path/to/diff.png",
  "message": "Comparison completed: 1234 pixels differ (0.13%)"
}
```

**Fields:**

- `success` - Operation status (true/false)
- `diffPixels` - Number of different pixels
- `totalPixels` - Total pixels in image
- `percentDiff` - Percentage difference
- `width` - Image width in pixels
- `height` - Image height in pixels
- `diffImagePath` - Path to generated diff image
- `message` - Human-readable result message
- `error` - Error message (if failed)

## Use Cases

### Visual Regression Testing

Compare UI before and after updates to catch unintended changes.

```
I have two screenshots:
- before-update.png
- after-update.png

Compare them and tell me what changed.
```

### Cross-browser Testing

Compare rendering across different browsers to ensure consistency.

### Design Review

Compare design mockups with actual implementation.

```
Compare design-mockup.png with https://myapp.com/landing
```

### A/B Testing

Compare different versions of the same page.

```
Compare:
- https://myapp.com/variant-a
- https://myapp.com/variant-b
```

### Mobile vs Desktop

Compare responsive layouts across different viewports.

## Configuration

### Threshold Values

The `threshold` parameter (0-1) controls comparison sensitivity:

- **0.0** - Very sensitive, detects smallest differences
- **0.1** - Default, good balance for most cases
- **0.3** - Less sensitive, ignores minor differences
- **1.0** - Least sensitive, only major differences

### Anti-aliasing

When `includeAA = false` (default), the server automatically detects and ignores anti-aliased pixels, reducing false positives from different rendering engines.

### Diff Image Colors

- **Red**: Different pixels
- **Yellow**: Anti-aliased pixels (if includeAA = true)
- **Faded**: Matching pixels (reduced opacity)

## Installation Methods

### Method 1: NPM Global (Recommended)

```bash
npm install -g mcp-image-compare-server
npx playwright install chromium
```

Configure Claude Desktop:

```json
{
  "command": "npx",
  "args": ["-y", "mcp-image-compare-server"]
}
```

### Method 2: NPX (No Installation)

Configure Claude Desktop:

```json
{
  "command": "npx",
  "args": ["-y", "mcp-image-compare-server"]
}
```

First run will download the package automatically.

### Method 3: From Source

```bash
git clone https://github.com/yourusername/mcp-image-compare-server.git
cd mcp-image-compare-server
npm install
npx playwright install chromium
npm run build
```

Configure Claude Desktop or Cursor:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/mcp-image-compare-server/dist/index.js"]
}
```

Replace `/absolute/path/to/mcp-image-compare-server` with your actual path.

## System Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 8.0.0 or higher
- **OS:** Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Disk:** ~500MB (includes Chromium browser)
- **RAM:** 2GB minimum

## Troubleshooting

### Server doesn't connect

1. Verify config path is correct
2. Ensure you ran `npm run build`
3. Restart Claude Desktop or Cursor completely
4. Check the MCP logs for errors

### "Browser not found" error

```bash
npx playwright install chromium
```

### Screenshot timeout

For slow websites, the default 30-second timeout will handle most cases. If issues persist, please report.

### Out of memory

For very large images:

- Resize images before comparison
- Use lower resolution images
- Increase Node.js memory: `node --max-old-space-size=4096 dist/index.js`

## Development

### Building from Source

```bash
npm install
npm run build
```

### Running Locally

```bash
npm start
# or
npm run dev
```

### Testing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Tech Stack

- **Framework:** [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- **Image Comparison:** [Pixelmatch](https://github.com/mapbox/pixelmatch)
- **Screenshots:** [Playwright](https://playwright.dev/)
- **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/), [pngjs](https://github.com/lukeapage/pngjs)
- **Language:** TypeScript

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with:

- [Pixelmatch](https://github.com/mapbox/pixelmatch) by Mapbox
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Playwright](https://playwright.dev/)
- [Sharp](https://sharp.pixelplumbing.com/)

## Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/yourusername/mcp-image-compare-server/issues)
- 💬 **Questions:** [GitHub Discussions](https://github.com/yourusername/mcp-image-compare-server/discussions)
- 📖 **Documentation:** This README

---

**Made with ❤️ using TypeScript and MCP**
