import useRecentChanges from "../hooks/useRecentChanges";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate, Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import "./HomePage.css";

function HomePage() {
  const { changes, loading, error } = useRecentChanges();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay">
          <p className="hero-quote">
            "Une pièce sans livres est comme un corps sans âme."
          </p>
          <p className="hero-desc">
            Découvrez des millions d'œuvres littéraires, explorez les
            collections du monde entier et plongez dans l'univers infini des
            livres.
          </p>
          <Link to="/search" className="hero-btn">
            Explorer la bibliothèque →
          </Link>
        </div>
      </section>

      {/* DERNIÈRES MODIFICATIONS */}
      <section className="recent-changes">
        <h2>Dernières modifications</h2>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && changes.length === 0 && (
          <p>Aucune modification récente</p>
        )}

        <div className="cards-grid">
          {changes.map((change, index) => {
            const id = change.key?.split("/").pop();
            const coverUrl = change.coverId
              ? `https://covers.openlibrary.org/b/id/${change.coverId}-M.jpg`
              : null;

            return (
              <div
                key={index}
                className="change-card"
                onClick={() => id && navigate(`/book/${id}`)}
              >
                <div className="change-card-cover">
                  {coverUrl ? (
                    <img src={coverUrl} alt={change.title || "Couverture"} />
                  ) : (
                    <div className="change-card-no-cover">📖</div>
                  )}
                </div>
                <div className="change-card-info">
                  <h3>{change.title || "Sans titre"}</h3>
                  <p className="change-type">
                    {change.kind === "add-book" ? "+ Ajout" : "✎ Modification"}
                  </p>
                  <p className="change-date">
                    {change.timestamp
                      ? new Date(change.timestamp).toLocaleDateString("fr-FR")
                      : "Date inconnue"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="popular-subjects">
        <h2>Explorer par sujet</h2>
        <div className="subjects-grid">
          {[
            { label: "📚 Roman", value: "fiction" },
            { label: "🔬 Science", value: "science" },
            { label: "🏛️ Histoire", value: "history" },
            { label: "💭 Philosophie", value: "philosophy" },
            { label: "🎨 Art", value: "art" },
            { label: "🌍 Géographie", value: "geography" },
            { label: "🧠 Psychologie", value: "psychology" },
            { label: "⚗️ Chimie", value: "chemistry" },
          ].map((subject) => (
            <Link
              key={subject.value}
              to={`/search?subject=${subject.value}`}
              className="subject-tag"
            >
              {subject.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
