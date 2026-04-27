import { AppRatingDialog } from "@/components/app/AppRatingDialog";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AppRatingDialog />
    </>
  );
}
