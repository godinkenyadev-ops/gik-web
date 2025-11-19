'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import SocialLinks from '../../ui/SocialLinks'

export default function ComingSoon() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const verseRef = useRef<HTMLDivElement>(null)

  // Use arrays + useCallback to safely collect refs
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([])

  const setFloatingRef = useCallback((el: HTMLDivElement | null, index: number) => {
    floatingElementsRef.current[index] = el
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([containerRef.current, cardRef.current], { opacity: 0, y: 50 })
      gsap.set([logoRef.current, titleRef.current, descriptionRef.current, progressRef.current, verseRef.current], { opacity: 0, y: 30 })
      gsap.set(floatingElementsRef.current, { opacity: 0, scale: 0 })


      const tl = gsap.timeline({ delay: 0.3 })

      tl.to(containerRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to(cardRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .to(logoRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8")
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
        .to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(progressRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")

      // Progress bar
      const progressBar = progressRef.current?.querySelector('.progress-bar') as HTMLElement
      if (progressBar) {
        gsap.to(progressBar, { width: "100%", duration: 2.5, ease: "power2.inOut", delay: 1 })
      }



      // Floating dots
      gsap.to(floatingElementsRef.current, {
        opacity: 0.4,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1,0.4)",
        stagger: 0.2,
        delay: 1.2
      })

      gsap.to(floatingElementsRef.current, {
        y: -25,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.4
      })

      tl.to(verseRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "+=0.5")

      // Card hover effect
      if (cardRef.current) {
        cardRef.current.addEventListener('mouseenter', () => gsap.to(cardRef.current, { scale: 1.03, duration: 0.4 }))
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
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            ref={(el) => setFloatingRef(el, i)}
            className="relative z-10 w-full max-w-lg"
            style={{
              top: `${15 + i * 13}%`,
              left: `${8 + i * 14}%`,
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-2xl">
        <article
          ref={cardRef}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/20 border border-white/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary-500/5 via-emerald-500/5 to-primary-500/5" />

          <div className="relative z-10 px-6 py-8 md:px-10 md:py-12 text-center">
            <div ref={logoRef} className="mb-4 md:mb-6">
              <Image
                src="/assets/logos/GIK-Black-Green.png"
                alt="God in Kenya Missions"
                width={200}
                height={200}
                priority
                className="h-8 md:h-10 w-auto mx-auto"
              />
            </div>

            <div ref={titleRef} className="mb-8 md:mb-6 relative overflow-hidden">
              <h1 className="relative text-4xl md:text-6xl font-black leading-tight inline-block">
                <span className="text-emerald-700">Website
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-full bg-linear-to-r from-transparent via-white/70 to-transparent opacity-80 animate-shimmer -skew-x-12"
                    style={{ animation: 'shimmer 3.5s infinite' }}
                  />
                </span>
                <br />
                <span className="text-emerald-700 relative">
                  Coming Soon
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-full bg-linear-to-r from-transparent via-white/70 to-transparent opacity-80 animate-shimmer -skew-x-12"
                    style={{ animation: 'shimmer 3.5s infinite' }}
                  />
                </span>
              </h1>
            </div>

            <div ref={progressRef} className="mb-8 max-w-xs mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div className="progress-bar h-full w-0 bg-linear-to-r from-primary-600 to-emerald-600 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 font-medium">Almost ready...</p>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 text-base md:text-base mb-8 max-w-md mx-auto">
                While you wait, follow us to stay connected with our latest mission updates.
              </p>

              <SocialLinks variant="compact" />
            </div>

            <div ref={verseRef} className="border-t border-gray-200/60 pt-6">
              <p className="text-sm md:text-lg text-primary-800 font-light  max-w-xl mx-auto">
                For the earth shall be filled with the knowledge of the glory of the Lord, as the waters cover the sea.
              </p>
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary-600 via-emerald-600 to-primary-600" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary-600 via-emerald-600 to-primary-600" />
        </article>
      </div>
    </main>
  )
}