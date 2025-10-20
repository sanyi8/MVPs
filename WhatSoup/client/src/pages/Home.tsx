import { RecipeGenerator } from "@/components/RecipeGenerator";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher"; // Assuming this component exists

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* App Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <Logo className="w-auto h-20" />
              <p className="text-lg text-[#8d99ae] font-medium mt-2">Delicious Soup Recipe Generator</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="flex justify-end mb-4"> {/* Added LanguageSwitcher here */}
            <LanguageSwitcher className="text-base" />
          </div>
          <RecipeGenerator />
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[#8d99ae]/30">
          <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
            <p className="text-sm text-[#8d99ae] mb-3 sm:mb-0">&copy; {new Date().getFullYear()} WhatSoup? All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="https://www.linkedin.com/in/sandor-kardos/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="footer-attribution">
                Powered by Sandor Kardos
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}