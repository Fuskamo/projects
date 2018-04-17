
#!/usr/bin/bash

#uncomment the topolgy you want. The simple two-server topology is uncommented here.

# Change the SERVER variable below to point your server executable.
SERVER=~/cs432/ServerChat/server

SERVER_NAME=`echo $SERVER | sed 's#.*/\(.*\)#\1#g'`

# Generate a simple two-server topology
#$SERVER localhost 4000 localhost 4001 &
#$SERVER localhost 4001 localhost 4000 & 

# Generate a simple three-server topology
#$SERVER localhost 6000 localhost 6001 &
#$SERVER localhost 6001 localhost 6000 localhost 6002 & 
#$SERVER localhost 6002 localhost 6001 &


# Generate a capital-H shaped topology
$SERVER localhost 4000 localhost 4001 &
$SERVER localhost 4001 localhost 4000 localhost 4002 localhost 4003 &
$SERVER localhost 4002 localhost 4001 & 
$SERVER localhost 4003 localhost 4001 localhost 4005 &
$SERVER localhost 4004 localhost 4005 &
$SERVER localhost 4005 localhost 4004 localhost 4003 localhost 4006 &
$SERVER localhost 4006 localhost 4005 &

# Generate a 3x3 grid topology
#$SERVER localhost 8000 localhost 8001 localhost 8003 &
#$SERVER localhost 8001 localhost 8000 localhost 8002 localhost 8004 &
#$SERVER localhost 8002 localhost 8001 localhost 8005 &
#$SERVER localhost 8003 localhost 8000 localhost 8004 localhost 8006 &
#$SERVER localhost 8004 localhost 8001 localhost 8003 localhost 8005 localhost 8007 &
#$SERVER localhost 8005 localhost 8002 localhost 8004 localhost 8008 &
#$SERVER localhost 8006 localhost 8003 localhost 8007 &
#$SERVER localhost 8007 localhost 8006 localhost 8004 localhost 8008 &
#$SERVER localhost 8008 localhost 8005 localhost 8007 &


echo "Press ENTER to quit"
read
pkill $SERVER_NAME
