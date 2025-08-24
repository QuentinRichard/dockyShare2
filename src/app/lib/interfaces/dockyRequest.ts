import { DockyFileTypeEnum } from '@/db/schema/dockies'
import { z } from 'zod'

export const DockyRequestSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    description: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    type: z
        .enum([DockyFileTypeEnum.HomePage, DockyFileTypeEnum.Docky, DockyFileTypeEnum.Article, DockyFileTypeEnum.App]),
    data: z
        .looseObject({ id: z.number() }),
    children: z
        .object({
            id: z.number(),
            order: z.number()
        }).array().optional()

})

export const DockyPutRequestSchema = z.object({
    id: z
        .number()
        .min(0),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    description: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    type: z
        .enum([DockyFileTypeEnum.HomePage, DockyFileTypeEnum.Docky, DockyFileTypeEnum.Article, DockyFileTypeEnum.App]),
    data: z
        .looseObject({ id: z.number() }),
    children: z
        .looseObject({
            id: z.number(),
            order: z.number()
        }).array().optional()
})
