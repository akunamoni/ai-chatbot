import React from "react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl shadow-sm wrap-break-word ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        <div className="prose prose-sm max-w-none overflow-hidden wrap-break-word">
          <ReactMarkdown
            components={{
              // ✅ Inline & Block Code
              code({ inline, className, children, ...props }) {
                if (inline) {
                  return (
                    <code
                      className="bg-gray-200 px-1.5 py-0.5 rounded text-sm text-gray-800 font-mono wrap-break-word"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto max-w-full relative">
                    <code {...props}>{children}</code>
                  </pre>
                );
              },

              // ✅ Paragraphs
              p({ children }) {
                return (
                  <p className="wrap-break-word leading-relaxed whitespace-pre-wrap">
                    {children}
                  </p>
                );
              },

              // ✅ Links
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline break-all hover:text-blue-700"
                  >
                    {children}
                  </a>
                );
              },

              // ✅ Lists
              li({ children }) {
                return (
                  <li className="ml-4 list-disc wrap-break-word whitespace-pre-wrap">
                    {children}
                  </li>
                );
              },
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
