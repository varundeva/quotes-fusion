# Quotes Fusion API

A simple, open-source API for retrieving inspirational quotes in multiple languages and categories. Built with [Hono](https://hono.dev/) and TypeScript, designed for serverless/edge environments (e.g., Cloudflare Workers).

## Features
- Get random quotes in English, Hindi, Kannada, Malayalam, Tamil, and Telugu
- Filter quotes by language and category
- Rate limiting and CORS support
- Easy to contribute new quotes or languages

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
$ git clone https://github.com/your-username/quotes-fusion.git
$ cd quotes-fusion

# Install dependencies
$ npm install
```

### Development
```bash
# Start the development server (using wrangler for Cloudflare Workers)
$ npx wrangler dev
```

## API Endpoints

All responses follow this structure:
```json
{
  "status": true,
  "data": <result>,
  "error": null
}
```
If an error occurs, `status` is `false`, `data` is `null`, and `error` contains a message.

### 1. Get a random English quote
**GET** `/quote`

**Example Response:**
```json
{
  "status": true,
  "data": {
    "quote": "goal fail grow success yourself never journey",
    "category": "Spirituality",
    "language": "English"
  },
  "error": null
}
```

---

### 2. List available languages
**GET** `/languages`

**Example Response:**
```json
{
  "status": true,
  "data": ["english", "hindi", "kannada", "malayalam", "tamil", "telugu"],
  "error": null
}
```

---

### 3. List categories for a language
**GET** `/categories/:language`

**Example:** `/categories/english`

**Example Response:**
```json
{
  "status": true,
  "data": ["Spirituality", "Career", "Failure", ...],
  "error": null
}
```

---

### 4. Get a random quote from a language
**GET** `/quote/:language`

**Example:** `/quote/hindi`

**Example Response:**
```json
{
  "status": true,
  "data": {
    "quote": "...",
    "category": "...",
    "language": "Hindi"
  },
  "error": null
}
```

---

### 5. Get a random quote from a language and category
**GET** `/quote/:language/:category`

**Example:** `/quote/english/Spirituality`

**Example Response:**
```json
{
  "status": true,
  "data": {
    "quote": "...",
    "category": "Spirituality",
    "language": "English"
  },
  "error": null
}
```

---

## Example Usage

### Fetch a random English quote (curl)
```bash
curl https://your-api-domain/quote
```

### Fetch available languages
```bash
curl https://your-api-domain/languages
```

### Fetch categories for Hindi
```bash
curl https://your-api-domain/categories/hindi
```

### Fetch a random quote from Tamil
```bash
curl https://your-api-domain/quote/tamil
```

### Fetch a random quote from English in the "Career" category
```bash
curl https://your-api-domain/quote/english/Career
```

---

## Contributing

Contributions are welcome! You can:
- Add new quotes to existing language files in `src/quotes/`
- Add a new language by creating a new JSON file in `src/quotes/`
- Improve documentation or code

### Steps
1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -am 'Add new feature'`)
5. Open a Pull Request

Please ensure your code passes linting and tests before submitting.

---

## License

This project is open source and available under the [MIT License](LICENSE).
