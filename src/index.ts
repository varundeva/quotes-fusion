import { Hono } from 'hono'
import { cors } from 'hono/cors'
import rateLimit from 'hono-rate-limit'
import quotesData from './quotes.json'

type Quote = {
  quote: string
  category: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Extract available categories
const categories = [...new Set(quotesData.map((q: Quote) => q.category))]

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

// GET /quote => random quote from any category
app.get('/quote', (c) => {
  try {
    const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)]
    return c.json({
      status: true,
      data: randomQuote
    })
  } catch (error) {
    return c.json({
      status: false,
      data: null,
      error: 'Internal server error'
    }, 500)
  }
})

// GET /quote/:category => random quote from a specific category
app.get('/quote/:category', (c) => {
  try {
    const category = c.req.param('category')
    const filtered = quotesData.filter((q: Quote) => q.category.toLowerCase() === category.toLowerCase())
    if (filtered.length === 0) {
      return c.json({
        status: false,
        data: null,
        error: 'Invalid category'
      }, 404)
    }
    const quote = filtered[Math.floor(Math.random() * filtered.length)]
    return c.json({
      status: true,
      data: quote
    })
  } catch (error) {
    return c.json({
      status: false,
      data: null,
      error: 'Internal server error'
    }, 500)
  }
})

// GET /categories => list of categories
app.get('/categories', (c) => {
  try {
    return c.json({
      status: true,
      data: categories
    })
  } catch (error) {
    return c.json({
      status: false,
      data: null,
      error: 'Internal server error'
    }, 500)
  }
})

export default app
