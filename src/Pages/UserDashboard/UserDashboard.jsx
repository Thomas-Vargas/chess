import { useAuth } from "../../components/AuthProvider/AuthProvider";

const UserDashboard = () => {

  const { user } = useAuth();

  console.log("user", user);

    return (
        <div>

        </div>
    )
}

export default UserDashboard;