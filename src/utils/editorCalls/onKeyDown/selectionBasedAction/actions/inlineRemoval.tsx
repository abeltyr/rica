import { EditorStateContentType, SelectorType } from '@/interface/editor'
import { getChildren, getChildrenIndex, removeChildrenContent } from '@/utils/editors/data/children'
import { trimLeft, trimRight } from '../utils'
import { getContent, getSecondParentValue, updateValueContent } from '@/utils/editors/data/content'

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

    if (contentData.content) {
        const firstValue = contentData.content.substring(0, selectedValues[0].startPos)
        const lastValue = contentData.content.substring(selectedValues[selectedValues.length - 1].endPos, contentData.content.length)
        updateValueContent({ id: firstChildRootId, value: firstValue + lastValue })
    } else if (contentData.children) {

        const children = getChildren({ parentId: firstChildRootId });

        const secondLayerFirstChildId = getSecondParentValue({
            contentId: firstContentId,
            finalId: firstChildRootId
        });

        const secondLayerLastChildId = getSecondParentValue({
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



        if (secondLayerFirstIndex < 0 || secondLayerFirstIndex < 0) {
            console.error("index of root wasn't valid")
            return
        }

        let enableTrimRight = true

        if (lastRootLastChildId === lastContentId &&
            lastContent.content?.length === selectedValues[selectedValues.length - 1].endPos) {
            secondLayerLastIndex = secondLayerLastIndex + 1
            enableTrimRight = false
        }

        let startingIndex = secondLayerFirstIndex + 1;
        if (selectedValues[0].startPos === 0 && enableTrimRight) {
            startingIndex = secondLayerFirstIndex;
        }


        for (let i = startingIndex; i < secondLayerLastIndex; i++) {
            removeChildrenContent({ contentId: children[i].contentId, parentId: firstChildRootId })
            const node = document.getElementById(children[i].contentId);
            if (node) node.remove();
        }


        if (selectedValues.length === 1) {
            const firstValue = selectedValues[0].wholeText.substring(0, selectedValues[0].startPos)
            const lastValue = selectedValues[0].wholeText.substring(selectedValues[selectedValues.length - 1].endPos, selectedValues[0].wholeText.length)
            updateValueContent({ id: selectedValues[0].id, value: firstValue + lastValue })
        } else {

            let parentId = firstChildRootId;

            if (firstContent.parentId && firstContent.parentId === lastContent.parentId) {
                parentId = firstContent.parentId
            }
            trimLeft({
                id: firstContentId,
                parentId: parentId,
                carterPosition: selectedValues[0].startPos
            })

            if (enableTrimRight)
                trimRight({
                    id: lastContentId,
                    parentId: parentId,
                    carterPosition: selectedValues[selectedValues.length - 1].endPos
                })
        }

    }
}