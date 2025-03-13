import { Request, Response, NextFunction } from 'express'

export const catchAsyncErrors = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>,
) => {
  return async (req: T, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Server error', error })
    }
  }
}
