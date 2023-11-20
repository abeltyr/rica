
import { EditorStateContentType } from '@/interface/editor';
import { v4 } from 'uuid';
import { getContent, updateValueContent, upsetContent } from '../editors/data';
import { parentClass } from '@/utils/commons';
import { elementConvertor } from '@/utils/actions';

export const fullStateAdjuster = async (
    {
        node,
    }: {
        node: Node,
    }
) => {
    let parentId: string | undefined;
    if (node instanceof Element) {
        parentId = node.id;
    }

    if (!parentId) return

    for (let i = 0; i < node.childNodes.length; i++) {
        const id = v4();
        if (node.childNodes[i].nodeType === 3) {

            let value: EditorStateContentType
            const initialData = node.childNodes[i].textContent ?? "";
            if (node.childNodes.length > 1) {
                value = {
                    id: id,
                    type: "P",
                    className: "",
                    direction: "",
                    indent: 0,
                    content: initialData,
                    parentId: parentId != parentClass ? parentId : undefined
                }
                const newChild = upsetContent({ id: value.id, value, setupNode: true });
                if (newChild) node.childNodes[i].replaceWith(newChild)
            } else {
                updateValueContent({ id: parentId, value: initialData })
            }
        } else {
            fullStateAdjuster({ node: node.childNodes[i] })
        }


        let childId: string | undefined;
        const childNode = node.childNodes[i];
        if (childNode instanceof Element) {
            childId = childNode.id;
        }

        let created = node.childNodes[i].nodeType === 3;

        if (!childId) {
            created = true;
        }
        else {
            const content = getContent({ id: childId })
            if (!content) created = true;
        }

        if (created) {
            if (childNode instanceof Element) {
                const value = elementConvertor(childNode)
                if (value) upsetContent({ id: value.id, value, })
            }
        }
    }

}
