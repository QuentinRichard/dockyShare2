
import { IPropertiesTable } from '@/db/schema/property';
import { addTree } from '@/repositories/PropertyRepository';

export async function seedAdminTrees1() {
    const blibli: IPropertiesTable = {
        content: '',
        name: 'Blibliothéque',
        userId: 10
    };
    const bibliId = await addTree(blibli);
    console.log(bibliId);

    const article: IPropertiesTable = {
        content: '',
        name: 'Article',
        userId: 10,
        parentId: bibliId
    };
    const articleId = await addTree(article);

    const survey: IPropertiesTable = {
        content: '',
        name: 'Survey',
        userId: 10,
        parentId: articleId
    };
    await addTree(survey);

    const docu: IPropertiesTable = {
        content: '',
        name: 'Document',
        userId: 10,
        parentId: bibliId
    };
    await addTree(docu);
}

