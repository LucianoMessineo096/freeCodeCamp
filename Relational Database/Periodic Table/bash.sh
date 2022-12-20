#!/bin/bash

#----------------------------------------------------
#~~~COMMANDS~~~~
# dump 
# restore   : db restore
# setId     : insert the type_id in properties table
# capitalize: capitalize the first letter of all the symbol values in the elements table
# remove    : emove all the trailing zeros after the decimals from each row of the atomic_mass column



#----------------------------------------------------
PSQL="psql -X --username=freecodecamp --dbname=periodic_table --tuples-only -c"

PROPERTIES_TABLE=$($PSQL "SELECT * FROM properties;")
ELEMENTS_TABLE=$($PSQL "SELECT * FROM elements;")


if [ $1 == 'dump' ]
then
  pg_dump -cC --inserts -U freecodecamp periodic_table > periodic_table.sql 
fi

if [ $1 == "restore" ]
then
  psql -U postgres < periodic_table.sql
fi

if [ $1 == "setId" ]
then

  echo "$PROPERTIES_TABLE" | while read ATOMIC_NUM BAR TYPE BAR ATOMIC_MASS BAR MELTING_PNT BAR BOILING_PNT BAR TYPE_ID
  do

    echo "$TYPE_ID"

    if [ $TYPE_ID != 0 ];
    then

      echo "type_id già aggiornato"

    else

      ID=$($PSQL "SELECT type_id FROM types WHERE type='$TYPE';")

      OK=$($PSQL "UPDATE properties SET type_id=$ID WHERE atomic_number=$ATOMIC_NUM;")

      echo "aggiornato"

    fi

  done
fi

if [ $1 == "capitalize" ]
then

  echo "$ELEMENTS_TABLE" | while read ATOMIC_NUM BAR SYMBOL BAR NAME
  do 

    result=$( echo "$SYMBOL" | sed 's/[a-z]/\U&/g' | sed 's/\(.\)/\L\1/2' )

    #query to modify symbol
    $($PSQL "UPDATE elements SET symbol = '$result' WHERE atomic_number = $ATOMIC_NUM;")

  done
fi

if [ $1 == "remove" ]
then

  $($PSQL "ALTER TABLE properties ALTER COLUMN atomic_mass TYPE DECIMAL")

  echo "$PROPERTIES_TABLE" | while read ATOMIC_NUM BAR TYPE BAR MELTING_PNT BAR BOILING_PNT TYPE_ID ATOMIC_MASS
  do 

    echo $ATOMIC_MASS

    valore=$(echo "$ATOMIC_MASS" | sed 's/0*$//')

    $($PSQL "UPDATE properties SET atomic_mass='$valore' WHERE atomic_number=$ATOMIC_NUM;")

  done

fi
