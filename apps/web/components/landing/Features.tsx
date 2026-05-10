import { Bot, Command, Database, Globe, Layout, Shield, Zap } from "lucide-react"

const features = [
  { icon: Command, title: "مركز الأوامر الذكية", desc: "اكتب أي أمر نصي والنظام يفهم ويخطط وينفذ" },
  { icon: Bot, title: "AI متعدد المزودين", desc: "ادعم OpenAI و Claude و OpenRouter في نفس الوقت" },
  { icon: Zap, title: "تنفيذ لحظي", desc: "تابع تقدم المهام مباشرة مع تحديثات WebSocket" },
  { icon: Database, title: "ذاكرة دائمة", desc: "النظام يتذكر كل مشروع وسياقه تلقائياً" },
  { icon: Layout, title: "إدارة المشاريع", desc: "أنشئ وعدّل واحذف المشاريع بكل سهولة" },
  { icon: Shield, title: "آمن ومشفر", desc: "مفاتيح API مشفرة ونظام صلاحيات كامل" },
  { icon: Globe, title: "لوحة تحكم خاصة", desc: "مركز قيادة كامل لمشاهدة وإدارة كل شيء" },
  { icon: Command, title: "سجل كامل", desc: "كل عملية مسجلة ومتتبعة للرجوع إليها" },
]

export function Features() {
  return (
    <section id="features" className="border-t border-dark-700/50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">إمكانيات احترافية</h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            كل ما تحتاجه لإدارة مشاريعك بالذكاء الاصطناعي من مكان واحد
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-dark-600 bg-dark-800 p-6 transition-all hover:border-dark-500 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-dark-600 text-accent group-hover:bg-accent/10">
                <f.icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold text-text-primary">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
