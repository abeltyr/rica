import { EditorStateContentType } from '@/interface/editor';
import { contents } from './data';
import { childIntegration } from '@/utils/render';
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
            contentChild = childIntegration({ editorStateData: value });
        }
    }

    contents[id] = value;
    return contentChild;
}

export const updateValueContent = async ({ id, value }: { id: string, value: string }) => {

    let newId = id;

    if (!newId) {
        alert("id doesn't exist")
        return
    }

    if (id.includes(subClassName)) newId = id.replace(subClassName, "")

    if (!contents[newId]) {
        alert("content doesn't exist")
        return
    }

    contents[newId].content = value;
    contents[newId].children = undefined;
    const contentChild = document.getElementById(id);
    if (contentChild)
        contentChild.textContent = value;

}

export const updateParentContent = async ({ id, parentId }: { id: string, parentId: string }) => {
    if (contents[id]) {
        contents[id].parentId = parentId;
    }
}
