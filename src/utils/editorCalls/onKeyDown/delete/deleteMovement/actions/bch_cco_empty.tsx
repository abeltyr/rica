import { EditorStateContentType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { fetchLastChild, removeChildrenContent } from '@/utils/editors/data';

export const bch_cco_empty = (
    {
        beforeContent,
        currentContentId
    }: {
        currentContentId: string,
        beforeContent: EditorStateContentType
    }) => {
    removeChildrenContent({ parentId: parentClass, contentId: currentContentId })
    const currentNode = document.getElementById(currentContentId)
    if (currentNode) currentNode.remove();
    const lastContent = fetchLastChild(beforeContent)
    if (lastContent)
        updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
}