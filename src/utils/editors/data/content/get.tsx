import { EditorStateContentType } from '@/interface/editor';
import { contents } from './data';


export const getContent = ({ id }: { id: string, }) => {
    return contents[id];
}

export const getContents = () => {
    return { ...contents };
}

export const getRootParentValue = ({ contentValue }: { contentValue: EditorStateContentType }) => {
    let id = "";
    if (contentValue.parentId) {
        id = getRootParentValue({ contentValue: contents[contentValue.parentId] })
    } else {
        id = contentValue.id;
    }
    return id;
}

export const getSecondParentValue = ({ contentId, id = "", finalId = "" }: { contentId: string, id: string, finalId: string }) => {
    const contentValue = contents[contentId]
    let newParentID = contentValue.id;
    if (contentValue && contentValue.parentId && finalId != contentValue.parentId) {
        newParentID = getSecondParentValue({ contentId: contentValue.parentId, id: contentValue.id, finalId })
    }
    return newParentID;
}
