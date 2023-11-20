import { getCurrentlyEditedElement, getFirstChildTagName } from '@/utils/editors/node';
import { caretIndexFinder, htmlConvertor, stateAdjuster } from '@/utils/actions';
import { keyInputUpdate } from './keyInput';
import { backSpaceKey } from './backSpace';
import { deleteKey } from './delete';
import { fetchLastChild, getChildren, getContent } from '@/utils/editors/data';



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


    const tagName = getFirstChildTagName(node);
    if (
        node.children.length > 0 &&
        !(node.children.length === 1 && tagName === "BR")
    ) {
        console.info("html need cleaning up",)

        //TODO: NEED TO FIX THE ISSUE OF REMOVING DATA ON ROOT NODE
        const index = caretIndexFinder({ node });
        await stateAdjuster({ node })
        await htmlConvertor({ node })
        if (index >= 0) {
            let editorData = node.children[index];
            node = editorData;
            id = editorData.id;
        }
        else {
            const content = getContent({ id: node.children[0].id });
            const lastContent = fetchLastChild(content)
            if (lastContent) {
                let editorData = document.getElementById(lastContent.id)
                node = editorData;
                id = lastContent.id;
                currentPosition = 0;
            }
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
            currentPosition,
        })
    }


    if (event.key === "Backspace") {
        backSpaceKey({
            id,
            currentPosition,
            node
        })
    }


    if (event.key === "Delete") {
        deleteKey({
            id,
            node,
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