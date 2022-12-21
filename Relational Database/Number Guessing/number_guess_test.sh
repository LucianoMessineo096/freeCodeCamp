#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

#echo "~~~ NUMBER GUESSING ~~~"

MENU(){

  echo "Enter your username:"
  read username

  if ! [[ $username =~ ^[0-9]+$ ]]; then
      # Input is not an integer

      if [ ${#username} -lt 22 ];
      then
        echo "the username inserted must be of 22 characters"
      else

        user=$($PSQL "SELECT username FROM users WHERE username='$username';")

        if [[ -z $user ]]
        then

          echo "Welcome, $username! It looks like this is your first time here."

          INSERT_USER $username
          GAME $username

        else

          games_played=$(GET_GAMES_PLAYED $username)
          best_game=$(GET_BEST_GAME $username)
          
          echo "Welcome back, $username! You have played $games_played games, and your best game took $best_game guesses."

          GAME $username

        fi

      fi
  else
      # Input is an integer
      echo "ERROR: The input is an integer."
  fi

}

GAME(){

  let number_of_guesses=0

  #generate random value
  secret_number=$((RANDOM % 1000 + 1))

  echo "Guess the secret number between 1 and 1000:"

  while true;
  do

    read user_rand

    if [[ $user_rand =~ ^-?[0-9]+$ ]]; then

      let number_of_guesses++

      if [ $user_rand -gt $secret_number ];
      then

        echo "It's lower than that, guess again:"
        
      elif [ $user_rand -lt $secret_number ];
      then
        
        echo "It's higher than that, guess again:"

      else

        echo "You guessed it in $number_of_guesses tries. The secret number was $secret_number. Nice job!"

        INSERT_GAME $number_of_guesses $username

        break

      fi

    else
      echo "That is not an integer, guess again:"
    fi

    

  done

}

INSERT_GAME(){

  user_id=$($PSQL "SELECT user_id FROM users WHERE username='$username';")
  inserted=$($PSQL "INSERT INTO games(user_id,num_of_guesses) VALUES($user_id,$number_of_guesses);")
}

INSERT_USER(){

  #echo "parametro $username"

  inserted=$($PSQL "INSERT INTO users(username) VALUES('$username');")

}

GET_GAMES_PLAYED(){

  user_id=$($PSQL "SELECT user_id FROM users WHERE username='$username';")
  num_games_played=$($PSQL "SELECT COUNT(*) FROM games WHERE user_id=$user_id;")

  echo "$num_games_played"
}

GET_BEST_GAME(){

  user_id=$($PSQL "SELECT user_id FROM users WHERE username='$username';")
  num_guesses=$($PSQL "SELECT MIN(num_of_guesses) FROM games WHERE user_id=$user_id LIMIT 1;")

  echo "$num_guesses"

}

MENU
