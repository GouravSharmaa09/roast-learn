import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import RoastJavaScript from "./pages/RoastJavaScript";
import RoastPython from "./pages/RoastPython";
import AICodeReview from "./pages/AICodeReview";
import NotFound from "./pages/NotFound";
import InstallPrompt from "./components/pwa/InstallPrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPrompt />
        <OfflineIndicator />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/roast-javascript-code" element={<RoastJavaScript />} />
            <Route path="/roast-python-code" element={<RoastPython />} />
            <Route path="/ai-code-review" element={<AICodeReview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
