import { EditorStateContentType } from '@/interface/editor';

export const spanChild = (
    {
        editorStateData,
    }: {
        editorStateData: EditorStateContentType,
    }
) => {
    const id = editorStateData.id;
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