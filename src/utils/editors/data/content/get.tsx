import { EditorContentType, EditorStateContentType } from '@/interface/editor';
import { contents } from './data';


export const getContent = ({ id }: { id: string, }): EditorStateContentType => {

    const data = contents[id]

    if (data) {
        const value: EditorStateContentType = JSON.parse(JSON.stringify(data))
        return value;
    } {
        const value: EditorStateContentType = {
            id: id,
            type: "P",
            className: "",
            direction: "",
            indent: 0,
            content: "",
        }
        return value
    }
}

export const getContents = () => {
    const value: EditorContentType = JSON.parse(JSON.stringify(contents))
    return value;
}

export const getRootParentValue = ({ contentValue }: { contentValue: EditorStateContentType }) => {

    let id = "";
    if (contentValue) {
        if (contentValue.parentId) {
            id = getRootParentValue({ contentValue: contents[contentValue.parentId] })
        } else {
            id = contentValue.id;
        }
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
