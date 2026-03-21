import styles from '@/styles/brand.module.css'

export default function HeroSection() {
  return (
    <>
      {/* デスクトップ：右側絶対配置 */}
      <div className={styles.heroImageArea}>
        <img src="/images/seira.png" alt="黒川聖羅" />
        <div className={styles.heroImageOverlay} />
      </div>

      {/* モバイル：上部バナー */}
      <div className={styles.heroImageMobile}>
        <img src="/images/seira.png" alt="黒川聖羅" />
      </div>

      {/* モバイル：名言 */}
      <div className={styles.quoteMobile}>
        <p className={styles.quoteMobileText}>「口コミは、お客様からの経営レポート。」</p>
        <p className={styles.quoteMobileText}>「返信の質が、店の格を決める。」</p>
        <p className={styles.quoteMobileAuthor}>── 黒川 聖羅</p>
      </div>
    </>
  )
}
