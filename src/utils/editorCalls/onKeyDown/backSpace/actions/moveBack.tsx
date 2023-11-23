import { updateCaretToMatch } from '@/utils/actions';
import { fetchFirstChild, fetchLastChild, getChildren, getChildrenIndex, getContent } from '@/utils/editors/data';

export const moveBack = (id: string) => {
    const content = getContent({ id });
    let parentId = content.parentId;

    if (!parentId) {
        const children = getChildren({ parentId: id })
        if (children.length <= 0) return;
        const beforeContent = getContent({ id: children[0].contentId });
        const firstContent = fetchFirstChild(beforeContent);
        if (firstContent) updateCaretToMatch({ id: firstContent.id, currentPosition: 0 })
        return
    }


    const parent = getContent({ id: parentId });
    let childrenId = parent.children
    if (!childrenId) return

    if (parent) {
        const index = getChildrenIndex({ contentId: id, parentId: parentId })
        if (index > 0) {
            const parentChildren = getChildren({ parentId: childrenId });
            const beforeNode = parentChildren[index - 1]
            if (!beforeNode) return;

            const beforeId = beforeNode.contentId;
            const beforeContent = getContent({ id: beforeId });
            const lastContent = fetchLastChild(beforeContent);
            if (lastContent) updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
        } else if (parent.parentId) {
            moveBack(parent.parentId)
        }
    }
}