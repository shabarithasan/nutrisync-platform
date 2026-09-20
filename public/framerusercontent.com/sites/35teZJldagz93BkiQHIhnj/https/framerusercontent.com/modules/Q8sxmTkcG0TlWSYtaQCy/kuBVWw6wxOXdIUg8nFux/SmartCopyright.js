// Autocopyright text layer with automatic year and editable name/company
import {
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * Autocopyright
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 * @framerDisableUnlink
 */
export default function CopyrightText(props) {
    const {
        name,
        prefix,
        suffix,
        color,
        font,
        style,
        showIcon,
        showName
    } = props;
    const year = typeof window !== "undefined" ? new Date().getFullYear() : 2024;
    return /*#__PURE__*/ _jsxs("span", {
        style: {
            color,
            ...font,
            ...style,
            width: "max-content",
            minWidth: "max-content",
            display: "inline-block"
        },
        "aria-label": `Copyright ${year} ${name}`,
        children: [prefix, prefix && " ", showIcon && "\xa9", " ", year, " ", showName && name, suffix && " ", suffix]
    });
}
addPropertyControls(CopyrightText, {
    name: {
        type: ControlType.String,
        title: "Name",
        defaultValue: "ACME",
        placeholder: "Company or Name"
    },
    showIcon: {
        type: ControlType.Boolean,
        title: "Show \xa9",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide"
    },
    showName: {
        type: ControlType.Boolean,
        title: "Show Name",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide"
    },
    prefix: {
        type: ControlType.String,
        title: "Prefix",
        defaultValue: "",
        placeholder: "Prefix (optional)"
    },
    suffix: {
        type: ControlType.String,
        title: "Suffix",
        defaultValue: "",
        placeholder: "Suffix (optional)"
    },
    color: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#FFFFFF"
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em"
        }
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "CopyrightText",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutWidth": "auto",
                "framerSupportedLayoutHeight": "auto",
                "framerDisableUnlink": "",
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./SmartCopyright.map