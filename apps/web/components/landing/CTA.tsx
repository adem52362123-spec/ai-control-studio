import Link from "next/link"

export function CTA() {
  return (
    <section className="border-t border-dark-700/50 px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-2xl border border-dark-500 bg-gradient-to-b from-dark-800 to-dark-900 p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">استعد للتحكم الذكي</h2>
          <p className="mb-8 text-lg text-text-secondary">
            platform منصة متكاملة تحت تصرفك. ابدأ اليوم وتحكم في مشاريعك بالذكاء الاصطناعي.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-xl bg-accent px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
          >
            أنشئ حسابك الآن
          </Link>
        </div>
      </div>
    </section>
  )
}
