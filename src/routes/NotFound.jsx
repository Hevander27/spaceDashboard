import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The celestial object you're looking for doesn't exist in our galaxy.</p>
      <div className="space-scene">
        <div className="astronaut">👨‍🚀</div>
        <div className="stars">✨ ⭐ 💫 ✨</div>
      </div>
      <Link to="/" className="home-link">Return to Dashboard</Link>
    </div>
  );
};

export default NotFound;