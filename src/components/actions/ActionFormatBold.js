import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";
import RichUtils from "draft-js/lib/RichTextEditorUtil";

export default function ActionFormatBold({editorState, setEditorState}) {
    const onFormat = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }

    return (
        <ToolbarButton onClick={onFormat}><ToolbarButtonIcon name="Bold" /></ToolbarButton>
    );
}