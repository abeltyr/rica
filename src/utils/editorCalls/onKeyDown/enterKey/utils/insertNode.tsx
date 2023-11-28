import { EditorStateContentType, ValueType } from '@/interface/editor'
import { parentClass } from '@/utils/commons'
import { addChildren, insertChildren } from '@/utils/editors/data/children'
import { childIntegration } from '@/utils/render'

export const insertNode = ({
    contentData,
    rootIndex,
    rootNode,
    parentId,
    parentChildren
}: {
    contentData: EditorStateContentType,
    rootIndex: number,
    rootNode: Node,
    parentId: string
    parentChildren: ValueType[]
}) => {

    // recreate the node with the newly update data and generate and insert the new Root
    const contentNode = childIntegration({ editorStateData: contentData })
    if (rootIndex + 1 >= parentChildren.length) {
        addChildren({ parentId, value: { contentId: contentData.id, } })
        rootNode.appendChild(contentNode)
    } else {
        insertChildren({ index: rootIndex + 1, parentId: parentClass, value: { contentId: contentData.id, } })
        const nextContentNode = document.getElementById(parentChildren[rootIndex + 1].contentId)
        rootNode.insertBefore(contentNode, nextContentNode)
    }

}