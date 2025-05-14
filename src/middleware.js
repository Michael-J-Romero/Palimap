// middleware.js
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  const theme = request.cookies.get('theme')?.value;
console.log("weeee theme",theme)
  const response = NextResponse.next();
  if (theme === 'dark') {
    response.headers.set('x-theme', 'dark');
  }

  return response;
}
