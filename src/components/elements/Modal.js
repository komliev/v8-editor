import React, {useEffect} from "react";

import './Modal.css';
import {IconX} from "@tabler/icons-react";

export default function Modal({
    visible = false,
    onClose = null,

    headerTitle = "Sample Modal",

    children
}) {
    const [show, setShow] = React.useState(visible);
    useEffect(() => {
        setShow(visible);
    }, [visible]);


    const onCloseClick = (e) => {
        e.preventDefault();
        e.target.blur();

        setShow(false);
        if (onClose) {
            onClose();
        }
    }


    return (
        <div className={'v8-editor-modal'+(!!show ? ' show' : '')} tabIndex="-1" aria-hidden={!show}>
            <div className="v8-editor-modal-dialog">
                {headerTitle ? (
                    <div className="v8-editor-modal-header">
                        <h4>{headerTitle}</h4>
                        <button type="button" className="v8-editor-btn-close" onClick={onCloseClick}>
                            <IconX size={12} stroke={2} className="" />
                        </button>
                    </div>
                ) : (
                    <button type="button" className="v8-editor-btn-close" onClick={onCloseClick}>
                        <IconX size={12} stroke={2} className="" />
                    </button>
                )}

                <div className="v8-editor-modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}