import SmarterBenefitsLetterhead from "@/components/SmarterBenefitsLetterhead";
import SmarterBenefitsTestimonials from "@/components/SmarterBenefitsTestimonials";

export default function ChamberLetter() {
  return (
    <SmarterBenefitsLetterhead>
      {/* Page 1 */}
      <div>
        <p className="mb-1"><strong>To:</strong> Todd Sanders, President &amp; CEO</p>
        <p className="ml-6 mb-1">Greater Phoenix Chamber of Commerce</p>
        <p className="mb-4">
          <strong>Subject:</strong> What If Your Chamber Could Annually Save Members $573 Per Employee While Generating a Predictable Revenue Stream for Your Chamber
        </p>
      </div>

      <p>Hello Todd,</p>
      <p>I'll be brief.</p>

      <p>
        As a Chamber President, you're measured by two things—how well you help your members grow financially, and how effectively you help them take care of their people.
      </p>

      <p>
        What if you could dramatically improve both… while creating a new, recurring non-dues revenue stream for your Chamber?
      </p>

      <p>
        Champion Health has developed "The Champ Plan", a proven, turnkey strategy using an IRS Section 125 structure that is delivering immediate financial impact:
      </p>

      <ul className="list-disc pl-6 space-y-1">
        <li>$573 in annual payroll tax savings per employee</li>
        <li>$1,500 average increase in employee take-home pay</li>
        <li>$0 copays, $0 deductibles, and $0 prescriptions for everyday healthcare</li>
        <li>24/7 access to primary care, urgent care, and mental health services</li>
      </ul>

      <p className="text-sky-500 font-bold text-center text-lg uppercase tracking-wide">
        The Champ Plan Covers Everyday Care - NOT CATASTROPHIC EVENTS
      </p>

      <p>
        This is real money back into employers' bottom lines—and meaningful, everyday relief for employees and their families. It's the kind of solution that positions you as not just a connector, but a true advocate for both business performance and employee well-being.
      </p>

      {/* Page 2 content */}
      <hr className="my-8 border-sky-200" />

      <p>
        The program offered by Champion Health operates through the First Health Network (Aetna / CVS Health) and is designed for companies with as few as 10 full-time W2 employees, ensuring stability and consistent value delivery.
      </p>

      <p>For the Chamber, the opportunity is simple—and powerful.</p>

      <p>
        There is no selling, no administrative burden, and no disruption to your team. We simply ask for an introduction to the appropriate decision-maker within your member companies. When a business enrolls, your Chamber earns $2 per employee per month in passive, recurring revenue.
      </p>

      <p>Here's what that looks like:</p>
      <p>A single member with 1,000 employees generates:</p>

      <ul className="list-disc pl-6 space-y-1">
        <li>$573,000 in employer tax savings</li>
        <li>$1,500,000 returned to employees</li>
        <li>$2,000 per month in ongoing, non-dues revenue to your Chamber</li>
      </ul>

      <p className="text-sky-500 font-bold text-center text-lg">
        No Contracts. No HR Headaches. Fully Turnkey.
      </p>

      <p>
        If there were ever an initiative that aligns financial performance with genuine care for employees—while strengthening your Chamber's revenue—this is it.
      </p>

      <p>
        Let's schedule 20 minutes on Zoom. I'll walk you through exactly how it works and how quickly you can introduce this to your members.
      </p>

      <p>Respectfully,</p>
      <p className="font-semibold">Robert Nyberg</p>

      {/* Page 3 - Testimonials */}
      <hr className="my-8 border-sky-200" />

      <SmarterBenefitsTestimonials />
    </SmarterBenefitsLetterhead>
  );
}
