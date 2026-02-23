  // Mobile menu toggle – exactly same UI/UX, smooth open/close
  document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', function() {
        // Toggle both active classes for menu and animation
        this.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
      });

      // Close menu when a link is clicked (optional, improves UX)
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          mobileToggle.classList.remove('active');
          navLinks.classList.remove('mobile-active');
        });
      });
    }
  });
document.addEventListener("DOMContentLoaded", () => {
  const playNowBtn = document.getElementById("playNowBtn");
  const overlay = document.getElementById("overlay");
  const opPopup = document.getElementById("opPopup");
  const lvlPopup = document.getElementById("lvlPopup");

  const closePopup = document.getElementById("closePopup");
  const backToOp = document.getElementById("backToOp");

  // quick sanity check
  console.log("✅ script.js loaded");
  console.log({ playNowBtn, overlay, opPopup, lvlPopup });

  if (!playNowBtn || !overlay || !opPopup || !lvlPopup || !closePopup || !backToOp) {
    console.error("❌ Popup elements missing. Check IDs in HTML.");
    return;
  }

  let selectedOp = null;

  function openOverlay() {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    opPopup.hidden = false;
    lvlPopup.hidden = true;
  }

  function closeOverlay() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  }

  playNowBtn.addEventListener("click", (e) => {
    e.preventDefault(); // ✅ stops navigation
    console.log("🔥 Play Now clicked!");
    openOverlay();
  });

  closePopup.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  backToOp.addEventListener("click", () => {
    lvlPopup.hidden = true;
    opPopup.hidden = false;
  });

  // Step 1: Operation
  opPopup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-op]");
    if (!btn) return;

    selectedOp = btn.dataset.op;

    opPopup.hidden = true;
    lvlPopup.hidden = false;
  });

  // Step 2: Difficulty
  lvlPopup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lvl]");
    if (!btn) return;

    const selectedLvl = btn.dataset.lvl;

    // ✅ redirect ONLY after both choices
    window.location.href = `tug-of-war.html?op=${selectedOp}&lvl=${selectedLvl}`;
  });
});
