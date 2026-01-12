# Auto-Translation System for Blog Posts

This system automatically translates blog posts between English and Spanish using the Anthropic Claude API.

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. **Add Anthropic API key** to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

3. **Add Spanish columns to blog_posts table** (if not already present):
   ```sql
   ALTER TABLE blog_posts
   ADD COLUMN title_es TEXT,
   ADD COLUMN excerpt_es TEXT,
   ADD COLUMN content_es TEXT;
   ```

## How It Works

### API Endpoints

**POST /api/blog** - Create new blog post
**PUT /api/blog** - Update existing blog post

Both endpoints automatically translate missing language versions.

### Translation Logic

1. **Language Detection**: The system detects the source language of the content using Claude
2. **Auto-Translation**: If one language version is missing, it's automatically translated
3. **Database Storage**: Both English and Spanish versions are saved to the database

### Example Usage

**Creating a post in English:**
```javascript
const response = await fetch('/api/blog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'First-Time Homebuyer Guide',
    slug: 'first-time-homebuyer-guide',
    content: '<p>Your complete guide to buying a home...</p>',
    excerpt: 'Everything you need to know',
    category: 'buyers',
    tags: ['guide', 'first-time'],
    client_id: 'danidiaz',
    featured_image: 'https://...',
    // Spanish versions will be auto-translated
  })
});
```

**Creating a post in Spanish:**
```javascript
const response = await fetch('/api/blog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Guía para Compradores Primerizos',
    slug: 'guia-compradores-primerizos',
    content: '<p>Tu guía completa para comprar una casa...</p>',
    excerpt: 'Todo lo que necesitas saber',
    category: 'buyers',
    tags: ['guía', 'primerizos'],
    client_id: 'danidiaz',
    featured_image: 'https://...',
    // English versions will be auto-translated
  })
});
```

**Providing both languages** (no translation needed):
```javascript
const response = await fetch('/api/blog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'First-Time Homebuyer Guide',
    title_es: 'Guía para Compradores Primerizos',
    content: '<p>English content...</p>',
    content_es: '<p>Contenido en español...</p>',
    excerpt: 'English excerpt',
    excerpt_es: 'Extracto en español',
    // ... other fields
  })
});
```

## Translation Functions

### `translateText(text: string, targetLanguage: 'en' | 'es')`
Translates a single text string to the target language.

### `detectLanguage(text: string)`
Detects whether text is in English or Spanish.

### `translateBlogPost(post, sourceLanguage)`
Translates title, excerpt, and content of a blog post.

## Frontend Integration

When displaying blog posts, use the language-aware fields:

```tsx
// In your component
const { language } = useLanguage();

// Display the appropriate language version
<h1>{language === 'es' && post.title_es ? post.title_es : post.title}</h1>
<p>{language === 'es' && post.excerpt_es ? post.excerpt_es : post.excerpt}</p>
<div dangerouslySetInnerHTML={{
  __html: language === 'es' && post.content_es ? post.content_es : post.content
}} />
```

## Notes

- Translation uses **claude-sonnet-4-20250514** model
- Translations preserve tone and formatting
- Cost: Approximately $0.003-0.015 per blog post (depending on length)
- Translations are cached in the database after first creation
- Re-running the API with different content will re-translate

## Troubleshooting

**Error: Missing API key**
- Make sure `ANTHROPIC_API_KEY` is set in `.env.local`
- Restart your dev server after adding the key

**Error: Column does not exist**
- Run the SQL migration to add Spanish columns to blog_posts table

**Translation quality issues**
- The system uses Claude Sonnet 4, which provides high-quality translations
- For critical content, you may want to manually review translations
- You can always provide both language versions manually to skip auto-translation
