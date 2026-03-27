export default function LegalPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4">
      {children}
    </div>
  );
}
