import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  //find which public path
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('token')?.value || ''
  
  if(isPublicPath && token){
    //path is where they should be directed to (home, etc)
    return NextResponse.redirect(new URL(
        '/', request.nextUrl))
  }

  //not public path, no token, redirect to login
  if(!isPublicPath && !token){
    return NextResponse.redirect(new URL(
        '/login', request.nextUrl))
  }


}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
  ],
}