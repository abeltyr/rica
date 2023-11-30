import { EditorStateContentType, ValueType } from '@/interface/editor';
import { getChildren, removeChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data/children';
import { getContent, removeContent, updateParentContent, upsetContent } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';

export const updateChildrenGenerator = async ({
    currentRootContent,
    updatedChildren,
    rootId,
}: {
    currentRootContent: EditorStateContentType,
    rootId: string,
    updatedChildren: ValueType[],
}) => {

    let currentRoot: EditorStateContentType = {
        ...currentRootContent
    }

    let addNewChildren = true;
    if (updatedChildren.length === 1) {
        const contentData = getContent({ id: updatedChildren[0].contentId });

        if (contentData.type != "InlineLink") {
            currentRoot = {
                ...contentData,
                id: currentRoot.id,
                parentId: undefined,
            }

            if (contentData.children) {
                const children = getChildren({ parentId: contentData.children });
                children.map((value, index) => {
                    if (children) children[index].parentId = currentRoot.id;
                    updateParentContent({ id: value.contentId, parentId: currentRoot.id })
                    // updateChildrenValue({
                    //     contentId: value.contentId,
                    //     parentId: value.parentId,
                    //     value: {
                    //         contentId: value.contentId,
                    //         parentId: currentRoot.id
                    //     }
                    // })
                })
                upsetChildren({ parentId: currentRoot.id, value: children })
                upsetChildren({ parentId: contentData.id, value: [] });
                removeChildren({ parentId: contentData.id, })
                currentRoot.children = currentRoot.id;
                currentRoot.content = undefined;
            } else {
                currentRoot.children = undefined;
                currentRoot.content = contentData.content;
                upsetChildren({ parentId: currentRoot.id, value: [] })
                removeChildren({ parentId: currentRoot.id, })
            }
            removeContent({ id: contentData.id });
            addNewChildren = false;
        }
    }


    if (addNewChildren) {
        if (currentRoot.children)
            upsetChildren({ parentId: currentRoot.children, value: updatedChildren })
        else
            removeChildren({ parentId: currentRoot.id, })
    }

    upsetContent({ id: currentRoot.id, value: currentRoot })

    const newNode = childIntegration({ editorStateData: currentRoot })
    const currentNode = document.getElementById(rootId);
    if (currentNode)
        currentNode.replaceWith(newNode)
}