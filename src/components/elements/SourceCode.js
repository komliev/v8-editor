import React from "react";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { gruvboxDark } from "@uiw/codemirror-theme-gruvbox-dark";

export default function SourceCode({onChange, value = ''}) {

    const onCodeMirrorChange = (value, viewUpdate) => {
        onChange(value);
    };

    return (
        <CodeMirror
            value={value ? value : ''}
            extensions={[html()]}
            onChange={onCodeMirrorChange}
            theme={gruvboxDark}
            className="v8-editor-source-code"
            basicSetup={{
                lineWrapping: true,
            }}
        />
    )
}