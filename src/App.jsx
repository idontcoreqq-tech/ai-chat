import { ChatWidget } from './components/ChatWidget.jsx';
import './styles/demo.css';

export default function App() {
  return (
    <>
      <main className="demo-site">
        <header className="demo-site__header">
          <div className="demo-site__logo">ShopDemo</div>
          <nav className="demo-site__nav" aria-label="Основное меню">
            <a href="#catalog">Каталог</a>
            <a href="#delivery">Доставка</a>
            <a href="#contacts">Контакты</a>
          </nav>
        </header>
        <section className="demo-site__hero">
          <h1>Демо-страница вашего сайта</h1>
          <p>
            В правом нижнем углу — виджет чата с ИИ-агентом в стиле Jivo. Откройте его,
            задайте вопрос про доставку, оплату или возврат.
          </p>
          <div className="demo-site__cards">
            <article className="demo-card">
              <h2>Быстрая поддержка</h2>
              <p>Ответы 24/7 без ожидания оператора в очереди.</p>
            </article>
            <article className="demo-card">
              <h2>Умные подсказки</h2>
              <p>Ассистент понимает типовые вопросы по заказам.</p>
            </article>
            <article className="demo-card">
              <h2>Удобный виджет</h2>
              <p>Не мешает просмотру каталога — сворачивается в одну кнопку.</p>
            </article>
          </div>
        </section>
        <footer className="demo-site__footer">
          © 2026 ShopDemo — учебный проект чата
        </footer>
      </main>
      <ChatWidget />
    </>
  );
}
