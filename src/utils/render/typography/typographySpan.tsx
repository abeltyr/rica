import { EditorStateContentType } from '@/interface/editor';
import { subClassName } from '@/utils/commons';
import { getContent } from '@/utils/editors/data';

export const spanChild = (
    {
        editorStateData,
        parentNodeExist = false
    }: {
        editorStateData: EditorStateContentType,
        parentNodeExist?: boolean
    }
) => {

    let id = editorStateData.id;
    if (parentNodeExist)
        id = `${subClassName}${editorStateData.id}`;

    const element = document.createElement("span");
    element.setAttribute('id', id);
    element.setAttribute('key', id);
    element.setAttribute('placeholder', " ");


    if (editorStateData.className)
        element.className = editorStateData.className;


    if (editorStateData.content)
        element.textContent = editorStateData.content;
    else {
        element.textContent = " ";
    }
    return element
}