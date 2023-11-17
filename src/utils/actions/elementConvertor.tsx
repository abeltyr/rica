
import { EditorStateContentType, EditorType, EditorLinkAttrs, EditorAdditionDataType } from '@/interface/editor';
import { v4 } from 'uuid';
import { parentClass } from '../commons';

export const elementConvertor = (element: Element): EditorStateContentType | null => {

    let id = element.id;
    let content: string | undefined;
    let children: string | undefined;
    let type: EditorType;
    let parentId: string | undefined;
    const indent = 0;

    if (!id) {
        id = v4();
        element.id = id;
        element.setAttribute("id", id);
    }

    const className = element.className;


    if (element.childNodes.length > 1) {
        children = id;
    }
    else {
        content = element.textContent ?? ""
    }

    const parent = element.parentElement
    if (parent && parent?.id) {
        if (parent?.id != parentClass) {
            parentId = parent?.id;
        }
    }


    const tagname = element.tagName;
    let additional: EditorAdditionDataType | undefined;

    if (tagname === "SPAN" || tagname === "P") {
        type = "P"
    } else if (tagname === "H1") {
        type = "H1"
    } else if (tagname === "A") {
        const href = element.getAttribute("href") ?? "";
        const target = element.getAttribute("target") ?? "_blank";
        type = "InlineLink"
        additional = {
            link: {
                href,
                target,
            }
        }
    } else {
        type = "P"
    }


    const value: EditorStateContentType = {
        id,
        type,
        className,
        direction: "Lte",
        indent,
        content,
        children,
        additional,
        parentId
    }

    return value
}
