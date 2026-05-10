const capabilities = [
  { title: "إنشاء المحتوى", items: ["فيديوهات تعليمية", "مقالات ومنشورات", "صور ورسومات"] },
  { title: "التطوير", items: ["إضافة ميزات جديدة", "تعديل الصفحات", "إصلاح الأخطاء"] },
  { title: "الإدارة", items: ["إدارة المشاريع", "تنظيم المهام", "تتبع التقدم"] },
  { title: "التحليل", items: ["تحليل البيانات", "تقارير ذكية", "اقتراحات تحسين"] },
]

export function Capabilities() {
  return (
    <section id="capabilities" className="border-t border-dark-700/50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">قدرات غير محدودة</h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            مهما كان طلبك، النظام قادر على فهمه وتنفيذه
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl border border-dark-600 bg-dark-800 p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-accent">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
