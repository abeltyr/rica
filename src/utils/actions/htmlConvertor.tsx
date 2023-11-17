
import { ValueType } from '@/interface/editor';
import { v4 } from 'uuid';
import { updateContentChildren, updateParentContent, updateValueContent, upsetChildren, upsetContent } from '@/utils/editors/data';
import { parentClass } from '../commons';
import { elementConvertor } from '@/utils/actions';

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


        if (!mainParentId || mainParentId === parentClass)
            updateParentContent({ id: parentId, parentId: undefined })
        else
            updateParentContent({ id: parentId, parentId: mainParentId })

        return parentId;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
        const nodeData = node.childNodes[i];
        if (nodeData.nodeType === 1 && nodeData instanceof Element && nodeData.tagName != "BR") {
            if (nodeData.firstChild?.nodeType === 3) {
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
                    if (!parentId || parentId === parentClass)
                        updateParentContent({ id: childContentId, parentId: undefined })
                    else
                        updateParentContent({ id: childContentId, parentId: parentId })
                }

            }

        } else {
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
                const value = elementConvertor(childNode)
                if (value) {
                    upsetContent({ id: value.id, value, })
                    contentId = value.id;
                }
            }
        }

        return {
            contentId,
            parentId
        }
    }
}
