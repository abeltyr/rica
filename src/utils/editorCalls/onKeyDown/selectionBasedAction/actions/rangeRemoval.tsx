import { EditorStateContentType, SelectorType, ValueType } from '@/interface/editor'
import { parentClass } from '@/utils/commons'
import { getChildren, getChildrenIndex, getFirstChildId, removeChildrenContent } from '@/utils/editors/data/children'
import { trimLeft, trimRight } from '../utils'
import { backSpaceMovement } from '../../backSpace/backSpaceMovement'
import { getActualContent, getContent } from '@/utils/editors/data'

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


    /// --------------- Data Fetching --------------- /// 
    const mainRoot = getChildren({ parentId: parentClass })

    const firstRootIndex = getChildrenIndex({ contentId: firstChildRootId, parentId: parentClass })
    const firstRootContent = getContent({ id: firstChildRootId })
    const firstRootChildId = getFirstChildId(firstRootContent)

    const lastContentValue = lastContent.content ?? "";
    let lastRootIndex = getChildrenIndex({ contentId: lastChildRootId, parentId: parentClass })


    /// --------------- Data Fetching End--------------- /// 


    // check if the fetch index from the first and last id actually exist.
    if (firstRootIndex < 0 || lastRootIndex < 0) {
        console.error("index of root wasn't valid")
        return
    }



    /**
     * check if all the value of the last content has been selected 
     * if it is we add it to the roots that is going to be removed
     * and ignore the trim right function
     */
    let enableTrimRight = true
    if (lastRootLastChildId === lastContentId && lastContentValue.length === selectedValues[selectedValues.length - 1].endPos) {
        lastRootIndex = lastRootIndex + 1
        enableTrimRight = false
    }



    /**
     * check if all the value of the first content has been selected 
     * if it is while the last content also not being fully selected
     * we add it to the roots that is going to be removed,
     */
    let startingIndex = firstRootIndex + 1;
    if (selectedValues[0].startPos === 0 && enableTrimRight && firstContentId === firstRootChildId) {
        startingIndex = firstRootIndex;
    }

    // loop through the root that are in between and the first and last root depending on the above condition
    for (let i = startingIndex; i < lastRootIndex; i++) {
        const childrenNode = document.getElementById(mainRoot[i].contentId)
        if (childrenNode) childrenNode.remove();
        removeChildrenContent({ parentId: parentClass, contentId: mainRoot[i].contentId })
    }


    /**
     * fetch lastIndex and last child children to get the need if for the root movement, 
     * this is fetched before the root data has been updated 
     */
    const lastindex = getChildrenIndex({ contentId: lastContentId, parentId: lastContent.parentId ?? parentClass })
    let children: ValueType[] | undefined;
    if (lastContent.parentId) children = getChildren({ parentId: lastContent.parentId });


    trimLeft({
        id: firstContentId,
        parentId: firstRootChildId,
        carterPosition: selectedValues[0].startPos
    })

    if (enableTrimRight) trimRight({
        id: lastContentId,
        parentId: parentClass,
        carterPosition: selectedValues[selectedValues.length - 1].endPos
    })

    /**
     * once the current selected data are removed we fetch the id of the last children to adjust
     * the backSpaceMovement, 
     * there are three case, 
     * if the last content is removed completely, 
     *      we need to fetch the id of the next content if it exist
     *      if it doesn't exist we fetch the last content of the root,
     * if the last is not completely removed we use the id of the
     */



    const lastContentData = getActualContent({ id: lastContentId })
    let movementId = lastContentId;

    if (lastContentData === undefined && children) {
        if (lastindex >= 0 && children[lastindex + 1])
            movementId = children[lastindex + 1].contentId
        else if (children[children.length - 1])
            movementId = children[children.length - 1].contentId
    }

    if (!(firstRootChildId === firstContentId && selectedValues[0].startPos === 0))
        backSpaceMovement(movementId)
}