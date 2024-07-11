import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const UserHoldingStats = () => {
    const [userHoldingStats, setUserHoldingStats] = useState([]);

    useEffect(() =>{
        const fetchData = async() => {
            const res = await axios.get("../../api/users/portfolio");
            console.log(res.data);
        }

        fetchData();
    })

    return(
        <h1>{userHoldingStats}</h1>
    );
};
export default UserHoldingStats;