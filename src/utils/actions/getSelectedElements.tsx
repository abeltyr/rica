import { SelectorType } from '@/interface/editor';

export const getSelectedElements = (): SelectorType[] => {
    const selection = window.getSelection();
    if (!selection) return [];

    if (selection.anchorNode != selection.focusNode || (selection.anchorNode === selection.focusNode && selection.anchorOffset != selection.focusOffset)) {
        const range = selection!.getRangeAt(0);
        const treeWalker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const selectedElements: any[] = [];
        let node;
        let nodeList: any[] = []

        // list out all the node that selected and convert them to an array value
        while (node = treeWalker.nextNode()) {
            nodeList = [...nodeList, node];
        }

        if (nodeList.length === 0) nodeList = [treeWalker.currentNode]
        nodeList.map((value, index) => {
            let startPos = 0;
            let endPos = 0;

            // selectedElements.push(node.parentElement);
            const nodeText = value.textContent;


            if (nodeText && range.intersectsNode(value)) {
                const nodeRange = document.createRange();
                nodeRange.selectNodeContents(value);

                // get the selection stating end ending position
                if (range.compareBoundaryPoints(Range.START_TO_START, nodeRange) >= 0) {
                    startPos = Math.max(startPos, range.startOffset);
                }
                if (index === nodeList.length - 1) {
                    endPos = range.endOffset;
                } else {
                    endPos = nodeRange.endOffset;
                }

                const selectedText = nodeText!.slice(startPos, endPos);

                // setup the data that is going to be deleted
                selectedElements.push({
                    id: value.parentElement.id,
                    node: value.parentElement,
                    fullySelected: selectedText === nodeText,
                    selectedText: selectedText,
                    wholeText: nodeText,
                    startPos,
                    endPos
                });

                // Clean up the created ranges
                nodeRange.detach();
            }
        })

        return selectedElements;
    }
    return [];
}