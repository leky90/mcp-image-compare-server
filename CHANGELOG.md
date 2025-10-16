# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-16

### Added

- Initial release of MCP Image Compare Server
- Pixel-level image comparison using pixelmatch library
- Support for PNG and JPEG image formats
- Three MCP tools:
  - `compare_images` - Compare two local image files
  - `compare_image_with_url` - Compare local image with webpage screenshot
  - `compare_urls` - Compare screenshots from two URLs
- Automatic image normalization (resize to matching dimensions)
- Detailed comparison statistics (pixel count, percentage, dimensions)
- Diff image generation with customizable colors
- Anti-aliased pixel detection and exclusion
- Screenshot capture using Playwright (Chromium)
- Configurable comparison threshold (0-1)
- Comprehensive English and Vietnamese documentation
- TypeScript implementation with full type safety
- Automatic cleanup of temporary screenshot files
- NPM package distribution support
- Postinstall script with setup instructions

### Features

- **Accurate pixel comparison**: Industry-standard pixelmatch library
- **Perceptual color difference**: YIQ color space for human-like comparison
- **Anti-aliasing detection**: Automatically ignore anti-aliased pixels
- **Web screenshot support**: Full-page screenshots with Playwright
- **Format flexibility**: Seamless PNG and JPEG handling
- **Smart resizing**: Automatic dimension normalization
- **Visual diff output**: Color-coded difference visualization
- **Error handling**: Comprehensive error messages and graceful failures

### Technical

- Built with TypeScript for type safety
- MCP SDK integration for Claude Desktop
- Playwright for reliable web screenshots
- Sharp for high-performance image processing
- pngjs for PNG encoding/decoding
- Graceful browser cleanup on exit
- Temporary file management
- Cross-platform support (Windows, macOS, Linux)

## Future Enhancements

Planned for future releases:

- WebP format support
- GIF animation comparison
- Batch comparison mode
- Custom viewport sizes for screenshots
- Parallel comparison for multiple images
- Comparison history tracking
- Integration examples with testing frameworks
- Docker container
- REST API wrapper
- Cloud storage integration

---

For upgrade instructions and breaking changes, see the [README](README.md).
