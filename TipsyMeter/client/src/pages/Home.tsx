import TipsyCalculator from "@/components/TipsyCalculator";

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans text-gray-900 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">TipsyCalculator</h1>
          <p className="text-sm text-gray-600 mt-1">Measure your tipsy level without any device</p>
        </header>

        <main>
          <TipsyCalculator />
        </main>

        <footer className="mt-8 text-center text-xs text-gray-500">
          <p>TipsyCalculator is for educational purposes only. <br />Always drink responsibly and never drive after drinking.</p>
        </footer>
      </div>
    </div>
  );
}
