import { Button } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Home.module.css'
import { useSession } from '../../context/SessionContext'

export const Home = () => {
  const navigate = useNavigate()
  const { session } = useSession()

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Храните и делитесь своими фотографиями
          </h1>
          <p className={styles.heroSubtitle}>
            Современный фото-хостинг с поддержкой альбомов, избранного и удобной галереи.
            Загружайте, организуйте и делитесь своими воспоминаниями.
          </p>
          <div className={styles.heroButtons}>
            {session ? (
              <Button onClick={() => navigate('/gallery')} variant="filled" size="large">
                Перейти к галерее
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/register')} variant="filled" size="large">
                  Начать бесплатно
                </Button>
                <Button onClick={() => navigate('/login')} variant="outlined" size="large">
                  Войти
                </Button>
              </>
            )}
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <span className="material-symbols-outlined">collections</span>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Возможности сервиса</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className="material-symbols-outlined">photo_library</span>
            </div>
            <h3 className={styles.featureTitle}>Галерея изображений</h3>
            <p className={styles.featureDescription}>
              Загружайте изображения и управляйте своей коллекцией с удобным интерфейсом.
              Автоматическая оптимизация и создание превью.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className="material-symbols-outlined">photo_album</span>
            </div>
            <h3 className={styles.featureTitle}>Альбомы</h3>
            <p className={styles.featureDescription}>
              Организуйте фотографии в тематические альбомы. Создавайте коллекции
              для разных событий и поездок.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className="material-symbols-outlined">favorite</span>
            </div>
            <h3 className={styles.featureTitle}>Избранное</h3>
            <p className={styles.featureDescription}>
              Отмечайте лучшие фотографии. Система лайков позволяет выделить
              самые ценные моменты.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className="material-symbols-outlined">share</span>
            </div>
            <h3 className={styles.featureTitle}>Приватность</h3>
            <p className={styles.featureDescription}>
              Контролируйте доступ к фотографиям. Делайте их публичными или
              приватными в один клик.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className="material-symbols-outlined">crop</span>
            </div>
            <h3 className={styles.featureTitle}>Обрезка изображений</h3>
            <p className={styles.featureDescription}>
              Встроенный редактор для кадрирования фотографий перед загрузкой.
              Получайте идеальный результат.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className="material-symbols-outlined">security</span>
            </div>
            <h3 className={styles.featureTitle}>Безопасность</h3>
            <p className={styles.featureDescription}>
              JWT аутентификация и шифрование данных. Ваши фотографии защищены
              надежными технологиями.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Как это работает</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Регистрация</h3>
              <p className={styles.stepDescription}>
                Создайте бесплатный аккаунт за несколько секунд. Нужен только email и пароль.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Загрузка фото</h3>
              <p className={styles.stepDescription}>
                Загружайте изображения через удобный интерфейс. Поддержка drag-and-drop
                и предпросмотр перед загрузкой.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Организация</h3>
              <p className={styles.stepDescription}>
                Создавайте альбомы, отмечайте избранное, управляйте приватностью.
                Все под вашим контролем.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Просмотр и управление</h3>
              <p className={styles.stepDescription}>
                Наслаждайтесь удобной галереей, делитесь фотографиями и отслеживайте
                статистику лайков.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Готовы начать?</h2>
          <p className={styles.ctaSubtitle}>
            Присоединяйтесь к нашему сервису и начните организовывать свои фотографии уже сегодня
          </p>
          {!session && (
            <div className={styles.ctaButtons}>
              <Button onClick={() => navigate('/register')} variant="filled" size="large">
                Создать аккаунт
              </Button>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Фото Хостинг</h4>
            <p>Современное решение для хранения и организации фотографий</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Возможности</h4>
            <ul>
              <li>Галерея</li>
              <li>Альбомы</li>
              <li>Избранное</li>
              <li>Обрезка</li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>О проекте</h4>
            <p>Разработано с использованием React, TypeScript и Material Design 3</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Фото Хостинг. Курсовая работа.</p>
        </div>
      </footer>
    </div>
  )
}
