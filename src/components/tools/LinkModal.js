import React, {useEffect} from "react";
import Modal from "../elements/Modal";

export default function LinkModal({
    visible = false,
    isNewLink = true,
    url = '',
    targetBlank = false,
    onSave,
    onClose = null
}) {
    const [linkUrl, setLinkUrl] = React.useState(url);
    const [openNewTab, setOpenNewTab] = React.useState(targetBlank);

    const modalUID = 'uid-link-modal-'+Math.random().toString(36).substring(2, 15);


    useEffect(() => {
        setLinkUrl(url);
        setOpenNewTab(!!targetBlank);
    }, [url, targetBlank]);


    const onSaveLocal = (e) => {
        e.preventDefault();

        const data = {
            url: linkUrl,
            targetBlank: openNewTab
        }

        onSave(data);

        setLinkUrl('');
        setOpenNewTab(false);
    }


    const onCloseLocal = (e) => {
        e.preventDefault();
        if (onClose) onClose(e);

        setLinkUrl('');
        setOpenNewTab(false);
    }


    return (
        <Modal
            visible={visible}
            headerTitle={isNewLink ? 'Додати посилання' : 'Редагувати посилання'}
            onClose={onCloseLocal}
        >
            <form className="v8-editor-form">
                <div className="form-group w-100">
                    <label htmlFor={'link-url-'+modalUID} className="form-label">Адреса</label>
                    <input type="text" id={'link-url-'+modalUID} className="form-control" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                </div>

                <div className="form-check form-check-inline v8-editor-form-check">
                    <input className="form-check-input" type="checkbox" id={'link-open-new-tab-'+modalUID} checked={openNewTab} onChange={(e) => setOpenNewTab(!!e.target.checked)} />
                    <label className="form-check-label" htmlFor={'link-open-new-tab-'+modalUID}>Відкрити у новій вкладці</label>
                </div>

                <div className="d-flex justify-content-end w-100">
                    <button className="btn btn-primary v8-editor-btn" onClick={onSaveLocal}>Зберегти зміни</button>
                </div>
            </form>
        </Modal>
    )
}