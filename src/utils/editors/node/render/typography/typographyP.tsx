import { EditorStateContentType } from '@/interface/editor';
import { alignmentCheck, indentSetup } from '@/utils/editors/class';

export const pElement = (
    {
        editorStateData,
    }: {
        editorStateData: EditorStateContentType,
    }
) => {
    const id = editorStateData.id;
    const element = document.createElement('p');
    element.setAttribute('id', id);
    element.setAttribute('key', id);
    element.className = `leading-7 outline-none cursor-text ${indentSetup(editorStateData.indent)} ${alignmentCheck(editorStateData.format)} ${editorStateData.className}`;
    return element
}