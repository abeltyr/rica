
export const getCurrentlyEditedElement = (): { selection: Selection | null, node: any } => {
    const selection = window.getSelection();
    if (!selection) return { node: null, selection: null };

    const node = selection.anchorNode;
    return { selection: selection, node: node && node.nodeType === 3 ? node.parentNode : node };
}


export const getCursorPosition = (id: string) => {
    let position = 0;
    const selection = window.getSelection();

    if (selection != null && selection!.rangeCount !== 0) {
        const range = selection!.getRangeAt(0);
        const preCaretRange = range.cloneRange();

        const contentEditableDiv = document.getElementById(id);
        if (contentEditableDiv) {
            preCaretRange.selectNodeContents(contentEditableDiv);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }
    }
    return position;
}


export const getFirstChildTagName = (node: Node): string | undefined => {


    let tagName: string | undefined;

    if (node.nodeType === 1) {
        if (node.firstChild && node.firstChild.nodeType === 1) {
            tagName = getFirstChildTagName(node.firstChild);
        } else {
            if (node instanceof Element)
                tagName = node.tagName;
        }
    }

    return tagName;

}
