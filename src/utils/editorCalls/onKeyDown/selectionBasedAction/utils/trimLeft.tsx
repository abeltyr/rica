import { getChildren, getChildrenIndex, removeChildrenContent } from '@/utils/editors/data/children'
import { getContent, updateValueContent } from '@/utils/editors/data/content'

export const trimLeft = ({
    id,
    parentId,
    carterPosition
}: {
    id: string,
    parentId: string,
    carterPosition: number
    initialCall?: boolean
}) => {
    const initialContent = getContent({ id })


    let value: string | undefined;
    if (initialContent.content) {
        value = initialContent.content.substring(0, carterPosition)
        updateValueContent({ id: initialContent.id, value })
    }

    if (initialContent.parentId && initialContent.parentId != parentId) {
        const index = getChildrenIndex({ contentId: initialContent.id, parentId: initialContent.parentId });
        const children = getChildren({ parentId: initialContent.parentId })

        let starterIndex = index + 1;
        if (value === '') starterIndex = index

        for (let i = starterIndex; i < children.length; i++) {
            removeChildrenContent({ parentId: initialContent.parentId, contentId: children[i].contentId })
            const node = document.getElementById(children[i].contentId)
            if (node) node.remove();
        }
        trimLeft({ carterPosition, parentId, id: initialContent.parentId, initialCall: false })
    }
}

