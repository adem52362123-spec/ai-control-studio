import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "مجاني",
    price: "0",
    period: "شهراً",
    desc: "جرب المنصة بدون أي مخاطرة",
    features: ["3 مشاريع", "مزود AI واحد", "50 أمر/يوم", "سجل 7 أيام", "3 وكلاء AI"],
    cta: "ابدأ مجاناً",
    href: "/register",
    highlighted: false,
  },
  {
    name: "احترافي",
    price: "99",
    period: "شهر",
    desc: "التحكم الكامل بكل الإمكانيات",
    features: ["مشاريع غير محدودة", "جميع مزودات AI", "أوامر غير محدودة", "سجل كامل", "7 وكلاء AI", "دعم أولوية", "API مخصص"],
    cta: "اشترك الآن",
    href: "/register",
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-dark-700/50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">اختر خطتك</h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            ابدأ مجاناً، ورقّ لاحقاً عندما تحتاج المزيد
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 transition-all hover:scale-[1.02] ${
                plan.highlighted
                  ? "border-accent/40 bg-dark-800 shadow-lg shadow-accent/10"
                  : "border-dark-600 bg-dark-800/50"
              }`}
            >
              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
              <p className="mb-6 text-sm text-text-secondary">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-text-secondary ml-1">/{plan.period}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check size={16} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block rounded-xl py-3 text-center font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-accent text-white hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
                    : "border border-dark-500 text-text-primary hover:bg-dark-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
