import styles from '@/styles/brand.module.css'

export default function HeroSection() {
  return (
    <>
      <div className={styles.heroImageArea}>
        <img src="/images/seira.png" alt="" />
        <div className={styles.heroImageOverlay} />
      </div>
      <div className={styles.quote}>
        <div className={styles.quoteLine} />
        <p className={styles.quoteText1}>「口コミは、お客様からの経営レポート。」</p>
        <p className={styles.quoteText2}>「データを読まない経営者は、勘で戦っている。」</p>
        <p className={styles.quoteText2}>「返信の質が、店の格を決める。」</p>
        <p className={styles.quoteAuthor}>── 黒川 聖羅</p>
      </div>
    </>
  )
}
