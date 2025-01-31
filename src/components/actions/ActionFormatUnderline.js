import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";
import RichUtils from "draft-js/lib/RichTextEditorUtil";

export default function ActionFormatUnderline({editorState, setEditorState}) {
    const onFormat = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    }

    return (
        <ToolbarButton onClick={onFormat}><ToolbarButtonIcon name="Underline" /></ToolbarButton>
    );
}