import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrandBuilder from "./pages/BrandBuilder";
import CRMChains from "./pages/CRMChains";
import AdminDashboard from "./pages/AdminDashboard";
import ClearFaithLanding from "./pages/ClearFaithLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/brand-builder" element={<BrandBuilder />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/crmchains" element={<CRMChains />} />
          <Route path="/clear-faith" element={<ClearFaithLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
