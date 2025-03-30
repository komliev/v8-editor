import { createContext, useContext } from 'react';

const EditorContext = createContext(null);

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorContext must be used within an EditorProvider');
    }
    return context;
};

export function EditorProvider({ children, value }) {
    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}
