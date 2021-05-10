
//***** INTERNAL ADANALYST VARIABLES (FLAGS/etc)

//var HOST_SERVER = 'https://lig-adanalystplus-test.imag.fr/';

//var HOST_SERVER = 'https://smm.mpi-sws.org/';
var HOST_SERVER = 'https://adanalystplus.imag.fr/';

var consoleHolder = console;
function debug(bool){
    if(!bool){
        consoleHolder = console;
        console = {};
        Object.keys(consoleHolder).forEach(function(key){
            console[key] = function(){};
        })
    }else{
        console = consoleHolder;
    }
}
debug(true);

