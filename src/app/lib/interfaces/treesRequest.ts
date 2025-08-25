import { PropertyTreeType } from '@/db/schema/property'
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
    type: z
        .enum([PropertyTreeType.Admin,
        PropertyTreeType.AdminUser,
        PropertyTreeType.AdminHomePage,
        PropertyTreeType.AdminLibrary,
        PropertyTreeType.AdminLibraryDocky,
        PropertyTreeType.AdminLibraryDockyDiv,
        PropertyTreeType.AdminDocky,
        PropertyTreeType.AdminLibraryArticle,
        PropertyTreeType.AdminLibraryArticleDiv,
        PropertyTreeType.AdminArticle,
        PropertyTreeType.Library,
        PropertyTreeType.LibraryDocky,
        PropertyTreeType.LibraryDockyDiv,
        PropertyTreeType.Docky,
        PropertyTreeType.LibraryArticle,
        PropertyTreeType.LibraryArticleDiv,
        PropertyTreeType.Article,
        PropertyTreeType.Calendar,
        PropertyTreeType.CalendarEvent,
        PropertyTreeType.CalendarHistory,
        PropertyTreeType.CalendarUpComming,
        PropertyTreeType.Events,
        PropertyTreeType.EventsDiv,
        PropertyTreeType.Event]),
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
