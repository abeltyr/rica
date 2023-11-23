import { EditorStateContentType, ValueType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { addChildren, insertChildren, removeChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data';
import { getContent, removeContent, updateParentContent, updateValueContent, upsetContent } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';
import { splitChildrenContent } from '../utils';

export const childrenUpdate = (
    {
        caretPosition,
        currentRootContent,
        parentChildren,
        rootIndex,
        rootNode,
        contentId,
        rootId
    }: {
        parentChildren: ValueType[],
        rootIndex: number,
        rootNode: Node,
        currentRootContent: EditorStateContentType,
        caretPosition: number,
        contentId: string,
        rootId: string
    }) => {

    const newRootId = v4()
    const data = splitChildrenContent({
        caretPosition,
        contentData: currentRootContent,
        contentId,
        parentId: rootId,
        newParentId: newRootId,
        updatedParentId: rootId,
    })

    if (!data) return;

    let updatedChildren = data.updatedChildren;
    let newChildren = data.newChildren;
    if (updatedChildren)
        updatedChildren.map((value, index) => {
            if (updatedChildren) updatedChildren[index].parentId = rootId;
            updateParentContent({ id: value.contentId, parentId: rootId })
            updateChildrenValue({
                contentId: value.contentId,
                parentId: value.parentId,
                value: {
                    contentId: value.contentId,
                    parentId: rootId
                }
            })
        })

    if (newChildren)
        newChildren.map((value, index) => {
            if (newChildren) newChildren[index].parentId = newRootId;
            updateParentContent({ id: value.contentId, parentId: newRootId })
            updateChildrenValue({
                contentId: value.contentId,
                parentId: value.parentId,
                value: {
                    contentId: value.contentId,
                    parentId: newRootId
                }
            })
        })


    let newRoot: EditorStateContentType = {
        ...currentRootContent,
        id: newRootId,
        parentId: undefined,
        content: undefined,
        children: newRootId
    }
    let currentRoot: EditorStateContentType = {
        ...currentRootContent,
        parentId: undefined,
        content: undefined,
        children: currentRootContent.id
    }



    if (updatedChildren) {
        upsetContent({ id: currentRoot.id, value: currentRoot })
        if (currentRoot.children)
            upsetChildren({ parentId: currentRoot.children, value: updatedChildren })
        else {
            upsetChildren({ parentId: currentRoot.id, value: [] })
            removeChildren({ parentId: currentRoot.id, })
        }
        const contentNode = childIntegration({ editorStateData: currentRoot })
        const currentNode = document.getElementById(rootId);
        if (currentNode)
            currentNode.replaceWith(contentNode)
    }
    if (newChildren) {

        upsetContent({ id: newRoot.id, value: newRoot })

        if (newRoot.children)
            upsetChildren({ parentId: newRoot.children, value: newChildren })
        else {
            upsetChildren({ parentId: newRoot.id, value: [] })
            removeChildren({ parentId: newRoot.id, })
        }

        const contentNode = childIntegration({ editorStateData: newRoot })
        if (rootIndex + 1 >= parentChildren.length) {
            addChildren({ parentId: parentClass, value: { contentId: newRoot.id, } })
            rootNode.appendChild(contentNode)
        } else {
            insertChildren({ index: rootIndex + 1, parentId: parentClass, value: { contentId: newRoot.id, } })
            const nextContentNode = document.getElementById(parentChildren[rootIndex + 1].contentId)
            rootNode.insertBefore(contentNode, nextContentNode)
        }

    }

    updateCaretToMatch({ id: newRoot.id, currentPosition: 0 })
}