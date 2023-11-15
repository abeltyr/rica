'use client'

import { useEditor } from '@/context/editor'
import { parentClass } from '@/utils/commons';
import { onCopy, onDragStart, onInput, onKeyDown, onKeyUp, onPaste } from '@/utils/editorCalls';
import React, { useEffect } from 'react'

const Editor = () => {
    const { renderEditorDom } = useEditor();
    useEffect(() => {
        renderEditorDom();
    })
    return (
        <div
            id={parentClass}
            contentEditable={true}
            className={`w-full py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text border-2 rounded-xl`}
            onDragStart={onDragStart}
            onInput={onInput}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onPaste={onPaste}
            onCopy={onCopy}
        >
        </div>
    )
}

export default Editor



{/* sadda
            <p id="20" key="20" className="leading-7 outline-none cursor-text text-start ">
                <span id="30" key="30">Welcome </span> sadda das hajs adssajk
                <a id="40" key="40" className="underline text-blue-300 italic " href="https://google.com" target="_blank">
                    <span id="50" key="50" className="font-bold text-red-300 italic no-underline"> To </span>
                    <span id="60" key="60">Link </span>
                </a>
                saads asd
                <span id="70" key="70"> Pp Data </span>
                jknkj k
                <a id="80" key="80" className="underline text-blue-300 italic " href="https://google.com" target="_blank">
                    <span id="90" key="90" className="font-bold italic"> To </span>
                    <span id="100" key="100">Link</span>
                </a>
            </p> */}