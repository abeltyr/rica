import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { fetchLastChild, getChildren, getChildrenIndex, getContent, removeChildren, removeChildrenContent, updateValueContent, validateId } from '@/utils/editors/data';
import { moveBack } from '.';


export const parentRemoval = (id: string) => {
    const contentId = validateId(id);
    const node = document.getElementById(contentId);

    if (!node) return;
    const parent = node.parentElement;

    if (parent) {
        const parentId = parent.id;

        if (parentId === parentClass) {
            const content = getContent({ id: contentId })
            if (content.children) {
                removeChildren({ parentId: content.children })
            }
            updateValueContent({ id: contentId, value: "" })
            return
        }

        const index = getChildrenIndex({ contentId: contentId, parentId })

        const parentContent = getContent({ id: parentId })
        if (!parentContent.children) return

        const parentChildren = getChildren({ parentId: parentContent.children })

        if (index > 0) {
            const beforeNode = parentChildren[index - 1]
            const beforeId = beforeNode.contentId;

            const beforeContent = getContent({ id: beforeId });
            const lastContent = fetchLastChild(beforeContent);
            if (lastContent)
                updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
            removeChildrenContent({ contentId, parentId })
            node.remove();
        } else {
            if (parentChildren.length > 1) {
                removeChildrenContent({ contentId, parentId })
                node.remove();
                moveBack(parentId)
            } else {
                parentRemoval(parent.id);
            }
        }
    }

}

