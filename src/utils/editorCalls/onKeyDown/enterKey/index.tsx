import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getFirstChildId, getRootParentIndex } from '@/utils/editors/data';
import { getContent, getRootParentValue, validateId } from '@/utils/editors/data/content';
import { childrenUpdate, contentUpdate, moveDown } from './actions';



export const enterKey = async (
    {
        id,
        currentPosition,
    }: {
        id: string,
        currentPosition: number,
    }) => {

    ///------------------------Validate And Collect The Need Data------------------------ ///

    // prepare the current selected text and caretPosition
    let contentId = validateId(id)
    let content = getContent({ id: contentId })
    let caretPosition = currentPosition;


    // get the root related data of the current content
    const rootId = getRootParentValue({ contentValue: content })
    const currentRootContent = getContent({ id: rootId })
    let rootIndex = getRootParentIndex(contentId)

    /**
     * get the children of the main editor and all the root values, 
     * validate against the root from the content 
     */
    const parentChildren = getChildren({ parentId: parentClass })
    if (rootIndex === undefined || rootIndex < 0 || parentChildren.length < rootIndex) rootIndex = parentChildren.length;


    // check the main editor is the
    const rootNode = document.getElementById(parentClass);
    if (!rootNode) return

    ///------------------------Validate And Collect The Need Data End------------------------ ///




    ///------------------------Edge Case based update------------------------ ///
    /**
     * When the caret at the zero index of the content and at the zero of the root
     * should follow a different case in which we just move the current root down and 
     * create a new root to insert before it
     */
    if (currentPosition === 0) {

        // fetch the id of the 

        const firstChildId = getFirstChildId(currentRootContent)
        if (firstChildId === contentId) {
            moveDown({
                currentRootContent,
                parentChildren,
                rootIndex,
                rootNode
            })
            updateCaretToMatch({ id: contentId, currentPosition: caretPosition })
            return
        }
    }

    //TODO: do the edge case for the caret position is at the end of the root

    ///------------------------Edge Case based update End------------------------ ///



    if (currentRootContent.content) {
        await contentUpdate({
            caretPosition,
            currentRootContent,
            parentChildren,
            rootIndex,
            rootNode
        })
        return;

    }

    if (currentRootContent.children) {
        await childrenUpdate({
            caretPosition,
            contentId,
            currentRootContent,
            parentChildren,
            rootId,
            rootIndex,
            rootNode
        })
        return;
    }


}


