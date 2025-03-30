import React, {useEffect} from "react";
import {useEditorContext} from "../../providers/EditorProvider";
import ToolbarButton from "./ToolbarButton";
import linkEditIcon from "../../assets/img/link-edit.svg";
import ToolbarButtonIcon from "./ToolbarButtonIcon";
import LinkModal from "../tools/LinkModal";
import {Editor, Element as SlateElement, Transforms, Range} from "slate";

export default function ToolbarButtonLink({isLinkSelected = false}) {
    const editor = useEditorContext();
    const [linkActive, setLinkActive] = React.useState(isLinkSelected);
    const [selectedLink, setSelectedLink] = React.useState(null);
    const [addNewLink, setAddNewLink] = React.useState(null);


    useEffect(() => {
        setLinkActive(isLinkSelected);
    }, [isLinkSelected]);


    const onAddLinkClick = () => {
        setAddNewLink(true);
    }
    const wrapNewLink = (data) => {
        const {selection} = editor
        const isCollapsed = selection && Range.isCollapsed(selection)
        const link = {
            type: 'link',
            url: data.url,
            newTab: data.targetBlank,
            children: isCollapsed ? [{text: data.url}] : [],
        }
        if (isCollapsed) {
            Transforms.insertNodes(editor, link)
        } else {
            Transforms.wrapNodes(editor, link, {split: true})
            Transforms.collapse(editor, {edge: 'end'})
        }

        setAddNewLink(null);
    }


    const onRemoveLinkClick = () => {
        const selected = getSelectedLink(editor);
        if (selected) {
            unwrapLink(editor);
        }
    }
    const unwrapLink = editor => {
        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
        })
    }


    const getSelectedLink = (editor) => {
        if (!editor.selection) return null;

        const [match] = Editor.nodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'link',
            mode: 'lowest',
        });

        if (match) {
            const [node, path] = match;
            return {node, path};
        }

        return null;
    };


    const handleLinkEditClick = () => {
        const result = getSelectedLink(editor);
        if (result) {
            setSelectedLink({
                url: result?.node?.url ? result.node.url : '',
                newTab: result?.node?.newTab ? result.node.newTab : false,
            })
        }
    };


    const editSelectedLink = (link) => {
        const {url, targetBlank} = link;
        const selected = getSelectedLink(editor);

        if (selected) {
            Transforms.setNodes(
                editor,
                {
                    url: url,
                    newTab: targetBlank,
                },
                {
                    at: selected.path,
                    match: n =>
                        !Editor.isEditor(n) &&
                        SlateElement.isElement(n) &&
                        n.type === 'link',
                }
            );
        }

        setSelectedLink(null);
    };


    const onModalClose = () => {
        setSelectedLink(null);
        setAddNewLink(null);

        setLinkActive(false);
    }


    return (<>
        {linkActive ? (
            <>
            <ToolbarButton onClick={handleLinkEditClick}>
                <img src={linkEditIcon} alt="Link edit" width={20} height={20} />
            </ToolbarButton>
            <ToolbarButton onClick={onRemoveLinkClick}>
                <ToolbarButtonIcon name="Unlink" />
            </ToolbarButton>
            </>
        ) : (
            <ToolbarButton onClick={onAddLinkClick}>
                <ToolbarButtonIcon name="Link" />
            </ToolbarButton>
        )}

        <LinkModal
            visible={selectedLink !== null}
            isNewLink={false}
            url={selectedLink?.url}
            targetBlank={selectedLink?.newTab}
            onSave={editSelectedLink}
            onClose={onModalClose}
        />

        <LinkModal
            visible={addNewLink}
            isNewLink={true}
            onSave={wrapNewLink}
            onClose={onModalClose}
        />
    </>);
}
