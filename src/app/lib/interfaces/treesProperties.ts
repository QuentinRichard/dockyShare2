import { z } from 'zod'

export const TreeRequestSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    content: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    parentId: z
        .number(),
})

export const TreePutRequestSchema = z.object({
    id: z
        .number()
        .min(0),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    content: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    parentId: z
        .number(),
})
