import { Hono } from 'hono'
import { cors } from 'hono/cors'
import rateLimit from 'hono-rate-limit'

export type Quote = {
  quote: string
  category: string
  language: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Rate limiter (10 requests/minute/IP)
app.use('*', rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: JSON.stringify({
    status: false,
    data: {
      quote: "All things come to those who wait.",
      category: "Patience"
    },
    error: 'Too many requests. Please try again later.'
  }),
  statusCode: 429
}))

// CORS
app.use(cors({
  origin: '*',
  allowMethods: ['GET'],
}))

// List of available languages (update if you add/remove files)
const availableLanguages = [
  'english',
  'hindi',
  'kannada',
  'malayalam',
  'tamil',
  'telugu',
]

// Helper: Load quotes for a language
async function loadQuotes(language: string): Promise<Quote[] | null> {
  try {
    // @ts-ignore
    const quotes = (await import(`./quotes/${language.toLowerCase()}.json`)).default
    return quotes
  } catch {
    return null
  }
}

// GET /languages => list of available languages
app.get('/languages', (c) => {
  try {
    return c.json({ status: true, data: availableLanguages })
  } catch (error) {
    return c.json({ status: false, data: null, error: 'Internal server error' }, 500)
  }
})

// GET /categories/:language => list of categories for a language
app.get('/categories/:language', async (c) => {
  try {
    const language = c.req.param('language')
    if (!availableLanguages.includes(language.toLowerCase())) {
      return c.json({ status: false, data: null, error: 'Invalid language' }, 404)
    }
    const quotes = await loadQuotes(language)
    if (!quotes) {
      return c.json({ status: false, data: null, error: 'Quotes not found' }, 404)
    }
    const categories = [...new Set(quotes.map((q: Quote) => q.category))]
    return c.json({ status: true, data: categories })
  } catch (error) {
    return c.json({ status: false, data: null, error: 'Internal server error' }, 500)
  }
})

// GET /quote => random quote from English
app.get('/quote', async (c) => {
  try {
    const quotes = await loadQuotes('english')
    if (!quotes || quotes.length === 0) {
      return c.json({ status: false, data: null, error: 'No quotes found' }, 404)
    }
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    return c.json({ status: true, data: randomQuote })
  } catch (error) {
    return c.json({ status: false, data: null, error: 'Internal server error' }, 500)
  }
})

// GET /quote/:language => random quote from a specific language
app.get('/quote/:language', async (c) => {
  try {
    const language = c.req.param('language')
    if (!availableLanguages.includes(language.toLowerCase())) {
      return c.json({ status: false, data: null, error: 'Invalid language' }, 404)
    }
    const quotes = await loadQuotes(language)
    if (!quotes || quotes.length === 0) {
      return c.json({ status: false, data: null, error: 'No quotes found' }, 404)
    }
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    return c.json({ status: true, data: randomQuote })
  } catch (error) {
    return c.json({ status: false, data: null, error: 'Internal server error' }, 500)
  }
})

// GET /quote/:language/:category => random quote from a specific language and category
app.get('/quote/:language/:category', async (c) => {
  try {
    const language = c.req.param('language')
    const category = c.req.param('category')
    if (!availableLanguages.includes(language.toLowerCase())) {
      return c.json({ status: false, data: null, error: 'Invalid language' }, 404)
    }
    const quotes = await loadQuotes(language)
    if (!quotes) {
      return c.json({ status: false, data: null, error: 'Quotes not found' }, 404)
    }
    const filtered = quotes.filter((q: Quote) => q.category.toLowerCase() === category.toLowerCase())
    if (filtered.length === 0) {
      return c.json({ status: false, data: null, error: 'Invalid category' }, 404)
    }
    const quote = filtered[Math.floor(Math.random() * filtered.length)]
    return c.json({ status: true, data: quote })
  } catch (error) {
    return c.json({ status: false, data: null, error: 'Internal server error' }, 500)
  }
})

export default app
