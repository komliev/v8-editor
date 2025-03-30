import { htmlToSlateConfig as defaultH2SConfig, slateToHtmlConfig as defaultS2HConfig} from '@slate-serializers/html'
import { getAttributeValue } from 'domutils'
import { Element } from 'domhandler'


export const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}
export const HOTKEYS_HISTORY = {
    'mod+z': 'undo',
    'mod+shift+z': 'redo',
}
export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


const alignedTag = (tag) => (el) => {
    let data = {
        tag,
        attributes: {},
    };

    if (el.align) {
        data.attributes.style = 'text-align: ' + el.align;
    }

    return data;
};
export const alignedTag2 = (el, tag) => {
    let data = {
        tag,
        attributes: {},
    };

    const align = extractAlign(el);
    if (align) {
        data.attributes.style = 'text-align: ' + align;
    }

    return data;
}
const extractAlign = (el) => {
    const style = el.attribs?.style || '';
    const match = style.match(/text-align:\s*(\w+)/);
    return match ? match[1] : undefined;
};
const buildElementTag = (el, type) => {
    let data = {
        type: type,
        children: el.children,
    };

    const align = extractAlign(el);
    if (align) {
        data.align = align;
    }

    return data;
}


export const CONVERSION_LABELS_TO_TAGS = {
    elementMap: {
        ...defaultS2HConfig.elementMap,
        'link': (el) => ({
            tag: 'a',
            attributes: {
                href: el.url,
                target: el.newTab ? '_blank' : undefined,
            },
        }),
        'bulleted-list': 'ul',
        'numbered-list': 'ol',
        'list-item': 'li',
        'paragraph': 'p',
        'heading-one': 'h1',
        'heading-two': 'h2',
        'heading-three': 'h3',
        'heading-four': 'h4',
        'heading-five': 'h5',
        'heading-six': 'h6',
    },
    markMap: {
        ...defaultS2HConfig.markMap
    },
    elementTransforms: {
        ...defaultS2HConfig.elementTransforms,
        'image': ({ node, children = []}) => {
            const attrs = {}
            if (node.alt) {attrs.alt = node.alt;}
            if (node.style) {attrs.style = node.style;}

            return new Element(
                'img',
                {
                    src: node.url,
                    ...attrs,
                },
                children,
            )
        },
    }
}
export const CONVERSION_TAGS_TO_LABELS = {
    ...defaultH2SConfig,
    elementTags: {
        ...defaultH2SConfig.elementTags,
        a: (el) => ({
            type: 'link',
            newTab: el && getAttributeValue(el, 'target') === '_blank',
            url: el && getAttributeValue(el, 'href'),
        }),
        ul: (el) => buildElementTag(el, 'bulleted-list'),
        ol: (el) => buildElementTag(el, 'numbered-list'),
        li: (el) => ({
            type: 'list-item',
            children: el.children,
        }),
        p: (el) => buildElementTag(el, 'paragraph'),
        h1: (el) => buildElementTag(el, 'heading-one'),
        h2: (el) => buildElementTag(el, 'heading-two'),
        h3: (el) => buildElementTag(el, 'heading-three'),
        h4: (el) => buildElementTag(el, 'heading-four'),
        h5: (el) => buildElementTag(el, 'heading-five'),
        h6: (el) => buildElementTag(el, 'heading-six'),
    },
}