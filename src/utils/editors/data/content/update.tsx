import { EditorStateContentType } from '@/interface/editor';
import { contents } from './data';


export const upsetContent = ({ id, value }: { id: string, value: EditorStateContentType }) => {
    contents[id] = value;
}

export const updateValueContent = async ({ id, value }: { id: string, value: string }) => {
    let update = false;
    if (contents[id]) {
        contents[id].content = value;
        contents[id].children = undefined;
        update = true;
    }
    return update
}

export const updateParentContent = async ({ id, parentId }: { id: string, parentId: string }) => {
    if (contents[id]) {
        contents[id].parentId = parentId;
    }
}
