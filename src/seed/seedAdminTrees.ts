
import { IPropertiesTable } from '@/db/schema/property';
import { addTree } from '@/repositories/PropertyRepository';

export async function seedAdminTrees1() {
    const blibli: IPropertiesTable = {
        content: '',
        name: 'Blibliothéque',
        userId: 10,
        icon: 'book-open-check'
    };
    const bibliId = await addTree(blibli);
    console.log(bibliId);

    const article: IPropertiesTable = {
        content: '',
        name: 'Article',
        userId: 10,
        parentId: bibliId,
        icon: 'wallpaper'
    };
    await addTree(article);

    const docu: IPropertiesTable = {
        content: '',
        name: 'Document',
        userId: 10,
        parentId: bibliId,
        icon: 'scroll-text'
    };
    await addTree(docu);

    const survey: IPropertiesTable = {
        content: '',
        name: 'Survey',
        userId: 10,
        parentId: undefined,
        icon: 'book-open-check'
    };

    await addTree(survey);
}

