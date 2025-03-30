import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator} from 'draft-js';
import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";
import Modifier from "draft-js/lib/DraftModifier";


export default function ActionFormatAlignRight({editorState, setEditorState}) {
    const onFormat = (alignment) => {
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();

        // Apply alignment as a custom inline style
        const newContentState = Modifier.mergeBlockData(
            contentState,
            selection,
            {textAlign: alignment}
        );

        setEditorState(EditorState.push(editorState, newContentState, "change-block-data"));
    };

    return (
        <ToolbarButton onClick={onFormat}><ToolbarButtonIcon name="AlignRight"/></ToolbarButton>
    );
}