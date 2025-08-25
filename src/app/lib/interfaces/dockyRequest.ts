import { DockyFileCatEnum, DockyFileTypeEnum } from '@/db/schema/dockies'
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
        .enum([DockyFileTypeEnum.Docky, DockyFileTypeEnum.Article]),
    cat: z
        .enum([DockyFileCatEnum.Article_Board, DockyFileCatEnum.Article_MD,
        DockyFileCatEnum.Article_IMG, DockyFileCatEnum.Article_AUDIO,
        DockyFileCatEnum.Article_Survey, DockyFileCatEnum.Article_VIDEO,
        DockyFileCatEnum.Docky_HomePage, DockyFileCatEnum.Docky_Perso
        ]),
    isPublic: z
        .number(),
    data: z
        .looseObject({ id: z.number() }).optional(),
    children: z
        .object({
            id: z.number(),
            order: z.number()
        }).array().optional(),
    treeId: z
        .number(),

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
    isPublic: z
        .number(),
    data: z
        .looseObject({ id: z.number() }),
    children: z
        .looseObject({
            id: z.number(),
            order: z.number()
        }).array().optional(),
    treeId: z
        .number(),
})
