import React, {useEffect} from 'react';
import MainEditor from "./components/MainEditor";

import './assets/css/base.css';
import './assets/css/bootstrap-reboot.min.css';
import './assets/css/demo.css';

export default function App({}) {
    const [editorOutputHTML, setEditorOutputHTML] = React.useState('');


    useEffect(() => {
        fetch("/demo/sample.html")
            .then((res) => res.text())
            .then((data) => setEditorOutputHTML(data));
    }, []);


    const onEditorSave = (html) => {
        setEditorOutputHTML(html);
    }


    return (<>
        <div className="v8-editor">
            <MainEditor
                value={editorOutputHTML}
                onSave={onEditorSave}
            />
        </div>

        <div className="demo-output">
            <h2>Output</h2>
            <div className="demo-output-content">
                {editorOutputHTML ? <div dangerouslySetInnerHTML={{__html: editorOutputHTML}}></div> : <p><em>Editor output will appear here.</em></p>}
            </div>
        </div>
    </>);
}