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

export const getActualContent = ({ id }: { id: string, }): EditorStateContentType | undefined => {
    const newId = validateId(id)
    const data = contents[newId]
    if (data) {
        const value: EditorStateContentType = JSON.parse(JSON.stringify(data))
        return value;
    }
}

export const getContents = () => {
    const value: EditorContentType = JSON.parse(JSON.stringify(contents))
    return value;
}

export const getRootParentValue = ({ contentValue }: { contentValue: EditorStateContentType }) => {

    let id = "";
    if (contentValue) {
        if (contentValue.parentId && contentValue.parentId != contentValue.id) {
            const value = getContent({ id: contentValue.parentId })
            id = getRootParentValue({ contentValue: value })
        } else {
            id = contentValue.id;
        }
    }
    return id;
}

export const getSecondLevelParentId = ({ contentId, finalId = "" }: { contentId: string, finalId: string }) => {
    const contentValue = getContent({ id: contentId })
    let newParentID = contentValue.id;
    if (contentValue.parentId && contentValue.parentId != contentValue.id && finalId != contentValue.parentId) {
        newParentID = getSecondLevelParentId({ contentId: contentValue.parentId, finalId })
    }
    return newParentID;
}
