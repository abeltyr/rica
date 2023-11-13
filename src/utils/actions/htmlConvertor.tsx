
import { ValueType } from '@/interface/editor';
import { v4 } from 'uuid';
import { updateContentChildren, updateParentContent, updateValueContent, upsetChildren } from '@/utils/editors/data';

export const htmlConvertor = async (
    { node, }: { node: Node, }
) => {

    let parentId: string | undefined;
    if (node instanceof Element) {
        parentId = node.id;
    }

    if (!parentId) return

    let children: ValueType[] = []

    if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
        updateValueContent({ id: parentId, value: node.textContent ?? "" })
        const mainParent = node.parentElement;

        let mainParentId: string | undefined;

        if (mainParent) mainParentId = mainParent.id


        if (!mainParentId || mainParentId === "Editor")
            updateParentContent({ id: parentId, parentId: undefined })
        else
            updateParentContent({ id: parentId, parentId: mainParentId })

        // removeChildren({ parentId })
        return parentId;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType === 1) {
            if (node.childNodes[i]?.firstChild?.nodeType === 3) {
                const value = nodeConvertor({ node: node.childNodes[i], parentId });
                if (value)
                    children = [...children, value]

            } else {
                let childContentId = await htmlConvertor({ node: node.childNodes[i] })
                if (childContentId) {
                    children = [...children, {
                        contentId: childContentId,
                        parentId
                    }]
                    updateContentChildren({ id: childContentId, childrenId: childContentId })
                    if (!parentId || parentId === "Editor")
                        updateParentContent({ id: childContentId, parentId: undefined })
                    else
                        updateParentContent({ id: childContentId, parentId: parentId })
                }
            }

        } else {
            console.error("Node should pass through html state check before being converted, incorrect html formate issue ")
            return
        }

    }


    upsetChildren({ parentId, value: children })
    return parentId

}


const nodeConvertor = (
    { node, parentId }: { node: Node, parentId: string }): ValueType | undefined => {
    if (node.firstChild && node.firstChild.nodeType === 3) {
        let contentId: string | undefined;
        const childNode = node;
        if (childNode instanceof Element) {
            contentId = childNode.id;
        }

        if (!contentId) {
            contentId = v4();
            if (childNode instanceof Element) {
                childNode.id = contentId;
                childNode.setAttribute("key", contentId);
            }
            // TODO:setup a way to convert html component to content
        }

        return {
            contentId,
            parentId
        }
    }
}
