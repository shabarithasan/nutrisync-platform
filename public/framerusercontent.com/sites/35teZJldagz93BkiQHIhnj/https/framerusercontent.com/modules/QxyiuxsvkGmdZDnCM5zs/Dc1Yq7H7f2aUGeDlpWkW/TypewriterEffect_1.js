// TypewriterEffect effect component with configurable text array, font, and delay
import {
    jsx as _jsx,
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    useState,
    useEffect,
    useRef,
    startTransition
} from "react";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * TypewriterEffect Effect
 *
 * @framerSupportedLayoutWidth fill
 * @framerSupportedLayoutHeight fill
 */
export default function TypewriterEffect(props) {
    const {
        texts = [{
            text: "Hello, world!"
        }], font, delay, textColor, style
    } = props;
    const [currentTextIdx, setCurrentTextIdx] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [phase, setPhase] = useState("typing");
    const [cursorVisible, setCursorVisible] = useState(true);
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const cursorBlinkSpeed = 500;
    const timeoutRef = useRef(null);
    const blinkRef = useRef(null);
    const currentText = texts.length > 0 ? texts[currentTextIdx % texts.length].text : ""; // Typing and deleting logic
    useEffect(() => {
        if (phase === "typing") {
            if (displayed.length < currentText.length) {
                timeoutRef.current = window.setTimeout(() => {
                    startTransition(() => setDisplayed(currentText.slice(0, displayed.length + 1)));
                }, typingSpeed);
            } else { // Start blinking cursor immediately after typing ends
                startTransition(() => setPhase("waiting"));
            }
        } else if (phase === "deleting") {
            if (displayed.length > 0) {
                timeoutRef.current = window.setTimeout(() => {
                    startTransition(() => setDisplayed(currentText.slice(0, displayed.length - 1)));
                }, deletingSpeed);
            } else {
                timeoutRef.current = window.setTimeout(() => {
                    startTransition(() => {
                        setCurrentTextIdx(idx => (idx + 1) % texts.length);
                        setPhase("typing");
                    });
                }, 300);
            }
        } else if (phase === "waiting") { // Wait for delay, then start deleting
            timeoutRef.current = window.setTimeout(() => {
                startTransition(() => setPhase("deleting"));
            }, delay);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [phase, displayed, currentText, delay, texts.length]); // Reset displayed text when moving to next text
    useEffect(() => {
        if (phase === "typing") {
            setDisplayed("");
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTextIdx]); // Cursor blinking
    useEffect(() => {
        if (phase === "waiting") {
            blinkRef.current = window.setInterval(() => {
                setCursorVisible(v => !v);
            }, cursorBlinkSpeed);
        } else {
            setCursorVisible(true);
            if (blinkRef.current) clearInterval(blinkRef.current);
        }
        return () => {
            if (blinkRef.current) clearInterval(blinkRef.current);
        };
    }, [phase]); // Clean up on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (blinkRef.current) clearInterval(blinkRef.current);
        };
    }, []);
    return /*#__PURE__*/ _jsxs("span", {
        style: { ...style,
            ...font,
            color: textColor,
            display: "inline-block",
            minWidth: "1em",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            verticalAlign: "middle",
            width: "100%",
            height: "100%",
            boxSizing: "border-box"
        },
        "aria-live": "polite",
        children: [displayed, /*#__PURE__*/ _jsx("span", {
            style: {
                display: "inline-block",
                width: "1ch", // height: "1em",
                marginLeft: "0px",
                background: "none",
                color: textColor,
                opacity: cursorVisible ? 1 : 0,
                animation: phase === "waiting" ? `blink ${cursorBlinkSpeed*2}ms step-end infinite` : undefined,
                verticalAlign: "middle"
            },
            "aria-hidden": "true",
            children: "|"
        }), /*#__PURE__*/ _jsx("style", {
            children: `
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `
        })]
    });
}
addPropertyControls(TypewriterEffect, {
    texts: {
        type: ControlType.Array,
        title: "Texts",
        control: {
            type: ControlType.Object,
            controls: {
                text: {
                    type: ControlType.String,
                    defaultValue: "Framer Typewriting"
                }
            }
        },
        defaultValue: [{
            text: "Framer Typewriting"
        }, {
            text: "Line 2."
        }]
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "32px",
            variant: "Semibold",
            letterSpacing: "-0.01em",
            lineHeight: "1.2em"
        }
    },
    delay: {
        type: ControlType.Number,
        title: "Delay (ms)",
        defaultValue: 3e3,
        min: 500,
        max: 1e4,
        step: 100,
        displayStepper: true
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#FFFFFF"
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "TypewriterEffect",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutHeight": "fill",
                "framerSupportedLayoutWidth": "fill",
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./TypewriterEffect_1.map