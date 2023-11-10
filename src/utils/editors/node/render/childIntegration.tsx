
import { EditorStateContentType } from '@/interface/editor';
import { h1Element, linkElement, pElement, spanChild } from './typography';
import { getChildren, getContent } from '@/utils/editors/data';

export const childIntegration = (
    {
        editorStateData,
    }: {
        editorStateData: EditorStateContentType,
    }
) => {
    let parentElement: HTMLElement;

    if (editorStateData.type === "InlineLink") {
        parentElement = linkElement({ editorStateData })
    }
    else if (editorStateData.type === "H1") {
        parentElement = h1Element({ editorStateData })
    }
    else {
        if (editorStateData.parentId)
            parentElement = spanChild({ editorStateData })
        else
            parentElement = pElement({ editorStateData })
    }

    if (editorStateData.children) {
        const editableStatChildren = getChildren({ parentId: editorStateData.children });
        editableStatChildren.map((value, index) => {
            const editableState = getContent({ id: value.contentId })
            if (editableState) {
                const childElement = childIntegration({
                    editorStateData: editableState,
                })
                parentElement.appendChild(childElement);
            }
        })
    }

    if (editorStateData.content != null) {
        let hasChild = false;
        if (editorStateData.type != "P" || (editorStateData.type == "P" && !editorStateData.parentId)) {
            hasChild = true;
        }
        if (hasChild) {
            const childElement = spanChild({
                editorStateData: editorStateData
            })
            parentElement.appendChild(childElement);
        }
    }

    return parentElement;
}
