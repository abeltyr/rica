import { EditorStateContentType, ValueType } from '@/interface/editor';
import { getChildren, removeChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data/children';
import { getContent, removeContent, updateParentContent, upsetContent } from '@/utils/editors/data/content';
import { insertNode } from '../../utils';
import { parentClass } from '@/utils/commons';

export const newChildrenGenerator = async ({
    currentRootContent,
    newChildren,
    newRootId,
    parentChildren,
    rootIndex,
    rootNode
}: {
    currentRootContent: EditorStateContentType,
    newRootId: string,
    newChildren: ValueType[],
    parentChildren: ValueType[],
    rootIndex: number,
    rootNode: Node
}) => {


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
        if (contentData.type != "InlineLink") {
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