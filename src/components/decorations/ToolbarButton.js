import {useEditorContext} from "../../providers/EditorProvider";
import {Editor, Element as SlateElement, Transforms} from "slate";
import {LIST_TYPES, TEXT_ALIGN_TYPES} from "../constants";

export default function ToolbarButton({children, className = '', format, action, block, onClick, ...props}) {
    const editor = useEditorContext();

    const toggleBlock = (format) => {
        const isActive = isBlockActive(
            editor,
            format,
            TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
        )
        const isList = LIST_TYPES.includes(format)
        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type) &&
                !TEXT_ALIGN_TYPES.includes(format),
            split: true,
        })
        let newProperties
        if (TEXT_ALIGN_TYPES.includes(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            }
        } else {
            const [match] = Editor.nodes(editor, {
                match: n => SlateElement.isElement(n),
            });

            const existingProps = match?.[0] || {};

            newProperties = {
                ...existingProps,
                type: isActive ? 'paragraph' : isList ? 'list-item' : format,
            };
        }
        Transforms.setNodes(editor, newProperties)
        if (!isActive && isList) {
            const block = {type: format, children: []}
            Transforms.wrapNodes(editor, block)
        }
    };

    const isBlockActive = (format) => {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === format,
        });
        return !!match;
    };

    const isFormatActive = (format) => {
        const [match] = Editor.nodes(editor, {
            match: n => n[format] === true,
            mode: 'all',
        });
        return !!match;
    };

    const toggleFormat = (format) => {
        const isActive = isFormatActive(format);
        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    };

    const toggleAction = (action) => {
        if (action === 'undo') {
            editor.undo();
        } else if (action === 'redo') {
            editor.redo();
        }
    };

    const handleMouseDown = (event) => {
        event.preventDefault();

        if (onClick) {
            onClick(event);
            return;
        }

        if (block) {
            toggleBlock(block);
        } else if (format) {
            toggleFormat(format);
        } else if (action) {
            toggleAction(action);
        }

        if (props.onMouseDown) props.onMouseDown(event);
    };

    return (
        <button
            className={`v8-editor-toolbar-item ${className}`}
            onMouseDown={handleMouseDown}
            {...props}
        >
            {children}
        </button>
    );
}
