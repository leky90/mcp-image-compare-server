# MCP Image Compare Server

[![npm version](https://badge.fury.io/js/mcp-image-compare-server.svg)](https://www.npmjs.com/package/mcp-image-compare-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mcp-image-compare-server)](https://nodejs.org)

> Tiếng Việt | **[English](README.md)**

MCP server để so sánh hình ảnh pixel-perfect sử dụng [Pixelmatch](https://github.com/mapbox/pixelmatch) từ Mapbox. So sánh ảnh, chụp và so sánh screenshots, phát hiện sự khác biệt trực quan với độ chính xác cao.

## Tính năng

- 🎯 **So sánh pixel-perfect** - Phát hiện ngay cả sự khác biệt 1 pixel
- 🎨 **Phát hiện màu sắc perceptual** - Không gian màu YIQ giống cảm nhận con người
- 🔍 **Phát hiện anti-aliasing** - Tự động loại trừ pixel anti-aliased
- 📊 **Thống kê chi tiết** - Số pixel, phần trăm, kích thước
- 🖼️ **Visual diff output** - Hình ảnh diff với mã màu
- 🌐 **Hỗ trợ screenshot web** - So sánh với website trực tiếp
- 📁 **Nhiều định dạng** - Hỗ trợ PNG và JPEG
- ⚡ **Nhanh & nhẹ** - Package chỉ ~60-80KB

## Bắt đầu nhanh

### Cài đặt

```bash
# Cài đặt global
npm install -g mcp-image-compare-server

# Cài đặt Chromium cho screenshots
npx playwright install chromium
```

### Cấu hình

#### Cho Claude Desktop

Thêm vào file config Claude Desktop:

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

Khởi động lại Claude Desktop sau khi cấu hình.

#### Cho Cursor

Thêm vào file cấu hình MCP của Cursor:

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

Hoặc qua Cursor settings:

1. Mở Cursor Settings (`Ctrl+,` hoặc `Cmd+,`)
2. Tìm kiếm "MCP"
3. Click "Edit in settings.json"
4. Thêm cấu hình ở trên

Khởi động lại Cursor sau khi cấu hình.

### Sử dụng

Hỏi trong Claude Desktop hoặc Cursor:

```
So sánh image1.png và image2.png
```

Xong! 🎉

## Công cụ

### 1. compare_images

So sánh hai file ảnh local.

**Tham số:**

- `image1_path` (string, bắt buộc) - Đường dẫn ảnh thứ nhất
- `image2_path` (string, bắt buộc) - Đường dẫn ảnh thứ hai
- `diff_output_path` (string, tùy chọn) - Nơi lưu ảnh diff
- `threshold` (number, tùy chọn) - Ngưỡng so sánh (0-1), mặc định 0.1
- `includeAA` (boolean, tùy chọn) - Bao gồm pixel anti-aliased, mặc định false

### 2. compare_image_with_url

So sánh file ảnh local với screenshot từ URL.

**Tham số:**

- `image_path` (string, bắt buộc) - Đường dẫn ảnh local
- `url` (string, bắt buộc) - URL để chụp và so sánh
- `diff_output_path` (string, tùy chọn) - Nơi lưu ảnh diff
- `threshold` (number, tùy chọn) - Ngưỡng so sánh (0-1), mặc định 0.1
- `includeAA` (boolean, tùy chọn) - Bao gồm pixel anti-aliased, mặc định false

### 3. compare_urls

So sánh screenshots từ hai URLs khác nhau.

**Tham số:**

- `url1` (string, bắt buộc) - URL thứ nhất để chụp
- `url2` (string, bắt buộc) - URL thứ hai để chụp
- `diff_output_path` (string, tùy chọn) - Nơi lưu ảnh diff
- `threshold` (number, tùy chọn) - Ngưỡng so sánh (0-1), mặc định 0.1
- `includeAA` (boolean, tùy chọn) - Bao gồm pixel anti-aliased, mặc định false

## Định dạng Output

Tất cả tools trả về JSON với thống kê chi tiết:

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

## Các trường hợp sử dụng

### Visual Regression Testing

So sánh UI trước và sau khi cập nhật để phát hiện thay đổi không mong muốn.

### Cross-browser Testing

So sánh rendering giữa các browsers để đảm bảo tính nhất quán.

### Design Review

So sánh mockup thiết kế với implementation thực tế.

### A/B Testing

So sánh các phiên bản khác nhau của cùng một trang.

### Mobile vs Desktop

So sánh responsive layouts giữa các viewport khác nhau.

## Cấu hình

### Giá trị Threshold

Tham số `threshold` (0-1) kiểm soát độ nhạy so sánh:

- **0.0** - Rất nhạy, phát hiện khác biệt nhỏ nhất
- **0.1** - Mặc định, cân bằng tốt cho hầu hết trường hợp
- **0.3** - Ít nhạy hơn, bỏ qua khác biệt nhỏ
- **1.0** - Ít nhạy nhất, chỉ khác biệt lớn

### Anti-aliasing

Khi `includeAA = false` (mặc định), server tự động phát hiện và bỏ qua các pixel anti-aliased, giảm false positives từ các rendering engines khác nhau.

## Phương pháp cài đặt

### Phương pháp 1: NPM Global (Khuyến nghị)

```bash
npm install -g mcp-image-compare-server
npx playwright install chromium
```

### Phương pháp 2: NPX (Không cần cài đặt)

Cấu hình Claude Desktop như trên, lần chạy đầu sẽ tự động tải package.

### Phương pháp 3: Từ Source

```bash
git clone https://github.com/yourusername/mcp-image-compare-server.git
cd mcp-image-compare-server
npm install
npx playwright install chromium
npm run build
```

Cấu hình Claude Desktop hoặc Cursor:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/mcp-image-compare-server/dist/index.js"]
}
```

Thay `/absolute/path/to/mcp-image-compare-server` bằng đường dẫn thực tế.

## Yêu cầu hệ thống

- **Node.js:** 18.0.0 trở lên
- **npm:** 8.0.0 trở lên
- **OS:** Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Ổ đĩa:** ~500MB (bao gồm trình duyệt Chromium)
- **RAM:** Tối thiểu 2GB

## Khắc phục sự cố

### Server không kết nối

1. Kiểm tra đường dẫn config đúng
2. Đảm bảo đã chạy `npm run build`
3. Khởi động lại Claude Desktop hoặc Cursor hoàn toàn
4. Kiểm tra MCP logs để xem lỗi

### Lỗi "Browser not found"

```bash
npx playwright install chromium
```

### Screenshot timeout

Timeout mặc định 30 giây sẽ xử lý hầu hết các trường hợp. Nếu vẫn gặp vấn đề, vui lòng báo cáo.

## Development

### Build từ Source

```bash
npm install
npm run build
```

### Chạy Local

```bash
npm start
# hoặc
npm run dev
```

## Tech Stack

- **Framework:** [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- **So sánh ảnh:** [Pixelmatch](https://github.com/mapbox/pixelmatch)
- **Screenshots:** [Playwright](https://playwright.dev/)
- **Xử lý ảnh:** [Sharp](https://sharp.pixelplumbing.com/), [pngjs](https://github.com/lukeapage/pngjs)
- **Ngôn ngữ:** TypeScript

## Đóng góp

Đóng góp luôn được hoan nghênh! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết hướng dẫn.

## Changelog

Xem [CHANGELOG.md](CHANGELOG.md) để biết lịch sử phiên bản.

## Giấy phép

MIT License - xem file [LICENSE](LICENSE) để biết chi tiết.

## Cảm ơn

Được xây dựng với:

- [Pixelmatch](https://github.com/mapbox/pixelmatch) bởi Mapbox
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Playwright](https://playwright.dev/)
- [Sharp](https://sharp.pixelplumbing.com/)

## Hỗ trợ

- 🐛 **Báo lỗi:** [GitHub Issues](https://github.com/yourusername/mcp-image-compare-server/issues)
- 💬 **Câu hỏi:** [GitHub Discussions](https://github.com/yourusername/mcp-image-compare-server/discussions)
- 📖 **Tài liệu:** File README này

---

**Được tạo với ❤️ bằng TypeScript và MCP**
