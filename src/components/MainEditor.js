import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createEditor, Editor, Transforms} from 'slate';
import {Editable, Slate, withReact} from 'slate-react';
import {htmlToSlate, slateToHtml, SlateToHtmlConfig} from '@slate-serializers/html';
import {CONVERSION_LABELS_TO_TAGS, CONVERSION_TAGS_TO_LABELS, HOTKEYS, HOTKEYS_HISTORY} from './constants';
import {html as beautifyHtml} from 'js-beautify';
import SimpleBar from "simplebar-react";

import Toolbar from './decorations/Toolbar';
import ToolbarButton from './decorations/ToolbarButton';
import ToolbarButtonIcon from './decorations/ToolbarButtonIcon';
import ToolbarDivider from './decorations/ToolbarDivider';
import {EditorProvider} from '../providers/EditorProvider';
import {withHistory} from 'slate-history';
import isHotkey from "is-hotkey";
import Leaf from "./elements/Leaf";
import Element from "./elements/Element";
import SourceCode from "./elements/SourceCode";
import ToolbarButtonLink from "./decorations/ToolbarButtonLink";
import ToolbarButtonImage from "./decorations/ToolbarButtonImage";
import ToolbarButtonFile from "./decorations/ToolbarButtonFile";

export default function MainEditor({ onSave, value = '', placeholder = 'Будь ласка, введіть текст...', config = {} }) {
    const emptyState = [{ type: 'paragraph', children: [{ text: '' }] }];
    const [editor] = useState(() => {
        const e = withHistory(withReact(createEditor()));
        const {isVoid, isInline} = e;

        e.isInline = (element) => {
            return (element.type === 'link' || element.type === 'image') ? true : isInline(element)
        }

        e.isVoid = element => {
            return element.type === 'image' ? true : isVoid(element)
        }
        return e;
    });
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [rawHtml, setRawHtml] = useState(value);

    const [isLinkSelected, setIsLinkSelected] = useState(false);

    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);


    const parseInitialValue = useCallback((html) => {
        if (!html?.trim()) return emptyState;
        try {
            const parsed = htmlToSlate(html, CONVERSION_TAGS_TO_LABELS);
            return parsed?.length ? parsed : emptyState;
        } catch (e) {
            console.error('Error parsing HTML:', e);
            return emptyState;
        }
    }, []);


    const isInitialized = useRef(false);
    useEffect(() => {
        if (value !== rawHtml) {
            editor.children = parseInitialValue(value);

            isInitialized.current = true;
            setRawHtml(value);
        }
    }, [value]);


    const handleChange = useCallback((newValue) => {
        // Update "link selected" state
        const linkActive = isLinkActive(editor);
        setIsLinkSelected(linkActive);

        setRawHtml(getRawHtml(newValue));
    }, [onSave]);


    useEffect(() => {
        if (onSave && (value !== rawHtml)) {
            onSave(rawHtml);
        }
    }, [rawHtml]);


    const isLinkActive = (editor) => {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'link',
            mode: 'lowest',
        });
        return !!match;
    };


    const toggleMark = (editor, format) => {
        const isActive = isMarkActive(editor, format)
        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    }
    const isMarkActive = (editor, format) => {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    }


    const onEditorKeyDown = (event) => {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
            }
        }
        for (const hotkey in HOTKEYS_HISTORY) {
            if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const action = HOTKEYS_HISTORY[hotkey];
                if (editor && editor.history) {
                    if (editor.history.undos && editor.history.undos.length && action === 'undo') {
                        editor.undo();
                    } else if (editor.history.redos && editor.history.redos.length && action === 'redo') {
                        editor.redo();
                    }
                }
            }
        }


        // Enter on empty list-item should exit the list
        if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
            const [listItemEntry] = Editor.nodes(editor, {
                match: n => n.type === 'list-item',
                at: editor.selection, // Use the current selection path
                mode: 'lowest',
            });

            if (listItemEntry) {
                const [node, path] = listItemEntry;

                const isEmpty = Editor.isEmpty(editor, node);
                if (isEmpty) {
                    event.preventDefault();

                    // Remove the list-item from the editor
                    Transforms.removeNodes(editor, {
                        at: path,
                    });

                    // add a new paragraph
                    Transforms.insertNodes(editor, {
                        type: 'paragraph',
                        children: [{text: ''}],
                    });


                    // Unwrap from bulleted-list or numbered-list
                    Transforms.unwrapNodes(editor, {
                        match: n => n.type === 'bulleted-list' || n.type === 'numbered-list',
                        split: true,
                    });
                }
            }
        }
    }


    const getRawHtml = (newValue) => {
        if (!newValue) {
            newValue = editor.children || emptyState;
        }
        const html = slateToHtml(newValue, CONVERSION_LABELS_TO_TAGS);
        return beautifyHtml(html, {
            indent_size: 4,
            wrap_line_length: 80,
        });
    }


    const toggleSourceCode = () => {
        setIsSourceMode(prev => !prev);
        if (isSourceMode) {
            editor.children = parseInitialValue(rawHtml);
            editor.selection = null;
        } else {
            setRawHtml(getRawHtml());
        }
    }


    return (
        <EditorProvider value={editor}>
            <Toolbar>
                <ToolbarButton onClick={toggleSourceCode}><ToolbarButtonIcon name="Code" /></ToolbarButton>
                <ToolbarDivider />
                <ToolbarButton action="undo" disabled={!editor || !editor.history || !editor.history.undos || (editor.history.undos.length === 0)}><ToolbarButtonIcon name="ArrowBackUp" /></ToolbarButton>
                <ToolbarButton action="redo" disabled={!editor || !editor.history || !editor.history.redos || (editor.history.redos.length === 0)}><ToolbarButtonIcon name="ArrowForwardUp" /></ToolbarButton>
                <ToolbarDivider />
                <ToolbarButton format="bold"><ToolbarButtonIcon name="Bold" /></ToolbarButton>
                <ToolbarButton format="italic"><ToolbarButtonIcon name="Italic" /></ToolbarButton>
                <ToolbarButton format="underline"><ToolbarButtonIcon name="Underline" /></ToolbarButton>
                <ToolbarButton format="strikethrough"><ToolbarButtonIcon name="Strikethrough" /></ToolbarButton>
                <ToolbarDivider />
                <ToolbarButton block="left"><ToolbarButtonIcon name="AlignLeft" /></ToolbarButton>
                <ToolbarButton block="center"><ToolbarButtonIcon name="AlignCenter" /></ToolbarButton>
                <ToolbarButton block="right"><ToolbarButtonIcon name="AlignRight" /></ToolbarButton>
                <ToolbarButton block="justify"><ToolbarButtonIcon name="AlignJustified" /></ToolbarButton>
                <ToolbarDivider />
                <ToolbarButton block="numbered-list"><ToolbarButtonIcon name="ListNumbers"/></ToolbarButton>
                <ToolbarButton block="bulleted-list"><ToolbarButtonIcon name="List"/></ToolbarButton>
                <ToolbarDivider />
                <ToolbarButtonLink
                    isLinkSelected={isLinkSelected}
                />
                <ToolbarDivider />
                <ToolbarButtonImage uploadUrl={config.imageUploadUrl} />
                <ToolbarButtonFile uploadUrl={config.fileUploadUrl} />
            </Toolbar>
            <SimpleBar autoHide={true} className="v8-editor-container">
                {isSourceMode ? (
                    <SourceCode onChange={setRawHtml} value={rawHtml} />
                ) : (
                <Slate editor={editor} initialValue={emptyState} onChange={handleChange}>
                    <Editable
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}
                        placeholder={placeholder}
                        spellCheck
                        autoFocus
                        onKeyDown={onEditorKeyDown}
                    />
                </Slate>
                )}
            </SimpleBar>
        </EditorProvider>
    );
}
