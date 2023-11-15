import { getCurrentlyEditedElement } from '@/utils/editors/node';
import { caretIndexFinder, htmlConvertor, stateAdjuster } from '@/utils/actions';
import { getAllChildren, getContents, updateValueContent } from '@/utils/editors/data';

export const onInput = async () => {

    // call the function getSelect to get the node and the current selection 
    let editorData = getCurrentlyEditedElement();
    let node = editorData.node;
    let selection = editorData.selection;

    if (node && selection) {
        // using the node fetch the id, current position
        let id = node.id;
        let currentPosition = selection!.focusOffset;
        console.log("onInput node", node, id, currentPosition, node.children)

        if (node.children.length > 0) {
            console.info("html need cleaning up",)
            const index = caretIndexFinder({ node });
            await stateAdjuster({ node })
            await htmlConvertor({ node })
            if (index > 0) {
                let editorData = node.children[index];
                node = editorData;
                id = editorData.id;
            }
        } else if (node.children.length === 1 && node.firstChild.nodeType === 3) {
            updateValueContent({
                id: id,
                value: node.textContent
            });
            console.info("html just updated",)
        }
        console.info("getContents", getContents())
        console.info("getChildren", getAllChildren())
    }
}