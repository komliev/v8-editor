import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator} from 'draft-js';
import ToolbarButtonIcon from "../decorations/ToolbarButtonIcon";
import ToolbarButton from "../decorations/ToolbarButton";

const findAlignmentEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'ALIGNMENT'
            );
        },
        callback
    );
};

const AlignmentSpan = (props) => {
    const {alignment} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <span style={{textAlign: alignment}}>
            {props.children}
        </span>
    );
};

const decorator = new CompositeDecorator([
    {
        strategy: findAlignmentEntities,
        component: AlignmentSpan,
    },
]);

export default function ActionFormatAlignLeft({editorState, setEditorState}) {
    const onFormat = () => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('ALIGNMENT', 'MUTABLE', {alignment: 'left'});
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
        setEditorState(RichUtils.toggleLink(newState, newState.getSelection(), entityKey));
    };

    return (
        <ToolbarButton onClick={onFormat}><ToolbarButtonIcon name="AlignLeft"/></ToolbarButton>
    );
}