import React, {useCallback, useEffect} from "react";
import {useEditorContext} from "../../providers/EditorProvider";
import ToolbarButton from "./ToolbarButton";
import linkEditIcon from "../../assets/img/link-edit.svg";
import ToolbarButtonIcon from "./ToolbarButtonIcon";
import LinkModal from "../tools/LinkModal";
import {Editor, Element as SlateElement, Transforms, Range} from "slate";

export default function ToolbarButtonFile({uploadUrl = ''}) {
    const editor = useEditorContext();


    const onFileButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = e.target.files[0];
            input.remove();
            if (file) {
                // send file via form multipart/form-data
                const formData = new FormData();
                formData.append('file', file);

                // send file to server
                const xhr = new XMLHttpRequest();
                //xhr.open('POST', uploadUrl, true); // TODO: change on production
                xhr.open('GET', uploadUrl, true);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (response?.url) {
                            const fileUrl = response.url;
                            const filename = response.filename;
                            const linkNode = { type: 'link', url: fileUrl, newTab: true, children: [{ text: filename }] };

                            // insert the image node at the current selection
                            const { selection } = editor;
                            if (selection && Range.isCollapsed(selection)) {
                                Transforms.insertNodes(editor, linkNode, { at: selection, mode: 'highest' });
                            } else {
                                Transforms.insertNodes(editor, linkNode);
                            }

                            // move the cursor after the image
                            Transforms.move(editor, { distance: 1, unit: 'offset' });
                        }
                    } else {
                        console.error('Error uploading file:', xhr.statusText);
                    }
                };
                xhr.onerror = function () {
                    console.error('Error uploading file:', xhr.statusText);
                };
                xhr.send(formData);
            }
        };
        input.style.display = 'none';

        input.click();
    }


    return (<>
        <ToolbarButton onClick={onFileButtonClick}>
            <ToolbarButtonIcon name="Paperclip" />
        </ToolbarButton>
    </>);
}
