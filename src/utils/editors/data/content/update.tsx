import { EditorStateContentType } from '@/interface/editor';
import { contents } from './data';
import { childIntegration } from '@/utils/editors/node';


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
    if (contents[id]) {
        contents[id].content = value;
        contents[id].children = undefined;
        const contentChild = document.getElementById(id);
        if (contentChild)
            contentChild.textContent = value;
    } else {
        alert("This id doesn't exist")
    }
}

export const updateParentContent = async ({ id, parentId }: { id: string, parentId: string }) => {
    if (contents[id]) {
        contents[id].parentId = parentId;
    }
}
