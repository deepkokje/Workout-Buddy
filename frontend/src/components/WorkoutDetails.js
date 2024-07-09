import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import { MdDelete } from "react-icons/md";
import moment from 'moment';
export default function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutsContext();
  const {user} =  useAuthContext()
  const handleClick = async () => {
    if(!user) {
      return
    }
    const response = await fetch("/api/workouts/" + workout._id, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  return (
    <div className="workout-details">
      <h4 data-testid = 'workoutTitle'>{workout.title}</h4>
      <p data-load = 'workoutLoad'>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p data-reps= 'workoutReps'>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p>{moment(workout.createdAt).startOf('minutes').fromNow()}</p>
      <span onClick={handleClick} data-deleteIcon={`delete-${workout.title}`}><MdDelete/></span>
    </div>
  );
}
