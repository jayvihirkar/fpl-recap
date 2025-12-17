import { useParams, Link } from 'react-router-dom';
import { useGWWrapped } from '../hooks/useGWWrapped';
import StoryMode from '../components/StoryMode'; // <--- Import the new component

const Wrapped = () => {
  const { teamId, gw } = useParams();
  const { data, loading, error } = useGWWrapped(teamId, gw);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen animate-pulse bg-gray-900 text-white">
        <div className="text-6xl mb-4">⚽</div>
        <div className="text-xl font-bold text-fpl-green">Reviewing the tapes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-900 text-white">
        <h1 className="text-4xl mb-2">🟥</h1>
        <h2 className="text-2xl text-red-500 font-bold mb-4">VAR Decision: No Goal</h2>
        <p className="mb-6 text-gray-400">{error}</p>
        <Link to="/" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition">
          Try Again
        </Link>
      </div>
    );
  }

  // --- THE CHANGE IS HERE ---
  // Instead of the debug HTML, we just render StoryMode with the data
  return <StoryMode data={data} />;
};

export default Wrapped;