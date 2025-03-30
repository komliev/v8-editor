import {useRef, useState, useEffect} from 'react';
import {Editor, EditorState, convertFromHTML} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import Toolbar from "./decorations/Toolbar";
import ToolbarButton from "./decorations/ToolbarButton";
import {IconBold, IconCloudDownload, IconItalic, IconStrikethrough, IconUnderline} from "@tabler/icons-react";
import ToolbarButtonIcon from "./decorations/ToolbarButtonIcon";
import ToolbarDivider from "./decorations/ToolbarDivider";
import ActionFormatBold from "./actions/ActionFormatBold";
import ActionFormatItalic from "./actions/ActionFormatItalic";
import ActionFormatUnderline from "./actions/ActionFormatUnderline";
import ActionFormatStrikethrough from "./actions/ActionFormatStrikethrough";
import ActionFormatAlignLeft from "./actions/ActionFormatAlignLeft";
import ActionFormatAlignCenter from "./actions/ActionFormatAlignCenter";
import ActionFormatAlignRight from "./actions/ActionFormatAlignRight";
import ContentState from "draft-js/lib/ContentState";

export default function MainEditor({onSave, value = ''}) {
    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );
    const editor = useRef(null);


    useEffect(() => {
        const blocksFromHTML = convertFromHTML(value);
        const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );
        setEditorState(EditorState.createWithContent(contentState));
    }, [value]);


    function focusEditor() {
        editor.current.focus();
    }


    useEffect(() => {
        focusEditor()
    }, []);


    /*useEffect(() => {
        const html = stateToHTML(editorState.getCurrentContent());
        if (html !== value) {
            onSave(html);
        }
    }, [editorState]);*/


    const blockRenderer = (contentBlock) => {
        const alignment = contentBlock.getData().get("textAlign");
        return {
            props: {
                style: {textAlign: alignment || "left"}, // Default is left
            },
        };
    };


    return (<>
        <Toolbar>
            <ToolbarButton><ToolbarButtonIcon name="Code" /></ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton><ToolbarButtonIcon name="ArrowBackUp" /></ToolbarButton>
            <ToolbarButton><ToolbarButtonIcon name="ArrowForwardUp" /></ToolbarButton>

            <ToolbarDivider />

            <ActionFormatBold editorState={editorState} setEditorState={setEditorState} />
            <ActionFormatItalic editorState={editorState} setEditorState={setEditorState} />
            <ActionFormatUnderline editorState={editorState} setEditorState={setEditorState} />
            <ActionFormatStrikethrough editorState={editorState} setEditorState={setEditorState} />

            <ToolbarDivider />

            <ActionFormatAlignLeft editorState={editorState} setEditorState={setEditorState} />
            <ActionFormatAlignCenter editorState={editorState} setEditorState={setEditorState} />
            <ActionFormatAlignRight editorState={editorState} setEditorState={setEditorState} />

            <ToolbarDivider />

            <ToolbarButton><ToolbarButtonIcon name="ListNumbers" /></ToolbarButton>
            <ToolbarButton><ToolbarButtonIcon name="List" /></ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton><ToolbarButtonIcon name="Link" /></ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton><ToolbarButtonIcon name="Paperclip" /></ToolbarButton>
            <ToolbarButton><ToolbarButtonIcon name="Photo" /></ToolbarButton>
        </Toolbar>

        <div className="v8-editor-container" onClick={focusEditor}>
            <Editor
                ref={editor}
                editorState={editorState}
                onChange={editorState => setEditorState(editorState)}
                blockRendererFn={blockRenderer}
            />
        </div>
    </>);
}