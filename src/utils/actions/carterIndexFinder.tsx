export const caretIndexFinder = ({ node }: { node: Node }) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        const parentNode = textNode.parentNode;

        if (parentNode === node) {
            let childIndex = 0;
            let child = node.firstChild;
            while (child) {
                if (child === textNode) {
                    return childIndex;
                }
                childIndex++;
                child = child.nextSibling;
            }
        }
    }
    return -1;
}