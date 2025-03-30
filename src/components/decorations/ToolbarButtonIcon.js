export default function ToolbarButtonIcon({ name, ...props }) {
    const Icon = require('@tabler/icons-react')[`Icon${name}`];
    if (!Icon) return null;

    return <Icon size={20} stroke={2} {...props} />;
}
