import './Toolbar.css';

export default function Toolbar({children, className = ''}) {
    return (
        <div className={`v8-editor-toolbar ${className}`}>
            {children}
        </div>
    );
}