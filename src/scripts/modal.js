// Centralized modal management (replaces CVTextPopup)

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.activeTrigger = null;
    this.init();
  }

  init() {
    this.setupTextModal();
    this.setupStoryModal();
    this.setupTimelineModals();
    this.setupCertificateModals();
  }

  setupTextModal() {
    this.textModal = document.getElementById("text-modal");
    if (!this.textModal) return;
    const closeEls = this.textModal.querySelectorAll(
      "[data-close], .text-modal-close"
    );
    closeEls.forEach((el) =>
      el.addEventListener("click", () => this.closeModal())
    );
    this.textModal.addEventListener("click", (e) => {
      if (
        e.target === this.textModal ||
        e.target.classList.contains("text-modal-backdrop")
      )
        this.closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.textModal.classList.contains("show"))
        this.closeModal();
    });
  }

  setupStoryModal() {
    const trigger = document.getElementById("story-trigger");
    const storyModal = document.getElementById("story-modal");
    if (!trigger || !storyModal) return;
    const closeEls = storyModal.querySelectorAll(
      "[data-close], .text-modal-close"
    );
    closeEls.forEach((el) =>
      el.addEventListener("click", () => this.closeModal())
    );
    storyModal.addEventListener("click", (e) => {
      if (
        e.target === storyModal ||
        e.target.classList.contains("text-modal-backdrop")
      )
        this.closeModal();
    });
    const open = (e) => {
      if (
        e &&
        e.target &&
        e.target.closest &&
        e.target.closest("a,button,input,textarea")
      )
        return;
      this.openStoryModal();
    };
    trigger.addEventListener("click", open);
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(e);
      }
    });
  }

  setupTimelineModals() {
    document.querySelectorAll(".timeline-description").forEach((desc) => {
      this.makeInteractive(desc);
      const open = (e) => {
        if (e.target.closest("a,button,input,textarea")) return;
        this.openTimelineModal(desc);
      };
      desc.addEventListener("click", open);
      desc.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(e);
        }
      });
    });
  }

  setupCertificateModals() {
    document
      .querySelectorAll(".certifications-grid .cert-item")
      .forEach((item) => {
        this.makeInteractive(item);
        const open = (e) => {
          if (e.target.closest("a,button,input,textarea")) return;
          this.openCertificateModal(item);
        };
        item.addEventListener("click", open);
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open(e);
          }
        });
      });
  }

  makeInteractive(el) {
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-haspopup", "dialog");
    el.setAttribute("aria-controls", "text-modal");
    el.setAttribute("aria-expanded", "false");
    el.style.cursor = "pointer";
  }

  openModal(modalEl, title, content, trigger) {
    const titleEl = modalEl.querySelector(".text-modal-title");
    const bodyEl = modalEl.querySelector(".text-modal-body");
    if (titleEl) titleEl.textContent = title || "";
    if (bodyEl) bodyEl.innerHTML = content || "";
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
      this.activeTrigger = trigger;
    }
    modalEl.classList.add("show");
    modalEl.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    const closeBtn = modalEl.querySelector(".text-modal-close");
    if (closeBtn) closeBtn.focus();
    this.activeModal = modalEl;
  }

  closeModal() {
    if (!this.activeModal) return;
    this.activeModal.classList.remove("show");
    this.activeModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (this.activeTrigger) {
      this.activeTrigger.setAttribute("aria-expanded", "false");
      try {
        this.activeTrigger.focus();
      } catch {}
      this.activeTrigger = null;
    }
    this.activeModal = null;
  }

  openStoryModal() {
    const storyModal = document.getElementById("story-modal");
    if (!storyModal) return;
    const title = "The Journey of a Digital Craftsman";
    const content = `
      <p>Over the last few years, I've focused on sharpening both my technical skills and architectural thinking to build maintainable, value-driven software.</p>
      <p>I prioritize clarity, clean patterns, performance, and aligning solutions with real user and business needs.</p>
      <p>My goal: keep solving meaningful problems and help others through what I build and share.</p>
    `;
    this.openModal(
      storyModal,
      title,
      content,
      document.getElementById("story-trigger")
    );
  }

  openTimelineModal(descEl) {
    const item = descEl.closest(".timeline-item");
    const year = item?.querySelector(".timeline-year")?.textContent?.trim();
    const evt = item?.querySelector(".timeline-event")?.textContent?.trim();
    const title = [year, evt].filter(Boolean).join(" — ") || "Timeline Details";
    this.openModal(this.textModal, title, descEl.innerHTML, descEl);
  }

  openCertificateModal(certEl) {
    const name =
      certEl.querySelector(".cert-name")?.textContent?.trim() || "Certificate";
    const dur = certEl.querySelector(".cert-duration")?.textContent?.trim();
    const title = dur ? `${name} — ${dur}` : name;
    const desc =
      certEl.querySelector(".cert-description")?.innerHTML || certEl.innerHTML;
    this.openModal(this.textModal, title, desc, certEl);
  }
}

document.addEventListener("DOMContentLoaded", () => new ModalManager());
