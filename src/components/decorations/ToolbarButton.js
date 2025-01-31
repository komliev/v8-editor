export default function ToolbarButton({children, className = '', ...props}) {
    return (
        <button className={`v8-editor-toolbar-item ${className}`} {...props}>
            {children}
        </button>
    );
}