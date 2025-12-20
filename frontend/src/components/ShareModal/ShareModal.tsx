import { useState } from 'react'

import { Dialog, Button, IconButton, Snackbar } from '@photo-gallery/ui-library'

import styles from './ShareModal.module.css'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  imageId: string
  imageTitle: string
}

export const ShareModal = ({ open, onClose, imageId, imageTitle }: ShareModalProps) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const publicUrl = `${window.location.origin}/photo/${imageId}`

  const embedCodes = {
    html: `<img src="${publicUrl}" alt="${imageTitle}" />`,
    markdown: `![${imageTitle}](${publicUrl})`,
    bbcode: `[img]${publicUrl}[/img]`,
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage(`${label} скопирован!`)
        setSnackbarOpen(true)
      })
      .catch(() => {
        setSnackbarMessage('Не удалось скопировать')
        setSnackbarOpen(true)
      })
  }

  const shareToSocial = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(imageTitle)}`,
      vk: `https://vk.com/share.php?url=${encodeURIComponent(publicUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(imageTitle)}`,
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="Поделиться изображением"
        maxWidth="md"
      >
        <div className={styles.shareContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Прямая ссылка</h3>
            <div className={styles.copyField}>
              <input
                type="text"
                value={publicUrl}
                readOnly
                className={styles.input}
              />
              <IconButton
                icon={<span className="material-symbols-outlined">content_copy</span>}
                onClick={() => copyToClipboard(publicUrl, 'Ссылка')}
                variant="tonal"
                ariaLabel="Копировать ссылку"
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Код для вставки</h3>

            <div className={styles.embedOption}>
              <span className={styles.embedLabel}>HTML</span>
              <div className={styles.copyField}>
                <input
                  type="text"
                  value={embedCodes.html}
                  readOnly
                  className={styles.input}
                />
                <IconButton
                  icon={<span className="material-symbols-outlined">content_copy</span>}
                  onClick={() => copyToClipboard(embedCodes.html, 'HTML код')}
                  variant="tonal"
                  ariaLabel="Копировать HTML"
                />
              </div>
            </div>

            <div className={styles.embedOption}>
              <span className={styles.embedLabel}>Markdown</span>
              <div className={styles.copyField}>
                <input
                  type="text"
                  value={embedCodes.markdown}
                  readOnly
                  className={styles.input}
                />
                <IconButton
                  icon={<span className="material-symbols-outlined">content_copy</span>}
                  onClick={() => copyToClipboard(embedCodes.markdown, 'Markdown код')}
                  variant="tonal"
                  ariaLabel="Копировать Markdown"
                />
              </div>
            </div>

            <div className={styles.embedOption}>
              <span className={styles.embedLabel}>BBCode</span>
              <div className={styles.copyField}>
                <input
                  type="text"
                  value={embedCodes.bbcode}
                  readOnly
                  className={styles.input}
                />
                <IconButton
                  icon={<span className="material-symbols-outlined">content_copy</span>}
                  onClick={() => copyToClipboard(embedCodes.bbcode, 'BBCode')}
                  variant="tonal"
                  ariaLabel="Копировать BBCode"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Поделиться в соцсетях</h3>
            <div className={styles.socialButtons}>
              <Button
                variant="filled"
                onClick={() => shareToSocial('facebook')}
                icon={<span className="material-symbols-outlined">share</span>}
              >
                Facebook
              </Button>
              <Button
                variant="filled"
                onClick={() => shareToSocial('twitter')}
                icon={<span className="material-symbols-outlined">share</span>}
              >
                Twitter
              </Button>
              <Button
                variant="filled"
                onClick={() => shareToSocial('vk')}
                icon={<span className="material-symbols-outlined">share</span>}
              >
                VK
              </Button>
              <Button
                variant="filled"
                onClick={() => shareToSocial('telegram')}
                icon={<span className="material-symbols-outlined">share</span>}
              >
                Telegram
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="text" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        duration={3000}
      />
    </>
  )
}
