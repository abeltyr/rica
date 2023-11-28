import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getFirstChildId, getLastChildId, getRootParentIndex } from '@/utils/editors/data';
import { getContent, getRootParentValue, validateId } from '@/utils/editors/data/content';
import { childrenUpdate, contentUpdate, insertBottomRoot, insertTopRoot } from './actions';



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
    const content = getContent({ id: contentId })
    if (content.children)
        contentId = getFirstChildId(content);
    const contentValue = content.content ?? "";
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
     * When the caret is at the beginning of both the content and the root, 
     * a distinct procedure is followed. In this scenario, we lower the existing 
     * root and establish a new root, placing it in front of the lowered one.
     */
    if (currentPosition === 0) {

        /**
         * fetching the ID of the root's first child /first child and comparing 
         * it to the ID of the content where our caret's position is at. 
        */
        const firstChildId = getFirstChildId(currentRootContent)
        if (firstChildId === contentId) {
            insertTopRoot({
                currentRootContent,
                parentChildren,
                rootIndex,
                rootNode
            })
            updateCaretToMatch({ id: contentId, currentPosition: 0 })
            return
        }
    }


    /**
    * When the caret is located at the end of both the content and the root, 
    * a different strategy is implemented. Here, we create a new root and that 
    * root directly underneath the current one.
    */
    if (currentPosition >= contentValue.length) {

        /**
         * fetching the ID of the root's las child /las child and comparing 
         * it to the ID of the content where our caret's position is at. 
        */
        const lastChildId = getLastChildId(currentRootContent);
        if (lastChildId === contentId) {
            const data = await insertBottomRoot({
                currentRootContent,
                parentChildren,
                rootIndex,
                rootNode
            })
            updateCaretToMatch({ id: data.id, currentPosition: 0 })
            return
        }
    }


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


