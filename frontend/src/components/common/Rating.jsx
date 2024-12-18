import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // For star icons
import api from "../../api";

const RatingCard = ({ courierId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(rating);  // This calls the `handleRatingSubmit` function passed from the parent
  };

  //     if (response.status === 200) {
  //       alert("Rating submitted successfully!");
  //       if (onRatingSubmitted) onRatingSubmitted();
  //     } else {
  //       alert("Failed to submit rating. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting rating:", error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h3 className="text-xl font-semibold mb-4">Rate Your Courier</h3>
      <div className="flex space-x-2 mb-4">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <FaStar
              key={index}
              size={28}
              className={`cursor-pointer transition-colors duration-200 ${
                currentRating <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(currentRating)}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </div>
      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Leave your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
          rating > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={!rating}
      >
        Submit Rating
      </button>
    </div>
  );
};

export default RatingCard;
