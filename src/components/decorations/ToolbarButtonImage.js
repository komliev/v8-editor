import React, {useCallback, useEffect} from "react";
import {useEditorContext} from "../../providers/EditorProvider";
import ToolbarButton from "./ToolbarButton";
import linkEditIcon from "../../assets/img/link-edit.svg";
import ToolbarButtonIcon from "./ToolbarButtonIcon";
import LinkModal from "../tools/LinkModal";
import {Editor, Element as SlateElement, Transforms, Range} from "slate";

export default function ToolbarButtonImage({uploadUrl = ''}) {
    const editor = useEditorContext();


    const onImageButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            input.remove();
            if (file) {
                // send file via form multipart/form-data
                const formData = new FormData();
                formData.append('file', file);

                // send file to server
                const xhr = new XMLHttpRequest();
                xhr.open('POST', uploadUrl, true);
                //xhr.open('GET', uploadUrl, true);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (response?.url) {
                            const imageUrl = response.url;
                            const imageNode = { type: 'image', url: imageUrl, children: [{ text: '' }] };

                            // insert the image node at the current selection
                            const { selection } = editor;
                            if (selection && Range.isCollapsed(selection)) {
                                Transforms.insertNodes(editor, imageNode, { at: selection, mode: 'highest' });
                            } else {
                                Transforms.insertNodes(editor, imageNode);
                            }

                            // move the cursor after the image
                            Transforms.move(editor, { distance: 1, unit: 'offset' });
                        }
                    } else {
                        console.error('Error uploading image:', xhr.statusText);
                    }
                };
                xhr.onerror = function () {
                    console.error('Error uploading image:', xhr.statusText);
                };
                xhr.send(formData);
            }
        };
        input.style.display = 'none';

        input.click();
    }


    return (<>
        <ToolbarButton onClick={onImageButtonClick}>
            <ToolbarButtonIcon name="Photo" />
        </ToolbarButton>
    </>);
}
