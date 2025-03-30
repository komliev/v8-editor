import React, { useEffect, useState } from 'react';
import MainEditor from './components/MainEditor';

import 'simplebar-react/dist/simplebar.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/css/base.css';
import '../src/assets/css/demo.css';

export default function App() {
    const [editorOutputHTML, setEditorOutputHTML] = useState('');

    useEffect(() => {
        const fetchSample = async () => {
            const res = await fetch('/demo/sample.html');
            const data = await res.text();
            if (data?.trim()) {
                setEditorOutputHTML(data);
            }
        };
        fetchSample();
    }, []);

    const handleEditorSave = (html) => {
        setEditorOutputHTML(html);
    };

    return (
        <>
            <div className="v8-editor">
                <MainEditor
                    config={{
                        imageUploadUrl: '/demo/image-upload.json',
                        fileUploadUrl: '/demo/file-upload.json',
                    }}
                    value={editorOutputHTML}
                    onSave={handleEditorSave}
                />
            </div>

            <div className="demo-output">
                <h2>Output</h2>
                <div className="demo-output-content">
                    {editorOutputHTML ? (
                        <div dangerouslySetInnerHTML={{ __html: editorOutputHTML }} />
                    ) : (
                        <p><em>Editor output will appear here.</em></p>
                    )}
                </div>
            </div>
        </>
    );
}
