
import { EditorStateContentType } from '@/interface/editor';
import { v4 } from 'uuid';
import { upsetContent } from '../editors/data';

export const stateCheck = async (
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
        if (node.childNodes[i].nodeType === 3) {
            if (node.childNodes.length > 1) {
                const initialData = node.childNodes[i].textContent ?? " ";
                const value: EditorStateContentType = {
                    id: v4(),
                    type: "P",
                    className: "",
                    direction: "",
                    indent: 0,
                    content: initialData,
                    parentId: parentId != "Editor" ? parentId : undefined
                }
                const newChild = upsetContent({ id: value.id, value, setupNode: true });
                if (newChild) node.childNodes[i].replaceWith(newChild)
            }
        } else {
            stateCheck({ node: node.childNodes[i] })
        }
    }

}
