import { getChildren, getChildrenIndex, removeChildrenContent } from '@/utils/editors/data/children'
import { getContent, removeContent, updateValueContent } from '@/utils/editors/data/content'

export const trimRight = ({
    id,
    parentId,
    carterPosition
}: {
    id: string,
    parentId?: string,
    carterPosition: number
}) => {
    const initialContent = getContent({ id })
    let value: string | undefined;
    if (initialContent.content) {
        value = initialContent.content.substring(carterPosition, initialContent.content.length)
        updateValueContent({ id: initialContent.id, value })
    }

    if (initialContent.parentId && initialContent.parentId != parentId) {
        const index = getChildrenIndex({ contentId: initialContent.id, parentId: initialContent.parentId });
        const children = getChildren({ parentId: initialContent.parentId })

        let lastIndex = index;
        if (value === '') lastIndex = index + 1;

        for (let i = 0; i < lastIndex; i++) {
            removeChildrenContent({ parentId: initialContent.parentId, contentId: children[i].contentId })
            const node = document.getElementById(children[i].contentId)
            if (node) node.remove();
        }
        trimRight({ carterPosition, parentId, id: initialContent.parentId })
    }
}

