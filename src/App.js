import Temp from "./component/temp";

function App() {
  return (
    <main className="appShell">
      <header className="appHeader">
        <a className="brand" href="/" aria-label="Skyline Weather home">
          <span className="brandMark" aria-hidden="true">
            +
          </span>
          <span>
            <strong>Skyline</strong>
            <small>weather desk</small>
          </span>
        </a>
        <span className="headerDate">LIVE CONDITIONS</span>
      </header>
      <Temp />
    </main>
  );
}

export default App;
