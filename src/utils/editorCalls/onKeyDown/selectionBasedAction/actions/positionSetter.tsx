
import { EditorStateContentType, SelectorType } from '@/interface/editor';
import { getChildren, getChildrenIndex, getContent, getLastChildId } from '@/utils/editors/data';


export const positionSetter = ({
    selectedValues,
    firstContent,
    lastContent,
    firstRootId
}: {
    selectedValues: SelectorType[],
    event: React.KeyboardEvent<HTMLDivElement>,
    firstContent: EditorStateContentType,
    lastContent: EditorStateContentType,
    firstRootId: string,
}
) => {
    let id = selectedValues[0].id
    let caretPosition = selectedValues[0].startPos;

    if (selectedValues.length > 1) {
        if (selectedValues[0].startPos != 0) {
            id = firstContent.id
            caretPosition = selectedValues[0].startPos;
        }

        const lastContentValue = lastContent.content ?? "";
        if (selectedValues[0].startPos === 0 && !(selectedValues[selectedValues.length - 1].endPos >= lastContentValue.length)) {
            id = lastContent.id
            caretPosition = 0;
        }

        // if everything get removed
        if (selectedValues[selectedValues.length - 1].endPos >= lastContentValue.length && selectedValues[0].startPos === 0) {
            const newId = getNeighborId(firstContent);
            if (newId) {
                const contentData = getContent({ id: newId })
                id = newId
                caretPosition = (contentData.content ?? "").length;
            }
            else {
                id = firstRootId
                caretPosition = 0;

            }
        }

    }

    return {
        id,
        caretPosition
    }
}





const getNeighborId = (content: EditorStateContentType): string | undefined => {

    let id: string | undefined;

    if (content.parentId) {
        const children = getChildren({ parentId: content.parentId });
        const index = getChildrenIndex({ contentId: content.id, parentId: content.parentId });
        if (index > 0) {
            const neighborContent = getContent({ id: children[index - 1].contentId })
            const neighborLastChildId = getLastChildId(neighborContent);
            id = neighborLastChildId;

        } else if (index === 0) {
            const parentContent = getContent({ id: content.parentId })
            const neighborLastChildId = getNeighborId(parentContent);
            if (neighborLastChildId) id = neighborLastChildId;
        }
    }



    return id;
}
