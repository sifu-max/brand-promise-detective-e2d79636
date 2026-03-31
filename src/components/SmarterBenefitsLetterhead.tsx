import smarterLogo from "@/assets/smarter-benefits-logo.jpg";
import championLogo from "@/assets/champion-health-logo.png";

interface Props {
  children: React.ReactNode;
}

export default function SmarterBenefitsLetterhead({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-gray-900 print:bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-[3px] border-sky-500">
        <div className="container max-w-3xl py-6 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <img src={smarterLogo} alt="Smarter Benefits Strategy" className="h-14 w-auto" />
            <div>
              <p className="text-sky-600 font-extrabold text-xl leading-tight tracking-tight">Smarter</p>
              <p className="text-sky-600 font-extrabold text-xl leading-tight tracking-tight">Benefits Strategy</p>
              <p className="text-sky-400 text-[11px] font-bold tracking-[0.2em] uppercase mt-0.5">Benefits That Perform</p>
            </div>
          </div>
          <img src={championLogo} alt="Champion Health" className="h-14 w-auto" />
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl px-8 py-10 space-y-5 text-[15px] leading-[1.75]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t-2 border-sky-100 mt-10">
        <div className="container max-w-3xl px-8 py-5 text-center space-y-1">
          <p className="font-bold text-gray-800 text-sm">Robert Nyberg</p>
          <p className="text-sky-600 text-xs font-semibold">Principal &nbsp;|&nbsp; Smarter Benefits Strategy</p>
          <p className="text-gray-500 text-xs">Independent Agent for Champion Health</p>
          <p className="text-gray-500 text-xs">
            Mobile: 480.740.1067 &nbsp;&bull;&nbsp;{" "}
            <a href="mailto:rpnyberg@SmarterBenefitsStrategy.com" className="text-sky-600 hover:underline">
              rpnyberg@SmarterBenefitsStrategy.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
