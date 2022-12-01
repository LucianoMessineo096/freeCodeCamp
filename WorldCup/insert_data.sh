#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.

# create db

#echo $($PSQL "CREATE TABLE IF NOT EXISTS teams(team_id SERIAL PRIMARY KEY NOT NULL,name VARCHAR(255) UNIQUE NOT NULL)")
#echo $($PSQL "CREATE TABLE IF NOT EXISTS games(game_id SERIAL PRIMARY KEY NOT NULL,year INT NOT NULL,round VARCHAR(255) NOT NULL,winner_id INT NOT NULL,opponent_id INT NOT NULL, winner_goals INT NOT NULL,opponent_goals INT NOT NULL)")
#echo $($PSQL "ALTER TABLE games ADD FOREIGN KEY(winner_id) REFERENCES teams(team_id)")
#echo $($PSQL "ALTER TABLE games ADD FOREIGN KEY(opponent_id) REFERENCES teams(team_id)")

# empty tables

echo "$($PSQL "TRUNCATE games,teams")"

# insert data

cat games.csv | while IFS="," read YEAR ROUND WINNER OPPONENT WINNER_GOALS OPPONENT_GOALS
do

  if [[ $WINNER != winner ]]
  then

    #get team id
    WINNER_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")
    
    if [[ -z $WINNER_ID ]]
    then
      # insert

      INSERT_WINNER=$($PSQL "INSERT INTO teams(name) VALUES('$WINNER')")

      WINNER_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")

    fi

  fi

  if [[ $OPPONENT != opponent ]]
  then

    #get team id
    OPPONENT_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")
    
    if [[ -z $OPPONENT_ID ]]
    then
      # insert

      INSERT_OPPONENT=$($PSQL "INSERT INTO teams(name) VALUES('$OPPONENT')")

      OPPONENT_ID=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")

    fi

  fi

  #fill games table

  if [[ $YEAR != year ]] && [[ $ROUND != round ]] && [[ $WINNER != winner ]] && [[ $OPPONENT != opponent ]] && [[ $WINNER_GOALS != winner_goals ]] && [[ $OPPONENT_GOALS != opponent_goals ]]
  then

    INSERT_YEAR=$($PSQL "INSERT INTO games(year,round,winner_id,opponent_id,winner_goals,opponent_goals) VALUES('$YEAR','$ROUND',$WINNER_ID,$OPPONENT_ID,$WINNER_GOALS,$OPPONENT_GOALS)")

  fi

done
