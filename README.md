mpg123-radio-server-api
========================

### A REST API to play shoutcast/icecast radio stations via mpg123

## Requirements
 - mpg123
 - alsa-utils  


### Important REST Endpoints:

Play a station:

    /play/:stationUrl
    
Stop playing:

    /stop
    
Get current song info:

    /currentsong
    
Get the current volume level:

    /volume
    
Set the volume:

    /volume/set/:level
    

 



    