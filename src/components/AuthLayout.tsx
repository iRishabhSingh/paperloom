import { Inter } from "next/font/google";
import ThemedText from "@/components/ThemedText";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.variable} flex min-h-screen items-center justify-center bg-gradient-to-br from-base-100 to-primary/10 p-4 font-sans`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <div className="animate-blob animation-delay-2000 absolute -top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-purple-400 mix-blend-multiply blur-[100px] filter"></div>
        <div className="animate-blob animation-delay-4000 absolute -right-20 top-1/3 h-[250px] w-[250px] rounded-full bg-blue-400 mix-blend-multiply blur-[90px] filter"></div>
        <div className="animate-blob absolute -bottom-20 left-1/2 h-[280px] w-[280px] rounded-full bg-cyan-400 mix-blend-multiply blur-[100px] filter"></div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-base-200 text-base-content border border-base-300",
        }}
      />

      <div className="relative z-10 w-full max-w-[95vw] overflow-hidden rounded-box bg-base-100 shadow-2xl sm:max-w-md">
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 text-center text-primary-content">
          <ThemedText className="text-2xl md:text-3xl" text="paperloom" />
          <p className="text-sm opacity-90">Seamless PDF collaboration</p>
        </div>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
