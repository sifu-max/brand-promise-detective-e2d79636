import SmarterBenefitsLetterhead from "@/components/SmarterBenefitsLetterhead";
import SmarterBenefitsTestimonials from "@/components/SmarterBenefitsTestimonials";

export default function StarbucksLetter() {
  return (
    <SmarterBenefitsLetterhead>
      {/* Page 1 */}
      <div>
        <p className="mb-1"><strong>To:</strong> Brian Niccol, CEO</p>
        <p className="ml-6 mb-4">Starbucks Corporation</p>
        <p className="font-semibold mb-4">Executive Brief: $207M in Payroll Tax Savings</p>
      </div>

      <p>Hello Brian,</p>
      <p>I'll be brief.</p>

      <p>
        I'm Robert Nyberg, Principal of Smarter Benefits Strategy.
      </p>

      <p>I'm not reaching out to sell insurance.</p>

      <p>
        I'm reaching out because our financial efficiency model represents a $207M annual earnings opportunity for your organization based on publicly available workforce data.
      </p>

      <p>
        The strategy uses an employee-funded / employer-sponsored supplemental health structure under IRS Section 125.
      </p>

      <p>It consistently:</p>

      <ul className="list-disc pl-6 space-y-1">
        <li>Increases employer profitability</li>
        <li>Increases employee net pay</li>
        <li>Strengthens existing medical benefits</li>
      </ul>

      <p>
        Importantly, it does not replace your current medical plan — it enhances it.
      </p>

      <p>
        Routine care shifts away from the employer-funded plan into an employee-funded supplemental program called the "Champ Plan," provided through the First Health Network, a division of Aetna, part of CVS Health.
      </p>

      <p className="text-sky-500 font-bold text-center text-lg uppercase tracking-wide">
        The Champ Plan Covers Everyday Care — NOT Catastrophic Events
      </p>

      {/* Page 2 content */}
      <hr className="my-8 border-sky-200" />

      <p>
        Employers will realize $573.60 in net earnings per employee annually, while employees gain:
      </p>

      <ul className="list-disc pl-6 space-y-1">
        <li>~$1,500 in additional net pay</li>
        <li>$0 copays, deductibles, or coinsurance</li>
        <li>$0 copay prescriptions</li>
        <li>24/7 access to primary, urgent, and mental health care</li>
      </ul>

      <p>
        Average employee participation is 95%, with client renewal rates at 91% with a month-to-month contract, no long-term commitments.
      </p>

      <p>Implementation is turnkey and does not add work for HR.</p>

      <p>We have operated this model for over 12 years.</p>

      <p>
        If reviewing a potential $207M improvement is worth 20 minutes, I would welcome the opportunity to walk through the assumptions behind the model.
      </p>

      <p>If the math doesn't hold up, you will know quickly.</p>

      <p>Would you be open to a brief Zoom conversation?</p>

      <p>
        Please email me at: <a href="mailto:rpnyberg@SmarterBenefitsStrategy.com" className="text-sky-600 underline">rpnyberg@SmarterBenefitsStrategy.com</a> with the date and time you are available.
      </p>

      <p>Respectfully,</p>
      <p className="font-semibold">Robert Nyberg</p>

      {/* Page 3 - Testimonials */}
      <hr className="my-8 border-sky-200" />

      <SmarterBenefitsTestimonials />
    </SmarterBenefitsLetterhead>
  );
}
