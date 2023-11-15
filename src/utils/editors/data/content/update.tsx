import { EditorStateContentType } from '@/interface/editor';
import { contents } from './data';
import { spanChild } from '@/utils/render';
import { subClassName } from '@/utils/commons';


export const upsetContent = ({ id, value, setupNode = false }: { id: string, value: EditorStateContentType, setupNode?: boolean }) => {
    let contentChild: HTMLElement | undefined | null
    if (setupNode) {
        if (contents[id]) {
            contentChild = document.getElementById(id);
            if (contentChild)
                contentChild.textContent = value.content ?? "";
        }
        else {
            contentChild = spanChild({ editorStateData: value })
        }
    }

    contents[id] = value;
    return contentChild;
}

export const updateValueContent = async ({ id, value }: { id: string, value: string }) => {

    let newId = id;

    if (!newId) {
        console.log("id doesn't exist")
        return
    }

    if (id.includes(subClassName)) newId = id.replace(subClassName, "")

    if (!contents[newId]) {
        console.log("content doesn't exist")
        return
    }

    contents[newId].content = value;
    contents[newId].children = undefined;
    const contentChild = document.getElementById(id);
    if (contentChild)
        contentChild.textContent = value;

}

export const updateParentContent = async ({ id, parentId }: { id: string, parentId: string | undefined }) => {
    //TODO: need optimization for this repeated code call
    let newId = id;

    if (!newId) {
        console.log("id doesn't exist")
        return
    }

    if (id.includes(subClassName)) newId = id.replace(subClassName, "")

    if (!contents[newId]) {
        console.log("content doesn't exist")
        return
    }


    if (contents[newId]) {
        contents[newId].parentId = parentId;
    }
}


export const updateContentChildren = async ({ id, childrenId }: { id: string, childrenId: string }) => {
    let newId = id;

    if (!newId) {
        console.log("id doesn't exist")
        return
    }

    if (id.includes(subClassName)) newId = id.replace(subClassName, "")

    if (!contents[newId]) {
        console.log("content doesn't exist")
        return
    }
    if (contents[newId]) {
        contents[newId].children = childrenId;
    }
}


export const validateId = (id: string) => {
    let newId = id;

    if (id.includes(subClassName)) newId = id.replace(subClassName, "")

    return newId
}