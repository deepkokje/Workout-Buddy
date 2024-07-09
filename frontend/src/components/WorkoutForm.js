import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";


export default function WorkoutForm() {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
const {user} = useAuthContext()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user) {
      setError('You must be logged in!')
      return
    }

    const workout = { title, load, reps };

    // second argument is the options object
    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`

      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
      <label>Exercise Title:</label>
      <input
        type="text"
        name='title'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Load (in kg):</label>
      <input
        type="number"
        name='load'
        onChange={(e) => setLoad(e.target.value)}
        value={load}
      />
      <label data-testid = 'reps'>Reps:</label>
      <input
        type="number"
        name='reps'
        onChange={(e) => setReps(e.target.value)}
        value={reps}
      />
      <button name="addWorkout">Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
