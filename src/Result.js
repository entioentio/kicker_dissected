import {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import React from 'react';
import 'react-tabs/style/react-tabs.css';
import 'reactjs-popup/dist/index.css';
import * as FirestoreService from './services/firestore';
import NewResult from './NewResult';


const Result = (props) => {
        const history = useHistory();
        const location = useLocation();
        const [resultList, setResultList] = useState([]);
        const [matchtList, setMatchList] = useState([]);

        useEffect(() => {
            const userList = [];
            const matchlist = [];

            FirestoreService.getRankingList(location.state.param)
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        userList.push(doc.data().name);
                    });
                    setResultList(userList);
                });

            FirestoreService.getMatchList(location.state.param)
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        matchlist.push(doc.data());
                    });
                    matchlist.sort((a, b) => (new Date(a.data * 1000).getTime() - new Date(b.data * 1000).getTime()))
                    //matchlist.sort(function(a,b){return a.getTime() - b.getTime()});
                    setMatchList(matchlist.reverse());
                });
        }, []);

    const renderTableData = () => {
        return matchtList.map((match, index) => {
            let date = new Date(match.data.seconds * 1000);
            let createDate = date.getFullYear() + '-' + date.getMonth() + '-'+ date.getDate()
            return (
                <tr key={index}>
                    <td>{createDate}</td>
                    <td>{match.winners.join(',')}</td>
                    <td>{match.losers.join(',')}</td>
                </tr>
            )
        })
    }

        return (
            <>
                <h1>Result Page {location.state.param}</h1>
                <br/>

                <Tabs>
                    <TabList>
                        <Tab>Players</Tab>
                        <Tab>History</Tab>
                        <Tab>New Game Result</Tab>
                    </TabList>
                    <TabPanel>
                        <h2>Player list</h2>
                        {<ul>
                            {
                                resultList.map(result =>
                                    <div>{result}</div>
                                )
                            }
                        </ul>}
                    </TabPanel>
                    <TabPanel>
                        <h2>Matches table</h2>
                        <table class="center" id='students'>
                            <tbody>
                                <th>Date </th>
                                <th>Winners </th>
                                <th>Losers </th>
                                {renderTableData()}
                            </tbody>
                        </table>

                    </TabPanel>
                    <TabPanel>
                        <NewResult group={location.state.param}/>
                    </TabPanel>
                </Tabs>

                <button type="button" class="btn btn-primary" onClick={() => history.goBack()}>Go Back</button>
            </>
        );
    }
;

export default Result;