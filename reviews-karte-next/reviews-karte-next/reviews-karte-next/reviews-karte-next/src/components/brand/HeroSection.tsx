import styles from '@/styles/brand.module.css'

export default function HeroSection() {
  return (
    <div className={styles.heroImageArea}>
      <img src="/images/seira.png" alt="黒川聖羅" />
      <div className={styles.heroImageOverlay} />
    </div>
  )
}
