import { z } from 'zod'

export const createTopicSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Topic title is required',
    }),
  }),
})  