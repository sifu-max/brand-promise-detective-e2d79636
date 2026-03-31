import SmarterBenefitsLetterhead from "@/components/SmarterBenefitsLetterhead";
import SmarterBenefitsTestimonials from "@/components/SmarterBenefitsTestimonials";

export default function StarbucksLetter() {
  return (
    <SmarterBenefitsLetterhead>
      {/* Addressee */}
      <div className="border-b border-gray-200 pb-5">
        <p className="text-gray-500 text-sm mb-1">To</p>
        <p className="font-semibold text-lg">Brian Niccol, CEO</p>
        <p className="text-gray-600">Starbucks Corporation</p>
      </div>

      <p className="font-bold text-xl text-gray-900">
        Executive Brief: A $207&thinsp;M Payroll Tax Savings Opportunity
      </p>

      <p>Hello Brian,</p>
      <p>I'll be brief.</p>

      <p>
        My name is Robert Nyberg. I'm the Principal of Smarter Benefits Strategy — and I'm <strong>not</strong> reaching out to sell insurance.
      </p>

      <p>
        I'm reaching out because our financial efficiency model identifies a <strong>$207&thinsp;M annual earnings opportunity</strong> for Starbucks, based on publicly available workforce data.
      </p>

      <p>
        The strategy leverages an employee-funded, employer-sponsored supplemental health structure under <strong>IRS Section 125</strong>. It has been in operation for over 12 years and consistently delivers three outcomes:
      </p>

      <div className="grid sm:grid-cols-3 gap-4 my-6">
        {[
          { icon: "📈", label: "Increases employer profitability" },
          { icon: "💰", label: "Increases employee net pay" },
          { icon: "🛡️", label: "Strengthens existing medical benefits" },
        ].map((item) => (
          <div key={item.label} className="bg-sky-50 border border-sky-100 rounded-lg p-4 text-center">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-semibold text-gray-800 mt-2">{item.label}</p>
          </div>
        ))}
      </div>

      <p>
        Importantly, this does <strong>not</strong> replace your current medical plan — it <em>enhances</em> it.
      </p>

      <p>
        Routine care shifts away from the employer-funded plan into an employee-funded supplemental program called the <strong>"Champ Plan,"</strong> provided through the First Health Network — a division of Aetna, part of CVS Health.
      </p>

      <div className="bg-sky-600 text-white text-center py-4 px-6 rounded-lg my-6">
        <p className="font-bold text-lg uppercase tracking-wider">
          The Champ Plan Covers Everyday Care — Not Catastrophic Events
        </p>
      </div>

      {/* Page 2 */}
      <hr className="my-8 border-sky-200" />

      <p>
        Employers realize <strong>$573.60 in net earnings per employee, per year</strong> — while employees gain:
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-4 space-y-3">
        {[
          "~$1,500 in additional annual net pay",
          "$0 copays, deductibles, or coinsurance",
          "$0 copay prescriptions",
          "24/7 access to primary, urgent, and mental health care",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="text-sky-500 font-bold text-lg leading-none mt-0.5">✓</span>
            <p className="text-gray-800 font-medium text-[15px]">{item}</p>
          </div>
        ))}
      </div>

      <p>
        Average employee participation is <strong>95%</strong>, with client renewal rates at <strong>91%</strong> — on a month-to-month contract with no long-term commitments.
      </p>

      <p>Implementation is fully turnkey and adds <strong>no work for HR</strong>.</p>

      <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 my-6 text-center">
        <p className="text-gray-800 text-[15px] leading-relaxed">
          If reviewing a potential <strong>$207&thinsp;M improvement</strong> is worth 20 minutes of your time, I'd welcome the opportunity to walk you through the assumptions behind the model.
        </p>
        <p className="text-gray-600 text-sm mt-3">
          If the math doesn't hold up, you'll know quickly.
        </p>
      </div>

      <p className="font-semibold text-gray-900">
        Would you be open to a brief Zoom conversation?
      </p>

      <p>
        Please reach out at:{" "}
        <a href="mailto:rpnyberg@SmarterBenefitsStrategy.com" className="text-sky-600 font-semibold hover:underline">
          rpnyberg@SmarterBenefitsStrategy.com
        </a>
      </p>

      <div className="mt-6">
        <p>Respectfully,</p>
        <p className="font-bold text-gray-900">Robert Nyberg</p>
      </div>

      {/* Page 3 - Testimonials */}
      <hr className="my-8 border-sky-200" />
      <SmarterBenefitsTestimonials />
    </SmarterBenefitsLetterhead>
  );
}
