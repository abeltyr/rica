import { EditorStateContentType } from '@/interface/editor';
import { subClassName } from '@/utils/commons';

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
    if (editorStateData.className)
        element.className = editorStateData.className;


    if (editorStateData.content)
        element.textContent = editorStateData.content;
    else {
        const brChildElement = document.createElement("br");
        element.append(brChildElement);
    }
    return element
}