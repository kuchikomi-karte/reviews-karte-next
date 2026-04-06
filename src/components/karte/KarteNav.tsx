'use client'

import { useEffect, useMemo, useState } from 'react'

const HEADER_HEIGHT = 94
const SCROLL_OFFSET = HEADER_HEIGHT + 42

const SECTIONS = [
  { id: 'section-souhy', label: '総評' },
  { id: 'section-kuchikomi', label: '口コミ分析' },
  { id: 'section-jikaku', label: '自覚症状' },
  { id: 'section-monshin', label: '自己問診' },
  { id: 'section-shohousen', label: '処方箋' },
  { id: 'section-action', label: 'アクション' },
] as const

const NAV_STYLES = `
  .kk-karte-nav {
    position: sticky;
    top: ${HEADER_HEIGHT}px;
    z-index: 90;
    display: flex;
    align-items: center;
    overflow-x: auto;
    padding: 0 32px;
    background: #111;
    border-bottom: 0.5px solid var(--kk-border);
    scrollbar-width: none;
  }

  .kk-karte-nav::-webkit-scrollbar {
    display: none;
  }

  .kk-karte-nav__inner {
    display: flex;
    align-items: center;
    min-height: 42px;
    margin: 0 auto;
    white-space: nowrap;
  }

  .kk-karte-nav__item {
    appearance: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 10px 14px;
    color: #555;
    font-family: "Noto Sans JP", sans-serif;
    font-size: 11px;
    letter-spacing: 0.08em;
    transition: color 0.15s ease;
  }

  .kk-karte-nav__item[data-active="true"] {
    color: var(--kk-gold);
  }

  .kk-karte-nav__slash {
    color: #2a2a2a;
    font-size: 10px;
    user-select: none;
  }

  @media (max-width: 640px) {
    .kk-karte-nav {
      padding: 0 12px;
    }

    .kk-karte-nav__inner {
      margin: 0;
    }
  }
`

export default function KarteNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)

  const sectionIds = useMemo(() => SECTIONS.map((section) => section.id), [])

  useEffect(() => {
    const handleScroll = () => {
      let activeSection = sectionIds[0]

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) {
          continue
        }

        if (element.getBoundingClientRect().top - SCROLL_OFFSET <= 24) {
          activeSection = id
        }
      }

      if (activeSection) {
        setActiveId(activeSection)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sectionIds])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (!element) {
      return
    }

    const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav aria-label="カルテメニュー" className="kk-karte-nav">
      <style>{NAV_STYLES}</style>
      <div className="kk-karte-nav__inner">
        {SECTIONS.map((section, index) => (
          <div key={section.id} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 ? <span className="kk-karte-nav__slash">/</span> : null}
            <button
              className="kk-karte-nav__item"
              data-active={activeId === section.id}
              onClick={() => scrollToSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          </div>
        ))}
      </div>
    </nav>
  )
}
