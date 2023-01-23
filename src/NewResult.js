import 'react-tabs/style/react-tabs.css';
import 'reactjs-popup/dist/index.css';
import * as FirestoreService from './services/firestore';
import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class NewResult extends PureComponent {

    redirectToHome = () => {
        const {history} = this.props;
        if (history) history.push('/');
    }

    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            userList: [],
            winners: '',
            losers: '',
            checkPass: '',
            valid: false,
            matchList: [],
            validLoss: false,
            validWin: false,
        };
        this.setMatchList();
		this.getGroupUsers();
        this.handleWinnersChange = this.handleWinnersChange.bind(this);
        this.handleLosersChange = this.handleLosersChange.bind(this);
		this.handleWinnersDropDownChange = this.handleWinnersDropDownChange.bind(this);
        this.handleWinnersDropDownChange = this.handleWinnersDropDownChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkPass = this.checkPass.bind(this);
        this.revertTeams = this.revertTeams.bind(this);
    }

    revertTeams() {
        this.setState({winners: this.state.losers});
        this.setState({losers: this.state.winners});
    }

    handleWinnersChange(event) {
        this.loadMatchList(event.target.value.replaceAll(" ","").toLocaleLowerCase(), 'validWin');
        this.setState({winners: event.target.value.replaceAll(" ","").toLocaleLowerCase()});
    }

    handleLosersChange(event) {
        this.loadMatchList(event.target.value.replaceAll(" ","").toLocaleLowerCase(), 'validLoss');
        this.setState({losers: event.target.value.replaceAll(" ","").toLocaleLowerCase()});
    }

	handleWinnersDropDownChange(event) {
		const result = Array.prototype.slice.call(event.target.options).filter(o => o.selected).map(o => o.value).join(',');

		this.setState({winners: result});
	}

	handleLosersDropDownChange(event) {
        const result = Array.prototype.slice.call(event.target.options).filter(o => o.selected).map(o => o.value).join(',');

		this.setState({losers: result});
	}

    checkPass(event) {
        this.setState({checkPass: event.target.value});
    }

    setMatchList() {
        let matchList = [];
        FirestoreService.getMatchList(this.props.group).then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                matchList.push(doc.data());
            });
            this.setState({matchList: matchList});
        });
    }


    handleSubmit(event) {
        event.preventDefault();
        if (this.state.losers && this.state.winners) {
            FirestoreService.getGroupPass(this.props.group)
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.data().password === this.state.checkPass) {
                            this.setState({valid: true});
                        } else {
                            toast.configure();
                            toast("⚽ Wrong password", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        }
                    });
                    if (this.state.valid && this.state.losers && this.state.winners) {
                        FirestoreService.addMatch(this.state.losers, this.state.winners, this.props.group).then(a => {
                            toast.configure();
                            toast("⚽ Changes saved", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
							this.redirectToHome();
                        });
                    }
                });
        } else {
            toast.configure();
            toast("⚽ Add all mandatory fields ", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    loadGroupList(newName) {
        const groupList = [];
        FirestoreService.getGroupList().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                groupList.push(doc.data().name);
            });
            this.setState({groupList: groupList})
        });
    }

    loadMatchList(playerTab, stateParam) {
        let players = [];
        let matchList = this.state.matchList;
        matchList.forEach(match => {
            match.losers.forEach(a => players.push(a));
            match.winners.forEach(a => players.push(a));
        })
        let uniquePlayers = [...new Set(players)];
        playerTab = playerTab.split(',');
        let valid = playerTab.every(elem => uniquePlayers.includes(elem));
        if(stateParam === 'validLoss') {
            this.setState({validLoss : valid})
        }
        else {
            this.setState({validWin : valid})
        }

    }

    getGroupUsers = () => {
        //  const group = myRef1.current.options[myRef1.current.selectedIndex].value;
        FirestoreService.getUsersOfGroup(this.props.group)
            .then((querySnapshot) => {
				const users = new Set();
                querySnapshot.forEach((doc) => {
                    const { losers, winners } = doc.data();

					[...losers, ...winners].forEach(user => users.add(user))
                });
                this.setState({userList: Array.from(users)});
            });
    };

    render() {
        return (
            <div>
                <h2>✏️Add New Result</h2>
                <p>Multiple players in team should be separated by comma</p>
                <button type="button" class="btn btn-primary" onClick={this.revertTeams}>
                    Swap team
                </button>
                <form onSubmit={this.handleSubmit}>
                    <br/>
                    <label>
                        Winners:
						<select class="form-select" multiple="true" onChange={this.handleWinnersDropDownChange}> {
							this.state.userList.map(user =>
								<option value={user}>{user}</option>
						)} </select>
                        <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value={this.state.winners}
                               onChange={this.handleWinnersChange}/>


                    </label>
                   <i class="material-icons">{this.state.validWin ? 'done' :  'info'}</i>
                    <br/>
                    <label>
                        Losers:
						<select class="form-select" multiple="true" onChange={this.handleLosersDropDownChange}> {
							this.state.userList.map(user =>
								<option value={user}>{user}</option>
						)} </select>
                        <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value={this.state.losers}
                               onChange={this.handleLosersChange}/>
                    </label>
                   <i class="material-icons">{this.state.validLoss ? 'done' :  'info'}</i>
                    <br/>
                    <label>
                        Password:
                        <input type="password" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value={this.state.pass}
                               onChange={this.checkPass}/>
                    </label>
                    <br/>
                    <br/>
                    <input type="submit" class="btn btn-success" value="Submit"/>
                    <br/>
                    <br/>
                    <button type="button" class="btn btn-primary" onClick={this.redirectToHome}>
                        Go to home
                    </button>
                </form>
                <br/>
            </div>
        );
    }

}

export default withRouter(NewResult);
;
