import { EditorChildrenType, EditorStateContentType } from '@/interface/editor';
import { undoList } from './data';
import { parentClass } from '@/utils/commons';
import { ActionType, TrackHistoryListType, TrackHistoryType } from '@/interface/trackHistory';
import { getActualContent, getContent, getRootParentValue } from '../../content';
import { getChildren, getChildrenIndex } from '../../children';
import { getUndoListAtIndex } from '.';


export const insertToUndoList = ({ id, action, index, reset = false }: { id: string, action: ActionType, index: number, reset?: boolean }) => {
    let rootContent = getContent({ id });

    const rootId = getRootParentValue({ contentValue: rootContent })

    if (rootId != rootContent.id) {
        const content = getActualContent({ id: rootId })
        if (!content) {
            console.error("Content Doesn't exist")
            return
        }
        rootContent = content;
    }


    const innerData = getInnerData(rootContent)

    const rootIndex = getChildrenIndex({
        contentId: rootContent.id,
        parentId: parentClass
    })

    const actionListData: TrackHistoryType = {
        rootId: {
            action,
            rootContent,
            subsequentChildren: innerData.childrenData,
            subsequentContents: innerData.contentsData,
            rootIndex,
        }
    }
    let undoListData: TrackHistoryListType | undefined = getUndoListAtIndex(index);
    if (!undoListData || (undoListData && !undoListData.actionList) || reset) {
        undoListData = {
            actionList: actionListData
        }
    } else {
        undoListData = {
            actionList: {
                ...undoListData.actionList,
                ...actionListData
            }
        }
    }
    undoList[index] = undoListData;
}



const getInnerData = (value: EditorStateContentType) => {

    let contentsData: EditorStateContentType[] = []
    let childrenData: EditorChildrenType[] = []

    if (value.children) {

        const contentChildren = getChildren({
            parentId: value.children,
        })
        contentChildren.map((children, index) => {
            const content = getActualContent({ id: children.contentId });
            if (content) {

                contentsData = [...contentsData, content]

                const innerData = getInnerData(content)
                contentsData = [...contentsData, ...innerData.contentsData];
                childrenData = [...childrenData, ...innerData.childrenData];
            }
        })


        childrenData = [...childrenData, {
            [value.id]: contentChildren
        }]

    }


    return { contentsData, childrenData }
}