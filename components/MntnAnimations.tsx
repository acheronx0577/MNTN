"use client";

import "lenis/dist/lenis.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function MntnAnimations() {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 0.85,
      });

      setLenisInstance(lenis);

      lenis.on("scroll", ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      const heroTitle = document.querySelectorAll(".hero-title span");
      const heroSubtitle = document.querySelector(".hero-subtitle");
      const heroAction = document.querySelector(".hero-action");
      const sliderListItem = document.querySelectorAll(".slider-list-item");
      const sliderProgress = document.querySelector(".slider-progress");

      gsap.fromTo(
        [heroSubtitle, heroTitle, heroAction, sliderListItem],
        {
          autoAlpha: 0,
          y: 100,
          stagger: 0.2,
        },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.2,
        }
      );

      gsap.fromTo(
        sliderProgress,
        {
          autoAlpha: 0,
          y: "100",
        },
        {
          autoAlpha: 1,
          y: "0",
          delay: 1,
        }
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        .to(".sky", { y: 1000 }, "0")
        .to(".mountains", { y: -300 }, "0")
        .to(".man-standing", { y: -100 }, "0")
        .to(".hero-content", { y: 450, autoAlpha: 0 }, "0");

      const contentRows = document.querySelectorAll(".content-row");

      contentRows.forEach((contentRow) => {
        const imageWrapper = contentRow.querySelector(".content-image");
        const image = imageWrapper?.querySelector("img");
        const counter = contentRow.querySelector(".counter");
        const subtitle = contentRow.querySelectorAll(".content-subtitle");
        const title = contentRow.querySelectorAll(".content-title span");
        const description = contentRow.querySelectorAll(".content-copy");
        const action = contentRow.querySelectorAll(".content-action");

        if (!image) return;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: contentRow,
              start: "center-=100 center",
              end: "center top",
              scrub: 0.2,
              pin: contentRow,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            [subtitle, title, description, action],
            {
              autoAlpha: 0,
              y: 100,
              stagger: 0.2,
            },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.2,
            },
            "0"
          )
          .fromTo(counter, { autoAlpha: 0 }, { autoAlpha: 1 }, "0")
          .fromTo(
            image,
            {
              autoAlpha: 0,
              scale: 1.5,
            },
            {
              autoAlpha: 1,
              scale: 1,
            },
            "0"
          );
      });

      gsap.to(".slider-progress-bar", {
        height: "100%",
        ease: "none",
        scrollTrigger: { scrub: 0.3 },
      });

      return () => {
        setLenisInstance(null);
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    []
  );

  return null;
}
