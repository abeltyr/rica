import { EditorStateContentType, SelectorType, ValueType } from '@/interface/editor'
import { parentClass } from '@/utils/commons'
import { getChildren, getChildrenIndex, getFirstChildId, getLastFirstChildId, removeChildrenContent } from '@/utils/editors/data/children'
import { trimLeft, trimRight } from '../utils'
import { backSpaceMovement } from '../../backSpace/backSpaceMovement'
import { getContent } from '@/utils/editors/data'

export const rangeRemoval = (
    {
        firstChildRootId,
        firstContentId,
        lastChildRootId,
        lastContent,
        lastContentId,
        lastRootLastChildId,
        selectedValues
    }: {
        firstChildRootId: string,
        lastChildRootId: string,
        lastRootLastChildId: string,
        lastContentId: string,
        firstContentId: string,
        lastContent: EditorStateContentType,
        selectedValues: SelectorType[],
    }) => {
    const firstRootIndex = getChildrenIndex({ contentId: firstChildRootId, parentId: parentClass })
    let lastRootIndex = getChildrenIndex({ contentId: lastChildRootId, parentId: parentClass })

    if (firstRootIndex < 0 || lastRootIndex < 0) {
        console.error("index of root wasn't valid")
        return
    }


    const mainRoot = getChildren({ parentId: parentClass })

    let enableTrimRight = true

    const lastContentValue = lastContent.content ?? ""

    if (lastRootLastChildId === lastContentId && lastContentValue.length === selectedValues[selectedValues.length - 1].endPos) {
        lastRootIndex = lastRootIndex + 1
        enableTrimRight = false
    }


    const firstRootContent = getContent({ id: firstChildRootId })
    const firstRootChildId = getFirstChildId(firstRootContent)


    let startingIndex = firstRootIndex + 1;
    if (selectedValues[0].startPos === 0 && enableTrimRight && firstContentId === firstRootChildId) {
        startingIndex = firstRootIndex;
    }


    for (let i = startingIndex; i < lastRootIndex; i++) {
        const childrenNode = document.getElementById(mainRoot[i].contentId)
        if (childrenNode) childrenNode.remove();
        removeChildrenContent({ parentId: parentClass, contentId: mainRoot[i].contentId })
    }

    const lastindex = getChildrenIndex({ contentId: lastContentId, parentId: lastContent.parentId ?? parentClass })

    let children: ValueType[] | undefined;
    if (lastContent.parentId) children = getChildren({ parentId: lastContent.parentId });
    trimLeft({
        id: firstContentId,
        parentId: parentClass,
        carterPosition: selectedValues[0].startPos
    })
    if (enableTrimRight) trimRight({
        id: lastContentId,
        parentId: parentClass,
        carterPosition: selectedValues[selectedValues.length - 1].endPos
    })

    const lastContentData = getContent({ id: lastContentId })

    let movementId = lastContentId;
    if (children && lastContentData.content === undefined && lastContentData.children === undefined) {
        if (lastindex >= 0 && children[lastindex + 1])
            movementId = children[lastindex + 1].contentId
        else if (children[children.length - 1])
            movementId = children[children.length - 1].contentId
    }

    backSpaceMovement(movementId)
}