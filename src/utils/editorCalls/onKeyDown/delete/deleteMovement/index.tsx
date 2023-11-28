import { parentClass } from '@/utils/commons';
import { getAllChildren, getChildren, getContent, getContents, getRootParentIndex, validateId } from '@/utils/editors/data';
import { bch_cch } from './actions/bch_cch';
import { bch_cco } from './actions/bch_cco';
import { bch_cco_empty } from './actions/bch_cco_empty';
import { bco_cch } from './actions/bco_cch';
import { bco_empty_cch } from './actions/bco_empty_cch';
import { bco_cco } from './actions/bco_cco';
import { bco_cco_empty } from './actions/bco_cco_empty';
import { bco_empty_cco } from './actions/bco_empty_cco';



export const backSpaceMovement = async (
    {
        id,
        currentPosition,
        selection
    }:
        {
            id: string,
            currentPosition: number,
            selection: Selection
        }
) => {

    const contentId = validateId(id)
    const rootIndex = getRootParentIndex(contentId);

    console.log("firstAtRoot", rootIndex)
    console.log("getContents", getContents())
    console.log("getAllChildren", getAllChildren())

    if (rootIndex && rootIndex > 0) {
        const root = getChildren({ parentId: parentClass });

        let previousIndex = rootIndex - 1;

        const beforeContentId = root[previousIndex].contentId
        const currentContentId = root[rootIndex].contentId

        const beforeContent = getContent({ id: beforeContentId });
        const currentContent = getContent({ id: currentContentId });

        if (beforeContent.children && currentContent.children) {
            await bch_cch({
                id,
                beforeContentId: beforeContentId,
                currentContentId: currentContentId,
            });
        }
        else if (beforeContent.children && currentContent.content != undefined) {
            if (currentContent.content) {
                await bch_cco({
                    beforeContentId: beforeContentId,
                    currentContent
                });
            }
            else if (currentContent.content === "") {
                await bch_cco_empty({
                    beforeContent,
                    currentContentId: contentId
                })
            }
        }
        else if (beforeContent.content != undefined && currentContent.children) {
            if (beforeContent.content) {
                await bco_cch({
                    beforeContent,
                    currentContent,
                    id,
                })
            }
            else if (beforeContent.content === "") {
                await bco_empty_cch({
                    beforeContent
                })
            }
        }
        else if (beforeContent.content != undefined && currentContent.content != undefined) {
            if (beforeContent.content && currentContent.content) {
                await bco_cco({
                    beforeContent,
                    currentContent
                })
            }
            if (currentContent.content === "") {
                await bco_cco_empty({
                    beforeContentId,
                    currentContentId,
                })
            }
            if (beforeContent.content === "" && currentContent.content != "") {
                await bco_empty_cco({
                    beforeContentId
                })
            }
        }

        console.log("getContents", getContents())
        console.log("getAllChildren", getAllChildren())

    }
    return

}