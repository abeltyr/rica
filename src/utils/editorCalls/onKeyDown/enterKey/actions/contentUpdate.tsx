import { EditorStateContentType, ValueType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { addChildren, insertChildren } from '@/utils/editors/data';
import { updateValueContent, upsetContent } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';

export const contentUpdate = (
    {
        caretPosition,
        currentRootContent,
        parentChildren,
        rootIndex,
        rootNode
    }: {
        parentChildren: ValueType[],
        rootIndex: number,
        rootNode: Node,
        currentRootContent: EditorStateContentType,
        caretPosition: number
    }) => {


    console.log("Root is just a normal content so just need to split the text", caretPosition)

    const newRoot = {
        ...currentRootContent,
        id: v4(),
        parentId: undefined,
        content: currentRootContent.content!.substring(caretPosition, currentRootContent.content!.length),
        children: undefined
    }

    currentRootContent.content = currentRootContent.content!.substring(0, caretPosition);

    upsetContent({ id: newRoot.id, value: newRoot })
    updateValueContent({ id: currentRootContent.id, value: currentRootContent.content })


    const contentNode = childIntegration({ editorStateData: newRoot })


    if (rootIndex + 1 >= rootNode.childNodes.length) {
        addChildren({ parentId: parentClass, value: { contentId: newRoot.id, } })
        rootNode.appendChild(contentNode)
    } else {
        insertChildren({ index: rootIndex + 1, parentId: parentClass, value: { contentId: newRoot.id, } })
        const nextContentNode = document.getElementById(parentChildren[rootIndex + 1].contentId)
        rootNode.insertBefore(contentNode, nextContentNode)
    }

    updateCaretToMatch({ id: newRoot.id, currentPosition: 0 })
}