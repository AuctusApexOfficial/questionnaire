"use client"

import Image from "next/image"
import { Questionnaire } from "@/components/questionnaire"
import { ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f7f2]">
      <header className="absolute top-0 left-0 w-full z-10 py-4">
        <div className="pl-4 flex items-center">
          <Image src="/logo.png" alt="Auctus Apex" width={40} height={40} className="h-[40px] w-auto mr-3" />
          <div
            className="text-xl md:text-2xl tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            <span className="text-[#e6d19f]">Auctus </span>
            <span className="text-[#ffffff]">Apex</span>
          </div>
        </div>
      </header>

      <section className="relative min-h-[64vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image src="/italian-landscape.png" alt="Italian Landscape" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/80 z-10"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-[1px] bg-[#dcba76]"></div>
              <div
                className="uppercase tracking-[0.1em] text-[#dcba76] text-xl italic"
                style={{ fontFamily: "'Playfair Display Fallback', serif", lineHeight: "1.75rem" }}
              >
                VINCE OMNIA
              </div>
              <div className="w-16 h-[1px] bg-[#dcba76]"></div>
            </div>

            <h1
              className="tracking-normal leading-tight mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                letterSpacing: "-0.01em",
                fontStyle: "italic",
              }}
            >
              <div className="text-4xl md:text-6xl text-white mb-2">Pre-Consultation</div>
              <div className="text-4xl md:text-6xl text-[#dcba76]">Questionnaire</div>
            </h1>

            <p
              className="text-[#e0e0e0] text-lg md:text-xl max-w-2xl mx-auto italic tracking-wide leading-relaxed mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We offer bespoke marketing, AI automation and web design solutions tailored to your unique needs.
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-[#dcba76] scroll-indicator z-20">
          <ChevronDown className="h-8 w-8 opacity-70" />
        </div>
      </section>

      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #f9f7f2, #f5f2ea)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d3c5a6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d3c5a6]/30 to-transparent"></div>

        {/* Subtle corner ornaments */}
        <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-[#d3c5a6]/20 rounded-tl-3xl opacity-60"></div>
        <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-[#d3c5a6]/20 rounded-tr-3xl opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-[#d3c5a6]/20 rounded-bl-3xl opacity-60"></div>
        <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-[#d3c5a6]/20 rounded-br-3xl opacity-60"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#d3c5a6]/10"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-3xl mx-auto"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <div className="text-center mb-16">
              <div
                className="flex items-center justify-center space-x-4 mb-8 opacity-0"
                style={{ animation: "fadeIn 0.8s ease-out 0.3s forwards" }}
              >
                <div className="w-16 h-[1px] bg-[#b39656]/40"></div>
                <div className="text-[#b39656] font-serif italic">Questionnaire</div>
                <div className="w-16 h-[1px] bg-[#b39656]/40"></div>
              </div>

              <h2
                className="text-3xl font-light tracking-wide mb-6 opacity-0"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  animation: "fadeIn 0.8s ease-out 0.5s forwards",
                }}
              >
                <span className="text-[#333]">Tell Us About Your</span> <span className="text-[#b39656]">Vision</span>
              </h2>

              <p
                className="text-[#666] max-w-2xl mx-auto font-body text-xl tracking-wide leading-relaxed opacity-0"
                style={{ animation: "fadeIn 0.8s ease-out 0.7s forwards" }}
              >
                Please take a moment to share your objectives and requirements. Your responses will help us prepare a
                tailored consultation experience.
              </p>
            </div>

            <style jsx global>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                33% { transform: translate(30px, -30px) rotate(120deg); }
                66% { transform: translate(-20px, 20px) rotate(240deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
              }
              
              .questionnaire-container {
                transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
              }
              
              .questionnaire-container:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px -5px rgba(179, 150, 86, 0.1), 0 8px 10px -6px rgba(179, 150, 86, 0.05);
              }
            `}</style>

            <div
              className="questionnaire-container opacity-0"
              style={{ animation: "fadeIn 0.8s ease-out 0.9s forwards" }}
            >
              <Questionnaire isNamedUrl={false} />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <a
                href="https://auctusapex.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="mr-3">
                  <Image src="/logo.png" alt="Auctus Apex" width={40} height={40} className="h-[40px] w-auto" />
                </div>
                <div className="text-[#b39656] font-serif">
                  <span className="text-lg tracking-wide">Auctus Apex</span>
                  <span className="text-xs ml-2 text-[#b39656]/80 font-accent">Est. MMXXV</span>
                </div>
              </a>
            </div>
            <div className="text-sm text-[#999] font-body tracking-wide">
              &copy; {new Date().getFullYear()} Auctus Apex. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
