import { EditorStateContentType, ValueType } from '@/interface/editor';
import { parentClass } from '@/utils/commons';
import { insertChildren, upsetContent } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';

export const insertTopRoot = (
    {
        currentRootContent,
        parentChildren,
        rootIndex,
        rootNode
    }: {
        rootNode: Node,
        currentRootContent: EditorStateContentType,
        rootIndex: number,
        parentChildren: ValueType[]
    }) => {
    const newRoot: EditorStateContentType = {
        type: "P",
        indent: currentRootContent.indent,
        direction: currentRootContent.direction,
        className: "",
        children: undefined,
        content: "",
        id: v4(),
        parentId: undefined,
    }

    const contentNode = childIntegration({ editorStateData: newRoot })
    const nextContentNode = document.getElementById(parentChildren[rootIndex].contentId);
    rootNode.insertBefore(contentNode, nextContentNode)

    upsetContent({ id: newRoot.id, value: newRoot })
    insertChildren({ index: rootIndex, parentId: parentClass, value: { contentId: newRoot.id, } })

}