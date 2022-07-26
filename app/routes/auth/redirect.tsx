import type { LoaderArgs, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/services/sessions/constants.server'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: LOGIN_URL,
  })

  // Put custom condition here
  const redirectTo = user ? '/notes' : '/'

  return redirect(redirectTo)
}
