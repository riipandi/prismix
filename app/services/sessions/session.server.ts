import { createCookie, createCookieSessionStorage } from '@remix-run/node'
import type { CookieOptions } from '@remix-run/server-runtime'
import * as crypto from 'crypto'

import { SESSION_MAX_AGE, SESSION_SECRET } from '@/services/sessions/constants.server'
import { createDatabaseSessionStorage } from '@/services/sessions/dbsession.server'
import { createUpstashSessionStorage } from '@/services/sessions/upstash.server'

// Session expiration in seconds.
export const SESSION_EXPIRES = 3600

// `expires` is a Date after which the data should be considered
// invalid. You could use it to invalidate the data somehow or
// automatically purge this record from your database.
export const expiresToSeconds = (expires: Date): number => {
  let utcTimeStamp = new Date(expires)
  let epochTime = utcTimeStamp.getTime() / 1000.0

  return Math.floor(epochTime + SESSION_EXPIRES)
}

export const setCookieExpires = () => {
  let utcTimeStamp = new Date()
  let epochTime = utcTimeStamp.getTime() / 1000.0
  let timestamp = Math.floor(epochTime + SESSION_EXPIRES)
  let expires = new Date(timestamp * 1000)

  return expires
}

export function epochToUTC(datetime: number): string {
  const utcTimeStamp = new Date(datetime * 1000)

  return utcTimeStamp.toISOString()
}

// Create a random id - taken from the core `createFileSessionStorage` Remix function.
// Use https://www.epochconverter.com/ to convert epoch to human-readable date.
export const getSessionId = (): string => {
  // Create a random id - taken from the core `createFileSessionStorage` Remix function.
  const randomBytes = crypto.randomBytes(8)
  const id = Buffer.from(randomBytes).toString('hex')
  return id
}

const sessionCookie: CookieOptions = createCookie('__session', {
  sameSite: 'lax', // this helps with CSRF
  path: '/', // remember to add this so the cookie will work in all routes
  httpOnly: true, // for security reasons, make this cookie http only
  secrets: [SESSION_SECRET], // replace this with an actual secret
  secure: process.env.NODE_ENV === 'production', // enable this in prod only
  maxAge: SESSION_MAX_AGE, // one week
})

export const getSessionStorage = () => {
  switch (process.env.SESSION_STORAGE) {
    case 'database':
      return createDatabaseSessionStorage({ cookie: sessionCookie })

    case 'redis':
      return createUpstashSessionStorage({ cookie: sessionCookie })

    default:
      return createCookieSessionStorage({ cookie: sessionCookie })
  }
}

export const sessionStorage = getSessionStorage()

export const { getSession, commitSession, destroySession } = sessionStorage
