import os
import flask
import redis
import requests
from flask import jsonify
from datetime import datetime, timezone
from flask_caching import Cache
from flask import request
from flask_cors import CORS
import pytz
from dotenv import load_dotenv


load_dotenv()

application = flask.Flask(__name__)
CORS(application)

config = {
    "DEBUG": True,
    "CACHE_TYPE": "RedisCache",
    "CACHE_DEFAULT_TIMEOUT": 300,
    "CACHE_REDIS_PASSWORD": os.getenv('REDIS_PASSWORD'),
    "CACHE_REDIS_URL": os.getenv('REDIS_URL')
}

application.config.from_mapping(config)
cache = Cache(application)

API_KEY = os.getenv('API_KEY')
base_url = os.getenv('BASE_URL')
headers = {'X-Auth-Token': API_KEY}


# Home page, get all matches for a specific date
@application.route('/', methods=['POST'])
def home():
    date = request.json.get('date', None)
    timezone = request.json.get('timeZone', 'UTC')
    if not date:
        return jsonify({'error': 'No date provided'}), 400

    # Date format: YYYY-MM-DD
    # Check if date is in the correct format
    try:
        datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD'}), 400

    return get_matches(date, timezone)

def convert_utc_to_local(utc_date_str, local_tz_str):
    utc_date = datetime.strptime(utc_date_str.replace('Z', ''), '%Y-%m-%dT%H:%M:%S')
    utc_date = utc_date.replace(tzinfo=timezone.utc)
    local_tz = pytz.timezone(local_tz_str)
    local_time = utc_date.astimezone(local_tz)

    return local_time.strftime('%H:%M')

@cache.memoize(timeout=300)
def get_matches(date, timezone):
    response = requests.get(base_url + 'matches?date=' + date, headers=headers)
    if response.json().get('error', None):
        return jsonify(response.json()), 400

    matches = {}

    for match in response.json().get('matches', []):
        competition_code = match['competition']['code']
        if competition_code not in matches:
            matches[competition_code] = {}
            competition_info = {
                'id': match['competition']['id'],
                'name': match['competition']['name'],
                'code': match['competition']['code'],
                'emblem': match['competition']['emblem']
            }
            matches[competition_code]['competition'] = competition_info 
            matches[competition_code]['matches'] = []

        match_info = {
            'id': match['id'],
            'homeTeam': match['homeTeam'],
            'awayTeam': match['awayTeam'],
            'utcDate': match['utcDate'],
            'status': match['status'],
            'score': match['score'],
            'time': str(convert_utc_to_local(match['utcDate'], timezone))
        }

        matches[competition_code]['matches'].append(match_info)

    return jsonify(matches), 200

# View league standings
@application.route('/standings/<league_code>')
@cache.cached(timeout=300)
def standings(league_code):
    response = requests.get(base_url + 'competitions/' + league_code + '/standings', headers=headers)
    if response.json().get('errorCode', None):
        return jsonify(response.json()), 400

    standings = response.json()['standings'][0]['table']
    info = {
        'competition': {
            'id': response.json()['competition']['id'],
            'name': response.json()['competition']['name'],
            'code': response.json()['competition']['code'],
            'emblem': response.json()['competition']['emblem']
        },
        'standings': standings
    }
    return jsonify(info), 200

# View match details
@application.route('/match/<int:match_id>')
@cache.cached(timeout=300)
def match(match_id):
    response = requests.get(base_url + 'matches/' + str(match_id), headers=headers)
    match = response.json()
    if match.get('error', None):
        return jsonify(match), 400

    info = {
        'id': match['id'],
        'competition': {
            'id': match['competition']['id'],
            'name': match['competition']['name'],
            'code': match['competition']['code'],
            'emblem': match['competition']['emblem']
        },
        'venue': match['venue'],
        'homeTeam': match['homeTeam'],
        'awayTeam': match['awayTeam'],
        'utcDate': match['utcDate'],
        'status': match['status'],
        'score': match['score'],
        'referees': match['referees'],
    }

    return jsonify(info), 200


def calculate_age(birth_date):
    birth_date = datetime.strptime(birth_date, '%Y-%m-%d')
    today = datetime.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

# View team details
@application.route('/teams/<int:team_id>')
@cache.cached(timeout=300)
def team(team_id):
    response = requests.get(base_url + 'teams/' + str(team_id), headers=headers)
    team = response.json()
    if team.get('error', None):
        return jsonify(team), 400

    info = {
        'id': team['id'],
        'name': team['name'],
        'shortName': team['shortName'],
        'tla': team['tla'],
        'emblem': team['crest'],
        'venue': team['venue'],
        'coach': {
            'id': team['coach']['id'],
            'name': team['coach']['name'],
            'nationality': team['coach']['nationality'],
        }
    }

    running_competitions = []
    for competition in team['runningCompetitions']:
        running_competitions.append({
            'id': competition['id'],
            'name': competition['name'],
            'code': competition['code'],
            'emblem': competition['emblem'],
        })

    info["runningCompetitions"] = running_competitions

    players = {}

    for player in team['squad']:
        if players.get(player['position'], None) is None:
            players[player['position']] = [{
                'id': player['id'],
                'name': player['name'],
                'nationality': player['nationality']
            }]
        else:
            players[player['position']].append({
                'id': player['id'],
                'name': player['name'],
                'nationality': player['nationality']
            })

    info["squad"] = players

    return jsonify(info), 200

# View team matches
@application.route('/team/fixtures', methods=['POST'])
def team_matches():
    timezone = request.json.get('timeZone', 'UTC')
    team_id = request.json.get('teamId', None)

    if not team_id:
        return jsonify({'error': 'No team ID provided'}), 400

    return get_fixtures(team_id, timezone)

@cache.memoize(timeout=300)
def get_fixtures(team_id, timezone):
    response = requests.get(base_url + 'teams/' + str(team_id) + '/matches', headers=headers)
    res = response.json()
    if res.get('errorCode', None):
        return jsonify(res), 400

    matches = []

    for match in res['matches']:
        match_info = match
        match_info['time'] = str(convert_utc_to_local(match['utcDate'], timezone))
        match_info['date'] = extract_date(match['utcDate'])
        matches.append(match_info)

    ret = {
        'count': res['resultSet']['count'],
        'matches': matches
    }

    return jsonify(ret), 200

def extract_date(date):
    return date.split('T')[0]

# View player details
@application.route('/player/<int:player_id>')
@cache.cached(timeout=300)
def player(player_id):
    response = requests.get(base_url + 'persons/' + str(player_id), headers=headers)
    player = response.json()
    if player.get('error', None):
        return jsonify(player), 400

    age = calculate_age(player['dateOfBirth'])
    info = {
        'id': player['id'],
        'name': player['name'],
        'position': player['position'],
        'shirtNumber': player['shirtNumber'],
        'age': age,
    }

    return jsonify(info), 200


if __name__ == '__main__':
    application.run(port=8080, debug=True)
    # serve(application, host='localhost', port=8080, threads=4)