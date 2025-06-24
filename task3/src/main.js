import "swiper/css"
import "swiper/css/navigation"
import "./styles.css"
import Swiper from "swiper"
import { Navigation } from "swiper/modules"

class SwiperElement extends HTMLElement {
  constructor() {
    super()

    this.swiperInstance = null
    this.toggleButton = null
  }

  connectedCallback() {
    this.initialize()
    this.setupEventListeners()
  }

  initialize() {
    if (!this.swiperInstance) {
      this.swiperInstance = new Swiper(this.querySelector(".swiper"), {
        modules: [Navigation],
        spaceBetween: 8,
        slidesPerView: 1.05,
        slidesOffsetAfter: 16,
        breakpoints: {
          1200: {
            slidesPerView: 2.95
          },
          800: {
            slidesPerView: 2,
            loop: true
          }
        },
        navigation: {
          nextEl: this.querySelector(".swiper__button--next"),
          prevEl: this.querySelector(".swiper__button--prev")
        }
      })

      this.swiperInstance.on("slideChange", (e) => {
        console.log("Informacije o trenutnom slajdu:")
        console.log("Index:", e.activeIndex)
        console.log("Element:", e.slides[e.activeIndex])
      })
    }
  }

  setupEventListeners() {
    this.toggleButton = this.querySelector(".swiper__control")

    this.toggleButton.addEventListener("click", () => {
      if (this.toggleButton.textContent == "ON") {
        this.destroy()
        this.toggleButton.innerHTML = "OFF"
      } else {
        this.initialize()
        this.toggleButton.innerHTML = "ON"
      }
    })
  }

  destroy() {
    this.swiperInstance.destroy()
    this.swiperInstance = null
  }
}

customElements.define("swiper-element", SwiperElement)