import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false
});

export const renderMarkdown = (rawMarkdown) => {
    if (!rawMarkdown || typeof rawMarkdown !== "string") return "";
    try {
        const rawHtml = marked.parse(rawMarkdown);
        // Enable interactive click on rendered task checkboxes
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

export const calculateReadingStats = (text) => {
    if (!text || typeof text !== "string") {
        return { readingTime: 1 };
    }

    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return { readingTime };
};

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

export const stripMarkdown = (text) => {
    if (!text || typeof text !== "string") return "";
    return text
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
        .replace(/^>\s+/gm, "")
        .replace(/^[-*+]\s+\[[ xX]\]\s+/gm, "")
        .replace(/^[-*+]\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();
};

/**
 * Extract hashtag labels from text (e.g. #ideas, #todo).
 * Ignores markdown headings (which have a space immediately after #).
 */
export const extractTags = (text) => {
    if (!text || typeof text !== "string") return [];
    const matches = text.match(/(?:^|\s)#([a-zA-Z0-9_-]+)/g);
    if (!matches) return [];

    const tags = matches
        .map((m) => m.trim().replace(/^#/, "").toLowerCase())
        .filter((t) => t.length > 0 && !/^\d+$/.test(t));

    return Array.from(new Set(tags));
};
