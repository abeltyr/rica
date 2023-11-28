import { SelectorType } from '@/interface/editor';
import { getLastChildId } from '@/utils/editors/data/children';
import { getContent, validateId, getRootParentValue } from '@/utils/editors/data';
import { inlineRemoval, rangeRemoval } from '.';


export const removalAction = (selectedValues: SelectorType[],
) => {


    const firstContentId = validateId(selectedValues[0].id)
    const lastContentId = validateId(selectedValues[selectedValues.length - 1].id)


    const firstContent = getContent({ id: firstContentId })
    const firstChildRootId = getRootParentValue({ contentValue: firstContent })

    const lastContent = getContent({ id: lastContentId })
    const lastChildRootId = getRootParentValue({ contentValue: lastContent })
    const lastRootContent = getContent({ id: lastChildRootId })

    const lastRootLastChildId = getLastChildId(lastRootContent)


    if (firstChildRootId !== lastChildRootId) {
        rangeRemoval({
            firstChildRootId,
            firstContentId,
            lastChildRootId,
            lastContent,
            lastContentId,
            lastRootLastChildId,
            selectedValues
        })
    } else {
        inlineRemoval({
            firstChildRootId,
            firstContentId,
            lastChildRootId,
            lastContent,
            firstContent,
            lastContentId,
            lastRootLastChildId,
            selectedValues
        })
    }


}




