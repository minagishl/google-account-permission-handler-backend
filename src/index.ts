import { Hono } from 'hono';

const app = new Hono<{ Bindings: CloudflareBindings }>();

function checkUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return (
      parsedUrl.protocol === 'https:' &&
      (hostname === 'google.com' || hostname.endsWith('.google.com'))
    );
  } catch {
    return false;
  }
}

function toViewUrl(url: string): string {
  // Remove any u/{number}/ pattern from the URL
  url = url.replace(/\/u\/\d+\//, '/');

  const googleFormsPattern =
    /https:\/\/docs\.google\.com\/forms\/d\/e\/([a-zA-Z0-9_-]+)(\/(?:edit|formrestricted))?/;

  const match = url.match(googleFormsPattern);
  if (match) {
    const id = match[1];
    return generateViewUrl(id);
  }

  return url;
}

function generateViewUrl(id: string): string {
  return `https://docs.google.com/forms/d/e/${id}/viewform`;
}

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/automatic', (c) => {
  const url = c.req.query('url');

  if (!url) {
    return c.text('Please provide a URL');
  }

  if (!checkUrl(url)) {
    return c.text('Invalid URL');
  }

  const newUrl = toViewUrl(url);
  return c.redirect(newUrl);
});

app.get('/chooser', (c) => {
  const url = c.req.query('url');

  if (!url) {
    return c.text('Please provide a URL');
  }

  if (!checkUrl(url)) {
    return c.text('Invalid URL');
  }

  const encodedUrl = encodeURIComponent(toViewUrl(url));
  const newUrl = `https://accounts.google.com/AccountChooser?continue=${encodedUrl}`;
  return c.redirect(newUrl);
});

export default app;
