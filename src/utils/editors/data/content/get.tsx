import { EditorContentType, EditorStateContentType } from '@/interface/editor';
import { contents } from './data';
import { validateId } from '.';


export const getContent = ({ id }: { id: string, }): EditorStateContentType => {

    const newId = validateId(id)

    const data = contents[newId]

    if (data) {
        const value: EditorStateContentType = JSON.parse(JSON.stringify(data))
        return value;
    } {
        const value: EditorStateContentType = {
            id: newId,
            type: "P",
            className: "",
            direction: "",
            indent: 0,
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
            const value = getContent({ id: contentValue.parentId })
            id = getRootParentValue({ contentValue: value })
        } else {
            id = contentValue.id;
        }
    }
    return id;
}

export const getSecondParentValue = ({ contentId, finalId = "" }: { contentId: string, finalId: string }) => {
    const contentValue = getContent({ id: contentId })
    let newParentID = contentValue.id;
    if (contentValue.parentId && finalId != contentValue.parentId) {
        newParentID = getSecondParentValue({ contentId: contentValue.parentId, finalId })
    }
    return newParentID;
}
