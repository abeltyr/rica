import { EditorStateContentType, ValueType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, removeChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data';
import { getContent, removeContent, updateParentContent, upsetContent } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';
import { splitChildren } from './utils';
import { insertNode } from '../../utils';
import { newChildrenGenerator } from './newChildren';
import { updateChildrenGenerator } from './updateChildren';

export const childrenUpdate = async (
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

    // call the splitChildren function to separate the current content children based on the caret
    const newRootId = v4()
    const data = splitChildren({
        caretPosition,
        contentData: currentRootContent,
        caretPositionContentId: contentId,
        newParentId: newRootId,
        updatedParentId: rootId,
    })
    if (!data) return;


    let updatedChildren = data.updatedChildren;
    let newChildren = data.newChildren;


    //TODO: Might need to remove this, since the parentId seems to be adjust well from the splitChildren function
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




    if (updatedChildren) {
        await updateChildrenGenerator({
            currentRootContent,
            rootId,
            updatedChildren
        })
    }

    if (newChildren) {
        await newChildrenGenerator({
            currentRootContent,
            newChildren,
            newRootId,
            parentChildren,
            rootIndex,
            rootNode
        })

    }

    updateCaretToMatch({ id: newRootId, currentPosition: 0 })
}