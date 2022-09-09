import { useRef, useState } from 'react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData, useSubmit } from '@remix-run/react'
import { ConfirmDialog } from '~/components/Dialog/ConfirmDialog'

import { deleteNote } from '~/services/note.server'
import { getNote } from '~/services/note.server'
import { requireUserId } from '~/services/session.server'
import { toast } from 'react-hot-toast'

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.noteId, 'noteId not found')

  const note = await getNote({ userId, id: params.noteId })
  if (!note) throw new Response('Not Found', { status: 404 })

  return json({ note })
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request)
  invariant(params.noteId, 'noteId not found')

  await deleteNote({ userId, id: params.noteId })

  return redirect('/notes')
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>()
  const submit = useSubmit()

  const formRef = useRef<HTMLFormElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = async () => {
    submit(formRef.current)
    toast.success('Note deleted!')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setConfirmOpen(true)
  }

  return (
    <div>
      <div>
        <h3 className="text-2xl font-bold">{data.note.title}</h3>
        <p className="py-6">{data.note.body}</p>
        <hr className="my-4" />
      </div>

      <div>
        <Form method="post" replace onSubmit={handleSubmit} ref={formRef}>
          <button type="submit" className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400">
            Delete
          </button>
        </Form>

        <ConfirmDialog
          open={confirmOpen}
          onConfirm={handleDelete}
          onClose={() => setConfirmOpen(false)}
          title="Delete Item?"
        >
          Are you sure you want to do this?
        </ConfirmDialog>
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Note not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
