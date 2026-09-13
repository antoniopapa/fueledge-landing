type AIAssistantSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const starterMessages = [
  {
    role: 'assistant',
    text: 'I can help draft a dispatch note, summarize exceptions, or prepare customer updates.',
  },
  {
    role: 'user',
    text: 'Show me which runs need attention before noon.',
  },
];

export default function AIAssistantSidebar({ open, onClose }: AIAssistantSidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close AI assistant"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-foreground-950/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-[380px] flex-col border-l border-background-200 bg-background-50 shadow-2xl shadow-foreground-950/10 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="AI assistant"
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between border-b border-background-200 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-background-50">
              <i className="ri-sparkling-2-line text-lg leading-none" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-heading text-[15px] font-bold text-foreground-950">AI Assistant</h2>
              <p className="truncate text-[11px] font-medium text-foreground-500">Visual preview only</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-background-200/70 hover:text-foreground-900 cursor-pointer"
            aria-label="Close AI assistant"
          >
            <i className="ri-close-line text-xl leading-none" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          <div className="rounded-lg border border-background-200 bg-background-100 p-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground-800">
              <i className="ri-magic-line text-primary-600 text-base leading-none" />
              Operations co-pilot
            </div>
            <p className="mt-2 text-[12px] leading-5 text-foreground-500">
              Ask about dispatch, sourcing, deliveries, or customers. This panel is ready for a future AI connection.
            </p>
          </div>

          <div className="space-y-3">
            {starterMessages.map((message) => (
              <div
                key={message.text}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-lg px-3 py-2 text-[12px] leading-5 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-background-50'
                      : 'border border-background-200 bg-background-100 text-foreground-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="border-t border-background-200 p-4">
          <label htmlFor="ai-assistant-message" className="sr-only">
            Message AI assistant
          </label>
          <div className="flex items-end gap-2 rounded-lg border border-background-300 bg-background-50 p-2 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
            <textarea
              id="ai-assistant-message"
              rows={3}
              placeholder="Ask the AI assistant..."
              className="min-h-16 flex-1 resize-none bg-transparent px-1 py-1 text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
            />
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-500 text-background-50 transition-colors hover:bg-primary-600 cursor-pointer"
              aria-label="Send message"
            >
              <i className="ri-send-plane-2-line text-base leading-none" />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
