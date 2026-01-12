import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Formats blog content into properly structured HTML
 * @param content - Raw blog content (may be plain text or poorly formatted HTML)
 * @returns Properly formatted HTML with semantic structure
 */
export async function formatBlogContent(content: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Format the following blog post content into clean, properly structured HTML.

Requirements:
- Use <h2> tags for main section headings
- Use <h3> tags for subsection headings
- Wrap each paragraph in <p> tags
- Use <ul> and <li> for lists if appropriate
- Add <strong> or <em> for emphasis where natural
- Ensure proper spacing and structure
- Return ONLY the formatted HTML, no explanations or markdown code blocks

Content to format:
${content}`,
      },
    ],
  });

  const formatted = message.content[0];
  if (formatted.type === 'text') {
    return formatted.text.trim();
  }

  throw new Error('Unexpected response format from Claude API');
}
