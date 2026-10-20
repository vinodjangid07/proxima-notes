import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked with GitHub Flavored Markdown and breaks
marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false
});

/**
 * Render raw markdown string to sanitized HTML with interactive checkboxes.
 */
export const renderMarkdown = (rawMarkdown) => {
    if (!rawMarkdown || typeof rawMarkdown !== "string") return "";
    try {
        const rawHtml = marked.parse(rawMarkdown);
        // Remove disabled attribute from checkbox inputs so they can be clicked interactively
        const interactiveHtml = rawHtml.replace(
            /<input([^>]*)\sdisabled(?:=""|="disabled")?([^>]*)>/gi,
            "<input$1$2>"
        );

        return DOMPurify.sanitize(interactiveHtml, {
            ADD_TAGS: ["input"],
            ADD_ATTR: ["target", "rel", "type", "checked"],
            FORBID_TAGS: ["style", "script", "iframe", "object", "embed"]
        });
    } catch (err) {
        console.error("Markdown rendering error:", err);
        return DOMPurify.sanitize(rawMarkdown);
    }
};

/**
 * Calculate estimated reading time in minutes.
 */
export const calculateReadingStats = (text) => {
    if (!text || typeof text !== "string") {
        return { readingTime: 1 };
    }

    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    // Average reading speed: 200 words per minute
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return { readingTime };
};

/**
 * Extract checklist progress: count `- [ ]` and `- [x]` / `- [X]`.
 */
export const getChecklistProgress = (text) => {
    if (!text || typeof text !== "string") {
        return { total: 0, completed: 0, percent: 0, hasChecklist: false };
    }

    const lines = text.split("\n");
    let total = 0;
    let completed = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        if (/^([-*+]|\d+\.)\s+\[[ xX]\]/.test(trimmed)) {
            total++;
            if (/^([-*+]|\d+\.)\s+\[[xX]\]/.test(trimmed)) {
                completed++;
            }
        }
    }

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        total,
        completed,
        percent,
        hasChecklist: total > 0
    };
};

/**
 * Toggle a specific checklist item in the markdown text.
 * @param {string} text Full markdown content
 * @param {number} taskIndex 0-indexed position of the task among all checklist items
 */
export const toggleChecklistTask = (text, taskIndex) => {
    if (!text || typeof text !== "string") return text;

    const lines = text.split("\n");
    let currentTaskCount = 0;

    const updatedLines = lines.map((line) => {
        const trimmed = line.trimStart();
        const indent = line.slice(0, line.length - trimmed.length);

        if (/^([-*+]|\d+\.)\s+\[[ ]\]/.test(trimmed)) {
            if (currentTaskCount === taskIndex) {
                currentTaskCount++;
                return indent + trimmed.replace(/^((?:[-*+]|\d+\.)\s+)\[[ ]\]/, "$1[x]");
            }
            currentTaskCount++;
        } else if (/^([-*+]|\d+\.)\s+\[[xX]\]/.test(trimmed)) {
            if (currentTaskCount === taskIndex) {
                currentTaskCount++;
                return indent + trimmed.replace(/^((?:[-*+]|\d+\.)\s+)\[[xX]\]/, "$1[ ]");
            }
            currentTaskCount++;
        }
        return line;
    });

    return updatedLines.join("\n");
};

/**
 * Strip Markdown tags to produce clean plain text for card previews.
 */
export const stripMarkdown = (text) => {
    if (!text || typeof text !== "string") return "";
    return text
        .replace(/^#{1,6}\s+/gm, "")                     // headers
        .replace(/(\*\*|__)(.*?)\1/g, "$2")              // bold
        .replace(/(\*|_)(.*?)\1/g, "$2")                // italics
        .replace(/~~(.*?)~~/g, "$1")                     // strikethrough
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1")            // inline code & code blocks
        .replace(/^>\s+/gm, "")                          // blockquotes
        .replace(/^[-*+]\s+\[[ xX]\]\s+/gm, "")         // checklists
        .replace(/^[-*+]\s+/gm, "")                      // unordered lists
        .replace(/^\d+\.\s+/gm, "")                      // ordered lists
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")             // links
        .trim();
};
