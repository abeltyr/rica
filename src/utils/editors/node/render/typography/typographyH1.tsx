import { EditorStateContentType } from '@/interface/editor';
import { alignmentCheck, indentSetup } from '@/utils/editors/class';

export const h1Element = (
    {
        editorStateData,
    }: {
        editorStateData: EditorStateContentType,
    }) => {

    const id = editorStateData.id;
    const element = document.createElement('h1');
    element.setAttribute('id', id);
    element.setAttribute('key', id);
    element.className = `font-extrabold tracking-tight text-4xl lg:text-5xl break-words cursor-text ${indentSetup(editorStateData.indent)} ${alignmentCheck(editorStateData.format)} ${editorStateData.className}`;
    return element
}