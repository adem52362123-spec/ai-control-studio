export function Footer() {
  return (
    <footer className="border-t border-dark-700/50 px-6 py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-accent text-xs font-bold text-white">
            AI
          </div>
          AI Control Studio © 2026
        </div>
        <div className="flex gap-6 text-sm text-text-secondary">
          <span>الخصوصية</span>
          <span>الشروط</span>
          <span>الاتصال</span>
        </div>
      </div>
    </footer>
  )
}
