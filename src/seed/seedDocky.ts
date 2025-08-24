
import { DockyFileData, DockyFileTypeEnum } from '@/db/schema/dockies';
import { createDocky, updateDocky } from '@/repositories/DockiesRepository';

export async function seedDocky1() {
    const dockyHomePage: DockyFileData = {
        name: 'HomePage',
        userId: 10,
        description: "HomePage desc",
        data: {},
        type: DockyFileTypeEnum.HomePage,
        children: undefined
    };
    const dockyHomePageId = await createDocky(dockyHomePage);
    console.log(dockyHomePageId);

    const docky1: DockyFileData = {
        name: 'Docky1',
        userId: 10,
        description: "Docky1 desc",
        data: {},
        type: DockyFileTypeEnum.Docky,
        children: undefined
    };
    const docky1Id = await createDocky(docky1);
    console.log(docky1Id);

    const article1: DockyFileData = {
        name: 'Article1',
        userId: 10,
        description: "Article1 desc",
        data: {},
        type: DockyFileTypeEnum.Article,
        children: undefined
    };
    const article1Id = await createDocky(article1);
    console.log('article1Id', article1Id);

    const article2: DockyFileData = {
        name: 'Article2',
        userId: 10,
        description: "Article2 desc",
        data: {},
        type: DockyFileTypeEnum.Article,
        children: undefined
    };
    const article2Id = await createDocky(article2);
    console.log('article1Id', article1Id);

    const docky2: DockyFileData = {
        name: 'Docky2',
        userId: 10,
        description: "Docky2 desc",
        data: {},
        type: DockyFileTypeEnum.Docky,
        children: [
            { id: article1Id, order: 0 },
            { id: article2Id, order: 1 }
        ]
    };
    const docky2Id = await createDocky(docky2);
    docky2.id = docky2Id;
    await updateDocky(docky2);
    console.log('docky2Id', docky2Id);
}

