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
  // If content already has proper HTML structure, return as-is
  if (content.includes('<h2>') && content.includes('<p>') && content.split('<p>').length > 3) {
    console.log('Content already has proper HTML structure, skipping formatting');
    return content;
  }

  console.log('Formatting content with Claude API...');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Format the following blog post content into clean, properly structured HTML.

Requirements:
- Use <h2> tags for main section headings (like "Getting Started", "Understanding Your Budget", etc.)
- Use <h3> tags for subsection headings
- Wrap each paragraph in <p> tags with proper spacing
- Use <ul> and <li> for lists if appropriate
- Add <strong> or <em> for emphasis where natural
- Ensure proper spacing and structure
- If content has existing HTML tags, clean them up and improve structure
- Return ONLY the formatted HTML, no explanations, no markdown code blocks, no \`\`\`html wrapper

Content to format:
${content}`,
      },
    ],
  });

  const formatted = message.content[0];
  if (formatted.type === 'text') {
    let result = formatted.text.trim();
    // Remove markdown code block wrappers if present
    result = result.replace(/^```html\n/, '').replace(/\n```$/, '');
    result = result.replace(/^```\n/, '').replace(/\n```$/, '');
    console.log('Content formatted successfully');
    return result;
  }

  throw new Error('Unexpected response format from Claude API');
}
