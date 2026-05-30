/**
 * Yellow Vibes — minimal JS
 * Sliders · Modal · Quantity
 */

(function () {
  'use strict';

  /* --- Header scroll & mobile nav --- */
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Product image sliders --- */
  function initSlider(sliderEl) {
    const slides = sliderEl.querySelectorAll('.product-slider__slide');
    const prevBtn = sliderEl.querySelector('[data-prev]');
    const nextBtn = sliderEl.querySelector('[data-next]');
    const dotsContainer = sliderEl.querySelector('[data-dots]');
    let current = 0;
    let timer = null;
    const interval = 4500;

    if (slides.length === 0) return;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.product-slider__dot');
        if (dots[current]) dots[current].classList.remove('is-active');
      }
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.product-slider__dot');
        if (dots[current]) dots[current].classList.add('is-active');
      }
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, interval);
    }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }

    if (dotsContainer) {
      slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'product-slider__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
        dot.addEventListener('click', function () {
          goTo(i);
          startAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        prev();
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        next();
        startAutoplay();
      });
    }

    sliderEl.addEventListener('mouseenter', stopAutoplay);
    sliderEl.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  document.querySelectorAll('[data-slider]').forEach(initSlider);

  /* --- Buy Now modal --- */
  const modal = document.getElementById('buyModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalTotal = document.getElementById('modalTotal');
  const qtyValue = document.getElementById('qtyValue');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  let unitPrice = 0;
  let quantity = 1;

  function formatPrice(amount) {
    return '$' + amount.toFixed(2);
  }

  function updateTotal() {
    if (modalTotal) {
      modalTotal.textContent = formatPrice(unitPrice * quantity);
    }
  }

  function openModal(name, image, price) {
    unitPrice = parseFloat(price, 10) || 0;
    quantity = 1;

    if (modalImage) {
      modalImage.src = image;
      modalImage.alt = name;
    }
    if (modalTitle) modalTitle.textContent = name;
    if (modalPrice) modalPrice.textContent = formatPrice(unitPrice);
    if (qtyValue) qtyValue.textContent = '1';
    updateTotal();

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-buy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(
        btn.getAttribute('data-name'),
        btn.getAttribute('data-image'),
        btn.getAttribute('data-price-val')
      );
    });
  });

  modal.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      if (quantity > 1) {
        quantity--;
        qtyValue.textContent = String(quantity);
        updateTotal();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      if (quantity < 99) {
        quantity++;
        qtyValue.textContent = String(quantity);
        updateTotal();
      }
    });
  }

  const paymentBtn = document.getElementById('paymentBtn');
  if (paymentBtn) {
    paymentBtn.addEventListener('click', function () {
      var email = document.getElementById('modalEmail');
      var address = document.getElementById('modalAddress');
      if (email && !email.value.trim()) {
        email.focus();
        return;
      }
      if (address && !address.value.trim()) {
        address.focus();
        return;
      }
      alert('Thank you! Official payment gateway coming soon.');
    });
  }
})();
