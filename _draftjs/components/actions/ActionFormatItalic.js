import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";
import RichUtils from "draft-js/lib/RichTextEditorUtil";

export default function ActionFormatItalic({editorState, setEditorState}) {
    const onFormat = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    }

    return (
        <ToolbarButton onClick={onFormat}><ToolbarButtonIcon name="Italic" /></ToolbarButton>
    );
}