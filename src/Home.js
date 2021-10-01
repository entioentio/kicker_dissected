import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import * as FirestoreService from "./services/firestore";

const Home = (props) => {
    const history = useHistory();
    const [groupList, setGroupList] = useState([]);

        useEffect(() => {
            console.log(location.state.param)
            const groupList = [];


            FirestoreService.getGroupList(location.state.param).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    groupList.push(doc.data().group);
                });
                setGroupList(groupList);
            });

        });

        return (
        <>
            <h1>Kicker</h1>

            <hr/>

            {/* Button */}


            {
                groupList.map(result =>
                    <p>
                        <button name="{result}" onClick={() => history.push('/{result}', {param: "{result}"})}>{result}</button>
                    </p>
                )
            }


        </>
    );
}
;

export default Home;