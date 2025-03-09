import { AxiosError } from 'axios'

export const isAxiosError = (error: unknown): error is AxiosError<{ message: string }> => {
  return error instanceof Error && 'isAxiosError' in error
}
