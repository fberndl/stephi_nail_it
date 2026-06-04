'use client'

import { useEffect } from 'react'

// Ports the imperative behaviors from the original site.js (everything except the
// gallery, which is now the <Gallery> React component, and the marquee/footer-year,
// which are rendered directly in JSX). Runs once after hydration.
export default function SiteInteractions() {
  useEffect(() => {
    const header = document.getElementById('site-header')
    const navLinks = document.getElementById('nav-links')
    const navAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.nav-links a[data-nav]'),
    )
    const sectionIds = [
      'ueber-mich',
      'leistungen',
      'galerie',
      'preise',
      'standort',
      'kontakt',
    ]

    const onScroll = () => {
      header?.classList.toggle('scrolled', window.scrollY > 30)
      let active = 'home'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 200) active = id
      }
      navAnchors.forEach((a) =>
        a.classList.toggle('active', a.dataset.nav === active),
      )
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle')
    const onMenu = () => {
      const open = navLinks?.classList.toggle('mobile-open')
      menuToggle?.classList.toggle('open', !!open)
    }
    menuToggle?.addEventListener('click', onMenu)

    // Smooth in-page scroll
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[data-nav], a[data-scroll-top]',
      ),
    )
    const onAnchorClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement
      if (a.dataset.scrollTop !== undefined) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const id = a.dataset.nav
        const target = id ? document.getElementById(id) : null
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      navLinks?.classList.remove('mobile-open')
      menuToggle?.classList.remove('open')
    }
    anchors.forEach((a) => a.addEventListener('click', onAnchorClick))

    // Services accordion
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>('#services-list .service-row'),
    )
    const onRowClick = (e: Event) => {
      if ((e.target as HTMLElement).closest('a, button')) return
      const row = e.currentTarget as HTMLElement
      const wasOpen = row.classList.contains('open')
      document
        .querySelectorAll('#services-list .service-row.open')
        .forEach((r) => r.classList.remove('open'))
      if (!wasOpen) row.classList.add('open')
    }
    rows.forEach((r) => r.addEventListener('click', onRowClick))

    // Cookie banner
    const cookieBanner = document.getElementById('cookie-banner')
    let cookieTimer: ReturnType<typeof setTimeout> | undefined
    if (!localStorage.getItem('snc_cookie')) {
      cookieTimer = setTimeout(() => cookieBanner?.classList.add('show'), 1400)
    }
    const cookieBtns = Array.from(
      document.querySelectorAll('[data-cookie-accept]'),
    )
    const onAccept = () => {
      localStorage.setItem('snc_cookie', '1')
      cookieBanner?.classList.remove('show')
    }
    cookieBtns.forEach((b) => b.addEventListener('click', onAccept))

    // Reveal on scroll
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.12 },
    )
    const reveals = Array.from(document.querySelectorAll('.reveal'))
    reveals.forEach((el) => obs.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      menuToggle?.removeEventListener('click', onMenu)
      anchors.forEach((a) => a.removeEventListener('click', onAnchorClick))
      rows.forEach((r) => r.removeEventListener('click', onRowClick))
      cookieBtns.forEach((b) => b.removeEventListener('click', onAccept))
      obs.disconnect()
      if (cookieTimer) clearTimeout(cookieTimer)
    }
  }, [])

  return null
}
