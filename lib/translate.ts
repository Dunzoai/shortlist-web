import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Translates text using Claude API
 * @param text - The text to translate
 * @param targetLanguage - Target language ('en' or 'es')
 * @returns The translated text
 */
export async function translateText(
  text: string,
  targetLanguage: 'en' | 'es'
): Promise<string> {
  const languageName = targetLanguage === 'en' ? 'English' : 'Spanish';

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Translate the following text to ${languageName}. Keep the same tone and formatting. Only return the translation, nothing else.\n\n${text}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response format from Claude API');
}

/**
 * Detects the language of the given text
 * @param text - The text to analyze
 * @returns The detected language code ('en' or 'es')
 */
export async function detectLanguage(text: string): Promise<'en' | 'es'> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages: [
      {
        role: 'user',
        content: `What language is this text? Reply with only 'en' or 'es'.\n\n${text}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    const detected = content.text.trim().toLowerCase();
    if (detected === 'en' || detected === 'es') {
      return detected;
    }
  }

  // Default to English if detection fails
  return 'en';
}

/**
 * Translates a blog post's content, title, and excerpt
 * @param post - The blog post with content in one language
 * @param sourceLanguage - Source language ('en' or 'es')
 * @returns Object with translated title, excerpt, and content
 */
export async function translateBlogPost(
  post: {
    title: string;
    excerpt: string;
    content: string;
  },
  sourceLanguage: 'en' | 'es'
): Promise<{
  title: string;
  excerpt: string;
  content: string;
}> {
  const targetLanguage = sourceLanguage === 'en' ? 'es' : 'en';

  const [title, excerpt, content] = await Promise.all([
    translateText(post.title, targetLanguage),
    translateText(post.excerpt, targetLanguage),
    translateText(post.content, targetLanguage),
  ]);

  return { title, excerpt, content };
}
