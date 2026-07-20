import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import BrandBuilder from "./pages/BrandBuilder";
import ConversationQuiz from "./pages/ConversationQuiz";
import RevolutionMortgageProposal from "./pages/RevolutionMortgageProposal";
import RevenueScanner from "./pages/RevenueScanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ROUTER_BASENAME = "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={ROUTER_BASENAME}>
        <Routes>
          <Route path="/" element={<Navigate to="/quiz" replace />} />
          {/* Legacy /crmchains/* redirects */}
          <Route path="/crmchains" element={<Navigate to="/quiz" replace />} />
          <Route path="/crmchains/quiz" element={<Navigate to="/quiz" replace />} />
          <Route path="/crmchains/brand-builder" element={<Navigate to="/brand-builder" replace />} />
          <Route path="/crmchains/revenue-scanner" element={<Navigate to="/revenue-scanner" replace />} />
          <Route path="/crmchains/admin" element={<Navigate to="/admin" replace />} />
          <Route path="/crmchains/revolution-mortgage-proposal" element={<Navigate to="/revolution-mortgage-proposal" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/brand-builder" element={<BrandBuilder />} />
          <Route path="/quiz" element={<ConversationQuiz />} />
          <Route path="/revenue-scanner" element={<RevenueScanner />} />
          <Route path="/revolution-mortgage-proposal" element={<RevolutionMortgageProposal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
