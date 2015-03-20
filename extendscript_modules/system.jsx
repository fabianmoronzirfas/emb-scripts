/**
 * check the operating system to use the right linefeeds
 * @param  {String} $.os.substring(0,1) Check the first character
 * @return {nothing}
 */
if($.os.substring(0,1) == "M"){
  if(DEBUG){$.writeln("Macintosh");}
  settings.delimiter = "\n";
  settings.linefeeds = "Unix";

}else{
  if(DEBUG){$.writeln("Windows");}
  settings.delimiter = "\r";
  settings.linefeeds = "Windows";
}