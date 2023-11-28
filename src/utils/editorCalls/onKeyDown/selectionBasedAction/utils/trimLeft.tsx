import { parentClass } from '@/utils/commons'
import { getChildren, getChildrenIndex, removeChildrenContent } from '@/utils/editors/data/children'
import { getContent, getSecondLevelParentId, removeContent, updateValueContent } from '@/utils/editors/data/content'

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
    const secondLevelId = getSecondLevelParentId({ contentId: id, finalId: parentClass })
    const mainRoot = getChildren({ parentId: parentClass })
    const root = getChildren({ parentId: secondLevelId })

    let value: string | undefined;
    if (initialContent.content) {
        value = initialContent.content.substring(0, carterPosition)
        if (value === '' && root.length > 0 && mainRoot.length > 0) {
            if (initialContent.parentId)
                removeChildrenContent({ parentId: initialContent.parentId, contentId: initialContent.id })
            else
                removeContent({ id: initialContent.id })
        }
        else
            updateValueContent({ id: initialContent.id, value })

    }

    if (initialContent.parentId && initialContent.parentId != parentId) {
        const index = getChildrenIndex({ contentId: initialContent.id, parentId: initialContent.parentId });
        if (index >= 0) {
            const children = getChildren({ parentId: initialContent.parentId })

            let starterIndex = index + 1;
            for (let i = starterIndex; i < children.length; i++) {
                removeChildrenContent({ parentId: initialContent.parentId, contentId: children[i].contentId })
            }
            trimLeft({ carterPosition, parentId, id: initialContent.parentId, initialCall: false })
        }
    }
}

