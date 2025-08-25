
import { IPropertiesTable, PropertyTreeType } from '@/db/schema/property';
import { addTree } from '@/repositories/PropertyRepository';

export async function seedAdminTrees1() {
    const blibli: IPropertiesTable = {
        content: '',
        name: 'Blibliothéque',
        userId: 10,
        icon: 'book-open-check',
        type: PropertyTreeType.Library
    };
    const bibliId = await addTree(blibli);
    console.log(bibliId);

    const article: IPropertiesTable = {
        content: '',
        name: 'Article',
        userId: 10,
        parentId: bibliId,
        icon: 'wallpaper',
        type: PropertyTreeType.LibraryArticle
    };
    await addTree(article);

    const docu: IPropertiesTable = {
        content: '',
        name: 'Document',
        userId: 10,
        parentId: bibliId,
        icon: 'scroll-text',
        type: PropertyTreeType.LibraryArticle
    };
    await addTree(docu);

    const event: IPropertiesTable = {
        content: '',
        name: 'Event',
        userId: 10,
        parentId: undefined,
        icon: 'scan-eye',
        type: PropertyTreeType.Events
    };

    await addTree(event);
}

