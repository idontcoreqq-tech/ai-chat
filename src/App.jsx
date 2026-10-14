import { ChatWidget } from './components/ChatWidget.jsx';
import { MOCK_CATALOG, OPERATOR_PHONE } from './data/mocks.js';
import './styles/demo.css';

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

const TICKER = [
  'без очереди',
  'чат 24/7',
  'витамины',
  'не ставим диагнозы',
  'самовывоз today',
  'оператор на линии',
  'термоупаковка',
];

export default function App() {
  return (
    <>
      <main className="site">
        <header className="site-header">
          <div className="site-header__inner">
            <a className="brand" href="#top">
              <span className="brand__mark" aria-hidden="true">
                +
              </span>
              <span className="brand__text">
                <strong>meddemo</strong>
                <span>аптека, но не скучная</span>
              </span>
            </a>
            <nav className="site-nav" aria-label="Основное меню">
              <a href="#catalog">дроп</a>
              <a href="#delivery">доставка</a>
              <a href="#contacts">связь</a>
            </nav>
            <a className="header-phone" href={`tel:${OPERATOR_PHONE.replace(/\D/g, '')}`}>
              {OPERATOR_PHONE}
            </a>
          </div>
        </header>

        <section className="hero" id="top">
          <div className="hero__blob hero__blob--a" aria-hidden="true" />
          <div className="hero__blob hero__blob--b" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__copy">
              <p className="eyebrow">online · не поликлиника</p>
              <h1>
                аптека
                <em> в кармане.</em>
                <span> лекарства без вайба очереди</span>
              </h1>
              <p className="hero__lead">
                Спроси чат про наличие и форму выпуска. Если это не про товары — кинем на
                живого оператора, без воды.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#catalog">
                  смотреть дроп
                </a>
                <a className="btn btn--ghost" href={`tel:${OPERATOR_PHONE.replace(/\D/g, '')}`}>
                  позвонить →
                </a>
              </div>
              <div className="chips">
                <span>оригиналы</span>
                <span>БАДы</span>
                <span>медтехника</span>
                <span>не лечим в чате</span>
              </div>
            </div>
            <aside className="hero-card" aria-label="Онлайн-консультант">
              <div className="hero-card__sticker">live</div>
              <p className="hero-card__kicker">your pharmacist</p>
              <p className="hero-card__name">елена</p>
              <p className="hero-card__role">консультант · не врач</p>
              <blockquote>
                напиши название — скажу, есть ли в каталоге. диагноз не ставлю, дозировку
                не подбираю. сомневаешься — к врачу или оператору.
              </blockquote>
              <p className="hero-card__hint">чат снизу справа ↓</p>
            </aside>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="section" id="catalog">
          <div className="section__head">
            <p className="kicker">hot rn</p>
            <h2>что берут чаще всего</h2>
            <p>мок-каталог. кинь название в чат — Елена подскажет.</p>
          </div>
          <div className="catalog">
            {MOCK_CATALOG.map((item) => (
              <article className={`product product--${item.vibe}`} key={item.id}>
                <div className="product__emoji" aria-hidden="true">
                  {item.emoji}
                </div>
                <div className="product__top">
                  <span className="product__tag">{item.tag}</span>
                  <span className={`stock ${item.inStock ? 'stock--ok' : 'stock--off'}`}>
                    {item.inStock ? 'in stock' : 'soon'}
                  </span>
                </div>
                <h3>{item.name}</h3>
                <p className="product__form">{item.form}</p>
                <p className="product__hint">{item.hint}</p>
                <div className="product__bottom">
                  <strong>{formatPrice(item.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--alt" id="delivery">
          <div className="section__head">
            <p className="kicker">logistics</p>
            <h2>как привезём</h2>
            <p>без сюрпризов по срокам.</p>
          </div>
          <div className="grid-3">
            <article className="info-card">
              <span className="info-card__n">01</span>
              <h3>город</h3>
              <p>1–2 дня. чувствительное — в термопаке, не в обычном пакете из пятерочки.</p>
            </article>
            <article className="info-card">
              <span className="info-card__n">02</span>
              <h3>регионы</h3>
              <p>3–6 дней. рецептурное — только с рецептом, без «ну вы же понимаете».</p>
            </article>
            <article className="info-card">
              <span className="info-card__n">03</span>
              <h3>самовывоз</h3>
              <p>садовая, 12. заказ ждёт 5 дней. забери, когда удобно.</p>
            </article>
          </div>
        </section>

        <section className="section" id="contacts">
          <div className="contacts">
            <div>
              <p className="kicker">hit us up</p>
              <h2>не в каталоге? звони.</h2>
              <p className="contacts__lead">живой оператор, не бот с автоответчиком.</p>
              <a className="contacts__phone" href={`tel:${OPERATOR_PHONE.replace(/\D/g, '')}`}>
                {OPERATOR_PHONE}
              </a>
              <p>8:00–22:00 каждый день · 0 ₽ по рф</p>
            </div>
            <ul className="contacts__list">
              <li>
                <span>spot</span>
                москва, садовая 12
              </li>
              <li>
                <span>mail</span>
                <a href="mailto:hello@meddemo.local">hello@meddemo.local</a>
              </li>
              <li>
                <span>papers</span>
                лицензия ЛО-77-02-00XXXX
              </li>
            </ul>
          </div>
        </section>

        <footer className="site-footer">
          <span>© 2026 meddemo · учебный дроп</span>
          <span>это не замена врача. серьёзно.</span>
        </footer>
      </main>
      <ChatWidget />
    </>
  );
}
