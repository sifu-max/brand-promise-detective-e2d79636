import smarterLogo from "@/assets/smarter-benefits-logo.jpg";
import championLogo from "@/assets/champion-health-logo.png";

interface Props {
  children: React.ReactNode;
}

export default function SmarterBenefitsLetterhead({ children }: Props) {
  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      {/* Header */}
      <header className="border-b-2 border-sky-400">
        <div className="container max-w-3xl py-5 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src={smarterLogo} alt="Smarter Benefits Strategy" className="h-16 w-auto" />
            <div>
              <p className="text-sky-500 font-bold text-lg leading-tight">Smarter</p>
              <p className="text-sky-500 font-bold text-lg leading-tight">Benefits Strategy</p>
              <p className="text-sky-400 text-xs font-semibold tracking-wide uppercase">Benefits That Perform</p>
            </div>
          </div>
          <img src={championLogo} alt="Champion Health" className="h-14 w-auto" />
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl px-6 py-8 space-y-6 text-[15px] leading-relaxed">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8">
        <div className="container max-w-3xl px-6 py-4 text-center text-xs text-gray-500 space-y-0.5">
          <p className="font-semibold text-gray-700">Robert Nyberg &nbsp;&nbsp; An Independent Agent of Champion Health</p>
          <p>Mobile Ph.: 480.740.1067 &nbsp;&nbsp; Email: rpnyberg@SmarterBenefitsStrategy.com</p>
        </div>
      </footer>
    </div>
  );
}
