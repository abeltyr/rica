import { EditorStateContentType, ValueType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, removeChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data';
import { getContent, removeContent, updateParentContent, upsetContent } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';
import { splitChildren } from './utils';
import { insertNode } from '../../utils';

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
        let currentRoot: EditorStateContentType = {
            ...currentRootContent,
            parentId: undefined,
            content: undefined,
            children: currentRootContent.id
        }
        upsetContent({ id: currentRoot.id, value: currentRoot })


        if (currentRoot.children)
            upsetChildren({ parentId: currentRoot.children, value: updatedChildren })
        else
            removeChildren({ parentId: currentRoot.id, })


        const newNode = childIntegration({ editorStateData: currentRoot })
        const currentNode = document.getElementById(rootId);
        if (currentNode)
            currentNode.replaceWith(newNode)
    }



    if (newChildren) {


        let newRoot: EditorStateContentType = {
            ...currentRootContent,
            id: newRootId,
            parentId: undefined,
            content: undefined,
            children: newRootId
        }


        let addNewChildren = true;
        // for children with only one child the parent inherit it data and that child is removed
        if (newChildren.length === 1) {
            const contentData = getContent({ id: newChildren[0].contentId });
            newRoot = {
                ...contentData,
                id: newRoot.id,
                parentId: undefined,
            }
            if (contentData.children) {
                const children = getChildren({ parentId: contentData.children });
                children.map((value, index) => {
                    if (children) children[index].parentId = newRoot.id;
                    updateParentContent({ id: value.contentId, parentId: newRoot.id })
                    updateChildrenValue({
                        contentId: value.contentId,
                        parentId: value.parentId,
                        value: {
                            contentId: value.contentId,
                            parentId: newRoot.id
                        }
                    })
                })
                upsetChildren({ parentId: newRoot.id, value: children })
                upsetChildren({ parentId: contentData.id, value: [] });
                removeChildren({ parentId: contentData.id, })
                newRoot.children = newRoot.id;
                newRoot.content = undefined;
            } else {
                newRoot.children = undefined;
                newRoot.content = contentData.content;
            }
            removeContent({ id: contentData.id });

            addNewChildren = false;
        }

        if (addNewChildren) {
            if (newRoot.children)
                upsetChildren({ parentId: newRoot.children, value: newChildren })
            else
                removeChildren({ parentId: newRoot.id, })

        }

        upsetContent({ id: newRoot.id, value: newRoot })



        await insertNode({
            contentData: newRoot,
            parentChildren,
            parentId: parentClass,
            rootIndex,
            rootNode
        })

    }

    updateCaretToMatch({ id: newRootId, currentPosition: 0 })
}