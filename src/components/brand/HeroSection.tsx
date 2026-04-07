import Image from 'next/image'
import styles from '@/styles/brand.module.css'

export default function HeroSection() {
  return (
    <>
      <div className={styles.heroImageArea}>
        <Image
          alt="黒川聖羅"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 42vw"
          src="/images/seira.png"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div className={styles.heroImageOverlay} />
      </div>

      <div className={styles.heroImageMobile}>
        <Image
          alt="黒川聖羅"
          fill
          priority
          sizes="100vw"
          src="/images/seira.png"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      <div className={styles.quoteMobile}>
        <p className={styles.quoteMobileText}>「口コミは、お客様からの経営レポート。」</p>
        <p className={styles.quoteMobileText}>「返信の質が、店の格を決める。」</p>
        <p className={styles.quoteMobileAuthor}>── 黒川 聖羅</p>
      </div>
    </>
  )
}
