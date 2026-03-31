import SmarterBenefitsLetterhead from "@/components/SmarterBenefitsLetterhead";
import SmarterBenefitsTestimonials from "@/components/SmarterBenefitsTestimonials";

export default function ChamberLetter() {
  return (
    <SmarterBenefitsLetterhead>
      {/* Addressee */}
      <div className="border-b border-gray-200 pb-5">
        <p className="text-gray-500 text-sm mb-1">To</p>
        <p className="font-semibold text-lg">Todd Sanders, President &amp; CEO</p>
        <p className="text-gray-600">Greater Phoenix Chamber of Commerce</p>
      </div>

      <p className="font-bold text-xl text-gray-900">
        What If Your Chamber Could Save Members $573 Per Employee — While Creating a New Revenue Stream?
      </p>

      <p>Hello Todd,</p>
      <p>I'll be brief.</p>

      <p>
        As a Chamber President, you're measured by two things — how well you help members <strong>grow financially</strong>, and how effectively you help them <strong>take care of their people</strong>.
      </p>

      <p>
        What if you could dramatically improve both… while creating a <strong>new, recurring non-dues revenue stream</strong> for your Chamber?
      </p>

      <p>
        Champion Health has developed <strong>"The Champ Plan"</strong> — a proven, turnkey strategy using an IRS Section 125 structure that is delivering immediate financial impact:
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-4 space-y-3">
        {[
          "$573 in annual payroll tax savings per employee",
          "$1,500 average increase in employee take-home pay",
          "$0 copays, $0 deductibles, and $0 prescriptions for everyday healthcare",
          "24/7 access to primary care, urgent care, and mental health services",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="text-sky-500 font-bold text-lg leading-none mt-0.5">✓</span>
            <p className="text-gray-800 font-medium text-[15px]">{item}</p>
          </div>
        ))}
      </div>

      <div className="bg-sky-600 text-white text-center py-4 px-6 rounded-lg my-6">
        <p className="font-bold text-lg uppercase tracking-wider">
          The Champ Plan Covers Everyday Care — Not Catastrophic Events
        </p>
      </div>

      <p>
        This is real money back into employers' bottom lines — and meaningful, everyday relief for employees and their families. It's the kind of solution that positions your Chamber as not just a connector, but a <strong>true advocate</strong> for both business performance and employee well-being.
      </p>

      {/* Page 2 */}
      <hr className="my-8 border-sky-200" />

      <p>
        The program operates through the <strong>First Health Network</strong> (Aetna / CVS Health) and is designed for companies with as few as <strong>10 full-time W2 employees</strong>, ensuring stability and consistent value delivery.
      </p>

      <p className="font-semibold text-gray-900 text-lg">
        For the Chamber, the opportunity is simple — and powerful.
      </p>

      <p>
        There is <strong>no selling, no administrative burden, and no disruption</strong> to your team. We simply ask for an introduction to the appropriate decision-maker within your member companies. When a business enrolls, your Chamber earns <strong>$2 per employee per month</strong> in passive, recurring revenue.
      </p>

      <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 my-6">
        <p className="font-semibold text-gray-800 mb-4 text-center">
          Here's what that looks like with a single 1,000-employee member:
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { value: "$573K", label: "Employer tax savings" },
            { value: "$1.5M", label: "Returned to employees" },
            { value: "$2K/mo", label: "Recurring Chamber revenue" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-sky-600">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sky-600 text-white text-center py-3 px-6 rounded-lg my-6">
        <p className="font-bold text-lg">No Contracts. No HR Headaches. Fully Turnkey.</p>
      </div>

      <p>
        If there were ever an initiative that aligns financial performance with genuine care for employees — while strengthening your Chamber's revenue — <strong>this is it</strong>.
      </p>

      <p>
        Let's schedule <strong>20 minutes on Zoom</strong>. I'll walk you through exactly how it works and how quickly you can introduce this to your members.
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
