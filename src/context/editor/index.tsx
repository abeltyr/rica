'use client'

import { Editor } from '@/interface/editor';
import React, { useContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import { getChildren, getContent, setupChildren, setupContents } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';
import { parentClass } from '@/utils/commons';

const defaultEditorValue: Editor = {
    id: v4(),
    editorState: {
        children: {
            "Editor": [
                {
                    contentId: "0",
                },
                {
                    contentId: "12",
                },
                {
                    contentId: "100",
                },
                {
                    contentId: "11",
                },
                {
                    contentId: "14",
                },
                {
                    contentId: "42",
                },
                {
                    contentId: "15",
                },
                {
                    contentId: "40",
                },
                {
                    contentId: "13",
                },
                {
                    contentId: "41",
                },
                {
                    contentId: "20",
                }
            ],
            "20": [
                {
                    contentId: "3",
                    parentId: "20",
                },
                {
                    contentId: "4",
                    parentId: "20",
                },
                {
                    contentId: "7",
                    parentId: "20",
                },
                {
                    contentId: "8",
                    parentId: "20",
                }
            ],
            "4": [
                {
                    contentId: "5",
                    parentId: "4",
                },
                {
                    contentId: "6",
                    parentId: "4",
                },
            ],
            "40": [
                {
                    contentId: "50",
                    parentId: "40",
                },
            ],
            "41": [
                {
                    contentId: "51",
                    parentId: "41",
                },
            ],
            "42": [
                {
                    contentId: "52",
                    parentId: "42",
                },
            ],
            "50": [
                {
                    contentId: "60",
                    parentId: "50",
                },
                {
                    contentId: "70",
                    parentId: "50",
                },
            ],
            "51": [
                {
                    contentId: "61",
                    parentId: "51",
                },
                {
                    contentId: "71",
                    parentId: "51",
                },
            ],
            "52": [
                {
                    contentId: "62",
                    parentId: "52",
                },
                {
                    contentId: "72",
                    parentId: "52",
                },
            ],
            "8": [
                {
                    contentId: "9",
                    parentId: "8",
                },
                {
                    contentId: "10",
                    parentId: "8",
                },
            ]
        },
        content: {
            "0": {
                id: "0",
                type: "H1",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Poland",
                format: null
            },
            "100": {
                id: "100",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "",
                format: null,

            },
            "20": {
                id: "20",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 50,
                children: "20",
                format: "Start"
            },
            "3": {
                id: "3",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Welcome ",
                format: null,
                parentId: "20"
            },
            "4": {
                id: "4",
                type: "InlineLink",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "4",
                format: null,
                parentId: "20",
                additional: {
                    link: {
                        href: "https://google.com",
                    }
                },
            },
            "40": {
                id: "40",
                type: "P",
                className: "font-bold text-red-300 italic no-underline",
                direction: "ltr",
                indent: 0,
                children: "40",
                format: null,
            },
            "41": {
                id: "41",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "41",
                format: null,
            },
            "42": {
                id: "42",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "42",
                format: null,
            },
            "50": {
                id: "50",
                type: "InlineLink",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "50",
                format: null,
                additional: {
                    link: {
                        href: "https://google.com",
                    }
                },
                parentId: "40",
            },
            "51": {
                id: "51",
                type: "InlineLink",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "51",
                format: null,
                additional: {
                    link: {
                        href: "https://google.com",
                    }
                },
                parentId: "41",
            },
            "52": {
                id: "52",
                type: "InlineLink",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "52",
                format: null,
                additional: {
                    link: {
                        href: "https://google.com",
                    }
                },
                parentId: "42",
            },
            "60": {
                id: "60",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
                parentId: "50",
            },
            "70": {
                id: "70",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: " Data ",
                format: null,
                parentId: "50",
            },
            "61": {
                id: "61",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
                parentId: "51",
            },
            "71": {
                id: "71",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: " Data ",
                format: null,
                parentId: "51",
            },
            "62": {
                id: "62",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
                parentId: "52",
            },
            "72": {
                id: "72",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: " Data ",
                format: null,
                parentId: "52",
            },
            "5": {
                id: "5",
                type: "P",
                className: "font-bold text-red-300 italic no-underline",
                direction: "ltr",
                indent: 0,
                content: "To ",
                format: null,
                parentId: "4",
            },
            "6": {
                id: "6",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
                parentId: "4",
            },
            "7": {
                id: "7",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: " Pp Data ",
                format: null,
                parentId: "20",
            },
            "8":
            {
                id: "8",
                type: "InlineLink",
                className: "",
                direction: "ltr",
                indent: 0,
                children: "8",
                additional: {
                    link: {
                        href: "https://google.com",
                    }
                },
                parentId: "20",

            },
            "9": {
                id: "9",
                type: "P",
                className: "font-bold italic",
                direction: "ltr",
                indent: 0,
                content: "To ",
                format: null,
                parentId: "8",
            },
            "10": {
                id: "10",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
                parentId: "8",
            },
            "11": {
                id: "11",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
            },
            "12": {
                id: "12",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "",
                format: null,
            },
            "13": {
                id: "13",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "",
                format: null,
            },
            "14": {
                id: "14",
                type: "P",
                className: "font-bold text-red-300 italic no-underline",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
            },
            "15": {
                id: "15",
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Link",
                format: null,
            },
        },
        rule: {
            availableFeature: [],
            maxChildrenAmount: null
        },
    },
    editorVersion: "0.0.1",
    lastSaved: new Date().toDateString(),
    source: "Editor",
    version: "1"
};

const initialValues: {
    editorValue: Editor,
    setEditorValue: Function,
    renderEditorDom: Function,
} = {
    editorValue: defaultEditorValue,
    setEditorValue: () => { },
    renderEditorDom: () => { }
};

type Props = {
    children?: React.ReactNode;
};

const EditorContext = React.createContext(initialValues);

const useEditor = () => useContext(EditorContext);

const EditorProvider: React.FC<Props> = ({ children }) => {

    const [editorValue, setEditorValue] = useState<Editor>(defaultEditorValue)

    useEffect(() => {
        setupContents(editorValue.editorState.content);
        setupChildren(editorValue.editorState.children);
    })


    const renderEditorDom = () => {
        const rootEditorElement = document.getElementById(parentClass);
        let count = 0
        const children = getChildren({ parentId: parentClass })
        if (children) {
            children.map((value, index) => {
                const editableState = getContent({ id: value.contentId });
                if (editableState) {
                    const parentElement = childIntegration({
                        editorStateData: editableState,
                    })
                    if (rootEditorElement?.children[count] == null) {
                        rootEditorElement?.appendChild(parentElement)
                    } else {
                        rootEditorElement?.replaceChild(parentElement, rootEditorElement.children[count])
                    }
                    count++;
                }
            })
        }
    }

    return (
        <EditorContext.Provider
            value={{
                editorValue,
                setEditorValue,
                renderEditorDom
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};

export { EditorProvider, useEditor };