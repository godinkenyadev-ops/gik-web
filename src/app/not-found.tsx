'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([containerRef.current, cardRef.current], { opacity: 0, y: 50 })
      gsap.set([logoRef.current, titleRef.current, descriptionRef.current, buttonRef.current], { opacity: 0, y: 30 })

      const tl = gsap.timeline({ delay: 0.3 })

      tl.to(containerRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to(cardRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .to(logoRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8")
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
        .to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(buttonRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")

      // Card hover effect
      if (cardRef.current) {
        cardRef.current.addEventListener('mouseenter', () => gsap.to(cardRef.current, { scale: 1.02, duration: 0.4 }))
        cardRef.current.addEventListener('mouseleave', () => gsap.to(cardRef.current, { scale: 1, duration: 0.4 }))
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6 py-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 -right-32 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse delay-700" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-2xl">
        <article
          ref={cardRef}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/20 border border-white/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary-500/5 via-emerald-500/5 to-primary-500/5" />

          <div className="relative z-10 px-6 py-8 md:px-10 md:py-12 text-center">
            <div ref={logoRef} className="mb-6">
              <Image
                src="/assets/logos/GIK-Black-Green.png"
                alt="God in Kenya Missions"
                width={200}
                height={200}
                priority
                className="h-8 md:h-10 w-auto mx-auto"
              />
            </div>

            <div ref={titleRef} className="mb-6">
              <h1 className="text-6xl md:text-8xl font-black text-emerald-700 mb-4">404</h1>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Page Not Found</h2>
            </div>

            <div ref={descriptionRef} className="mb-8">
              <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            <div ref={buttonRef}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-linear-to-r from-primary-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <span>Return Home</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary-600 via-emerald-600 to-primary-600" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary-600 via-emerald-600 to-primary-600" />
        </article>
      </div>
    </main>
  )
}