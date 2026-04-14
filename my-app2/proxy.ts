import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {

  // const user = false
	//  // TODO: palitan ng cookie
  // const path = request.nextUrl.pathname

  // // ❌ not logged in → redirect to login (except login page)
  // if (!user && path !== '/login') {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // // ✅ logged in → bawal na sa login → redirect to home
  // if (user && path === '/login') {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  // return NextResponse.next()

	// 1. Kunin ang cookie gamit ang tamang name
  const cookie = request.cookies.get('_Secure-acstk')
  
  // 2. I-check kung may value (ibig sabihin logged in ang user)
  const isAuthenticated = !!cookie?.value
  
  const path = request.nextUrl.pathname

  // ❌ Hindi logged in -> redirect sa /login (huwag i-redirect kung nasa /login na)
  if (!isAuthenticated && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Logged in na -> bawal na bumalik sa /login -> redirect sa home
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
		'/',
		'/about',
		'/login',
		'/mikrotik',
	],
}