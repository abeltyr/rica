import { getCurrentlyEditedElement } from '@/utils/editors/node';
import { caretIndexFinder, htmlConvertor, stateAdjuster, updateCaretToMatch } from '@/utils/actions';
import { updateValueContent } from '@/utils/editors/data';
import { keyInputUpdate } from './keyInput';
import { remove } from './remove';

export const onKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {

    // console.log("on keyDown", event.key, event.code)

    let skipPrevention = true;
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
        return
    }

    // call the function getSelect to get the node and the current selection 
    let editorData = getCurrentlyEditedElement();

    let node = editorData.node;
    let selection = editorData.selection;
    let id = node.id;
    let currentPosition = selection!.focusOffset;
    // using the node fetch the id, current position

    if (node.children.length > 0) {
        const index = caretIndexFinder({ node });
        console.info("html need cleaning up",)
        await stateAdjuster({ node })
        await htmlConvertor({ node })
        if (index > 0) {
            let editorData = node.children[index];
            node = editorData;
            id = editorData.id;
        }
    }

    /**
     * call the getTextSelection to fetch the selected text in a form of an array
     */

    // setup an if to check when there is text selection here

    /**
     * if the selection has value
     */


    if (event.key.length === 1) {
        keyInputUpdate({
            id,
            node,
            key: event.key,
            selection: selection!,
            currentPosition,
        })
    }


    if (event.key === "Backspace" || event.key === "Delete") {
        remove({
            id,
            node,
            key: event.key,
            selection: selection!,
            currentPosition,
        })
    }



    if (event.key === "Tap") {
        /**
         * check the previous clicked value move the content by one margin 
         * in any direction by updating the indent value and adding a margin value 
         * to the node
         * */
    }


    if (event.key === "Enter") {
        /**
         * run the function to cut the text or children and move it to the next
         * root
         * */


        /**
         * setup the carter position to the first then call the 
         * update function using the id and the currentPosition for the new root
         * */
    }

    // shortcuts
    if (event.key === "Shift") {
        /**
         * save the key Shift has been clicked and is being for the shortcut
         * */
    }
    if (event.key === "Meta") {
        /**
         * save the key Meta has been clicked and is being for the shortcut
         * */
    }
    if (event.key === "Control") {
        /**
         * save the key Control has been clicked and is being for the shortcut
         * */
    }
    if (event.key === "Alt") {
        /**
         * save the key Alt has been clicked and is being for the shortcut
         * */
    }

    if (skipPrevention)
        event.preventDefault();

}