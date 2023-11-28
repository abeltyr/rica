import { EditorStateContentType, ValueType } from '@/interface/editor';
import { parentClass } from '@/utils/commons';
import { upsetContent } from '@/utils/editors/data';
import { v4 } from 'uuid';
import { insertNode } from '../../utils';

export const insertBottomRoot = (
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
    upsetContent({ id: newRoot.id, value: newRoot })

    insertNode({
        contentData: newRoot,
        parentChildren,
        parentId: parentClass,
        rootIndex,
        rootNode
    })

    return newRoot;
}