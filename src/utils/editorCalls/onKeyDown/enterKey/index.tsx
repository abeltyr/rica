import { EditorStateContentType, ValueType, } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { addChildren, getAllChildren, getChildren, getChildrenIndex, getLastFirstChildId, getRootParentIndex, insertChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data';
import { getContent, getContents, getRootParentValue, getSecondParentValue, updateParentContent, updateValueContent, upsetContent, validateId } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';



export const enterKey = (
    {
        id,
        node,
        currentPosition,
    }: {
        id: string,
        node: Node,
        currentPosition: number,
    }) => {

    let contentId = validateId(id)
    let content = getContent({ id: contentId })
    let caretPosition = currentPosition;
    let currentNode = node;
    const newRootId = v4()

    let lastId = contentId;
    let lastCaretPosition = currentPosition;

    const rootId = getRootParentValue({ contentValue: content })
    let rootIndex = getRootParentIndex(contentId)
    const parentChildren = getChildren({ parentId: parentClass })

    if (rootIndex === undefined || rootIndex < 0 || parentChildren.length < rootIndex) rootIndex = parentChildren.length;


    const currentRootContent = getContent({ id: rootId })

    const rootNode = document.getElementById(parentClass);


    if (!rootNode) return



    let newRoot: EditorStateContentType;


    if (currentPosition === 0) {
        let moveDown = false;
        const rootParentId = getRootParentValue({ contentValue: content });
        const rootContent = getContent({ id: rootParentId });
        const firstChildId = getLastFirstChildId(rootContent)
        if (firstChildId === contentId) moveDown = true
        console.log("at the root ")
        if (moveDown) {
            console.info("MDown - moving down because it is at the root")
            newRoot = {
                ...currentRootContent,
                children: undefined,
                content: "",
                id: v4(),
                parentId: undefined,
            }

            const contentNode = childIntegration({ editorStateData: newRoot })
            const nextContentNode = document.getElementById(parentChildren[rootIndex].contentId);
            rootNode.insertBefore(contentNode, nextContentNode)


            upsetContent({ id: newRoot.id, value: newRoot })
            insertChildren({ index: rootIndex, parentId: parentClass, value: { contentId: newRoot.id, } })

            return
        }
    }

    if (currentRootContent.children) {
        const data = splitChildrenContent({
            caretPosition,
            contentData: currentRootContent,
            contentId,
            rootId,
            newParentId: newRootId,
            updatedParentId: rootId,
        })
        if (!data) return;

        const newRoot = {
            ...currentRootContent,
            id: newRootId,
            parentId: undefined,
            content: undefined,
            children: newRootId
        }
        const currentRoot = {
            ...currentRootContent,
            parentId: undefined,
            content: undefined,
            children: currentRootContent.id
        }
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


        upsetContent({ id: newRoot.id, value: newRoot })
        upsetContent({ id: currentRoot.id, value: currentRoot })
        if (updatedChildren) {
            upsetChildren({ parentId: currentRoot.children, value: updatedChildren })
            const contentNode = childIntegration({ editorStateData: currentRoot })
            const currentNode = document.getElementById(rootId);
            if (currentNode)
                currentNode.replaceWith(contentNode)
        }
        if (newChildren) {
            upsetChildren({ parentId: newRoot.children, value: newChildren })
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

        lastId = newRoot.id;
        lastCaretPosition = 0

    }
    else if (currentRootContent.content) {
        console.log("Root is just a normal content so just need to split the text", caretPosition)

        newRoot = {
            ...currentRootContent,
            id: v4(),
            parentId: undefined,
            content: currentRootContent.content.substring(currentPosition, currentRootContent.content.length),
            children: undefined
        }

        currentRootContent.content = currentRootContent.content.substring(0, currentPosition);

        upsetContent({ id: newRoot.id, value: newRoot })
        updateValueContent({ id: currentRootContent.id, value: currentRootContent.content })


        const contentNode = childIntegration({ editorStateData: newRoot })


        if (rootIndex + 1 >= rootNode.childNodes.length) {
            addChildren({ parentId: parentClass, value: { contentId: newRoot.id, } })
            rootNode.appendChild(contentNode)
        } else {
            insertChildren({ index: rootIndex + 1, parentId: parentClass, value: { contentId: newRoot.id, } })
            const nextContentNode = document.getElementById(parentChildren[rootIndex + 1].contentId)
            rootNode.insertBefore(contentNode, nextContentNode)
        }

        lastId = newRoot.id;
        lastCaretPosition = 0

    }


    updateCaretToMatch({ id: lastId, currentPosition: lastCaretPosition })
}



const splitChildrenContent = (
    {
        contentData,
        caretPosition,
        rootId,
        updatedParentId,
        newParentId,
        contentId
    }: {
        contentData: EditorStateContentType,
        caretPosition: number,
        rootId: string,
        updatedParentId: string,
        newParentId: string,
        contentId: string
    }) => {


    let updatedChildren: ValueType[] | undefined;
    let newChildren: ValueType[] | undefined;

    const secondContentId = getSecondParentValue({ contentId, finalId: rootId })

    if (contentData.content) {
        let { updatedContent, newContent } = splitContentContent({ caretPosition, contentData })
        if (newContent) newChildren = [{
            contentId: newContent.id,
            parentId: newParentId
        }]
        if (updatedContent) updatedChildren = [{
            contentId: updatedContent.id,
            parentId: updatedParentId
        }]

    }

    else if (contentData.children) {
        let currentChildren: ValueType[] = getChildren({ parentId: rootId });
        let secondLayerIndex = getChildrenIndex({ contentId: secondContentId, parentId: rootId });

        updatedChildren = currentChildren.slice(0, secondLayerIndex)
        newChildren = currentChildren.slice(secondLayerIndex + 1, currentChildren.length)


        if (!currentChildren[secondLayerIndex]) return

        const indexContent = getContent({ id: currentChildren[secondLayerIndex].contentId });

        if (indexContent) {
            console.log("indexContent", indexContent)
            const data = splitChildrenContent({
                caretPosition, contentData: indexContent, rootId: indexContent.id, contentId,
                updatedParentId: indexContent.id,
                newParentId,
            })

            if (data) {
                if (data.newChildren) newChildren = [...data.newChildren, ...newChildren];
                if (data.updatedChildren) updatedChildren = [...updatedChildren, ...data.updatedChildren];
            }
        }
    }




    return { newChildren, updatedChildren }

}

const splitContentContent = ({ contentData, caretPosition }: { contentData: EditorStateContentType, caretPosition: number }) => {

    let updatedContent: EditorStateContentType | undefined;
    let newContent: EditorStateContentType | undefined;

    if (contentData.content) {
        updatedContent = {
            ...contentData,
            content: contentData.content.substring(0, caretPosition) === "" ? " " : contentData.content.substring(0, caretPosition),
            children: undefined
        }

        newContent = {
            ...contentData,
            id: v4(),
            parentId: undefined,
            content: contentData.content.substring(caretPosition, contentData.content.length) === "" ? " " : contentData.content.substring(caretPosition, contentData.content.length),
            children: undefined
        }

        upsetContent({ id: updatedContent.id, value: updatedContent })
        upsetContent({ id: newContent.id, value: newContent })
    }

    return { updatedContent, newContent }

}