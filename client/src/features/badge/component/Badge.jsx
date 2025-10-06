import React from "react";

/**
 * Reusable Badge component
 * @param {string} text - Text to display
 * @param {"success"|"error"|"warning"|"info"|"default"} type
 */
export default function Badge({ text, type = "default" }) {
  const baseClasses = "badge px-2 py-1 font-semibold text-sm";

  const typeClasses = {
    success: "badge-success",
    error: "badge-error",
    warning: "badge-warning",
    info: "badge-info",
    default: "badge-neutral",
  };

  return <span className={`${baseClasses} ${typeClasses[type] || typeClasses.default}`}>{text}</span>;
}