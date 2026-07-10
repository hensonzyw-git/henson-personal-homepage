import { blogFeed } from '../../lib/rss';

export const prerender = true;

export async function GET() {
  return blogFeed('en');
}
