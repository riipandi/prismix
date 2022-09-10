import { Form } from '@remix-run/react'
import type { FC } from 'react'
import { SocialsProvider } from 'remix-auth-socials'

interface SocialButtonProps {
  provider: SocialsProvider
  label: string
  className?: string
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, label, className }) => (
  <Form action={`/auth/${provider}`} method="post" className={className}>
    <button className="mb-6 inline-flex w-full items-center justify-center rounded-md border border-gray-100 bg-white py-3 px-7 text-center text-base text-gray-500 shadow-sm hover:border-gray-200">
      <img
        className="mr-2 h-4"
        src="https://shuffle.dev/flex-ui-assets/elements/sign-up/google-icon-sign-up.svg"
        alt=""
      />
      <span>{label}</span>
      <span className="pl-1 capitalize">{provider}</span>
    </button>
  </Form>
)

export enum AuthLabel {
  SIGNIN = 'Sign in with',
  SIGNUP = 'Continue with',
}

type SocialAuthProps = {
  label: AuthLabel
}

export const SocialAuth: FC<SocialAuthProps> = ({ label }) => {
  return (
    <>
      <SocialButton provider={SocialsProvider.GOOGLE} label={label} />
      {/* <SocialButton provider={SocialsProvider.GITHUB} label={label} /> */}
      {/* <SocialButton provider={SocialsProvider.FACEBOOK} label={label} /> */}
      {/* <SocialButton provider={SocialsProvider.MICROSOFT} label={label} /> */}
      {/* <SocialButton provider={SocialsProvider.DISCORD} label={label} /> */}
    </>
  )
}