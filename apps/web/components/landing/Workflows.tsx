const steps = [
  { num: "01", title: "اكتب الأمر", desc: "مثلاً: أنشئ مشروع فيديو تعليمي عن الذكاء الاصطناعي" },
  { num: "02", title: "النظام يحلل", desc: "AI يحلل طلبك ويصنفه ويخطط للتنفيذ" },
  { num: "03", title: "يطلب الموافقة", desc: "للأوامر الحساسة، النظام ينتظر تأكيدك" },
  { num: "04", title: "التنفيذ الفوري", desc: "ينفذ المهمة خطوة بخطوة مع تحديث الحالة" },
  { num: "05", title: "النتيجة", desc: "يعرض النتيجة ويحفظها في الذاكرة والسجلات" },
]

export function Workflows() {
  return (
    <section id="workflows" className="border-t border-dark-700/50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">كيف يعمل النظام؟</h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            5 خطوات بسيطة من الأمر إلى التنفيذ الكامل
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:right-8 before:top-0 before:h-full before:w-px before:bg-dark-600">
          {steps.map((s) => (
            <div key={s.num} className="relative flex gap-6 pr-16">
              <div className="absolute right-0 flex h-16 w-16 items-center justify-center rounded-xl border border-dark-500 bg-dark-800 text-lg font-bold text-accent">
                {s.num}
              </div>
              <div className="rounded-xl border border-dark-600 bg-dark-800/50 p-6 flex-1">
                <h3 className="mb-1 text-lg font-semibold text-text-primary">{s.title}</h3>
                <p className="text-sm text-text-secondary">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
