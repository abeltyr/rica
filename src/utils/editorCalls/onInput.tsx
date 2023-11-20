import { getCurrentlyEditedElement, getFirstChildTagName } from '@/utils/editors/node';
import { caretIndexFinder, fullStateAdjuster, htmlConvertor, stateAdjuster, updateCaretToMatch } from '@/utils/actions';
import { fetchLastChild, getAllChildren, getChildren, getContent, getContents, getRootParentValue, updateValueContent } from '@/utils/editors/data';

export const onInput = async () => {

    // call the function getSelect to get the node and the current selection 
    let editorData = getCurrentlyEditedElement();
    let node = editorData.node;
    let selection = editorData.selection;

    if (node && selection) {
        // using the node fetch the id, current position
        let id = node.id;
        let currentPosition = selection!.focusOffset;

        const content = getContent({ id })
        const rootParentId = getRootParentValue({ contentValue: content })

        if (!rootParentId) return;

        const rootNode = document.getElementById(rootParentId);
        console.log("onInput something was wrong everything is rerendered", rootNode)
        if (rootNode) {

            const index = caretIndexFinder({ node });

            await fullStateAdjuster({ node: rootNode })
            await htmlConvertor({ node: rootNode })

            if (node.children.length > index && index >= 0) {
                let editorData = node.children[index];
                node = editorData;
                id = editorData.id;
            }
            else if (node.children.length === 0 && index < 0) {
                const content = getContent({ id: node.children[0].id });
                const lastContent = fetchLastChild(content)
                if (lastContent) {
                    let editorData = document.getElementById(lastContent.id)
                    node = editorData;
                    id = lastContent.id;
                }
            }
        }


        console.info("getContents", getContents())
        console.info("getChildren", getAllChildren())
        updateCaretToMatch({ id, currentPosition })
    }
}