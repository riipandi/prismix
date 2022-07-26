import type { FC } from 'react'
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useField, useIsSubmitting } from 'remix-validated-form'

interface PasswordInputProps {
  name: string
  label: string
  autoFocus?: boolean
}

export const PasswordInput: FC<PasswordInputProps> = (props) => {
  const { name, label, autoFocus } = props
  const [textInput, setTextInput] = useState(false)
  const { error, getInputProps } = useField(name)
  const isSubmitting = useIsSubmitting()

  return (
    <>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type={textInput ? 'text' : 'password'}
          {...getInputProps({ id: name })}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          className={clsx(
            isSubmitting
              ? 'focus:ring-gray-500 focus:border-gray-500 bg-gray-100 '
              : 'focus:ring-primary-500 focus:border-primary-500 bg-white',
            'appearance-none block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm',
          )}
          placeholder={label}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 w-8 flex items-center"
          onClick={() => setTextInput(!textInput)}
          tabIndex={-1}
        >
          {textInput ? (
            <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-500" />
          ) : (
            <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-500" />
          )}
        </button>
      </div>
      {error && (
        <span className="p-1 text-red-700 text-xs" id={`${name}-error`}>
          {error}
        </span>
      )}
    </>
  )
}
