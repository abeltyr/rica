import { EditorStateContentType, SelectorType } from '@/interface/editor';
import { getContent } from '@/utils/editors/data';
import { getCurrentlyEditedElement } from '@/utils/editors/node';


export const finalPosition = ({
    selectedValues, lastContent, firstRootId
}: {
    selectedValues: SelectorType[],
    event: React.KeyboardEvent<HTMLDivElement>,
    lastContent: EditorStateContentType,
    firstRootId: string,
}
) => {
    let id = selectedValues[0].id
    let caretPosition = selectedValues[0].startPos;

    let editorData = getCurrentlyEditedElement();
    let node = editorData.node;
    let selection = editorData.selection;
    id = node.id;
    caretPosition = selection!.focusOffset;


    return {
        id,
        caretPosition
    }
}




