import { ArrowRightIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'

import { authenticator } from '@/modules/users/auth.server'
import { findUserById, findVerificationTokenById } from '@/modules/users/user.server'
import { sendVerificationEmail } from '@/services/mailer/verification-email.server'
import { appUrl } from '@/utils/http'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (user) return redirect('/')

  const url = new URL(request.url)
  const verifyId = url.searchParams.get('id') as string
  if (!verifyId) return json({ errors: 'Invalid verification token!' })

  const verify = await findVerificationTokenById(verifyId)
  if (!verify) return json({ errors: 'Invalid verification token!' })

  return json({ verifyId })
}

export async function action({ request }: ActionArgs) {
  const formData: any = await request.formData()
  const verifyId = formData.get('verifyId')

  const verify = await findVerificationTokenById(verifyId)
  if (!verify) return json({ errors: 'Invalid verification token!' })

  const verifyLink = appUrl(`/auth/verification?id=${verify.id}&token=${verify.token}`)
  const user = await findUserById(verify.userId)

  if (!user) return json({ errors: 'User not registered!' })

  await sendVerificationEmail(user.email, user.firstName, verifyLink)

  return json({ success: 'Verification email sent!' }, { status: 200 })
}

export const meta: MetaFunction = () => ({ title: 'Verify Email' })

export default function Verify() {
  const loaderData = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof loader>()

  if (!loaderData.success && loaderData?.errors)
    return (
      <main className="bg-white pt-8 pb-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <div
          className="flex rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Warning</span>
          <div>{loaderData?.errors}</div>
        </div>
        <div className="mt-4">
          <Link
            to="/auth/signin"
            className="w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span>Back to sign in</span>
            <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
          </Link>
        </div>
      </main>
    )

  return (
    <main className="bg-white pt-8 pb-8 px-4 shadow-md sm:rounded-lg sm:px-10">
      <div>
        <h2 className="text-center font-medium text-gray-800 text-xl">Thanks for signing up! </h2>
        <p className="text-gray-700 text-sm text-justify mt-4">
          You should receive an email with a link to confirm your email address within the next few minutes. If you do
          not receive an email, make sure to check your spam, we will gladly send you another. You can click the button
          below to resend it.
        </p>
      </div>

      {actionData && actionData.success && (
        <div
          className="mt-4 flex rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <CheckCircleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>{actionData?.success}</div>
        </div>
      )}

      <div className="py-6">
        <div className="border-t border-dashed border-gray-300" />
      </div>

      <Form method="post" autoComplete="off">
        <input type="hidden" name="verifyId" value={loaderData.verifyId} />
        <button
          type="submit"
          className="w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <span>Resend email verification</span>
          <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
        </button>
      </Form>
    </main>
  )
}
