import { EditorStateContentType, SelectorType } from '@/interface/editor'
import { getChildren, getChildrenIndex, removeChildrenContent } from '@/utils/editors/data/children'
import { trimLeft, trimRight } from '../utils'
import { getContent, getSecondLevelParentId, updateValueContent } from '@/utils/editors/data/content'

export const inlineRemoval = (
    {
        firstChildRootId,
        firstContentId,
        lastChildRootId,
        lastContent,
        firstContent,
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
        firstContent: EditorStateContentType,
        selectedValues: SelectorType[],
    }) => {
    const contentData = getContent({ id: firstChildRootId });

    // if the content is a content we just adjust the text based on the selected position
    if (contentData.content) {
        const firstValue = contentData.content.substring(0, selectedValues[0].startPos)
        const lastValue = contentData.content.substring(selectedValues[selectedValues.length - 1].endPos, contentData.content.length)
        updateValueContent({ id: firstChildRootId, value: firstValue + lastValue })
    }
    else if (contentData.children) {
        if (selectedValues.length === 1) {
            const firstValue = selectedValues[0].wholeText.substring(0, selectedValues[0].startPos)
            const lastValue = selectedValues[0].wholeText.substring(selectedValues[selectedValues.length - 1].endPos, selectedValues[0].wholeText.length)
            updateValueContent({ id: selectedValues[0].id, value: firstValue + lastValue })
        }
        else {
            /// --------------- Data Fetching --------------- /// 
            const children = getChildren({ parentId: firstChildRootId });

            const secondLayerFirstChildId = getSecondLevelParentId({
                contentId: firstContentId,
                finalId: firstChildRootId
            });

            const secondLayerLastChildId = getSecondLevelParentId({
                contentId: lastContentId,
                finalId: lastChildRootId
            });

            const secondLayerFirstIndex = getChildrenIndex({
                contentId: secondLayerFirstChildId,
                parentId: firstChildRootId
            });

            let secondLayerLastIndex = getChildrenIndex({
                contentId: secondLayerLastChildId,
                parentId: lastChildRootId
            });

            /// --------------- Data Fetching End--------------- /// 

            // check if the fetch index from the first and last id actually exist.
            if (secondLayerFirstIndex < 0 || secondLayerFirstIndex < 0) {
                console.error("index of root wasn't valid")
                return
            }

            /**
             * check if all the value of the last content has been selected 
             * if it is we add it to the roots that is going to be removed
             * and ignore the trim right function
             */
            let enableTrimRight = true

            if (lastRootLastChildId === lastContentId &&
                lastContent.content?.length === selectedValues[selectedValues.length - 1].endPos) {
                secondLayerLastIndex = secondLayerLastIndex + 1
                enableTrimRight = false
            }

            /**
             * check if all the value of the first content has been selected 
             * if it is while the last content also not being fully selected
             * we add it to the roots that is going to be removed,
             */
            let startingIndex = secondLayerFirstIndex + 1;
            if (selectedValues[0].startPos === 0 && enableTrimRight) {
                startingIndex = secondLayerFirstIndex;
            }


            // loop through the root that are in between and the first and last root depending on the above condition
            for (let i = startingIndex; i < secondLayerLastIndex; i++) {
                removeChildrenContent({ contentId: children[i].contentId, parentId: firstChildRootId })
                const node = document.getElementById(children[i].contentId);
                if (node) node.remove();
            }


            let parentId = firstChildRootId;
            if (firstContent.parentId && firstContent.parentId === lastContent.parentId) {
                parentId = firstContent.parentId
            }

            // remove all the Data to the left of the first content going from the current content to the parent specified 
            trimLeft({
                id: firstContentId,
                parentId: parentId,
                carterPosition: selectedValues[0].startPos
            })

            // remove all the Data to the right of the last content going from the current content to the parent specified 
            if (enableTrimRight)
                trimRight({
                    id: lastContentId,
                    parentId: parentId,
                    carterPosition: selectedValues[selectedValues.length - 1].endPos
                })

        }

    }
}