'use client'

import { useEditor } from '@/context/editor'
import React, { useEffect } from 'react'

const Editor = () => {

    const { editorValue, renderEditorDom, setEditorValue } = useEditor();
    useEffect(() => {
        renderEditorDom();
    })


    return (
        <div
            className={`w-full py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text border-2 rounded-xl`}
            id="Editor"
            contentEditable={true}
            onDragStart={(event: any) => {
                event.preventDefault();
            }}
            onKeyDown={async (event: React.KeyboardEvent<HTMLDivElement>) => {
                event.preventDefault();
            }}
        >
        </div>
    )
}

export default Editor