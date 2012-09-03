//use it in sencha touch
//use appname.jlog({log:message,dir:object}) for logmessages in your application.
//list stack-trace in console with timestamps in console messages (copy&paste) in:
//
// "log.history[millis].stackTrace" 
//
Ext.regApplication({
  name: 'appname',
  //debug level 0-5
  //use preceding dots in jlog messages to set debugLevel for message.
  //use >5 or no dots, when message must appear at any debugLevel
  debug: 3,
  //cleans dots (debugLevel) from log
  cleanDebug: 1,
  //filter messages.
  // 0:       <=      -> messagesDebugLevel is lt appname.debug
  // 1:       >=      -> messagesDebugLevel is gt appname.debug
  // 2:       ==      -> messagesDebugLevel is eq appname.debug
  // 3:       >2&&<5  -> no informational Messages
  debugFilter:3,
  mainLaunch: function() {

         //initially enable special debug things
         if (this.debug) { this.debugfn() };

  },
  debugfn: function(){
    
        /**
         * use "log.history[millis].stackTrace" in console
         */
        console.logSuper = console.log;
        window.log={}
        window.log.history = window.log.history || {}; // store logs to a global history for reference
        console.log=function(){
            
            var timestamp=(new Date), //create a timestamp of the log
                millis=timestamp.getTime(),
                stack=new Error().stack, //save a stacktrace for Google Chrome
                array=Array.prototype.slice.call(arguments),
                args={arguments:array, stackTrace:stack};
            log.history[millis]=args; //save everything to the log
            console.logSuper(arguments[0], millis); //call the original log function with a timestamp
        }        
        
        appname.jlog({ log:"DEBUG LEVEL: "+this.debug });
        appname.jlog({ log:"DEBUG FILTER: "+this.debugFilter });
      
    },
  /**
  * provides logging, controlled via appname.debug setting
  * @param {Object} [params] console.dir, or console.log as params.dir/params.log. executing dir only on mac (in browser)
  * use starting-dots for logtext as debug level. Be careful
  * .message - info
  * ..message - error
  * ...message - debug
  * ....message - debug -v
  * .....message - get the rest
  * use "log.history[millis].stackTrace" in console
  */
 jlog: function(params){
        
     var confDebugLevel = appname.debug,
         debug_filter=appname.debugFilter;

     function logIt(cleanedMessage, debug_filter, debugLevel) {
            
         var logmessage=cleanedMessage ? cleanedMessage : (params.log+" (FILTER: "+debug_filter+", LEVEL: "+debugLevel+")");
            
         if (params.dir && Ext.is.Mac) {
             if (params.log) console.log(logmessage);
             console.dir(params.dir);
         } else {
             console.log(logmessage);
         }
     }
                    
     if (confDebugLevel) {
         if(params.log){
             //count dots
             var debugLevel=params.log.match(/^\.+[^\.]/gi);
             var cleanedMessage= debugLevel ? params.log.split(debugLevel[0].slice(0,-1))[1] : 0;
             debugLevel = debugLevel ? debugLevel[0].split('.').length - 1 : 6;
                
         }
            
         // check for debug level of logmessage
         // add filters here. 
         //
         // Show only Messages with given LogLevel: debugLevel==confDebugLevel
         // default: debugLevel<=confDebugLevel
         switch(debug_filter){
            
             case 1: debug_filter=(debugLevel>=confDebugLevel);
                     break;
             case 2: debug_filter=(debugLevel===confDebugLevel);
                     break;
             case 3: debug_filter=(debugLevel>1 && debugLevel<5);
                     break;                        
             default: debug_filter=(debugLevel<=confDebugLevel);
                     break;
         }
         if (typeof(debugLevel)=='number' && debug_filter || debugLevel>5) {
             //console.log(debugLevel);
             logIt(this.cleanDebug && cleanedMessage, debug_filter, debugLevel)//=null)
             } else {
                 return
             }
 }},    
    
});
