# Quick Setup for Cursor

## Installation

```bash
npm install -g mcp-image-compare-server
npx playwright install chromium
```

## Configuration

### Option 1: Through MCP Settings File

**Windows:** `%APPDATA%\Cursor\User\globalStorage\mcp.json`  
**macOS:** `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`  
**Linux:** `~/.config/Cursor/User/globalStorage/mcp.json`

Add this configuration:

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

### Option 2: Through Cursor UI

1. Open Cursor Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "MCP"
3. Click "Edit in settings.json"
4. Add the configuration above

## Restart

Restart Cursor after configuration.

## Usage

Ask Cursor AI:

```
Compare image1.png and image2.png
```

```
Compare design-mockup.png with https://mywebsite.com
```

```
Compare https://staging.example.com with https://production.example.com
```

## Verify Installation

1. Open Cursor
2. Start a new chat
3. Ask: "What image comparison tools are available?"
4. You should see: compare_images, compare_image_with_url, compare_urls

## Troubleshooting

### Server not connecting

1. Verify config file path is correct
2. Check JSON syntax is valid
3. Restart Cursor completely
4. Check Cursor logs for errors

### Browser not found

```bash
npx playwright install chromium
```

---

For full documentation, see [README.md](README.md)
