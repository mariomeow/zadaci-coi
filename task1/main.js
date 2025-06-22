// Bonus zadatak - custom klasa

class TextImageSection extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.section = this.querySelector(".section")
        this.sectionButton = this.querySelector(".section__button")
        this.sectionHiddenParagraph = this.querySelector(".section__p--hidden")

        this.sectionButton.addEventListener("click", () => {
            this.sectionHiddenParagraph.classList.remove("section__p--hidden")
            this.sectionButton.remove()
        })

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("section--hidden")
                } else {
                    entry.target.classList.add("section--hidden")
                }
            })
        }, { rootMargin: "0px", threshold: 0.5 })

        this.observer.observe(this.section)
    }

    // Cleanup nije potreban zato jer se komponenta nikad ne brise iz DOMa
}

customElements.define("text-image-section", TextImageSection)