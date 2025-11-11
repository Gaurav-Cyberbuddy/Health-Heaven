import { IngredientScanner } from "@/components/IngredientScanner";
import { Navbar } from "@/components/navbar";

export default function ScannerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <IngredientScanner />
      </main>
    </div>
  );
}



