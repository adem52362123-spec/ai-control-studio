import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,69,96,0.15),transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-dark-500 bg-dark-800 px-4 py-1.5 text-sm text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          منصة AI تشغيلية من الجيل الجديد
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
          اكتب المطلوب
          <br />
          <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
            والنظام ينفذ
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary leading-relaxed">
          AI Control Studio هو مركز القيادة الذكي لمنشآتك. اكتب أوامرك بالعربية أو الإنجليزية،
          والنظام يحلل، يخطط، وينفذ المهام تلقائياً مع تحديث الحالة لحظياً.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
          >
            ابدأ مجاناً
          </Link>
          <Link
            href="#features"
            className="rounded-xl border border-dark-500 bg-dark-800 px-8 py-3.5 text-base font-semibold text-text-primary transition-all hover:bg-dark-700"
          >
            اكتشف المزيد
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-dark-700 pt-10">
          {[
            { value: "ذكاء اصطناعي", label: "متعدد المزودين" },
            { value: "تنفيذ فوري", label: "للأوامر النصية" },
            { value: "ذاكرة دائمة", label: "للمشاريع والسياق" },
          ].map((item) => (
            <div key={item.value} className="text-center">
              <div className="text-lg font-bold text-text-primary">{item.value}</div>
              <div className="text-sm text-text-secondary">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
