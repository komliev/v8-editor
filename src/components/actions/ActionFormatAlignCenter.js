import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";
import RichUtils from "draft-js/lib/RichTextEditorUtil";

export default function ActionFormatAlignCenter({editorState, setEditorState}) {
    const onFormatBold = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ALIGNCENTER'));
    }

    return (
        <ToolbarButton onClick={onFormatBold}><ToolbarButtonIcon name="AlignCenter" /></ToolbarButton>
    );
}