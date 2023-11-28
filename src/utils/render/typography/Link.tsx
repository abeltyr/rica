import { EditorStateContentType } from '@/interface/editor';

export const linkElement = (
    {
        editorStateData,
    }: {
        editorStateData: EditorStateContentType,
    }) => {

    const element = document.createElement("a");
    const id = editorStateData.id;
    element.setAttribute('id', id);
    element.setAttribute('key', id);
    element.setAttribute('placeholder', " ");
    element.className = `underline text-blue-300 italic ${editorStateData.className}`;
    if (editorStateData.additional?.link) {
        element.setAttribute('href', editorStateData.additional?.link?.href);
        element.setAttribute('target', editorStateData.additional?.link?.target ?? "_blank");
    }
    return element
}