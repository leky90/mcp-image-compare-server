# Contributing to MCP Image Compare Server

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-image-compare-server.git
cd mcp-image-compare-server

# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Build the project
npm run build
```

### Project Structure

```
src/
├── index.ts              # MCP server entry point
├── types.ts              # TypeScript type definitions
├── tools/                # MCP tool implementations
│   ├── compare-images.ts
│   ├── compare-image-with-url.ts
│   └── compare-urls.ts
└── utils/                # Utility modules
    ├── image-loader.ts   # Image loading & normalization
    ├── screenshot.ts     # Screenshot capture
    └── comparator.ts     # Pixelmatch wrapper
```

## Development Workflow

### Making Changes

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Build and test:

   ```bash
   npm run build
   ```

4. Test with Claude Desktop:
   - Configure the server in Claude Desktop
   - Test all three tools
   - Verify error handling

### Code Style

- Use TypeScript for all code
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### TypeScript Guidelines

- Enable strict mode
- Define proper types for all functions
- Avoid `any` types when possible
- Use interfaces for complex objects
- Export types that may be useful externally

## Types of Contributions

### Bug Reports

When filing a bug report, please include:

- MCP server version
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected behavior vs actual behavior
- Error messages (if any)
- Sample images (if applicable)

### Feature Requests

For feature requests, please describe:

- Use case and motivation
- Proposed API/interface
- Potential implementation approach
- Any alternatives considered

### Code Contributions

#### Pull Request Process

1. Update README.md if changing functionality
2. Update CHANGELOG.md under "Unreleased" section
3. Ensure builds succeed: `npm run build`
4. Write clear commit messages
5. One feature/fix per PR
6. Respond to review feedback

#### Commit Message Format

```
type: Short description (50 chars or less)

Longer explanation if needed. Wrap at 72 characters.

Fixes #123
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Testing

### Local Testing

```bash
# Build the project
npm run build

# Create test tarball
npm pack

# Install locally
npm install -g mcp-image-compare-server-1.0.0.tgz

# Test with Claude Desktop
# Configure and verify all tools work

# Cleanup
npm uninstall -g mcp-image-compare-server
rm mcp-image-compare-server-*.tgz
```

### Testing Checklist

- [ ] Package builds successfully
- [ ] All 3 tools are available
- [ ] Can compare local images
- [ ] Can capture screenshots from URLs
- [ ] Diff images are generated correctly
- [ ] Temporary files are cleaned up
- [ ] Browser closes properly
- [ ] Error messages are helpful

## Adding New Features

### Adding New Image Formats

To add support for a new format:

1. Update `utils/image-loader.ts`:

   ```typescript
   if (ext === ".webp") {
     return loadWebP(imagePath);
   }
   ```

2. Implement loader function:

   ```typescript
   async function loadWebP(imagePath: string): Promise<ImageData> {
     // Implementation
   }
   ```

3. Update documentation
4. Test with sample images

### Adding New Comparison Options

To add new pixelmatch options:

1. Update `types.ts`:

   ```typescript
   export interface ComparisonOptions {
     // ... existing options
     newOption?: boolean;
   }
   ```

2. Update `utils/comparator.ts`:

   ```typescript
   const pixelmatchOptions = {
     // ... existing options
     newOption: options.newOption ?? false,
   };
   ```

3. Update tool schemas in `src/index.ts`
4. Document in README.md

## Publishing

### Pre-publish Checklist

- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] Build successful
- [ ] README up to date
- [ ] No sensitive data in package
- [ ] Local test successful
- [ ] Git committed and pushed

### Publishing Steps

```bash
# Update version
npm version patch  # or minor/major

# Build
npm run build

# Test locally
npm pack
npm install -g mcp-image-compare-server-*.tgz
# Test thoroughly
npm uninstall -g mcp-image-compare-server

# Login to npm
npm login

# Publish
npm publish

# Create git tag
git tag v1.0.0
git push origin v1.0.0

# Create GitHub release
```

## Code Review Criteria

PRs will be reviewed for:

- **Functionality**: Does it work as intended?
- **Code quality**: Is it readable and maintainable?
- **Performance**: Any negative impact?
- **Security**: Any vulnerabilities?
- **Documentation**: Are changes documented?
- **Tests**: Are edge cases covered?

## Community Guidelines

- Be respectful and constructive
- Help others in issues and discussions
- Share use cases and examples
- Provide detailed bug reports
- Test thoroughly before submitting

## Questions?

- Open an issue for questions
- Tag with "question" label
- Check existing issues first
- Be specific with examples

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
