import { MAIL_FROM, transport } from '@/services/mailer/mailer.server'

const mailMessage = (name: string, loginLink: string) => {
  return `<!doctype html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="antialiased bg-gray-50 h-full w-full">
        <div class="max-w-3xl mx-auto py-12">
            <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Hello, ${name}!</h3>
                    <div class="mt-2 w-full text-gray-600">
                        <p>
                            Your password has been changed.
                        </p>
                    </div>
                    <div class="mt-4 text-sm">
                        <a href="${loginLink}" class="font-medium text-blue-700 hover:text-blue-600">
                            Click here to continue to your account
                            <span aria-hidden="true"> &rarr;</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`
}

export async function sendPasswordResetEmail(to: string, name: string, loginLink: string) {
  return transport.sendMail(
    {
      to,
      from: MAIL_FROM,
      subject: 'Password Changed',
      html: mailMessage(name, loginLink),
    },
    (err: any, _res: any) => {
      if (err) {
        console.error(err)
      } else {
        console.info('The email was sent successfully')
      }
    },
  )
}
