export default function ToolbarButtonIcon({name, ...props}) {
    let componentClass = 'Icon' + name;
    let Icon = require(`@tabler/icons-react`)[componentClass];

    return (
        <Icon size={20} stroke={2} {...props} />
    );
}