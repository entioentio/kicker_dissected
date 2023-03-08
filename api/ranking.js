const skill = require('ts-trueskill');
const axios = require('axios');
const { URL } = process.env

const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };
  

exports.handler = async function (event, context) {
    const query = event.queryStringParameters.group ? `?group=${event.queryStringParameters.group}` : '',
          url = `${URL}/api/matches${query}`,
          matches = await axios.get(url);
    let ranks = {};
    console.log("Queried for ", url)
    console.log("Matches: ", matches.data)
    matches.data.forEach(match => ranks = processMatch(match, ranks))
    return {
		headers,
        statusCode: 200,
        body: JSON.stringify(formatRank(ranks).sort((a,b) => b.rank - a.rank))
    };
}

function processMatch(match, ranks) {
    let winning_team_ratings = match.winners.map(user => get_rating(user, ranks));
    let losing_team_ratings = match.losers.map(user => get_rating(user, ranks));

    // Assumes the first team was the winner by default
    let [updated_winning_team_ratings, updated_losing_team_ratings] = skill.rate([winning_team_ratings, losing_team_ratings]);

    ranks = updateRanks(updated_winning_team_ratings, match.winners, ranks);
    ranks = updateRanks(updated_losing_team_ratings, match.losers, ranks);

    return ranks;
}

get_rating = function (user_tag, ranks) {
    if (user_tag in ranks) {
        return ranks[user_tag];
    }
    return new skill.Rating();
}

function formatRank(ranks) {
    var user_names = Object.keys(ranks)
    return user_names.map( name => { return {
        "user": name,
        "rank": skill.expose(ranks[name]),
        "mu": ranks[name].mu,
        "sigma": ranks[name].sigma
    }})
}

function updateRanks(group_ratings, tags, ranks) {
    for (let i = 0; i < group_ratings.length; i++) {
        ranks[tags[i]] = group_ratings[i]
    }
    return ranks;
}