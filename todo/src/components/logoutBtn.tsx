"use client";
import React from "react";
// import reactElementToJSXString from "react-element-to-jsx-string";
// import { toast, Toaster } from "sonner";
import { ButtonsCard } from "@/components/ui/tailwindcss-buttons";

export default function TailwindcssButtons() {
    return (
        <div>
            <div>
                {buttons.map((button, idx) => (
                    <ButtonsCard key={idx}>
                        {button.component}
                    </ButtonsCard>
                ))}
            </div>
        </div>
    );
}
export const buttons = [
  {
    name: "Shimmer",
    description: "Shimmer button for your website",
    showDot: false,
    component: (
      <button
        className="inline-flex animate-shimmer items-center justify-center rounded-md border border-white-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-slate transition-colors 
                h-10 px-4 text-sm
                sm:h-12 sm:px-6 sm:text-base"
      >
        Log Out
      </button>
    ),
  },
];
