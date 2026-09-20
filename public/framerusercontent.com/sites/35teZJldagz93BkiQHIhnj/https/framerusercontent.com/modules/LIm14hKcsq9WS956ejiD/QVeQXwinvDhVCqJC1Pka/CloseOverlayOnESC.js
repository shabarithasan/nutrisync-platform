import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useEffect
} from "react";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 *  @framerIntrinsicHeight 1
 * @framerIntrinsicWidth 1
 */
export default function CloseOverlayOnESC(props) {
    const {
        onEscape
    } = props;
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleKeyDown = event => {
            if (event.key === "Escape" && onEscape) {
                onEscape();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onEscape]);
    return /*#__PURE__*/ _jsx("span", {
        style: {
            width: 0,
            height: 0,
            pointerEvents: "none",
            userSelect: "none"
        }
    });
}
addPropertyControls(CloseOverlayOnESC, {
    onEscape: {
        type: ControlType.EventHandler,
        title: "On Escape",
        description: "Component by [Krutik Maru](https://www.framer.com/@krutikmaru/)"
    }
});
CloseOverlayOnESC.displayName = "Close Overlay On ESC";
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "CloseOverlayOnESC",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1",
                "framerSupportedLayoutHeight": "fixed",
                "framerSupportedLayoutWidth": "fixed",
                "framerIntrinsicHeight": "1",
                "framerIntrinsicWidth": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./CloseOverlayOnESC.map