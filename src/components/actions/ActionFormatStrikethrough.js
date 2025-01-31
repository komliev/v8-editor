import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";
import RichUtils from "draft-js/lib/RichTextEditorUtil";

export default function ActionFormatStrikethrough({editorState, setEditorState}) {
    const onFormat = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH'));
    }

    return (
        <ToolbarButton onClick={onFormat}><ToolbarButtonIcon name="Strikethrough" /></ToolbarButton>
    );
}