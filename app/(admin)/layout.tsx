

export default function AdminPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <h1>Ini header admin</h1>
      {children}
    <h1>Ini footer admin</h1>
    </>
  );
}
