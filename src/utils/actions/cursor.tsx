export const updateCaretToMatch = ({ id, currentPosition, selection }: { id: string, currentPosition: number, selection: Selection }) => {

    if (selection !== null) {

        const contentEditableElement = document.getElementById(id);


        if (contentEditableElement) {
            let node = contentEditableElement;

            if (contentEditableElement.firstChild?.nodeType === 1) {
                const firstChild = contentEditableElement.children[0];
                if (firstChild instanceof HTMLElement) {
                    node = firstChild;
                }
            }

            const range = selection!.getRangeAt(0);

            if (node!.firstChild && node!.firstChild!.nodeType === 3)
                range.setStart(node!.firstChild!, currentPosition)
            else
                range.setStart(node!, 0)


            range.collapse(true);

            selection!.removeAllRanges();
            selection!.addRange(range);

            node!.focus();
        }
    }
}