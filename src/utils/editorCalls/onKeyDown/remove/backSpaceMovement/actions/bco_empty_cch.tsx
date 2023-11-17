import { EditorStateContentType } from '@/interface/editor';
import { parentClass } from '@/utils/commons';
import { removeChildrenContent } from '@/utils/editors/data';

export const bco_empty_cch = (
    {
        beforeContent,
    }: {
        beforeContent: EditorStateContentType,
    }) => {
    const currentNode = document.getElementById(beforeContent.id)
    if (currentNode) currentNode.remove()
    removeChildrenContent({ parentId: parentClass, contentId: beforeContent.id })
}