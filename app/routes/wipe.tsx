import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { clearAllReviews, getReviewCount } from "~/lib/localReviews";
import { useSupabaseAuthStore } from "~/lib/supabase";

const WipeApp = () => {
  const { auth, isLoading } = useSupabaseAuthStore();
  const navigate = useNavigate();
  const [reviewCount, setReviewCount] = useState(0);
  const [isWiping, setIsWiping] = useState(false);

  const loadReviewCount = async () => {
    const count = await getReviewCount();
    setReviewCount(count);
  };

  useEffect(() => {
    loadReviewCount();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setIsWiping(true);
    await clearAllReviews();
    await loadReviewCount();
    setIsWiping(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Authenticated as: {auth.user?.email}
      <div>Stored reviews: {reviewCount}</div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => handleDelete()}
        >
          {isWiping ? "Wiping..." : "Wipe App Data"}
        </button>
      </div>
    </div>
  );
};

export default WipeApp;
